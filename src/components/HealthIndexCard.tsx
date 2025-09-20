import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react';
import { useHealthIndex } from '../hooks/useHealthIndex';
import { useLanguage } from '../context/LanguageContext';

interface HealthIndexCardProps {
  showDetails?: boolean;
  onDetailsClick?: () => void;
}

export function HealthIndexCard({ showDetails = false, onDetailsClick }: HealthIndexCardProps) {
  const healthMetrics = useHealthIndex();
  const { language } = useLanguage();
  
  const getHealthColor = (indice: number) => {
    if (indice >= 85) return 'text-green-600 dark:text-green-400';
    if (indice >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const getHealthBgColor = (indice: number) => {
    if (indice >= 85) return 'bg-green-100 dark:bg-green-900/30';
    if (indice >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };
  
  const getHealthStatus = (indice: number) => {
    if (language === 'es') {
      if (indice >= 85) return 'Excelente';
      if (indice >= 70) return 'Bueno';
      if (indice >= 50) return 'Regular';
      return 'Necesita atención';
    } else {
      if (indice >= 85) return 'Excellent';
      if (indice >= 70) return 'Good';
      if (indice >= 50) return 'Fair';
      return 'Needs attention';
    }
  };
  
  const getTrendIcon = () => {
    switch (healthMetrics.tendencia) {
      case 'mejorando':
        return <TrendingUp className="size-4 text-green-600" />;
      case 'empeorando':
        return <TrendingDown className="size-4 text-red-600" />;
      default:
        return <Minus className="size-4 text-gray-600" />;
    }
  };
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(language === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Header con gradiente */}
        <div className={`${getHealthBgColor(healthMetrics.indiceGeneral)} px-6 py-4`}>
          <CardHeader className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-sm">
                  <Heart className={`size-6 ${getHealthColor(healthMetrics.indiceGeneral)}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {language === 'es' ? 'Índice de Salud' : 'Health Index'}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <CardDescription className="text-sm">
                      {language === 'es' ? 'Actualizado' : 'Updated'}: {formatDate(healthMetrics.ultimaActualizacion)}
                    </CardDescription>
                    {getTrendIcon()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getHealthColor(healthMetrics.indiceGeneral)}`}>
                  {healthMetrics.indiceGeneral}%
                </div>
                <Badge 
                  className={`${getHealthBgColor(healthMetrics.indiceGeneral)} ${getHealthColor(healthMetrics.indiceGeneral)} border-0`}
                >
                  {getHealthStatus(healthMetrics.indiceGeneral)}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {language === 'es' ? 'Nivel general' : 'Overall level'}
              </span>
              <span className="text-sm text-muted-foreground">
                {healthMetrics.indiceGeneral}/100
              </span>
            </div>
            <Progress 
              value={healthMetrics.indiceGeneral} 
              className="h-3"
            />
          </div>

          {/* Factores destacados */}
          {!showDetails && (
            <div className="space-y-3">
              {/* Factores positivos más importantes */}
              {healthMetrics.factoresPositivos.slice(0, 2).map((factor, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="size-4 text-green-600" />
                  <span className="text-green-700 dark:text-green-400">{factor.factor}</span>
                  <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700">
                    +{factor.impacto}
                  </Badge>
                </div>
              ))}

              {/* Factores de riesgo más importantes */}
              {healthMetrics.factoresRiesgo.slice(0, 1).map((factor, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="size-4 text-orange-600" />
                  <span className="text-orange-700 dark:text-orange-400">{factor.factor}</span>
                  <Badge variant="outline" className="text-xs bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700">
                    -{factor.impacto}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Detalles completos */}
          {showDetails && (
            <div className="space-y-4">
              {/* Factores positivos */}
              {healthMetrics.factoresPositivos.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center text-green-700 dark:text-green-400">
                    <CheckCircle className="size-4 mr-1" />
                    {language === 'es' ? 'Factores positivos' : 'Positive factors'}
                  </h4>
                  <div className="space-y-2">
                    {healthMetrics.factoresPositivos.map((factor, index) => (
                      <div key={index} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            {factor.factor}
                          </span>
                          <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-0">
                            +{factor.impacto}
                          </Badge>
                        </div>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          {factor.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Factores de riesgo */}
              {healthMetrics.factoresRiesgo.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center text-orange-700 dark:text-orange-400">
                    <AlertTriangle className="size-4 mr-1" />
                    {language === 'es' ? 'Factores de riesgo' : 'Risk factors'}
                  </h4>
                  <div className="space-y-2">
                    {healthMetrics.factoresRiesgo.map((factor, index) => (
                      <div key={index} className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                            {factor.factor}
                          </span>
                          <Badge className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border-0">
                            -{factor.impacto}
                          </Badge>
                        </div>
                        <p className="text-xs text-orange-700 dark:text-orange-400">
                          {factor.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendaciones */}
              {healthMetrics.recomendaciones.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center text-blue-700 dark:text-blue-400">
                    <Info className="size-4 mr-1" />
                    {language === 'es' ? 'Recomendaciones' : 'Recommendations'}
                  </h4>
                  <div className="space-y-2">
                    {healthMetrics.recomendaciones.map((recomendacion, index) => (
                      <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {recomendacion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botón para ver detalles */}
          {!showDetails && onDetailsClick && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDetailsClick}
              className="w-full p-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 rounded-lg"
            >
              {language === 'es' ? 'Ver análisis detallado' : 'View detailed analysis'}
            </motion.button>
          )}

          {/* Indicador de tendencia */}
          <div className="flex items-center justify-center space-x-2 pt-2 border-t">
            {getTrendIcon()}
            <span className="text-xs text-muted-foreground">
              {language === 'es' ? 'Tendencia' : 'Trend'}: {
                language === 'es' 
                  ? (healthMetrics.tendencia === 'mejorando' ? 'Mejorando' : 
                     healthMetrics.tendencia === 'empeorando' ? 'Empeorando' : 'Estable')
                  : (healthMetrics.tendencia === 'mejorando' ? 'Improving' : 
                     healthMetrics.tendencia === 'empeorando' ? 'Declining' : 'Stable')
              }
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}