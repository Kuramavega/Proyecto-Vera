import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface HealthMetrics {
  indiceGeneral: number;
  factoresPositivos: Array<{
    factor: string;
    impacto: number;
    descripcion: string;
  }>;
  factoresRiesgo: Array<{
    factor: string;
    impacto: number;
    descripcion: string;
  }>;
  tendencia: 'mejorando' | 'estable' | 'empeorando';
  ultimaActualizacion: string;
  recomendaciones: string[];
}

interface HealthData {
  citasRecientes: number;
  examenesNormales: number;
  medicamentosActivos: number;
  vacunasAlDia: boolean;
  consultasRegulares: boolean;
  sintomasReportados: number;
  emergenciasRecientes: number;
  edad: number;
  antecedentesImportantes: number;
}

export function useHealthIndex(): HealthMetrics {
  const { user } = useAuth();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    indiceGeneral: 85,
    factoresPositivos: [],
    factoresRiesgo: [],
    tendencia: 'estable',
    ultimaActualizacion: new Date().toISOString(),
    recomendaciones: []
  });

  // Función para simular cambios dinámicos basados en la actividad del usuario
  const actualizarIndiceBasadoEnActividad = () => {
    const data = obtenerDatosDeSalud();
    
    // Agregar variación temporal basada en la hora del día
    const now = new Date();
    const hour = now.getHours();
    let modificadorTemporal = 0;
    
    // Mejor índice durante horas de descanso (mejor hidratación, menos estrés)
    if (hour >= 22 || hour <= 6) {
      modificadorTemporal = 2; // Ligero aumento durante horas de descanso
    } else if (hour >= 7 && hour <= 11) {
      modificadorTemporal = 1; // Ligero aumento en las mañanas
    } else if (hour >= 14 && hour <= 18) {
      modificadorTemporal = -1; // Ligera disminución en tarde (cansancio)
    }
    
    // Simular actividad reciente del usuario (preclasificación de síntomas, citas, etc.)
    const actividadReciente = localStorage.getItem('saludcerca_actividad_reciente');
    let modificadorActividad = 0;
    
    if (actividadReciente) {
      const actividad = JSON.parse(actividadReciente);
      const tiempoTranscurrido = Date.now() - actividad.timestamp;
      const horasTranscurridas = tiempoTranscurrido / (1000 * 60 * 60);
      
      // Si el usuario ha usado preclasificación recientemente y reportó pocos síntomas
      if (actividad.tipo === 'preclasificacion' && horasTranscurridas < 24) {
        if (actividad.riesgo === 'BAJO') {
          modificadorActividad = 3; // Mejora por evaluación positiva
        } else if (actividad.riesgo === 'MEDIO') {
          modificadorActividad = -2; // Ligera disminución por síntomas moderados
        } else if (actividad.riesgo === 'ALTO') {
          modificadorActividad = -8; // Disminución significativa por síntomas graves
        }
      }
      
      // Si ha agendado citas recientemente (actividad proactiva)
      if (actividad.tipo === 'cita_agendada' && horasTranscurridas < 48) {
        modificadorActividad = 2; // Mejora por ser proactivo
      }
      
      // Si ha revisado su historial médico (cuidado personal)
      if (actividad.tipo === 'historial_revisado' && horasTranscurridas < 12) {
        modificadorActividad = 1; // Pequeña mejora por cuidado personal
      }
    }
    
    return { data, modificadorTemporal, modificadorActividad };
  };

  const calcularEdad = (fechaNacimiento: string): number => {
    const birth = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const obtenerDatosDeSalud = (): HealthData => {
    // En una implementación real, estos datos vendrían de la base de datos
    // Por ahora usamos datos simulados basados en el historial mock
    const edad = user?.fechaNacimiento ? calcularEdad(user.fechaNacimiento) : 35;
    
    return {
      citasRecientes: 3, // Últimos 3 meses
      examenesNormales: 5, // Exámenes con resultados normales
      medicamentosActivos: 2, // Medicamentos actuales
      vacunasAlDia: true,
      consultasRegulares: true,
      sintomasReportados: 0, // Síntomas reportados recientemente
      emergenciasRecientes: 0, // Emergencias en últimos 6 meses
      edad,
      antecedentesImportantes: user?.antecedentes?.length || 0
    };
  };

  const calcularIndiceGeneral = (data: HealthData, modificadorTemporal = 0, modificadorActividad = 0): number => {
    let indice = 100; // Comenzamos con 100%
    
    // Factores que reducen el índice
    
    // Edad (factor de riesgo gradual)
    if (data.edad > 65) {
      indice -= 10;
    } else if (data.edad > 50) {
      indice -= 5;
    } else if (data.edad > 35) {
      indice -= 2;
    }
    
    // Antecedentes médicos importantes
    indice -= data.antecedentesImportantes * 3;
    
    // Emergencias recientes
    indice -= data.emergenciasRecientes * 15;
    
    // Síntomas reportados recientemente
    indice -= data.sintomasReportados * 8;
    
    // Medicamentos activos (muchos medicamentos pueden indicar problemas)
    if (data.medicamentosActivos > 3) {
      indice -= (data.medicamentosActivos - 3) * 2;
    }
    
    // Factores que mejoran el índice
    
    // Exámenes normales recientes
    indice += Math.min(data.examenesNormales * 2, 10);
    
    // Consultas regulares
    if (data.consultasRegulares) {
      indice += 5;
    }
    
    // Vacunas al día
    if (data.vacunasAlDia) {
      indice += 3;
    }
    
    // Actividad médica apropiada (ni muy pocas ni demasiadas citas)
    if (data.citasRecientes >= 1 && data.citasRecientes <= 4) {
      indice += 5;
    } else if (data.citasRecientes > 6) {
      indice -= 3; // Demasiadas citas pueden indicar problemas
    }
    
    // Aplicar modificadores dinámicos
    indice += modificadorTemporal;
    indice += modificadorActividad;
    
    // Asegurar que el índice esté entre 0 y 100
    return Math.max(0, Math.min(100, Math.round(indice)));
  };

  const analizarFactores = (data: HealthData, indice: number) => {
    const factoresPositivos = [];
    const factoresRiesgo = [];
    
    // Factores positivos
    if (data.examenesNormales >= 3) {
      factoresPositivos.push({
        factor: 'Exámenes médicos normales',
        impacto: 8,
        descripcion: `${data.examenesNormales} exámenes con resultados normales`
      });
    }
    
    if (data.consultasRegulares) {
      factoresPositivos.push({
        factor: 'Seguimiento médico regular',
        impacto: 5,
        descripcion: 'Asistes regularmente a tus citas médicas'
      });
    }
    
    if (data.vacunasAlDia) {
      factoresPositivos.push({
        factor: 'Vacunación al día',
        impacto: 3,
        descripcion: 'Esquema de vacunación completo y actualizado'
      });
    }
    
    if (data.emergenciasRecientes === 0) {
      factoresPositivos.push({
        factor: 'Sin emergencias recientes',
        impacto: 10,
        descripcion: 'No has tenido emergencias médicas recientemente'
      });
    }
    
    if (data.edad < 35) {
      factoresPositivos.push({
        factor: 'Edad favorable',
        impacto: 5,
        descripcion: 'Tu edad es un factor protector para la salud'
      });
    }
    
    // Factores de riesgo
    if (data.edad > 50) {
      factoresRiesgo.push({
        factor: 'Factor edad',
        impacto: data.edad > 65 ? 10 : 5,
        descripcion: 'La edad aumenta el riesgo de algunas condiciones'
      });
    }
    
    if (data.antecedentesImportantes > 0) {
      factoresRiesgo.push({
        factor: 'Antecedentes médicos',
        impacto: data.antecedentesImportantes * 3,
        descripcion: `${data.antecedentesImportantes} antecedente(s) médico(s) importantes`
      });
    }
    
    if (data.medicamentosActivos > 3) {
      factoresRiesgo.push({
        factor: 'Múltiples medicamentos',
        impacto: (data.medicamentosActivos - 3) * 2,
        descripcion: `${data.medicamentosActivos} medicamentos activos`
      });
    }
    
    if (data.emergenciasRecientes > 0) {
      factoresRiesgo.push({
        factor: 'Emergencias recientes',
        impacto: data.emergenciasRecientes * 15,
        descripcion: `${data.emergenciasRecientes} emergencia(s) en los últimos meses`
      });
    }
    
    if (data.sintomasReportados > 0) {
      factoresRiesgo.push({
        factor: 'Síntomas reportados',
        impacto: data.sintomasReportados * 8,
        descripcion: `${data.sintomasReportados} síntoma(s) reportado(s) recientemente`
      });
    }
    
    return { factoresPositivos, factoresRiesgo };
  };

  const determinarTendencia = (indiceActual: number): 'mejorando' | 'estable' | 'empeorando' => {
    // En una implementación real, compararíamos con el índice anterior
    // Por ahora usamos lógica simplificada
    if (indiceActual >= 85) return 'estable';
    if (indiceActual >= 70) return 'estable';
    return 'empeorando';
  };

  const generarRecomendaciones = (data: HealthData, indice: number): string[] => {
    const recomendaciones = [];
    
    if (indice >= 85) {
      recomendaciones.push('Excelente! Mantén tus hábitos de cuidado de la salud');
      recomendaciones.push('Continúa con tus controles médicos regulares');
    } else if (indice >= 70) {
      recomendaciones.push('Tu salud está bien, pero hay áreas de mejora');
      recomendaciones.push('Considera agendar una consulta de control general');
    } else {
      recomendaciones.push('Es importante que consultes con tu médico pronto');
      recomendaciones.push('Mantente al día con todos tus tratamientos');
    }
    
    if (data.antecedentesImportantes > 0) {
      recomendaciones.push('Mantén un seguimiento especial por tus antecedentes médicos');
    }
    
    if (data.medicamentosActivos > 0) {
      recomendaciones.push('Toma tus medicamentos según las indicaciones médicas');
    }
    
    if (!data.vacunasAlDia) {
      recomendaciones.push('Actualiza tu esquema de vacunación');
    }
    
    if (data.edad > 40) {
      recomendaciones.push('Considera hacer chequeos preventivos anuales');
    }
    
    return recomendaciones.slice(0, 3); // Máximo 3 recomendaciones
  };

  useEffect(() => {
    const calcularMetricas = () => {
      const { data, modificadorTemporal, modificadorActividad } = actualizarIndiceBasadoEnActividad();
      const indice = calcularIndiceGeneral(data, modificadorTemporal, modificadorActividad);
      const { factoresPositivos, factoresRiesgo } = analizarFactores(data, indice);
      const tendencia = determinarTendencia(indice);
      const recomendaciones = generarRecomendaciones(data, indice);
      
      setHealthMetrics({
        indiceGeneral: indice,
        factoresPositivos,
        factoresRiesgo,
        tendencia,
        ultimaActualizacion: new Date().toISOString(),
        recomendaciones
      });
    };

    // Calcular métricas cuando se monta el componente
    calcularMetricas();
    
    // Actualizar cada 30 segundos para capturar cambios dinámicos
    const interval = setInterval(calcularMetricas, 30000);
    
    // Escuchar cambios en el localStorage para actualizaciones inmediatas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'saludcerca_actividad_reciente') {
        calcularMetricas();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  return healthMetrics;
}

// Función auxiliar para registrar actividad del usuario (para usar en otros componentes)
export const registrarActividad = (tipo: string, datos?: any) => {
  const actividad = {
    tipo,
    timestamp: Date.now(),
    ...datos
  };
  
  localStorage.setItem('saludcerca_actividad_reciente', JSON.stringify(actividad));
  
  // Disparar evento de almacenamiento personalizado para actualización inmediata
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'saludcerca_actividad_reciente',
    newValue: JSON.stringify(actividad)
  }));
};