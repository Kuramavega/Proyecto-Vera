# Integración de APIs para Chat Inteligente SaludCerca

## Resumen

El chat inteligente de SaludCerca puede integrarse con múltiples APIs externas para proporcionar respuestas más precisas y actualizadas. Este documento explica cómo configurar e integrar estas APIs.

## APIs Soportadas

### 1. OpenAI API (GPT-4/GPT-3.5)
**Propósito**: Respuestas conversacionales inteligentes y análisis de consultas médicas generales.

**Configuración**:
```env
REACT_APP_OPENAI_ENABLED=true
REACT_APP_OPENAI_API_KEY=tu_api_key_aqui
REACT_APP_OPENAI_MODEL=gpt-4-turbo-preview
```

**Costo estimado**: $0.01-0.03 por consulta
**Beneficios**: 
- Respuestas muy naturales y contextualmente apropiadas
- Excelente comprensión del lenguaje español nicaragüense
- Capacidad de mantener contexto conversacional

### 2. Infermedica API
**Propósito**: Análisis profesional de síntomas médicos y triaje clínico.

**Configuración**:
```env
REACT_APP_INFERMEDICA_ENABLED=true
REACT_APP_INFERMEDICA_APP_ID=tu_app_id
REACT_APP_INFERMEDICA_APP_KEY=tu_app_key
```

**Costo estimado**: $0.10-0.25 por análisis de síntomas
**Beneficios**:
- Base de conocimiento médico profesional
- Algoritmos de triaje validados clínicamente
- Análisis de urgencia médica preciso

### 3. Claude API (Anthropic)
**Propósito**: Alternativa a OpenAI con enfoque en seguridad médica.

**Configuración**:
```env
REACT_APP_CLAUDE_ENABLED=true
REACT_APP_CLAUDE_API_KEY=tu_api_key_aqui
REACT_APP_CLAUDE_MODEL=claude-3-sonnet-20240229
```

**Costo estimado**: $0.008-0.024 por consulta
**Beneficios**:
- Muy conservador en recomendaciones médicas
- Excelente para manejar consultas sensibles
- Menos propenso a dar información médica inapropiada

### 4. APIs Médicas Alternativas

#### a) Babylon Health API
- Análisis de síntomas basado en IA
- Integración con sistemas de salud

#### b) Ada Health API
- Evaluación de síntomas personalizada
- Soporte multiidioma

#### c) Your.MD API
- Chatbot médico especializado
- Base de conocimiento curada por médicos

## Configuración Paso a Paso

### 1. Configuración de APIs (Modo Seguro)

**IMPORTANTE**: Por seguridad, las API keys NO se configuran en el cliente. En su lugar, el sistema usa:

#### Configuración Dinámica (Recomendado para Producción)
```typescript
// En el futuro, se puede configurar a través de panel de administración
import { configureAPIs } from './services/chatAI';

// Configurar APIs a través de llamada al servidor
configureAPIs({
  openai: {
    enabled: true,
    apiKey: 'obtenido-del-servidor-seguro',
    model: 'gpt-4-turbo-preview',
    baseURL: 'https://api.openai.com/v1'
  }
});
```

#### Configuración de Desarrollo (Local únicamente)
```typescript
// Solo para pruebas locales, NUNCA en producción
const devConfig = {
  openai: {
    enabled: true,
    apiKey: 'sk-your-dev-key-here',
    model: 'gpt-4-turbo-preview',
    baseURL: 'https://api.openai.com/v1'
  }
};
```

### 2. Obtener API Keys

#### OpenAI:
1. Visitar [platform.openai.com](https://platform.openai.com)
2. Crear cuenta y agregar método de pago
3. Ir a "API Keys" y crear nueva key
4. Configurar límites de uso (recomendado: $10-50/mes para pruebas)

#### Infermedica:
1. Visitar [developer.infermedica.com](https://developer.infermedica.com)
2. Registrarse para cuenta de desarrollador
3. Solicitar acceso a la API (proceso de revisión)
4. Obtener App-Id y App-Key

#### Claude:
1. Visitar [console.anthropic.com](https://console.anthropic.com)
2. Crear cuenta y completar verificación
3. Generar API key en la sección de desarrolladores

### 3. Configurar Fallbacks

El sistema está diseñado para fallar de manera elegante:

```typescript
// Orden de preferencia:
1. API médica especializada (Infermedica) para síntomas
2. OpenAI/Claude para consultas generales
3. Conocimiento local como fallback
```

### 4. Monitoreo y Logs

El sistema incluye logging automático:

```typescript
// Logs incluyen:
- Tipo de API utilizada
- Tiempo de respuesta
- Errores y fallbacks
- Costo estimado por consulta
- Satisfacción del usuario
```

## Mejores Prácticas

### Seguridad
- **NUNCA** incluir API keys en el código fuente
- Usar variables de entorno para todas las configuraciones
- Implementar rate limiting para evitar costos excesivos
- Validar y sanitizar todas las entradas del usuario

### Costo Optimization
- Usar caché local para consultas frecuentes
- Implementar timeouts para evitar consultas colgadas
- Preferir APIs más baratas para consultas simples
- Monitorear uso diario y configurar alertas

### Experiencia de Usuario
- Implementar fallbacks rápidos (< 2 segundos)
- Mostrar indicadores de que se está usando IA avanzada
- Proporcionar feedback sobre la fuente de la información
- Permitir al usuario elegir entre respuesta rápida (local) vs. detallada (API)

## Prompt Engineering para Contexto Médico

### Prompts Especializados

```typescript
const medicalSystemPrompt = `
Eres un asistente médico virtual para SaludCerca en Nicaragua.

REGLAS CRÍTICAS:
1. NO diagnostiques - solo educa e informa
2. SIEMPRE recomienda consultar profesionales médicos
3. Para emergencias: recomienda 911 INMEDIATAMENTE
4. Enfócate en contexto nicaragüense (dengue, hospitales locales)
5. Sé conservador - mejor enviar al médico que arriesgarse

CONTEXTO NICARAGUA:
- Hospitales: Vivian Pellas (2255-8000), Bautista (2249-7070)
- Enfermedades comunes: dengue, hipertensión, diabetes
- Emergencias: 911
- Época lluviosa: mayor riesgo dengue
`;
```

### Ejemplos de Uso Exitoso

```typescript
// Consulta de síntomas
Usuario: "Tengo fiebre alta y dolor de cabeza desde ayer"
IA: "Los síntomas de fiebre alta y dolor de cabeza pueden tener varias causas. En Nicaragua, durante la época lluviosa, es importante considerar dengue. Te recomiendo:

1. Buscar atención médica PRONTO (no esperes)
2. Hospitales disponibles: Vivian Pellas (2255-8000)
3. Mientras tanto: hidratación, paracetamol, reposo
4. EVITA aspirina (riesgo con dengue)

¿Tienes otros síntomas como dolor muscular, erupciones o náuseas?"
```

## Implementación Técnica

### Estructura de Respuesta

```typescript
interface APIResponse {
  content: string;           // Respuesta principal
  source: 'openai' | 'infermedica' | 'local';
  confidence: number;        // 0-1, confianza en la respuesta
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  recommendations: string[]; // Acciones recomendadas
  followUp: string;         // Preguntas de seguimiento
  estimatedCost: number;    // Costo de la consulta en USD
}
```

### Manejo de Errores

```typescript
try {
  const response = await callMedicalAPI(symptoms);
  return formatMedicalResponse(response);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    return fallbackToLocal(symptoms);
  } else if (error.code === 'API_DOWN') {
    return fallbackToAlternativeAPI(symptoms);
  } else {
    logError(error);
    return gracefulErrorResponse();
  }
}
```

## Métricas y Análisis

### KPIs a Monitorear
- **Precisión**: Satisfacción del usuario con respuestas
- **Tiempo de respuesta**: < 3 segundos promedio
- **Tasa de fallback**: < 10% a APIs locales
- **Costo por consulta**: < $0.05 promedio
- **Urgencias detectadas**: % de casos urgentes identificados correctamente

### Dashboard de Monitoreo
- Uso diario por API
- Costo acumulado mensual
- Errores y timeouts
- Satisfacción del usuario
- Casos de emergencia manejados

## Consideraciones Legales y Éticas

### Disclaimer Médico
Todas las respuestas deben incluir:
> "Esta información es solo educativa y no reemplaza el consejo médico profesional. Siempre consulta con un médico para diagnósticos y tratamientos."

### Cumplimiento HIPAA (si aplica)
- No almacenar información médica sensible
- Encriptar todas las comunicaciones
- Implementar logs de auditoría
- Política de retención de datos clara

### Responsabilidad
- El sistema es una herramienta de información, no diagnóstico
- Los usuarios deben entender las limitaciones
- Protocolos claros para emergencias médicas
- Escalación automática a servicios de emergencia cuando sea necesario

## Roadmap de Implementación

### Fase 1 (Inmediata): Configuración Básica
- [ ] Integrar OpenAI para consultas generales
- [ ] Implementar fallbacks robustos
- [ ] Configurar rate limiting básico
- [ ] Tests de integración

### Fase 2 (2-4 semanas): APIs Médicas Especializadas
- [ ] Integrar Infermedica para síntomas
- [ ] Mejorar prompts médicos específicos
- [ ] Implementar triaje automático
- [ ] Análisis de urgencia mejorado

### Fase 3 (1-3 meses): Optimización Avanzada
- [ ] Machine learning para optimizar respuestas
- [ ] Integración con base de datos de hospitales
- [ ] Personalización basada en historial médico
- [ ] API propia de SaludCerca para otros desarrolladores

### Fase 4 (3-6 meses): Expansión
- [ ] Soporte para múltiples idiomas
- [ ] Integración con dispositivos IoT médicos
- [ ] Análisis predictivo de salud
- [ ] Telemedicina integrada

## Conclusión

La integración de APIs externas transformará el chat inteligente de SaludCerca en una herramienta médica de clase mundial, manteniendo la seguridad y el contexto nicaragüense como prioridades principales.

Para implementación inmediata, recomendamos comenzar con OpenAI ($20-50/mes) para obtener mejoras dramáticas en la calidad de respuestas, luego agregar Infermedica para análisis médico especializado.