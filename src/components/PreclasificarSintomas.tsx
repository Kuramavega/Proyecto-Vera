import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { 
  ArrowLeft, 
  ArrowRight,
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  Thermometer,
  Heart,
  Brain,
  Stethoscope,
  Phone,
  Calendar,
  MapPin,
  Bot,
  Lightbulb,
  Shield,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { registrarActividad } from '../hooks/useHealthIndex';
import { toast } from 'sonner@2.0.3';

interface Sintoma {
  id: string;
  nombre: string;
  categoria: string;
  gravedad: number; // 1-10
  ubicacion?: string[];
  descripcion: string;
  preguntas: string[];
}

interface PreguntaEvaluacion {
  id: string;
  pregunta: string;
  tipo: 'multiple' | 'escala' | 'texto' | 'checkbox' | 'ubicacion';
  opciones?: string[];
  requerida: boolean;
  categoria: string;
  peso: number; // Para calcular el riesgo
}

interface PreclasificarSintomasProps {
  onBack: () => void;
  onSolicitarCita: () => void;
}

const sintomasComunes: Sintoma[] = [
  {
    id: 'dolor-cabeza',
    nombre: 'Dolor de cabeza',
    categoria: 'neurológico',
    gravedad: 3,
    ubicacion: ['frente', 'sienes', 'occipital', 'toda la cabeza'],
    descripcion: 'Dolor o molestia en la región craneal',
    preguntas: ['¿Es pulsátil o constante?', '¿Se acompaña de náuseas?', '¿Empeora con la luz?']
  },
  {
    id: 'dolor-pecho',
    nombre: 'Dolor en el pecho',
    categoria: 'cardiovascular',
    gravedad: 8,
    descripcion: 'Dolor, opresión o molestia en la región torácica',
    preguntas: ['¿Se irradia al brazo?', '¿Empeora con el esfuerzo?', '¿Se acompaña de falta de aire?']
  },
  {
    id: 'fiebre',
    nombre: 'Fiebre',
    categoria: 'general',
    gravedad: 5,
    descripcion: 'Elevación de la temperatura corporal por encima de 38°C',
    preguntas: ['¿Cuánto tiempo tienes fiebre?', '¿Se acompaña de escalofríos?']
  },
  {
    id: 'tos',
    nombre: 'Tos',
    categoria: 'respiratorio',
    gravedad: 3,
    descripción: 'Tos persistente o con flemas',
    preguntas: ['¿Es tos seca o con flemas?', '¿Empeora por las noches?']
  },
  {
    id: 'nauseas',
    nombre: 'Náuseas/Vómitos',
    categoria: 'digestivo',
    gravedad: 4,
    descripcion: 'Sensación de malestar estomacal con ganas de vomitar',
    preguntas: ['¿Has vomitado?', '¿Se relaciona con las comidas?']
  },
  {
    id: 'mareos',
    nombre: 'Mareos/Vértigo',
    categoria: 'neurológico',
    gravedad: 4,
    descripcion: 'Sensación de inestabilidad o que todo gira',
    preguntas: ['¿Sientes que todo gira?', '¿Empeora al levantarte?']
  }
];

const preguntasEvaluacion: PreguntaEvaluacion[] = [
  {
    id: 'duracion',
    pregunta: '¿Hace cuánto tiempo tienes estos síntomas?',
    tipo: 'multiple',
    opciones: ['Menos de 1 hora', '1-6 horas', '6-24 horas', '1-3 días', '3-7 días', 'Más de 1 semana'],
    requerida: true,
    categoria: 'temporal',
    peso: 5
  },
  {
    id: 'intensidad',
    pregunta: 'En una escala del 1 al 10, ¿qué tan intensos son tus síntomas?',
    tipo: 'escala',
    opciones: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    requerida: true,
    categoria: 'intensidad',
    peso: 8
  },
  {
    id: 'evolucion',
    pregunta: '¿Cómo han evolucionado los síntomas?',
    tipo: 'multiple',
    opciones: ['Han empeorado', 'Se mantienen igual', 'Han mejorado', 'Van y vienen'],
    requerida: true,
    categoria: 'evolucion',
    peso: 6
  },
  {
    id: 'desencadenantes',
    pregunta: '¿Qué puede haber desencadenado los síntomas?',
    tipo: 'checkbox',
    opciones: ['Estrés', 'Ejercicio físico', 'Comida', 'Medicamentos', 'Cambios climáticos', 'No lo sé'],
    requerida: false,
    categoria: 'desencadenantes',
    peso: 3
  },
  {
    id: 'sintomas-asociados',
    pregunta: '¿Tienes alguno de estos síntomas adicionales?',
    tipo: 'checkbox',
    opciones: ['Dificultad para respirar', 'Sudoración', 'Palpitaciones', 'Visión borrosa', 'Debilidad', 'Confusión'],
    requerida: false,
    categoria: 'asociados',
    peso: 7
  },
  {
    id: 'medicamentos',
    pregunta: '¿Has tomado algún medicamento para estos síntomas?',
    tipo: 'multiple',
    opciones: ['No he tomado nada', 'Medicamentos de venta libre', 'Medicamentos recetados', 'Remedios caseros'],
    requerida: false,
    categoria: 'tratamiento',
    peso: 2
  },
  {
    id: 'antecedentes',
    pregunta: '¿Tienes alguna de estas condiciones médicas?',
    tipo: 'checkbox',
    opciones: ['Diabetes', 'Hipertensión', 'Problemas cardíacos', 'Asma', 'Alergias', 'Ninguna'],
    requerida: false,
    categoria: 'antecedentes',
    peso: 4
  }
];

export function PreclasificarSintomas({ onBack, onSolicitarCita }: PreclasificarSintomasProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [sintomasSeleccionados, setSintomasSeleccionados] = useState<string[]>([]);
  const [respuestas, setRespuestas] = useState<Record<string, any>>({});
  const [descripcionLibre, setDescripcionLibre] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [resultado, setResultado] = useState<{
    nivel: 'BAJO' | 'MEDIO' | 'ALTO';
    puntuacion: number;
    recomendaciones: string[];
    especialidadSugerida: string;
    urgencia: boolean;
  } | null>(null);

  const totalSteps = 4; // Síntomas, Detalles, Evaluación, Resultado
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const calcularRiesgo = () => {
    let puntuacion = 0;
    let factoresAltoRiesgo = 0;

    // Evaluar síntomas seleccionados
    sintomasSeleccionados.forEach(sintomaId => {
      const sintoma = sintomasComunes.find(s => s.id === sintomaId);
      if (sintoma) {
        puntuacion += sintoma.gravedad;
        if (sintoma.gravedad >= 7) factoresAltoRiesgo++;
      }
    });

    // Evaluar respuestas
    Object.entries(respuestas).forEach(([preguntaId, respuesta]) => {
      const pregunta = preguntasEvaluacion.find(p => p.id === preguntaId);
      if (!pregunta) return;

      switch (preguntaId) {
        case 'intensidad':
          const intensidad = parseInt(respuesta);
          puntuacion += intensidad * 2;
          if (intensidad >= 8) factoresAltoRiesgo++;
          break;
        
        case 'duracion':
          if (respuesta === 'Menos de 1 hora' || respuesta === '1-6 horas') {
            puntuacion += 5;
          }
          break;
        
        case 'evolucion':
          if (respuesta === 'Han empeorado') {
            puntuacion += 10;
            factoresAltoRiesgo++;
          }
          break;
        
        case 'sintomas-asociados':
          if (Array.isArray(respuesta)) {
            const sintomasGraves = ['Dificultad para respirar', 'Palpitaciones', 'Confusión', 'Visión borrosa'];
            const sintomasGravesSeleccionados = respuesta.filter(s => sintomasGraves.includes(s));
            puntuacion += sintomasGravesSeleccionados.length * 8;
            if (sintomasGravesSeleccionados.length > 0) factoresAltoRiesgo++;
          }
          break;
        
        case 'antecedentes':
          if (Array.isArray(respuesta)) {
            const antecedentesGraves = ['Diabetes', 'Hipertensión', 'Problemas cardíacos'];
            const antecedentesSeleccionados = respuesta.filter(a => antecedentesGraves.includes(a));
            puntuacion += antecedentesSeleccionados.length * 3;
          }
          break;
      }
    });

    // Determinar nivel de riesgo
    let nivel: 'BAJO' | 'MEDIO' | 'ALTO';
    let recomendaciones: string[] = [];
    let especialidadSugerida = 'Medicina General';
    let urgencia = false;

    if (puntuacion <= 20 && factoresAltoRiesgo === 0) {
      nivel = 'BAJO';
      recomendaciones = [
        'Mantén reposo y observa la evolución de los síntomas',
        'Hidratate adecuadamente',
        'Si los síntomas empeoran, consulta con un médico',
        'Considera agendar una cita de control rutinario'
      ];
    } else if (puntuacion <= 50 || factoresAltoRiesgo <= 1) {
      nivel = 'MEDIO';
      recomendaciones = [
        'Se recomienda consulta médica en las próximas 24-48 horas',
        'Mantén un registro de tus síntomas',
        'Evita esfuerzos físicos intensos',
        'Toma la medicación según indicaciones previas si la tienes'
      ];
      
      // Determinar especialidad según síntomas
      const categoriasSeleccionadas = sintomasSeleccionados.map(id => 
        sintomasComunes.find(s => s.id === id)?.categoria
      ).filter(Boolean);
      
      if (categoriasSeleccionadas.includes('cardiovascular')) {
        especialidadSugerida = 'Cardiología';
      } else if (categoriasSeleccionadas.includes('neurológico')) {
        especialidadSugerida = 'Neurología';
      } else if (categoriasSeleccionadas.includes('respiratorio')) {
        especialidadSugerida = 'Neumología';
      }
    } else {
      nivel = 'ALTO';
      urgencia = true;
      recomendaciones = [
        '⚠️ Se requiere atención médica URGENTE',
        'Dirígete inmediatamente al servicio de emergencias',
        'Llama al 911 si tienes dificultad para movilizarte',
        'No conduzcas, pide ayuda para trasladarte'
      ];
      especialidadSugerida = 'Medicina de Emergencias';
    }

    return {
      nivel,
      puntuacion,
      recomendaciones,
      especialidadSugerida,
      urgencia
    };
  };

  const handleEvaluarSintomas = async () => {
    setIsEvaluating(true);
    
    // Simular procesamiento con IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const evaluacion = calcularRiesgo();
    setResultado(evaluacion);
    setIsEvaluating(false);
    setCurrentStep(3);
    
    // Registrar la actividad para actualizar el índice de salud
    registrarActividad('preclasificacion', {
      riesgo: evaluacion.nivel,
      puntuacion: evaluacion.puntuacion,
      sintomasCount: sintomasSeleccionados.length
    });
  };

  const handleSintomaToggle = (sintomaId: string) => {
    setSintomasSeleccionados(prev => 
      prev.includes(sintomaId) 
        ? prev.filter(id => id !== sintomaId)
        : [...prev, sintomaId]
    );
  };

  const handleRespuesta = (preguntaId: string, valor: any) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor
    }));
  };

  const canContinue = () => {
    switch (currentStep) {
      case 0:
        return sintomasSeleccionados.length > 0;
      case 1:
        return descripcionLibre.trim().length > 0;
      case 2:
        const preguntasRequeridas = preguntasEvaluacion.filter(p => p.requerida);
        return preguntasRequeridas.every(p => respuestas[p.id] !== undefined);
      default:
        return true;
    }
  };

  const SintomaCard = ({ sintoma }: { sintoma: Sintoma }) => {
    const isSelected = sintomasSeleccionados.includes(sintoma.id);
    const IconComponent = sintoma.categoria === 'cardiovascular' ? Heart :
                         sintoma.categoria === 'neurológico' ? Brain :
                         sintoma.categoria === 'respiratorio' ? Activity :
                         sintoma.categoria === 'general' ? Thermometer :
                         Stethoscope;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleSintomaToggle(sintoma.id)}
        className={`cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-primary bg-primary/5' 
            : 'hover:bg-muted/50'
        }`}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`rounded-full p-2 ${
                sintoma.gravedad >= 7 ? 'bg-red-100 dark:bg-red-900/30' :
                sintoma.gravedad >= 5 ? 'bg-orange-100 dark:bg-orange-900/30' :
                'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <IconComponent className={`size-5 ${
                  sintoma.gravedad >= 7 ? 'text-red-600 dark:text-red-400' :
                  sintoma.gravedad >= 5 ? 'text-orange-600 dark:text-orange-400' :
                  'text-blue-600 dark:text-blue-400'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{sintoma.nombre}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {sintoma.descripcion}
                </p>
                {sintoma.gravedad >= 7 && (
                  <Badge className="mt-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-0">
                    <AlertTriangle className="size-3 mr-1" />
                    Alta prioridad
                  </Badge>
                )}
              </div>
              {isSelected && (
                <CheckCircle className="size-5 text-primary" />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const PreguntaCard = ({ pregunta }: { pregunta: PreguntaEvaluacion }) => {
    const respuesta = respuestas[pregunta.id];

    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <h3 className="font-medium flex-1">{pregunta.pregunta}</h3>
              {pregunta.requerida && (
                <Badge variant="outline" className="text-xs">
                  Requerida
                </Badge>
              )}
            </div>

            {pregunta.tipo === 'multiple' && (
              <RadioGroup
                value={respuesta || ''}
                onValueChange={(value) => handleRespuesta(pregunta.id, value)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pregunta.opciones?.map((opcion) => (
                    <div key={opcion} className="flex items-center space-x-2">
                      <RadioGroupItem value={opcion} id={`${pregunta.id}-${opcion}`} />
                      <Label htmlFor={`${pregunta.id}-${opcion}`} className="text-sm">
                        {opcion}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {pregunta.tipo === 'escala' && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Muy leve</span>
                  <span>Muy intenso</span>
                </div>
                <div className="grid grid-cols-10 gap-2">
                  {pregunta.opciones?.map((opcion) => (
                    <Button
                      key={opcion}
                      variant={respuesta === opcion ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRespuesta(pregunta.id, opcion)}
                      className="aspect-square p-0"
                    >
                      {opcion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {pregunta.tipo === 'checkbox' && (
              <div className="space-y-3">
                {pregunta.opciones?.map((opcion) => (
                  <div key={opcion} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${pregunta.id}-${opcion}`}
                      checked={Array.isArray(respuesta) && respuesta.includes(opcion)}
                      onCheckedChange={(checked) => {
                        const currentValues = Array.isArray(respuesta) ? respuesta : [];
                        if (checked) {
                          handleRespuesta(pregunta.id, [...currentValues, opcion]);
                        } else {
                          handleRespuesta(pregunta.id, currentValues.filter(v => v !== opcion));
                        }
                      }}
                    />
                    <Label htmlFor={`${pregunta.id}-${opcion}`} className="text-sm">
                      {opcion}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="size-4 mr-2" />
                Volver
              </Button>
              <h1 className="ml-4 text-xl font-semibold">{t('symptoms.title')}</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              {currentStep + 1} / {totalSteps}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Step 0: Selección de síntomas */}
          {currentStep === 0 && (
            <motion.div
              key="sintomas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="size-6 mr-2" />
                    Selecciona tus síntomas
                  </CardTitle>
                  <CardDescription>
                    Marca todos los síntomas que estás experimentando actualmente
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sintomasComunes.map(sintoma => (
                  <SintomaCard key={sintoma.id} sintoma={sintoma} />
                ))}
              </div>

              {sintomasSeleccionados.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Síntomas seleccionados:</h3>
                      <div className="flex flex-wrap gap-2">
                        {sintomasSeleccionados.map(id => {
                          const sintoma = sintomasComunes.find(s => s.id === id);
                          return sintoma && (
                            <Badge key={id} variant="outline">
                              {sintoma.nombre}
                            </Badge>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 1: Descripción libre */}
          {currentStep === 1 && (
            <motion.div
              key="descripcion"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="size-6 mr-2" />
                    Describe tus síntomas
                  </CardTitle>
                  <CardDescription>
                    Proporciona detalles adicionales sobre cómo te sientes. Esto nos ayuda a dar una evaluación más precisa.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Describe con detalle cómo comenzaron los síntomas, qué los empeora o mejora, y cualquier otro detalle importante..."
                    value={descripcionLibre}
                    onChange={(e) => setDescripcionLibre(e.target.value)}
                    className="min-h-32"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    {descripcionLibre.length}/500 caracteres
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="size-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Consejos para una mejor evaluación:</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>• Menciona cuándo comenzaron los síntomas</li>
                        <li>• Describe la intensidad del dolor (escala 1-10)</li>
                        <li>• Indica si algo empeora o mejora los síntomas</li>
                        <li>• Menciona si has tomado algún medicamento</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Preguntas específicas */}
          {currentStep === 2 && (
            <motion.div
              key="preguntas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="size-6 mr-2" />
                    Preguntas específicas
                  </CardTitle>
                  <CardDescription>
                    Responde estas preguntas para completar tu evaluación médica
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="space-y-6">
                {preguntasEvaluacion.map(pregunta => (
                  <PreguntaCard key={pregunta.id} pregunta={pregunta} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Evaluación en progreso o Resultado */}
          {currentStep === 3 && (
            <motion.div
              key="resultado"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {isEvaluating ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="bg-primary rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center mb-6"
                  >
                    <Bot className="size-8 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-semibold mb-2">Analizando tus síntomas...</h2>
                  <p className="text-muted-foreground mb-6">
                    Nuestro sistema de IA está procesando tu información para generar una evaluación personalizada
                  </p>
                  <div className="max-w-md mx-auto">
                    <Progress value={85} className="mb-2" />
                    <p className="text-sm text-muted-foreground">Procesando datos médicos...</p>
                  </div>
                </div>
              ) : resultado && (
                <div className="space-y-6">
                  {/* Resultado principal */}
                  <Card className={`border-0 shadow-xl ${
                    resultado.nivel === 'ALTO' ? 'border-l-4 border-l-red-500' :
                    resultado.nivel === 'MEDIO' ? 'border-l-4 border-l-orange-500' :
                    'border-l-4 border-l-green-500'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          {resultado.nivel === 'ALTO' && <AlertTriangle className="size-6 mr-2 text-red-600" />}
                          {resultado.nivel === 'MEDIO' && <Clock className="size-6 mr-2 text-orange-600" />}
                          {resultado.nivel === 'BAJO' && <CheckCircle className="size-6 mr-2 text-green-600" />}
                          Resultado de Evaluación
                        </CardTitle>
                        <Badge className={
                          resultado.nivel === 'ALTO' ? 'bg-red-100 text-red-700 border-0' :
                          resultado.nivel === 'MEDIO' ? 'bg-orange-100 text-orange-700 border-0' :
                          'bg-green-100 text-green-700 border-0'
                        }>
                          Riesgo {resultado.nivel}
                        </Badge>
                      </div>
                      <CardDescription>
                        Evaluación basada en los síntomas y respuestas proporcionadas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Recomendaciones:</h4>
                        <ul className="space-y-2">
                          {resultado.recomendaciones.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="size-1.5 bg-current rounded-full mt-2"></div>
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Especialidad sugerida:</h4>
                        <p className="text-sm text-muted-foreground">{resultado.especialidadSugerida}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Acciones recomendadas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resultado.urgencia ? (
                      <>
                        <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/20">
                          <CardContent className="p-6 text-center">
                            <AlertTriangle className="size-12 text-red-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Emergencia</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Necesitas atención médica inmediata
                            </p>
                            <Button 
                              className="w-full bg-red-600 hover:bg-red-700"
                              onClick={() => window.open('tel:911', '_self')}
                            >
                              <Phone className="size-4 mr-2" />
                              Llamar 911
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-6 text-center">
                            <MapPin className="size-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Urgencias Cercanas</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Encuentra el servicio de emergencias más cercano
                            </p>
                            <Button variant="outline" className="w-full">
                              <MapPin className="size-4 mr-2" />
                              Ver Ubicaciones
                            </Button>
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      <>
                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-6 text-center">
                            <Calendar className="size-12 text-green-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Agendar Cita</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Programa una consulta con un especialista
                            </p>
                            <Button 
                              className="w-full"
                              onClick={onSolicitarCita}
                            >
                              <Calendar className="size-4 mr-2" />
                              Solicitar Cita
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-6 text-center">
                            <Activity className="size-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Nueva Evaluación</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Realiza otra evaluación si los síntomas cambian
                            </p>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setSintomasSeleccionados([]);
                                setRespuestas({});
                                setDescripcionLibre('');
                                setResultado(null);
                                setCurrentStep(0);
                              }}
                            >
                              <Stethoscope className="size-4 mr-2" />
                              Nueva Evaluación
                            </Button>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>

                  {/* Disclaimer */}
                  <Card className="border-0 shadow-sm bg-yellow-50 dark:bg-yellow-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-2">
                        <Shield className="size-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm text-yellow-800 dark:text-yellow-300">
                            {t('symptoms.important')}
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                            Esta evaluación es solo orientativa y no reemplaza el criterio médico profesional. 
                            Ante cualquier emergencia, contacta inmediatamente el número de urgencias 911.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {!isEvaluating && resultado === null && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="size-4 mr-2" />
              Anterior
            </Button>

            {currentStep < 2 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canContinue()}
              >
                Siguiente
                <ArrowRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleEvaluarSintomas}
                disabled={!canContinue()}
              >
                Evaluar Síntomas
                <Bot className="size-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}