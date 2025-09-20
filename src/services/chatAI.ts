import { registrarActividad } from '../hooks/useHealthIndex';
import { 
  MedicalKnowledgeEngine, 
  nicaraguanHealthContext, 
  hospitals, 
  medicalSpecialists, 
  medicalConditions 
} from './medicalKnowledge';

export interface ChatContext {
  userProfile?: {
    nombre: string;
    edad?: number;
    antecedentes?: string[];
    alergias?: string[];
    medicamentosActivos?: string[];
  };
  currentView?: string;
  healthIndex?: number;
  recentActivity?: Array<{
    type: string;
    timestamp: number;
    data?: any;
  }>;
}

export interface ChatResponse {
  content: string;
  suggestions?: string[];
  actionButtons?: Array<{
    label: string;
    action: string;
    variant?: 'default' | 'destructive' | 'outline';
  }>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  followUp?: string;
  source?: 'local' | 'openai' | 'medical_api' | 'huggingface' | 'gemini';
}

// Configuración de APIs externas
interface ExternalAPIConfig {
  openai: {
    enabled: boolean;
    apiKey: string;
    model: string;
    baseURL: string;
  };
  medicalAPI: {
    enabled: boolean;
    apiKey: string;
    baseURL: string;
  };
  huggingface: {
    enabled: boolean;
    apiKey: string; // Gratis en huggingface.co
    model: string;
    baseURL: string;
  };
  gemini: {
    enabled: boolean;
    apiKey: string; // Gratis hasta 15 requests/minuto
    model: string;
    baseURL: string;
  };
}

// Configuración por defecto - API keys se configurarían a través de configuración del administrador
const API_CONFIG: ExternalAPIConfig = {
  openai: {
    enabled: false, // Deshabilitar por defecto hasta configurar
    apiKey: '', // En producción, esto vendría de la configuración del sistema
    model: 'gpt-4-turbo-preview',
    baseURL: 'https://api.openai.com/v1'
  },
  medicalAPI: {
    enabled: false, // Deshabilitar por defecto hasta configurar
    apiKey: '', // En producción, esto vendría de la configuración del sistema
    baseURL: 'https://api.infermedica.com/v3'
  },
  huggingface: {
    enabled: false, // Deshabilitado hasta configurar API key real
    apiKey: '', // Requiere API key válida de huggingface.co
    model: 'microsoft/DialoGPT-medium', // Modelo conversacional gratuito
    baseURL: 'https://api-inference.huggingface.co/models'
  },
  gemini: {
    enabled: false, // Se habilita cuando se configure la API key gratuita
    apiKey: '', // Gratis en ai.google.dev hasta 15 requests/minuto
    model: 'gemini-1.5-flash',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta'
  }
};

// Función para configurar APIs dinámicamente (para uso futuro del administrador)
export const configureAPIs = (config: Partial<ExternalAPIConfig>) => {
  Object.assign(API_CONFIG, config);
};

// Funciones de configuración rápida para APIs gratuitas
export const setupHuggingFace = (apiKey: string, model?: string) => {
  if (!apiKey.startsWith('hf_')) {
    console.error('❌ API key de Hugging Face debe empezar con "hf_"');
    return false;
  }
  
  API_CONFIG.huggingface = {
    enabled: true,
    apiKey: apiKey,
    model: model || 'microsoft/DialoGPT-medium',
    baseURL: 'https://api-inference.huggingface.co/models'
  };
  console.log('✅ Hugging Face API configurada correctamente');
  return true;
};

export const setupGemini = (apiKey: string, model?: string) => {
  API_CONFIG.gemini = {
    enabled: true,
    apiKey: apiKey,
    model: model || 'gemini-1.5-flash',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta'
  };
  console.log('✅ Google Gemini API configurada correctamente');
};

// Función para configurar ambas APIs gratuitas de una vez
export const setupFreeAPIs = (huggingFaceKey?: string, geminiKey?: string) => {
  let configured = 0;
  
  if (huggingFaceKey && setupHuggingFace(huggingFaceKey)) {
    configured++;
  }
  
  if (geminiKey) {
    setupGemini(geminiKey);
    configured++;
  }
  
  if (configured > 0) {
    console.log(`🎉 ${configured} API(s) gratuita(s) configurada(s). Chat inteligente mejorado!`);
  } else {
    console.log('ℹ️ No se configuraron APIs. El chat usará conocimiento local.');
  }
  
  return configured;
};

// Función para verificar estado de APIs
export const getAPIStatus = () => {
  return {
    huggingface: {
      enabled: API_CONFIG.huggingface.enabled,
      configured: API_CONFIG.huggingface.apiKey.length > 5,
      model: API_CONFIG.huggingface.model
    },
    gemini: {
      enabled: API_CONFIG.gemini.enabled,
      configured: API_CONFIG.gemini.apiKey.length > 10,
      model: API_CONFIG.gemini.model
    },
    openai: {
      enabled: API_CONFIG.openai.enabled,
      configured: API_CONFIG.openai.apiKey.length > 10,
      model: API_CONFIG.openai.model
    }
  };
};

export class AdvancedChatAI {
  private context: ChatContext = {};
  private conversationHistory: Array<{ user: string; bot: string; timestamp: number }> = [];
  private useExternalAPI: boolean = false;

  constructor() {
    // Verificar si las APIs están configuradas y habilitadas
    this.useExternalAPI = this.isAPIConfigured();
  }

  public isAPIConfigured(): boolean {
    return (API_CONFIG.openai.enabled && API_CONFIG.openai.apiKey.length > 10) ||
           (API_CONFIG.medicalAPI.enabled && API_CONFIG.medicalAPI.apiKey.length > 10) ||
           (API_CONFIG.huggingface.enabled && API_CONFIG.huggingface.apiKey.length > 10 && API_CONFIG.huggingface.apiKey.startsWith('hf_')) ||
           (API_CONFIG.gemini.enabled && API_CONFIG.gemini.apiKey.length > 10);
  }

  setContext(context: ChatContext) {
    this.context = context;
  }

  // Llamada a Hugging Face API (100% GRATUITA)
  private async callHuggingFace(prompt: string): Promise<string> {
    // Verificar que la API key sea válida
    if (!API_CONFIG.huggingface.apiKey || !API_CONFIG.huggingface.apiKey.startsWith('hf_')) {
      throw new Error('Hugging Face API key no configurada o inválida');
    }

    try {
      const medicalContext = this.buildMedicalContext();
      const fullPrompt = `Contexto: Eres un asistente médico virtual para SaludCerca en Nicaragua.
Usuario: ${medicalContext}

Instrucciones importantes:
- NO diagnostiques, solo informa y educa
- Para emergencias, recomienda llamar al 911
- Enfócate en el contexto nicaragüense
- Sé empático y profesional

Consulta del paciente: ${prompt}

Respuesta del asistente médico:`;

      const response = await fetch(`${API_CONFIG.huggingface.baseURL}/${API_CONFIG.huggingface.model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.huggingface.apiKey}`
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new Error('Hugging Face API key inválida o expirada');
        }
        throw new Error(`Hugging Face API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      // Hugging Face devuelve un array, tomamos el primer resultado
      const result = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
      
      if (!result) {
        throw new Error('No se recibió respuesta válida de Hugging Face');
      }

      // Limpiar la respuesta para que sea más médica y apropiada
      return this.sanitizeMedicalResponse(result);
    } catch (error) {
      console.error('Error calling Hugging Face:', error);
      throw error;
    }
  }

  // Llamada a Google Gemini API (GRATIS hasta 15 req/min)
  private async callGemini(prompt: string): Promise<string> {
    if (!API_CONFIG.gemini.enabled || !API_CONFIG.gemini.apiKey) {
      throw new Error('Gemini API no configurada');
    }

    try {
      const medicalContext = this.buildMedicalContext();
      const systemPrompt = `Eres un asistente médico virtual inteligente para SaludCerca, una aplicación de salud en Nicaragua.

CONTEXTO DEL USUARIO:
${medicalContext}

INSTRUCCIONES CRÍTICAS:
- NO diagnostiques condiciones médicas específicas
- Proporciona información educativa solamente
- Para emergencias, SIEMPRE recomienda llamar al 911
- Enfócate en el contexto nicaragüense (dengue, hospitales locales)
- Sé empático, claro y profesional
- Incluye cuándo buscar ayuda médica profesional
- Prioriza SIEMPRE la seguridad del paciente

Responde en español de manera clara y útil.`;

      const response = await fetch(`${API_CONFIG.gemini.baseURL}/models/${API_CONFIG.gemini.model}:generateContent?key=${API_CONFIG.gemini.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nConsulta del paciente: ${prompt}`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!result) {
        throw new Error('No se recibió respuesta válida de Gemini');
      }

      return this.sanitizeMedicalResponse(result);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      throw error;
    }
  }

  // Llamada a OpenAI API para respuestas más inteligentes
  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.useExternalAPI) {
      throw new Error('OpenAI API no configurada');
    }

    try {
      const medicalContext = this.buildMedicalContext();
      const systemPrompt = `Eres un asistente médico virtual inteligente para SaludCerca, una aplicación de salud en Nicaragua. 

CONTEXTO DEL USUARIO:
${medicalContext}

INSTRUCCIONES IMPORTANTES:
- Proporciona información médica precisa pero NO reemplazas el diagnóstico médico profesional
- Para emergencias, siempre recomienda llamar al 911 o acudir a emergencias
- Enfócate en el contexto de Nicaragua (hospitales locales, enfermedades comunes como dengue)
- Sé empático, profesional y fácil de entender
- Incluye información sobre cuándo buscar ayuda médica inmediata
- No diagnostiques condiciones específicas, pero puedes sugerir especialistas apropiados

Responde de manera clara, útil y siempre prioriza la seguridad del paciente.`;

      const response = await fetch(`${API_CONFIG.openai.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`
        },
        body: JSON.stringify({
          model: API_CONFIG.openai.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No pude procesar tu consulta. Intenta nuevamente.';
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }

  // Función para limpiar y mejorar respuestas médicas
  private sanitizeMedicalResponse(response: string): string {
    // Remover texto inapropiado o demasiado técnico
    let cleaned = response
      .replace(/\b(diagnostico|diagnóstico)\b/gi, 'evaluación')
      .replace(/\b(medicina|medicamento|tratamiento)\s+(específico|recomendado)\b/gi, 'orientación médica')
      .replace(/\b(toma|consume|usa)\s+(este|estos|esta|estas)\b/gi, 'consulta con tu médico sobre');

    // Agregar disclaimers importantes si no los tiene
    if (!cleaned.toLowerCase().includes('consulta') && !cleaned.toLowerCase().includes('médico')) {
      cleaned += '\n\n⚠️ **Importante**: Esta información es solo educativa. Consulta siempre con un profesional médico para diagnósticos y tratamientos.';
    }

    // Limitar longitud
    if (cleaned.length > 800) {
      cleaned = cleaned.substring(0, 800) + '...\n\nPara más información, consulta con un médico.';
    }

    return cleaned;
  }

  // Llamada a API médica especializada (Infermedica) para análisis de síntomas
  private async analyzeSymptomsWithAPI(symptoms: string[]): Promise<any> {
    if (!this.useExternalAPI) {
      return null;
    }

    try {
      // Primero obtenemos información del usuario para el análisis
      const userProfile = this.context.userProfile;
      const age = userProfile?.edad || 30;
      const sex = 'unknown'; // Se podría agregar al perfil del usuario

      // Paso 1: Parsear síntomas en formato de la API
      const parseResponse = await fetch(`${API_CONFIG.medicalAPI.baseURL}/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'App-Id': API_CONFIG.medicalAPI.apiKey,
          'App-Key': 'YOUR_APP_KEY_HERE' // Se necesita tanto App-Id como App-Key
        },
        body: JSON.stringify({
          text: symptoms.join(', ')
        })
      });

      if (!parseResponse.ok) {
        throw new Error(`Medical API parse error: ${parseResponse.status}`);
      }

      const parsedSymptoms = await parseResponse.json();

      // Paso 2: Hacer diagnóstico
      const diagnosisResponse = await fetch(`${API_CONFIG.medicalAPI.baseURL}/diagnosis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'App-Id': API_CONFIG.medicalAPI.apiKey,
          'App-Key': 'YOUR_APP_KEY_HERE'
        },
        body: JSON.stringify({
          sex: sex,
          age: age,
          evidence: parsedSymptoms.mentions.map((mention: any) => ({
            id: mention.id,
            choice_id: mention.choice_id
          }))
        })
      });

      if (!diagnosisResponse.ok) {
        throw new Error(`Medical API diagnosis error: ${diagnosisResponse.status}`);
      }

      const diagnosis = await diagnosisResponse.json();
      return diagnosis;
    } catch (error) {
      console.error('Error calling Medical API:', error);
      return null;
    }
  }

  private buildMedicalContext(): string {
    const { userProfile, healthIndex } = this.context;
    let context = '';

    if (userProfile) {
      context += `Paciente: ${userProfile.nombre}`;
      if (userProfile.edad) context += `, ${userProfile.edad} años`;
      if (userProfile.antecedentes?.length) {
        context += `\nAntecedentes médicos: ${userProfile.antecedentes.join(', ')}`;
      }
      if (userProfile.alergias?.length) {
        context += `\nAlergias: ${userProfile.alergias.join(', ')}`;
      }
      if (userProfile.medicamentosActivos?.length) {
        context += `\nMedicamentos actuales: ${userProfile.medicamentosActivos.join(', ')}`;
      }
    }

    if (healthIndex) {
      context += `\nÍndice de salud actual: ${healthIndex}/100`;
    }

    context += `\nUbicación: Nicaragua, red hospitalaria disponible`;
    context += `\nHospitales principales: Hospital Vivian Pellas, Hospital Bautista, Hospital Alemán Nicaragüense`;

    return context;
  }

  private analyzeUrgency(message: string): 'low' | 'medium' | 'high' | 'urgent' {
    const urgentKeywords = [
      'emergencia', 'urgente', 'grave', 'intenso', 'sangrado', 'inconsciente',
      'respirar', 'pecho', 'corazón', 'ataque', 'convulsión', 'accidente',
      'infarto', 'derrame', 'asfixia', 'desmayo'
    ];
    
    const highKeywords = [
      'dolor fuerte', 'fiebre alta', 'vómito', 'mareos severos', 'desmayo',
      'infección', 'alergia severa', 'presión alta', 'sangre', 'dificultad'
    ];
    
    const mediumKeywords = [
      'dolor', 'malestar', 'síntoma', 'enfermo', 'molestia', 'cansancio',
      'fiebre', 'tos', 'gripe', 'resfriado', 'náuseas', 'diarrea'
    ];

    const lowerMessage = message.toLowerCase();
    
    // Análisis más sofisticado usando conocimiento médico
    const words = lowerMessage.split(/\s+/);
    const symptoms = words.filter(word => word.length > 3);
    
    // Usar el motor de conocimiento médico para análisis
    if (symptoms.length >= 2) {
      const analysis = MedicalKnowledgeEngine.analyzeSymptoms(symptoms);
      return analysis.urgencyLevel;
    }
    
    if (urgentKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'urgent';
    }
    
    if (highKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'high';
    }
    
    if (mediumKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  private async analyzeHealthConcerns(message: string): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase();
    const words = lowerMessage.split(/\s+/).filter(word => word.length > 2);
    
    // Extraer posibles síntomas del mensaje
    const possibleSymptoms = words.filter(word => 
      ['dolor', 'fiebre', 'tos', 'mareos', 'náuseas', 'cansancio', 'debilidad', 
       'palpitaciones', 'sudor', 'escalofríos', 'vómito', 'diarrea'].includes(word) ||
      word.includes('duele') || word.includes('mal')
    );

    // Análisis de urgencia mejorado
    const urgencyLevel = this.analyzeUrgency(message);
    
    // Intentar usar API médica para análisis más preciso
    let externalAnalysis = null;
    if (possibleSymptoms.length > 0 && this.useExternalAPI) {
      try {
        externalAnalysis = await this.analyzeSymptomsWithAPI(possibleSymptoms);
      } catch (error) {
        console.warn('External medical API failed, using local knowledge');
      }
    }

    // Si tenemos análisis externo, usarlo para mejorar la respuesta
    if (externalAnalysis && externalAnalysis.conditions) {
      const topConditions = externalAnalysis.conditions.slice(0, 3);
      const conditionNames = topConditions.map((c: any) => c.name).join(', ');
      
      let content = `🔍 **Análisis de síntomas (IA avanzada):**\n\n`;
      content += `Basado en los síntomas descritos, las posibles condiciones incluyen: ${conditionNames}.\n\n`;
      content += `⚠️ **Importante:** Esta es solo una evaluación preliminar. `;
      
      if (urgencyLevel === 'urgent' || urgencyLevel === 'high') {
        content += `Dado el nivel de urgencia, te recomiendo buscar atención médica inmediata.`;
      } else {
        content += `Te sugiero consultar con un médico para una evaluación completa.`;
      }

      return {
        content,
        actionButtons: [
          { label: '🚨 Llamar 911', action: 'emergency', variant: 'destructive' },
          { label: '📅 Agendar cita urgente', action: 'solicitar-cita', variant: 'default' },
          { label: '🏥 Hospitales cercanos', action: 'unidades-cercanas', variant: 'outline' }
        ],
        priority: urgencyLevel,
        source: 'medical_api',
        suggestions: [
          '¿Desde cuándo tienes estos síntomas?',
          '¿Has tomado algún medicamento?',
          '¿Tienes otros síntomas?',
          'Describir dolor con más detalle'
        ]
      };
    }

    // Si tenemos APIs externas, usar para análise más inteligente
    if (this.useExternalAPI) {
      // Intentar APIs en orden de preferencia (mejor calidad primero)
      const apiCalls = [];
      
      if (API_CONFIG.gemini.enabled && API_CONFIG.gemini.apiKey.length > 10) {
        apiCalls.push({ 
          call: () => this.callGemini(message), 
          source: 'gemini' as const 
        });
      }
      
      if (API_CONFIG.huggingface.enabled && API_CONFIG.huggingface.apiKey.startsWith('hf_')) {
        apiCalls.push({ 
          call: () => this.callHuggingFace(message), 
          source: 'huggingface' as const 
        });
      }
      
      if (API_CONFIG.openai.enabled && API_CONFIG.openai.apiKey.length > 10) {
        apiCalls.push({ 
          call: () => this.callOpenAI(message), 
          source: 'openai' as const 
        });
      }

      for (const { call, source } of apiCalls) {
        try {
          const aiResponse = await call();
          
          return {
            content: aiResponse,
            actionButtons: [
              { label: '🔍 Preclasificar síntomas', action: 'preclasificar', variant: 'default' },
              { label: '📅 Agendar cita', action: 'solicitar-cita', variant: 'outline' }
            ],
            priority: urgencyLevel,
            source: source,
            suggestions: [
              '¿Desde cuándo tienes estos síntomas?',
              '¿Has tomado algún medicamento?',
              '¿Tienes otros síntomas?'
            ]
          };
        } catch (error) {
          console.warn(`${source} API failed, trying next:`, error);
        }
      }
    }

    // Fallback al conocimiento local
    const medicalAnalysis = MedicalKnowledgeEngine.analyzeSymptoms(possibleSymptoms);

    // Emergencias médicas
    if (urgencyLevel === 'urgent') {
      const conditions = medicalAnalysis.possibleConditions
        .filter(c => c.urgencyLevel === 'urgent')
        .map(c => c.name)
        .join(', ');
        
      return {
        content: `🚨 **ALERTA MÉDICA**: Los síntomas que describes pueden indicar una emergencia médica${conditions ? ` (posible ${conditions})` : ''}. **BUSCA ATENCIÓN INMEDIATA**.`,
        actionButtons: [
          { label: '🚨 Llamar 911', action: 'emergency', variant: 'destructive' },
          { label: '🏥 Hospitales de emergencia', action: 'unidades-cercanas', variant: 'default' }
        ],
        priority: 'urgent',
        source: 'local',
        followUp: 'En Nicaragua, el número de emergencias es 911. Si no puedes movilizarte, pide ayuda inmediatamente.'
      };
    }

    // Síntomas de alta prioridad
    if (urgencyLevel === 'high') {
      const recommendations = medicalAnalysis.recommendations.slice(0, 2);
      const specialty = MedicalKnowledgeEngine.getSpecialtyRecommendation(possibleSymptoms);
      
      return {
        content: `⚠️ Tus síntomas requieren evaluación médica pronto. ${recommendations.length > 0 ? `Recomendaciones: ${recommendations.join(', ')}` : ''}`,
        actionButtons: [
          { label: '🔍 Preclasificar síntomas', action: 'preclasificar', variant: 'default' },
          { label: `📅 Cita ${specialty}`, action: 'solicitar-cita', variant: 'outline' }
        ],
        priority: 'high',
        source: 'local',
        suggestions: [
          '¿Desde cuándo tienes estos síntomas?', 
          '¿Has tomado algún medicamento?', 
          '¿Tienes otros síntomas?',
          'Describir dolor con más detalle'
        ]
      };
    }

    // Síntomas moderados con análisis contextual
    if (urgencyLevel === 'medium') {
      const advice = possibleSymptoms.length > 0 ? 
        MedicalKnowledgeEngine.getSymptomAdvice(possibleSymptoms[0]) : null;
      
      let content = 'Entiendo tu preocupación. Te sugiero usar nuestro sistema de preclasificación para una evaluación detallada.';
      
      if (advice) {
        content += ` Para ${advice.symptom}: ${advice.homeCareTips.slice(0, 2).join(', ')}.`;
      }
      
      return {
        content,
        actionButtons: [
          { label: '🔍 Evaluar síntomas completo', action: 'preclasificar', variant: 'default' },
          { label: '📚 Ver mi historial', action: 'historial', variant: 'outline' }
        ],
        priority: 'medium',
        source: 'local',
        suggestions: [
          'Describe más síntomas',
          'Consultar antecedentes',
          'Medicamentos actuales',
          'Factores que empeoran/mejoran'
        ]
      };
    }

    // Consultas de salud general
    return {
      content: 'Puedo ayudarte a evaluar tus síntomas usando nuestro sistema de IA médica. También puedo darte consejos de salud general.',
      actionButtons: [
        { label: '🔍 Evaluación de síntomas IA', action: 'preclasificar', variant: 'default' },
        { label: '📊 Ver mi índice de salud', action: 'indice-salud', variant: 'outline' }
      ],
      priority: 'low',
      source: 'local',
      suggestions: [
        'Consejos de prevención',
        'Información sobre enfermedades comunes',
        'Cuándo buscar ayuda médica'
      ]
    };
  }

  async processMessage(message: string): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Registrar actividad para el índice de salud
    registrarActividad('consultaIA', {
      message: message,
      timestamp: Date.now()
    });

    try {
      // Determinar el tipo de consulta y usar la mejor estrategia
      if (this.containsHealthSymptoms(message)) {
        return await this.analyzeHealthConcerns(message);
      }

      if (lowerMessage.includes('cita') || lowerMessage.includes('agendar') || lowerMessage.includes('solicitar')) {
        return this.handleAppointmentQueries(message);
      }

      if (lowerMessage.includes('historial') || lowerMessage.includes('consultas anteriores')) {
        return this.handleMedicalHistory(message);
      }

      if (lowerMessage.includes('índice') || lowerMessage.includes('salud general')) {
        return this.handleHealthIndex(message);
      }

      if (lowerMessage.includes('medicamento') || lowerMessage.includes('medicina')) {
        return this.handleMedicationQueries(message);
      }

      if (lowerMessage.includes('hospital') || lowerMessage.includes('centro médico')) {
        return this.handleHospitalQueries(message);
      }

      if (lowerMessage.includes('emergencia') || lowerMessage.includes('urgente')) {
        return this.handleEmergencyGuidance(message);
      }

      // Para consultas generales, intentar APIs externas en orden de preferencia
      if (this.useExternalAPI) {
        // 1. Intentar Gemini primero (mejor para medicina en español)
        if (API_CONFIG.gemini.enabled && API_CONFIG.gemini.apiKey.length > 10) {
          try {
            const aiResponse = await this.callGemini(message);
            return {
              content: aiResponse,
              actionButtons: [
                { label: '📅 Agendar cita', action: 'solicitar-cita', variant: 'default' },
                { label: '🔍 Evaluar síntomas', action: 'preclasificar', variant: 'outline' }
              ],
              source: 'gemini',
              suggestions: this.generateContextualSuggestions(message)
            };
          } catch (error) {
            console.warn('Gemini failed, trying next API:', error);
          }
        }

        // 2. Intentar Hugging Face si está configurado correctamente
        if (API_CONFIG.huggingface.enabled && API_CONFIG.huggingface.apiKey.startsWith('hf_')) {
          try {
            const aiResponse = await this.callHuggingFace(message);
            return {
              content: aiResponse,
              actionButtons: [
                { label: '📅 Agendar cita', action: 'solicitar-cita', variant: 'default' },
                { label: '🔍 Evaluar síntomas', action: 'preclasificar', variant: 'outline' }
              ],
              source: 'huggingface',
              suggestions: this.generateContextualSuggestions(message)
            };
          } catch (error) {
            console.warn('Hugging Face failed, trying next API:', error);
          }
        }

        // 3. Intentar OpenAI como último recurso
        if (API_CONFIG.openai.enabled && API_CONFIG.openai.apiKey.length > 10) {
          try {
            const aiResponse = await this.callOpenAI(message);
            return {
              content: aiResponse,
              actionButtons: [
                { label: '📅 Agendar cita', action: 'solicitar-cita', variant: 'default' },
                { label: '🔍 Evaluar síntomas', action: 'preclasificar', variant: 'outline' }
              ],
              source: 'openai',
              suggestions: this.generateContextualSuggestions(message)
            };
          } catch (error) {
            console.warn('OpenAI failed, fallback to local');
          }
        }
      }

      // Fallback a respuesta local
      return this.handleGeneralHelp();

    } catch (error) {
      console.error('Error in processMessage:', error);
      return {
        content: '😔 Disculpa, he tenido un problema técnico. Por favor intenta nuevamente o contacta al soporte si persiste el error.',
        actionButtons: [
          { label: '📞 Contactar soporte', action: 'support', variant: 'outline' }
        ],
        source: 'local'
      };
    }
  }

  private containsHealthSymptoms(message: string): boolean {
    const healthKeywords = [
      'dolor', 'duele', 'síntoma', 'enfermo', 'malestar', 'fiebre', 'tos', 
      'mareos', 'náuseas', 'vómito', 'diarrea', 'cansancio', 'debilidad',
      'palpitaciones', 'sangre', 'respirar', 'pecho', 'cabeza', 'estómago'
    ];
    
    const lowerMessage = message.toLowerCase();
    return healthKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  private generateContextualSuggestions(message: string): string[] {
    const defaultSuggestions = [
      '¿Cómo agendar una cita?',
      'Información sobre síntomas',
      'Hospitales cercanos',
      'Mi historial médico'
    ];

    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('dolor')) {
      return [
        '¿Dónde te duele exactamente?',
        '¿Desde cuándo tienes dolor?',
        '¿Qué intensidad tiene el dolor?',
        'Medicamentos para el dolor'
      ];
    }

    if (lowerMessage.includes('fiebre')) {
      return [
        '¿Cuánta fiebre tienes?',
        '¿Tienes otros síntomas?',
        'Remedios para la fiebre',
        'Cuándo preocuparse'
      ];
    }

    return defaultSuggestions;
  }

  generateProactiveQuestions(): string[] {
    const { userProfile, healthIndex } = this.context;
    const questions = [];

    if (userProfile) {
      questions.push(`¿Cómo te sientes hoy, ${userProfile.nombre}?`);
      
      if (userProfile.antecedentes?.length) {
        questions.push('Revisar mis antecedentes médicos');
      }
      
      if (userProfile.medicamentosActivos?.length) {
        questions.push('¿Cómo van mis medicamentos?');
      }
    }

    if (healthIndex && healthIndex < 70) {
      questions.push('Mejorar mi índice de salud');
    }

    // Agregar preguntas estacionales para Nicaragua
    const month = new Date().getMonth();
    if (month >= 4 && month <= 10) { // Época lluviosa
      questions.push('Prevención del dengue');
      questions.push('Síntomas de enfermedades de temporada');
    }

    questions.push(
      'Agendar una cita médica',
      'Encontrar hospitales cercanos',
      'Información de emergencia'
    );

    return questions;
  }

  // Métodos privados auxiliares (manteniendo la funcionalidad existente)
  private handleAppointmentQueries(message: string): ChatResponse {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('agendar') || lowerMessage.includes('solicitar') || lowerMessage.includes('nueva cita')) {
      return {
        content: '📅 Te ayudo a agendar una nueva cita médica. ¿Para qué especialidad necesitas la consulta?',
        actionButtons: [
          { label: '📅 Solicitar cita', action: 'solicitar-cita', variant: 'default' },
          { label: '👨‍⚕️ Ver especialidades', action: 'unidades-cercanas', variant: 'outline' }
        ],
        suggestions: [
          'Medicina General',
          'Cardiología',
          'Dermatología',
          'Ginecología',
          'Pediatría'
        ]
      };
    }

    return {
      content: '📅 ¿Necesitas ayuda con tus citas médicas? Te puedo asistir con agendarlas, revisarlas o hacer check-in.',
      actionButtons: [
        { label: '📅 Nueva cita', action: 'solicitar-cita', variant: 'default' },
        { label: '📋 Mis citas', action: 'mis-citas', variant: 'outline' }
      ]
    };
  }

  private handleMedicalHistory(message: string): ChatResponse {
    return {
      content: '📚 En tu historial médico encontrarás todas tus consultas, recetas, exámenes y tratamientos anteriores.',
      actionButtons: [
        { label: '📚 Ver historial', action: 'historial', variant: 'default' },
        { label: '💊 Medicamentos activos', action: 'historial', variant: 'outline' }
      ],
      suggestions: [
        'Última consulta',
        'Resultados de exámenes',
        'Medicamentos actuales',
        'Próximas revisiones'
      ]
    };
  }

  private handleHealthIndex(message: string): ChatResponse {
    const { healthIndex } = this.context;
    
    let healthStatus = 'bueno';
    let recommendation = 'Continúa con tus hábitos saludables.';
    
    if (healthIndex) {
      if (healthIndex >= 85) {
        healthStatus = 'excelente';
        recommendation = '¡Felicitaciones! Tu índice de salud es excelente.';
      } else if (healthIndex >= 70) {
        healthStatus = 'bueno';
        recommendation = 'Tu salud está bien, pero hay áreas de mejora.';
      } else {
        healthStatus = 'que requiere atención';
        recommendation = 'Te recomiendo agendar una consulta médica pronto.';
      }
    }

    return {
      content: `📊 Tu índice de salud actual es ${healthStatus}. ${recommendation}`,
      actionButtons: [
        { label: '📊 Ver análisis completo', action: 'indice-salud', variant: 'default' },
        { label: '📅 Agendar control', action: 'solicitar-cita', variant: 'outline' }
      ],
      suggestions: [
        'Factores de riesgo',
        'Recomendaciones personalizadas',
        'Tendencias de salud',
        'Mejorar índice'
      ]
    };
  }

  private handleMedicationQueries(message: string): ChatResponse {
    const { userProfile } = this.context;
    
    const content = userProfile?.medicamentosActivos?.length 
      ? `💊 Tienes ${userProfile.medicamentosActivos.length} medicamento(s) activo(s). Recuerda tomarlos según indicaciones y reportar cualquier efecto secundario.`
      : '💊 Puedo ayudarte con información sobre medicamentos, dosis, efectos secundarios e interacciones.';

    return {
      content,
      actionButtons: [
        { label: '💊 Ver mis medicamentos', action: 'historial', variant: 'default' },
        { label: '⚠️ Reportar efecto adverso', action: 'preclasificar', variant: 'outline' }
      ],
      suggestions: [
        'Recordatorios de medicamentos',
        'Efectos secundarios comunes',
        'Interacciones medicamentosas',
        'Qué hacer si olvido una dosis'
      ]
    };
  }

  private handleHospitalQueries(message: string): ChatResponse {
    const mainHospitals = hospitals.slice(0, 3);
    let content = '🏥 **Principales hospitales en Managua:**\n\n';
    
    mainHospitals.forEach(hospital => {
      content += `**${hospital.name}**\n`;
      content += `📍 ${hospital.address}\n`;
      content += `📞 ${hospital.phone}\n`;
      content += `🚨 ${hospital.emergencyServices ? 'Servicio de emergencias 24/7' : 'Sin emergencias'}\n\n`;
    });
    
    return {
      content,
      actionButtons: [
        { label: '🏥 Ver ubicaciones', action: 'unidades-cercanas', variant: 'default' },
        { label: '📞 Números de emergencia', action: 'emergency', variant: 'destructive' }
      ],
      suggestions: [
        'Hospital Vivian Pellas',
        'Hospital Bautista',
        'Especialidades disponibles',
        'Servicios de emergencia'
      ]
    };
  }

  private handleEmergencyGuidance(message: string): ChatResponse {
    return {
      content: `🚨 **EMERGENCIAS EN NICARAGUA:**\n\n**Número único de emergencias: 911**\n\n**Cuándo llamar:**\n• Dificultad para respirar\n• Dolor en el pecho\n• Sangrado abundante\n• Pérdida del conocimiento\n• Convulsiones\n\n**Hospitales con emergencias 24/7:**\n• Hospital Vivian Pellas: 2255-8000\n• Hospital Bautista: 2249-7070`,
      actionButtons: [
        { label: '🚨 Llamar 911', action: 'emergency', variant: 'destructive' },
        { label: '🏥 Hospitales de emergencia', action: 'unidades-cercanas', variant: 'default' }
      ],
      priority: 'urgent',
      suggestions: [
        'Primeros auxilios',
        'Qué hacer en emergencia',
        'Números de contacto',
        'Hospitales cercanos'
      ]
    };
  }

  private handleGeneralHelp(): ChatResponse {
    return {
      content: '🏥 Soy tu asistente médico personal con IA avanzada. Puedo ayudarte con citas, síntomas, historial médico y más.',
      actionButtons: [
        { label: '📅 Agendar cita', action: 'solicitar-cita', variant: 'default' },
        { label: '🔍 Evaluar síntomas', action: 'preclasificar', variant: 'default' },
        { label: '🏥 Hospitales cercanos', action: 'unidades-cercanas', variant: 'outline' }
      ],
      suggestions: [
        '¿Cómo usar la app?',
        'Información de emergencia',
        'Contactar soporte',
        'Configurar recordatorios'
      ]
    };
  }
}

// Exportar instancia única
export const chatAI = new AdvancedChatAI();