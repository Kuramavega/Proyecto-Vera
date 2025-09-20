export interface User {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  municipio: string;
  alergias: string[];
  antecedentes: string[];
}

export interface Hospital {
  id: string;
  nombre: string;
  direccion: string;
  municipio: string;
  telefono: string;
  coordenadas: { lat: number; lng: number };
  servicios: string[];
  tipo?: 'Público' | 'Privado' | 'Semi-privado';
}

export interface Doctor {
  id: string;
  nombre: string;
  especialidad: string;
  hospitalId: string;
  disponible: boolean;
  horarios?: string;
}

export interface Cita {
  id: string;
  pacienteId: string;
  doctorId: string;
  hospitalId: string;
  fecha: string;
  hora: string;
  especialidad: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
  motivo: string;
}

export interface ColaVirtual {
  citaId: string;
  posicion: number;
  estimacionEspera: number; // en minutos
  estado: 'ESPERANDO' | 'LLAMADO' | 'EN_CONSULTA';
}

export type View = 
  | 'dashboard' 
  | 'solicitar-cita' 
  | 'preclasificar' 
  | 'cola-virtual' 
  | 'perfil'
  | 'mis-citas'
  | 'unidades-cercanas'
  | 'historial'
  | 'indice-salud';