// Configuración centralizada para APIs externas del chat inteligente

export interface APIConfig {
  openai: {
    enabled: boolean;
    apiKey: string;
    model: string;
    baseURL: string;
    maxTokens: number;
    temperature: number;
  };
  infermedica: {
    enabled: boolean;
    appId: string;
    appKey: string;
    baseURL: string;
  };
  claude: {
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
}

// Configuración por defecto - Para producción, configurar estas variables
export const defaultAPIConfig: APIConfig = {
  openai: {
    enabled: false, // Cambiar a true cuando se configure
    apiKey: 'YOUR_OPENAI_API_KEY_HERE',
    model: 'gpt-4-turbo-preview',
    baseURL: 'https://api.openai.com/v1',
    maxTokens: 500,
    temperature: 0.7
  },
  infermedica: {
    enabled: false, // Cambiar a true cuando se configure
    appId: 'YOUR_INFERMEDICA_APP_ID',
    appKey: 'YOUR_INFERMEDICA_APP_KEY',
    baseURL: 'https://api.infermedica.com/v3'
  },
  claude: {
    enabled: false, // Cambiar a true cuando se configure
    apiKey: 'YOUR_CLAUDE_API_KEY_HERE',
    model: 'claude-3-sonnet-20240229',
    baseURL: 'https://api.anthropic.com/v1'
  },
  medicalAPI: {
    enabled: false, // Cambiar a true cuando se configure
    apiKey: 'YOUR_MEDICAL_API_KEY',
    baseURL: 'https://api.example.com/medical'
  }
};

// Validar configuración de APIs
export function validateAPIConfig(config: APIConfig): boolean {
  const validations = [
    // OpenAI validation
    !config.openai.enabled || 
    (config.openai.apiKey !== 'YOUR_OPENAI_API_KEY_HERE' && config.openai.apiKey.length > 10),
    
    // Infermedica validation
    !config.infermedica.enabled || 
    (config.infermedica.appId !== 'YOUR_INFERMEDICA_APP_ID' && config.infermedica.appKey !== 'YOUR_INFERMEDICA_APP_KEY'),
    
    // Claude validation
    !config.claude.enabled || 
    (config.claude.apiKey !== 'YOUR_CLAUDE_API_KEY_HERE' && config.claude.apiKey.length > 10)
  ];

  return validations.every(valid => valid);
}

// Obtener APIs habilitadas
export function getEnabledAPIs(config: APIConfig): string[] {
  const enabled = [];
  
  if (config.openai.enabled && config.openai.apiKey !== 'YOUR_OPENAI_API_KEY_HERE') {
    enabled.push('OpenAI');
  }
  
  if (config.infermedica.enabled && config.infermedica.appId !== 'YOUR_INFERMEDICA_APP_ID') {
    enabled.push('Infermedica');
  }
  
  if (config.claude.enabled && config.claude.apiKey !== 'YOUR_CLAUDE_API_KEY_HERE') {
    enabled.push('Claude');
  }
  
  if (config.medicalAPI.enabled && config.medicalAPI.apiKey !== 'YOUR_MEDICAL_API_KEY') {
    enabled.push('Medical API');
  }
  
  return enabled;
}

// Configuración específica para prompts médicos
export const medicalPrompts = {
  systemPrompt: `Eres un asistente médico virtual inteligente para SaludCerca, una aplicación de salud en Nicaragua.

DIRECTRICES MÉDICAS IMPORTANTES:
- NO proporciones diagnósticos definitivos - solo orientación e información educativa
- SIEMPRE recomienda consultar a un profesional médico para diagnósticos
- Para emergencias, INMEDIATAMENTE recomienda llamar al 911
- Enfócate en el contexto nicaragüense (hospitales locales, enfermedades endémicas como dengue)
- Sé empático, claro y fácil de entender
- Prioriza SIEMPRE la seguridad del paciente

CONTEXTO NICARAGÜENSE:
- Principales hospitales: Hospital Vivian Pellas, Hospital Bautista, Hospital Alemán Nicaragüense
- Enfermedades comunes: dengue, hipertensión, diabetes, gastroenteritis
- Emergencias: 911
- Época lluviosa (mayo-octubre): mayor riesgo de dengue, enfermedades respiratorias
- Época seca (noviembre-abril): enfermedades respiratorias por polvo

FORMATO DE RESPUESTA:
- Información clara y comprensible
- Recomendaciones de acción específicas
- Cuándo buscar ayuda médica inmediata
- Referencias a especialistas apropiados cuando sea necesario`,

  symptomAnalysisPrompt: (symptoms: string, userContext: string) => 
    `Analiza estos síntomas en el contexto de un paciente en Nicaragua:

SÍNTOMAS: ${symptoms}
CONTEXTO DEL PACIENTE: ${userContext}

Proporciona:
1. Evaluación del nivel de urgencia (bajo, medio, alto, urgente)
2. Posibles causas (sin diagnosticar definitivamente)
3. Recomendaciones inmediatas
4. Cuándo buscar atención médica
5. Especialista apropiado si es necesario
6. Consideraciones específicas para Nicaragua

Recuerda: NO diagnostiques, solo orienta y educa.`,

  emergencyPrompt: `El usuario está reportando síntomas que podrían ser una emergencia médica. 

INSTRUCCIONES:
1. Evalúa si los síntomas requieren atención INMEDIATA
2. Si es emergencia: recomienda llamar 911 INMEDIATAMENTE
3. Proporciona instrucciones de primeros auxilios básicos si aplica
4. Lista hospitales con servicios de emergencia en Nicaragua
5. Mantén la calma pero sé directo sobre la urgencia

NÚMEROS DE EMERGENCIA NICARAGUA:
- Emergencias generales: 911
- Hospital Vivian Pellas: 2255-8000
- Hospital Bautista: 2249-7070`
};

// Configuración de rate limiting para las APIs
export const rateLimits = {
  openai: {
    requestsPerMinute: 10,
    requestsPerHour: 100
  },
  infermedica: {
    requestsPerMinute: 5,
    requestsPerHour: 50
  },
  claude: {
    requestsPerMinute: 15,
    requestsPerHour: 200
  }
};

// Función para crear headers de autenticación
export function createAuthHeaders(apiType: keyof APIConfig, config: APIConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  switch (apiType) {
    case 'openai':
      headers['Authorization'] = `Bearer ${config.openai.apiKey}`;
      break;
    case 'infermedica':
      headers['App-Id'] = config.infermedica.appId;
      headers['App-Key'] = config.infermedica.appKey;
      break;
    case 'claude':
      headers['Authorization'] = `Bearer ${config.claude.apiKey}`;
      headers['anthropic-version'] = '2023-06-01';
      break;
    case 'medicalAPI':
      headers['Authorization'] = `Bearer ${config.medicalAPI.apiKey}`;
      break;
  }

  return headers;
}