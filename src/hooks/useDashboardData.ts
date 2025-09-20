import { useState, useEffect } from 'react';
import { Cita } from '../types';

interface DashboardData {
  proximaCita: Cita | null;
  citasPendientes: number;
  notificaciones: Array<{
    mensaje: string;
    tiempo: string;
    tipo: 'recordatorio' | 'urgente' | 'info';
  }>;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    proximaCita: null,
    citasPendientes: 0,
    notificaciones: []
  });

  useEffect(() => {
    // Simular carga de datos
    const mockData: DashboardData = {
      proximaCita: {
        id: '1',
        pacienteId: '1',
        doctorId: '1',
        hospitalId: '1',
        fecha: '2024-12-20',
        hora: '10:30',
        especialidad: 'Medicina General',
        estado: 'CONFIRMADA',
        motivo: 'Control rutinario'
      },
      citasPendientes: 2,
      notificaciones: [
        {
          mensaje: 'Recordatorio: Cita mañana a las 10:30 AM',
          tiempo: '2h',
          tipo: 'recordatorio'
        },
        {
          mensaje: 'Resultados de laboratorio disponibles',
          tiempo: '1d',
          tipo: 'info'
        }
      ]
    };

    setData(mockData);
  }, []);

  return data;
}