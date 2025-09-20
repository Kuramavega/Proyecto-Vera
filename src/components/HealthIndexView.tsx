import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Heart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Shield,
  Info,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { HealthIndexCard } from './HealthIndexCard';
import { useHealthIndex } from '../hooks/useHealthIndex';
import { useLanguage } from '../context/LanguageContext';

interface HealthIndexViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export function HealthIndexView({ onBack, onNavigate }: HealthIndexViewProps) {
  const { language } = useLanguage();
  const healthMetrics = useHealthIndex();
  const [activeTab, setActiveTab] = useState('resumen');

  const getHealthRecommendations = () => {
    const recomendaciones = [];
    
    if (healthMetrics.indiceGeneral >= 85) {
      recomendaciones.push({
        titulo: language === 'es' ? 'Mantén el buen trabajo' : 'Keep up the good work',
        descripcion: language === 'es' 
          ? 'Tu índice de salud es excelente. Continúa con tus hábitos saludables.'
          : 'Your health index is excellent. Continue with your healthy habits.',
        accion: language === 'es' ? 'Ver citas programadas' : 'View scheduled appointments',
        vista: 'mis-citas',
        prioridad: 'baja'
      });
    } else if (healthMetrics.indiceGeneral >= 70) {
      recomendaciones.push({
        titulo: language === 'es' ? 'Agendar consulta de control' : 'Schedule check-up',
        descripcion: language === 'es'
          ? 'Tu salud está bien, pero sería bueno hacer una revisión general.'
          : 'Your health is good, but a general check-up would be beneficial.',
        accion: language === 'es' ? 'Solicitar cita' : 'Request appointment',
        vista: 'solicitar-cita',
        prioridad: 'media'
      });
    } else {
      recomendaciones.push({
        titulo: language === 'es' ? 'Consulta médica prioritaria' : 'Priority medical consultation',
        descripcion: language === 'es'
          ? 'Tu índice de salud sugiere que deberías consultar con un médico pronto.'
          : 'Your health index suggests you should consult with a doctor soon.',
        accion: language === 'es' ? 'Agendar urgente' : 'Schedule urgent',
        vista: 'solicitar-cita',
        prioridad: 'alta'
      });
    }

    // Recomendaciones adicionales basadas en factores específicos
    if (healthMetrics.factoresRiesgo.some(f => f.factor.includes('Antecedentes'))) {
      recomendaciones.push({
        titulo: language === 'es' ? 'Seguimiento especializado' : 'Specialized follow-up',
        descripcion: language === 'es'
          ? 'Tus antecedentes médicos requieren seguimiento regular.'
          : 'Your medical history requires regular follow-up.',
        accion: language === 'es' ? 'Ver historial' : 'View history',
        vista: 'historial',
        prioridad: 'media'
      });
    }

    return recomendaciones;
  };

  const recomendaciones = getHealthRecommendations();

  const getHistoricoSimulado = () => {
    // Simular datos históricos del índice de salud
    const meses = [
      { mes: 'Jul', indice: 82 },
      { mes: 'Ago', indice: 85 },
      { mes: 'Sep', indice: 83 },
      { mes: 'Oct', indice: 87 },
      { mes: 'Nov', indice: 84 },
      { mes: 'Dic', indice: healthMetrics.indiceGeneral }
    ];
    return meses;
  };

  const historicoData = getHistoricoSimulado();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="size-4 mr-2" />
                {language === 'es' ? 'Volver' : 'Back'}
              </Button>
              <h1 className="ml-4 text-xl font-semibold">
                {language === 'es' ? 'Índice de Salud' : 'Health Index'}
              </h1>
            </div>
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              {language === 'es' ? 'Análisis Personal' : 'Personal Analysis'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Índice principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HealthIndexCard showDetails={false} />
        </motion.div>

        {/* Tabs de análisis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resumen">
                {language === 'es' ? 'Resumen' : 'Summary'}
              </TabsTrigger>
              <TabsTrigger value="factores">
                {language === 'es' ? 'Factores' : 'Factors'}
              </TabsTrigger>
              <TabsTrigger value="tendencias">
                {language === 'es' ? 'Tendencias' : 'Trends'}
              </TabsTrigger>
            </TabsList>

            {/* Tab Resumen */}
            <TabsContent value="resumen" className="space-y-6 mt-6">
              {/* Recomendaciones personalizadas */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="size-6 mr-2" />
                    {language === 'es' ? 'Recomendaciones Personalizadas' : 'Personalized Recommendations'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'es' 
                      ? 'Acciones sugeridas basadas en tu índice de salud actual'
                      : 'Suggested actions based on your current health index'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recomendaciones.map((rec, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 ${
                        rec.prioridad === 'alta' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                        rec.prioridad === 'media' ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                        'border-l-green-500 bg-green-50 dark:bg-green-900/20'
                      }`}
                      onClick={() => onNavigate(rec.vista)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{rec.titulo}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rec.descripcion}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            {rec.accion}
                          </Button>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Resumen de métricas de salud */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="size-6 mr-2" />
                    {language === 'es' ? 'Métricas de Salud' : 'Health Metrics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {healthMetrics.factoresPositivos.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Factores positivos' : 'Positive factors'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {healthMetrics.factoresRiesgo.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Factores de riesgo' : 'Risk factors'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {healthMetrics.recomendaciones.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Recomendaciones' : 'Recommendations'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {healthMetrics.tendencia === 'mejorando' ? '↗' : 
                         healthMetrics.tendencia === 'empeorando' ? '↘' : '→'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Tendencia' : 'Trend'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Factores */}
            <TabsContent value="factores" className="space-y-6 mt-6">
              <HealthIndexCard showDetails={true} />
            </TabsContent>

            {/* Tab Tendencias */}
            <TabsContent value="tendencias" className="space-y-6 mt-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="size-6 mr-2" />
                    {language === 'es' ? 'Evolución del Índice' : 'Index Evolution'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'es' 
                      ? 'Seguimiento de tu índice de salud en los últimos meses'
                      : 'Tracking your health index over the past months'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Gráfico simple con barras */}
                    <div className="space-y-4">
                      {historicoData.map((data, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-12 text-sm text-muted-foreground">
                            {data.mes}
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-4 relative overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${data.indice}%` }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className={`h-full rounded-full ${
                                data.indice >= 85 ? 'bg-green-500' :
                                data.indice >= 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                            />
                          </div>
                          <div className="w-12 text-sm font-medium">
                            {data.indice}%
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Análisis de tendencia */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        {healthMetrics.tendencia === 'mejorando' ? (
                          <TrendingUp className="size-5 text-green-600" />
                        ) : healthMetrics.tendencia === 'empeorando' ? (
                          <TrendingDown className="size-5 text-red-600" />
                        ) : (
                          <Activity className="size-5 text-gray-600" />
                        )}
                        <h4 className="font-medium">
                          {language === 'es' ? 'Análisis de Tendencia' : 'Trend Analysis'}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? (
                          healthMetrics.tendencia === 'mejorando' 
                            ? 'Tu índice de salud ha mostrado mejoras en los últimos meses. ¡Continúa así!'
                            : healthMetrics.tendencia === 'empeorando'
                            ? 'Tu índice de salud ha disminuido. Considera consultar con tu médico.'
                            : 'Tu índice de salud se mantiene estable. Continúa con tus hábitos actuales.'
                        ) : (
                          healthMetrics.tendencia === 'mejorando'
                            ? 'Your health index has shown improvements in recent months. Keep it up!'
                            : healthMetrics.tendencia === 'empeorando'
                            ? 'Your health index has declined. Consider consulting with your doctor.'
                            : 'Your health index remains stable. Continue with your current habits.'
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Próxima actualización */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="size-6 mr-2" />
                    {language === 'es' ? 'Próxima Actualización' : 'Next Update'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {language === 'es' ? 'Actualización automática' : 'Automatic update'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' 
                          ? 'Tu índice se actualiza automáticamente con nueva información médica'
                          : 'Your index updates automatically with new medical information'
                        }
                      </p>
                    </div>
                    <Info className="size-5 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}