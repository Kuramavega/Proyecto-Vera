// =====================================================
// SERVICIO DE BASE DE DATOS PARA SALUDCERCA
// Simulación completa de funcionalidades MySQL para testing
// =====================================================

import { hospitales, especialidades, departamentos } from '../data/nicaraguaData';

// Tipos para la base de datos
export interface Usuario {
  id: number;
  tipo_usuario: 'PACIENTE' | 'PERSONAL' | 'ADMIN';
  nombres: string;
  apellidos: string;
  numero_documento: string;
  fecha_nacimiento: string;
  genero: 'M' | 'F' | 'O';
  telefono: string;
  email?: string;
  municipio_id: number;
  direccion?: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  verificado: boolean;
  ultimo_acceso?: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalHospitalario {
  id: number;
  usuario_id: number;
  hospital_id: number;
  rol_id: number;
  departamento_id?: number;
  numero_licencia?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'LICENCIA' | 'VACACIONES';
  created_at: string;
  updated_at: string;
}

export interface Medico {
  id: number;
  personal_id: number;
  especialidad_principal_id: number;
  subespecialidades?: string[];
  anos_experiencia: number;
  universidad_graduacion?: string;
  ano_graduacion?: number;
  certificaciones?: string[];
  tarifa_consulta: number;
  biografia?: string;
  created_at: string;
  updated_at: string;
}

export interface Cita {
  id: number;
  codigo_cita: string;
  paciente_id: number;
  medico_id: number;
  hospital_id: number;
  tipo_cita_id: number;
  estado_id: number;
  fecha_cita: string;
  hora_inicio: string;
  hora_fin: string;
  motivo_consulta?: string;
  notas_paciente?: string;
  precio: number;
  forma_pago?: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'SEGURO';
  confirmada_por_paciente: boolean;
  confirmada_por_medico: boolean;
  fecha_confirmacion?: string;
  recordatorio_enviado: boolean;
  created_at: string;
  updated_at: string;
}

export interface Consulta {
  id: number;
  cita_id: number;
  diagnostico_principal?: string;
  diagnosticos_secundarios?: string[];
  sintomas?: string;
  examen_fisico?: string;
  tratamiento?: string;
  medicamentos_recetados?: any[];
  examenes_solicitados?: any[];
  observaciones?: string;
  proximo_control?: string;
  created_at: string;
  updated_at: string;
}

export interface EstadoCita {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
}

export interface TipoCita {
  id: number;
  nombre: string;
  descripcion: string;
  duracion_minutos: number;
  precio: number;
}

export interface RolPersonal {
  id: number;
  nombre: string;
  descripcion: string;
  nivel_acceso: number;
  permisos: any;
}

export interface ColaVirtual {
  id: number;
  cita_id: number;
  numero_turno: number;
  estado: 'ESPERANDO' | 'EN_ATENCION' | 'ATENDIDO' | 'NO_PRESENTO';
  hora_llegada: string;
  hora_llamada?: string;
  hora_atencion?: string;
  tiempo_espera_minutos?: number;
  created_at: string;
  updated_at: string;
}

export interface MetricasSistema {
  id: number;
  hospital_id?: number;
  fecha_metrica: string;
  citas_programadas: number;
  citas_completadas: number;
  citas_canceladas: number;
  citas_no_show: number;
  tiempo_promedio_espera: number;
  satisfaccion_promedio: number;
  usuarios_activos: number;
  created_at: string;
}

// Datos mock para testing
let mockData = {
  usuarios: [] as Usuario[],
  personal_hospitalario: [] as PersonalHospitalario[],
  medicos: [] as Medico[],
  citas: [] as Cita[],
  consultas: [] as Consulta[],
  cola_virtual: [] as ColaVirtual[],
  metricas_sistema: [] as MetricasSistema[],
  estados_citas: [
    { id: 1, nombre: 'PROGRAMADA', descripcion: 'Cita programada y confirmada', color: '#3B82F6' },
    { id: 2, nombre: 'CONFIRMADA', descripcion: 'Cita confirmada por el paciente', color: '#10B981' },
    { id: 3, nombre: 'EN_CURSO', descripcion: 'Paciente siendo atendido', color: '#F59E0B' },
    { id: 4, nombre: 'COMPLETADA', descripcion: 'Cita completada exitosamente', color: '#22C55E' },
    { id: 5, nombre: 'CANCELADA', descripcion: 'Cita cancelada', color: '#EF4444' },
    { id: 6, nombre: 'NO_SHOW', descripcion: 'Paciente no se presentó', color: '#F97316' },
    { id: 7, nombre: 'REPROGRAMADA', descripcion: 'Cita reprogramada', color: '#8B5CF6' }
  ] as EstadoCita[],
  tipos_citas: [
    { id: 1, nombre: 'Consulta General', descripcion: 'Consulta médica general', duracion_minutos: 30, precio: 200.00 },
    { id: 2, nombre: 'Consulta Especializada', descripcion: 'Consulta con médico especialista', duracion_minutos: 45, precio: 350.00 },
    { id: 3, nombre: 'Control Rutinario', descripcion: 'Control médico de rutina', duracion_minutos: 20, precio: 150.00 },
    { id: 4, nombre: 'Emergencia', descripcion: 'Atención de emergencia', duracion_minutos: 60, precio: 500.00 },
    { id: 5, nombre: 'Telemedicina', descripcion: 'Consulta virtual por video', duracion_minutos: 30, precio: 180.00 }
  ] as TipoCita[],
  roles_personal: [
    { id: 1, nombre: 'Médico Especialista', descripcion: 'Médico con especialidad certificada', nivel_acceso: 4, permisos: { consultas: true, prescripciones: true, historiales: true, reportes: true } },
    { id: 2, nombre: 'Médico General', descripcion: 'Médico de medicina general', nivel_acceso: 3, permisos: { consultas: true, prescripciones: true, historiales: true } },
    { id: 3, nombre: 'Enfermero/a', descripcion: 'Personal de enfermería', nivel_acceso: 2, permisos: { signos_vitales: true, medicamentos: true, cola_virtual: true } },
    { id: 4, nombre: 'Administrativo', descripcion: 'Personal administrativo', nivel_acceso: 2, permisos: { citas: true, pacientes: true, reportes_basicos: true } },
    { id: 5, nombre: 'Recepcionista', descripcion: 'Personal de recepción', nivel_acceso: 1, permisos: { citas: true, cola_virtual: true } },
    { id: 6, nombre: 'Director Médico', descripcion: 'Director del hospital', nivel_acceso: 5, permisos: { all: true } }
  ] as RolPersonal[]
};

// Inicializar datos de ejemplo
const initializeMockData = () => {
  // Usuarios de ejemplo (expandido significativamente)
  mockData.usuarios = [
    // Pacientes
    {
      id: 1,
      tipo_usuario: 'PACIENTE',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez González',
      numero_documento: '001-120485-1002K',
      fecha_nacimiento: '1985-04-12',
      genero: 'M',
      telefono: '+505 8888 9999',
      email: 'juan.perez@email.com',
      municipio_id: 1001,
      direccion: 'Barrio Martha Quezada, Casa #123',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-01-15T10:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      tipo_usuario: 'PACIENTE',
      nombres: 'María Elena',
      apellidos: 'García Flores',
      numero_documento: '001-150790-1005L',
      fecha_nacimiento: '1990-07-15',
      genero: 'F',
      telefono: '+505 8777 8888',
      email: 'maria.garcia@email.com',
      municipio_id: 1001,
      direccion: 'Colonia Centroamérica, Casa #456',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-01-20T09:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      tipo_usuario: 'PACIENTE',
      nombres: 'Carlos Eduardo',
      apellidos: 'Mendoza Rivera',
      numero_documento: '001-081292-1006M',
      fecha_nacimiento: '1992-12-08',
      genero: 'M',
      telefono: '+505 8666 7777',
      email: 'carlos.mendoza@email.com',
      municipio_id: 1001,
      direccion: 'Villa Venezuela, Casa #789',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-02-01T11:00:00Z',
      updated_at: new Date().toISOString()
    },

    // Personal Hospitalario - Hospital Metropolitano
    {
      id: 10,
      tipo_usuario: 'PERSONAL',
      nombres: 'Dr. Ricardo Antonio',
      apellidos: 'Martínez López',
      numero_documento: '001-150978-1003M',
      fecha_nacimiento: '1978-09-15',
      genero: 'M',
      telefono: '+505 8765-4321',
      email: 'dr.martinez@metropolitano.com.ni',
      municipio_id: 1001,
      direccion: 'Residencial Las Colinas',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-01-10T08:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 11,
      tipo_usuario: 'PERSONAL',
      nombres: 'Dra. Ana Cristina',
      apellidos: 'Herrera Vásquez',
      numero_documento: '001-230682-1007A',
      fecha_nacimiento: '1982-06-23',
      genero: 'F',
      telefono: '+505 8654-3210',
      email: 'dra.herrera@metropolitano.com.ni',
      municipio_id: 1001,
      direccion: 'Las Robles, Casa #123',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-01-12T09:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 12,
      tipo_usuario: 'PERSONAL',
      nombres: 'Dr. Miguel Ángel',
      apellidos: 'Castillo Morales',
      numero_documento: '001-041275-1008B',
      fecha_nacimiento: '1975-12-04',
      genero: 'M',
      telefono: '+505 8543-2109',
      email: 'dr.castillo@metropolitano.com.ni',
      municipio_id: 1001,
      direccion: 'Altamira, Casa #456',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-01-08T07:30:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 13,
      tipo_usuario: 'PERSONAL',
      nombres: 'Enfermera Carla',
      apellidos: 'Núñez Pérez',
      numero_documento: '001-180588-1009C',
      fecha_nacimiento: '1988-05-18',
      genero: 'F',
      telefono: '+505 8432-1098',
      email: 'enf.nunez@metropolitano.com.ni',
      municipio_id: 1001,
      direccion: 'Bolonia, Casa #789',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-01-14T08:15:00Z',
      updated_at: new Date().toISOString()
    },

    // Personal Hospital Bautista
    {
      id: 14,
      tipo_usuario: 'PERSONAL',
      nombres: 'Dr. Fernando José',
      apellidos: 'Solís Ramírez',
      numero_documento: '001-290180-1010D',
      fecha_nacimiento: '1980-01-29',
      genero: 'M',
      telefono: '+505 8321-0987',
      email: 'dr.solis@bautista.com.ni',
      municipio_id: 1001,
      direccion: 'Los Santos, Casa #321',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-01-16T10:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 15,
      tipo_usuario: 'PERSONAL',
      nombres: 'Dra. Lucía Isabel',
      apellidos: 'Moreno García',
      numero_documento: '001-150683-1011E',
      fecha_nacimiento: '1983-06-15',
      genero: 'F',
      telefono: '+505 8210-9876',
      email: 'dra.moreno@bautista.com.ni',
      municipio_id: 1001,
      direccion: 'Reparto San Juan, Casa #654',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-01-18T09:30:00Z',
      updated_at: new Date().toISOString()
    },

    // Administrador Universal
    {
      id: 100,
      tipo_usuario: 'ADMIN',
      nombres: 'Isaac',
      apellidos: 'Espinoza',
      numero_documento: '001-770601-1004I',
      fecha_nacimiento: '1985-06-01',
      genero: 'M',
      telefono: '+505 7796-0601',
      email: 'isaac.espinoza@saludcerca.ni',
      municipio_id: 1001,
      direccion: 'Managua Centro',
      estado: 'ACTIVO',
      verificado: true,
      ultimo_acceso: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    }
  ];

  // Personal hospitalario expandido significativamente
  mockData.personal_hospitalario = [
    // Hospital Metropolitano Vivian Pellas (ID: 1)
    {
      id: 1,
      usuario_id: 10,
      hospital_id: 1,
      rol_id: 1, // Médico Especialista
      departamento_id: 1,
      numero_licencia: 'MED-2020-001234',
      fecha_inicio: '2020-03-01',
      estado: 'ACTIVO',
      created_at: '2020-03-01T08:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      usuario_id: 11,
      hospital_id: 1,
      rol_id: 1, // Médico Especialista
      departamento_id: 2,
      numero_licencia: 'MED-2021-002345',
      fecha_inicio: '2021-01-15',
      estado: 'ACTIVO',
      created_at: '2021-01-15T08:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      usuario_id: 12,
      hospital_id: 1,
      rol_id: 1, // Médico Especialista
      departamento_id: 3,
      numero_licencia: 'MED-2019-003456',
      fecha_inicio: '2019-08-20',
      estado: 'ACTIVO',
      created_at: '2019-08-20T08:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      usuario_id: 13,
      hospital_id: 1,
      rol_id: 3, // Enfermero/a
      departamento_id: 1,
      numero_licencia: 'ENF-2022-004567',
      fecha_inicio: '2022-06-10',
      estado: 'ACTIVO',
      created_at: '2022-06-10T08:00:00Z',
      updated_at: new Date().toISOString()
    },

    // Hospital Bautista (ID: 2)
    {
      id: 5,
      usuario_id: 14,
      hospital_id: 2,
      rol_id: 2, // Médico General
      departamento_id: 4,
      numero_licencia: 'MED-2020-005678',
      fecha_inicio: '2020-09-01',
      estado: 'ACTIVO',
      created_at: '2020-09-01T08:00:00Z',
      updated_at: new Date().toISOString()
    },
    {
      id: 6,
      usuario_id: 15,
      hospital_id: 2,
      rol_id: 1, // Médico Especialista
      departamento_id: 5,
      numero_licencia: 'MED-2021-006789',
      fecha_inicio: '2021-03-15',
      estado: 'ACTIVO',
      created_at: '2021-03-15T08:00:00Z',
      updated_at: new Date().toISOString()
    },

    // Isaac Espinoza - Admin Universal (acceso a todos los hospitales)
    {
      id: 100,
      usuario_id: 100,
      hospital_id: 1, // Registrado en Metropolitano pero con acceso universal
      rol_id: 6, // Director Médico - Acceso completo
      numero_licencia: 'ADM-UNIVERSAL-001',
      fecha_inicio: '2024-01-01',
      estado: 'ACTIVO',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    }
  ];

  // Médicos expandido significativamente
  mockData.medicos = [
    // Dr. Ricardo Martínez - Cardiólogo
    {
      id: 1,
      personal_id: 1,
      especialidad_principal_id: 2, // Cardiología
      subespecialidades: ['Cardiología Intervencionista', 'Electrofisiología'],
      anos_experiencia: 15,
      universidad_graduacion: 'Universidad Nacional Autónoma de Nicaragua (UNAN)',
      ano_graduacion: 2008,
      certificaciones: ['Cardiología Intervencionista', 'Ecocardiografía', 'Cateterismo Cardíaco'],
      tarifa_consulta: 450.00,
      biografia: 'Especialista en cardiología con más de 15 años de experiencia. Subespecialista en cardiología intervencionista y electrofisiología. Ha realizado más de 2000 procedimientos cardiovasculares.',
      created_at: '2020-03-01T08:00:00Z',
      updated_at: new Date().toISOString()
    },
    // Dra. Ana Herrera - Neuróloga
    {
      id: 2,
      personal_id: 2,
      especialidad_principal_id: 5, // Neurología
      subespecialidades: ['Neurología Pediátrica', 'Epilepsia'],
      anos_experiencia: 12,
      universidad_graduacion: 'Universidad Centroamericana (UCA)',
      ano_graduacion: 2011,
      certificaciones: ['Neurología Clínica', 'Electroencefalografía', 'Neurología Pediátrica'],
      tarifa_consulta: 420.00,
      biografia: 'Neuróloga con especialización en neurología pediátrica y tratamiento de epilepsia. Experiencia en diagnóstico y tratamiento de trastornos neurológicos complejos.',
      created_at: '2021-01-15T08:00:00Z',
      updated_at: new Date().toISOString()
    },
    // Dr. Miguel Castillo - Oncólogo
    {
      id: 3,
      personal_id: 3,
      especialidad_principal_id: 9, // Oncología
      subespecialidades: ['Oncología Médica', 'Hematología'],
      anos_experiencia: 18,
      universidad_graduacion: 'Universidad Nacional Autónoma de Nicaragua (UNAN)',
      ano_graduacion: 2005,
      certificaciones: ['Oncología Médica', 'Hematología', 'Quimioterapia'],
      tarifa_consulta: 480.00,
      biografia: 'Oncólogo médico con amplia experiencia en el tratamiento integral del cáncer. Especialista en tumores sólidos y enfermedades hematológicas.',
      created_at: '2019-08-20T08:00:00Z',
      updated_at: new Date().toISOString()
    },
    // Dr. Fernando Solís - Pediatra (Hospital Bautista)
    {
      id: 4,
      personal_id: 5,
      especialidad_principal_id: 3, // Pediatría
      subespecialidades: ['Neonatología', 'Pediatría Intensiva'],
      anos_experiencia: 14,
      universidad_graduacion: 'Universidad Nacional Autónoma de Nicaragua (UNAN)',
      ano_graduacion: 2009,
      certificaciones: ['Pediatría General', 'Neonatología', 'Reanimación Pediátrica'],
      tarifa_consulta: 380.00,
      biografia: 'Pediatra con subespecialización en neonatología. Amplia experiencia en el cuidado de recién nacidos y pediatría de cuidados intensivos.',
      created_at: '2020-09-01T08:00:00Z',
      updated_at: new Date().toISOString()
    },
    // Dra. Lucía Moreno - Ginecóloga (Hospital Bautista)
    {
      id: 5,
      personal_id: 6,
      especialidad_principal_id: 4, // Ginecología
      subespecialidades: ['Obstetricia', 'Ginecología Oncológica'],
      anos_experiencia: 11,
      universidad_graduacion: 'Universidad Centroamericana (UCA)',
      ano_graduacion: 2012,
      certificaciones: ['Ginecología y Obstetricia', 'Ultrasonido Obstétrico', 'Laparoscopía'],
      tarifa_consulta: 400.00,
      biografia: 'Ginecóloga y obstetra con experiencia en embarazos de alto riesgo y cirugía ginecológica mínimamente invasiva.',
      created_at: '2021-03-15T08:00:00Z',
      updated_at: new Date().toISOString()
    }
  ];

  // Citas expandidas significativamente
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  const pasadoManana = new Date(hoy);
  pasadoManana.setDate(hoy.getDate() + 2);

  mockData.citas = [
    // Citas del Hospital Metropolitano
    {
      id: 1,
      codigo_cita: `C${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001000001`,
      paciente_id: 1,
      medico_id: 1, // Dr. Ricardo Martínez - Cardiólogo
      hospital_id: 1,
      tipo_cita_id: 2, // Consulta Especializada
      estado_id: 2, // CONFIRMADA
      fecha_cita: manana.toISOString().split('T')[0],
      hora_inicio: '09:00',
      hora_fin: '09:45',
      motivo_consulta: 'Control cardiológico rutinario - seguimiento hipertensión arterial',
      notas_paciente: 'Paciente con antecedentes de hipertensión arterial, en tratamiento con enalapril 10mg. Refiere leve disnea de esfuerzo.',
      precio: 450.00,
      confirmada_por_paciente: true,
      confirmada_por_medico: true,
      fecha_confirmacion: new Date().toISOString(),
      recordatorio_enviado: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      codigo_cita: `C${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001000002`,
      paciente_id: 2,
      medico_id: 2, // Dra. Ana Herrera - Neuróloga
      hospital_id: 1,
      tipo_cita_id: 2, // Consulta Especializada
      estado_id: 1, // PROGRAMADA
      fecha_cita: manana.toISOString().split('T')[0],
      hora_inicio: '10:30',
      hora_fin: '11:15',
      motivo_consulta: 'Consulta por cefaleas recurrentes',
      notas_paciente: 'Paciente refiere cefaleas intensas de 3 meses de evolución, predominio matutino. No mejora con analgésicos comunes.',
      precio: 420.00,
      confirmada_por_paciente: true,
      confirmada_por_medico: false,
      fecha_confirmacion: new Date().toISOString(),
      recordatorio_enviado: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      codigo_cita: `C${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001000003`,
      paciente_id: 3,
      medico_id: 3, // Dr. Miguel Castillo - Oncólogo
      hospital_id: 1,
      tipo_cita_id: 2, // Consulta Especializada
      estado_id: 1, // PROGRAMADA
      fecha_cita: pasadoManana.toISOString().split('T')[0],
      hora_inicio: '14:00',
      hora_fin: '14:45',
      motivo_consulta: 'Seguimiento post-quimioterapia',
      notas_paciente: 'Paciente en seguimiento por linfoma de Hodgkin, completó 6 ciclos de ABVD. Control de respuesta al tratamiento.',
      precio: 480.00,
      confirmada_por_paciente: false,
      confirmada_por_medico: false,
      recordatorio_enviado: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    // Citas del Hospital Bautista
    {
      id: 4,
      codigo_cita: `C${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}002000004`,
      paciente_id: 1,
      medico_id: 4, // Dr. Fernando Solís - Pediatra
      hospital_id: 2,
      tipo_cita_id: 1, // Consulta General
      estado_id: 4, // COMPLETADA
      fecha_cita: hoy.toISOString().split('T')[0],
      hora_inicio: '08:00',
      hora_fin: '08:30',
      motivo_consulta: 'Control pediátrico rutinario',
      notas_paciente: 'Control de crecimiento y desarrollo. Vacunación al día.',
      precio: 200.00,
      confirmada_por_paciente: true,
      confirmada_por_medico: true,
      fecha_confirmacion: new Date(Date.now() - 86400000).toISOString(), // ayer
      recordatorio_enviado: true,
      created_at: new Date(Date.now() - 172800000).toISOString(), // anteayer
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
      codigo_cita: `C${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}002000005`,
      paciente_id: 2,
      medico_id: 5, // Dra. Lucía Moreno - Ginecóloga
      hospital_id: 2,
      tipo_cita_id: 2, // Consulta Especializada
      estado_id: 2, // CONFIRMADA
      fecha_cita: manana.toISOString().split('T')[0],
      hora_inicio: '15:30',
      hora_fin: '16:15',
      motivo_consulta: 'Control ginecológico anual',
      notas_paciente: 'Paciente para control ginecológico de rutina. Última citología hace 2 años.',
      precio: 400.00,
      confirmada_por_paciente: true,
      confirmada_por_medico: true,
      fecha_confirmacion: new Date().toISOString(),
      recordatorio_enviado: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    // Citas para generar más datos estadísticos
    {
      id: 6,
      codigo_cita: `C${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001000006`,
      paciente_id: 1,
      medico_id: 1,
      hospital_id: 1,
      tipo_cita_id: 1,
      estado_id: 5, // CANCELADA
      fecha_cita: hoy.toISOString().split('T')[0],
      hora_inicio: '16:00',
      hora_fin: '16:30',
      motivo_consulta: 'Control rutinario',
      precio: 200.00,
      confirmada_por_paciente: false,
      confirmada_por_medico: false,
      recordatorio_enviado: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 7,
      codigo_cita: `C${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}002000007`,
      paciente_id: 3,
      medico_id: 4,
      hospital_id: 2,
      tipo_cita_id: 4, // Emergencia
      estado_id: 6, // NO_SHOW
      fecha_cita: hoy.toISOString().split('T')[0],
      hora_inicio: '11:00',
      hora_fin: '12:00',
      motivo_consulta: 'Emergencia pediátrica',
      precio: 500.00,
      confirmada_por_paciente: true,
      confirmada_por_medico: false,
      recordatorio_enviado: true,
      created_at: new Date(Date.now() - 43200000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Generar métricas de ejemplo
  const fechaHoy = new Date().toISOString().split('T')[0];
  hospitales.forEach((hospital, index) => {
    mockData.metricas_sistema.push({
      id: index + 1,
      hospital_id: parseInt(hospital.id),
      fecha_metrica: fechaHoy,
      citas_programadas: Math.floor(Math.random() * 50) + 10,
      citas_completadas: Math.floor(Math.random() * 40) + 5,
      citas_canceladas: Math.floor(Math.random() * 5) + 1,
      citas_no_show: Math.floor(Math.random() * 3) + 1,
      tiempo_promedio_espera: Math.floor(Math.random() * 30) + 15,
      satisfaccion_promedio: parseFloat((Math.random() * 2 + 3).toFixed(2)), // 3.0 - 5.0
      usuarios_activos: Math.floor(Math.random() * 100) + 20,
      created_at: new Date().toISOString()
    });
  });
};

// Clase principal del servicio de base de datos
export class DatabaseService {
  constructor() {
    initializeMockData();
  }

  // =====================================================
  // MÉTODOS DE AUTENTICACIÓN
  // =====================================================

  async authenticateUser(telefono: string, password: string): Promise<Usuario | null> {
    // Simular autenticación (en producción usar bcrypt)
    if (telefono === '+505 8888 9999' && password === '123456') {
      const usuario = mockData.usuarios.find(u => u.telefono === telefono);
      if (usuario) {
        usuario.ultimo_acceso = new Date().toISOString();
        return usuario;
      }
    }
    return null;
  }

  async authenticateStaff(email: string, password: string, hospitalId: number): Promise<any | null> {
    // Usuario administrador universal (Isaac Espinoza)
    if (email === 'isaac.espinoza@saludcerca.ni' && password === '77960601') {
      const adminUser = mockData.usuarios.find(u => u.email === email);
      if (adminUser) {
        return {
          usuario: adminUser,
          personal: {
            id: 999,
            hospital_id: hospitalId,
            rol_id: 6,
            numero_licencia: 'ADM-UNIVERSAL-001',
            hospital_info: hospitales.find(h => h.id === hospitalId.toString()),
            es_admin_universal: true
          }
        };
      }
    }

    // Autenticación normal del personal
    const personal = mockData.personal_hospitalario.find(p => 
      p.hospital_id === hospitalId && p.estado === 'ACTIVO'
    );
    
    if (personal) {
      const usuario = mockData.usuarios.find(u => u.id === personal.usuario_id);
      if (usuario && usuario.email === email) {
        return {
          usuario,
          personal: {
            ...personal,
            hospital_info: hospitales.find(h => h.id === hospitalId.toString())
          }
        };
      }
    }
    
    return null;
  }

  // =====================================================
  // MÉTODOS DE HOSPITALES
  // =====================================================

  async getHospitales(): Promise<any[]> {
    return hospitales.map(h => ({
      id: parseInt(h.id),
      nombre: h.nombre,
      codigo_establecimiento: h.codigo_establecimiento,
      tipo: h.tipo,
      nivel_complejidad: h.nivel_complejidad,
      municipio: h.municipio,
      departamento: h.departamento,
      direccion: h.direccion,
      telefono: h.telefono,
      coordenadas: h.coordenadas,
      capacidad_camas: h.capacidad_camas,
      especialidades: h.especialidades,
      servicios: h.servicios,
      estado: h.estado
    }));
  }

  async getHospitalById(id: number): Promise<any | null> {
    const hospital = hospitales.find(h => h.id === id.toString());
    if (!hospital) return null;

    const metricas = mockData.metricas_sistema.find(m => m.hospital_id === id);
    const personal = mockData.personal_hospitalario.filter(p => p.hospital_id === id && p.estado === 'ACTIVO');

    return {
      ...hospital,
      metricas: metricas || {
        citas_programadas: 0,
        citas_completadas: 0,
        citas_canceladas: 0,
        total_personal: personal.length
      },
      total_personal: personal.length
    };
  }

  // =====================================================
  // MÉTODOS DE CITAS
  // =====================================================

  async getCitasByHospital(hospitalId: number, fechaInicio?: string, fechaFin?: string): Promise<any[]> {
    let citas = mockData.citas.filter(c => c.hospital_id === hospitalId);
    
    if (fechaInicio) {
      citas = citas.filter(c => c.fecha_cita >= fechaInicio);
    }
    
    if (fechaFin) {
      citas = citas.filter(c => c.fecha_cita <= fechaFin);
    }

    return citas.map(cita => {
      const paciente = mockData.usuarios.find(u => u.id === cita.paciente_id);
      const medico = mockData.medicos.find(m => m.id === cita.medico_id);
      const personal = medico ? mockData.personal_hospitalario.find(p => p.id === medico.personal_id) : null;
      const medicoUsuario = personal ? mockData.usuarios.find(u => u.id === personal.usuario_id) : null;
      const estado = mockData.estados_citas.find(e => e.id === cita.estado_id);
      const tipo = mockData.tipos_citas.find(t => t.id === cita.tipo_cita_id);
      const especialidad = medico ? especialidades.find(e => e.id === medico.especialidad_principal_id.toString()) : null;

      return {
        ...cita,
        paciente_nombre: paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Desconocido',
        paciente_telefono: paciente?.telefono,
        paciente_email: paciente?.email,
        paciente_documento: paciente?.numero_documento,
        medico_nombre: medicoUsuario ? `Dr. ${medicoUsuario.nombres} ${medicoUsuario.apellidos}` : 'Desconocido',
        medico_especialidad: especialidad?.nombre || 'General',
        medico_telefono: medicoUsuario?.telefono,
        estado_nombre: estado?.nombre || 'Desconocido',
        estado_color: estado?.color || '#000000',
        tipo_nombre: tipo?.nombre || 'Desconocido',
        tipo_duracion: tipo?.duracion_minutos || 30
      };
    });
  }

  async getCitasByMedico(medicoId: number, fechaInicio?: string, fechaFin?: string): Promise<any[]> {
    let citas = mockData.citas.filter(c => c.medico_id === medicoId);
    
    if (fechaInicio) {
      citas = citas.filter(c => c.fecha_cita >= fechaInicio);
    }
    
    if (fechaFin) {
      citas = citas.filter(c => c.fecha_cita <= fechaFin);
    }

    return this.enrichCitasData(citas);
  }

  async getCitasByPaciente(pacienteId: number): Promise<any[]> {
    const citas = mockData.citas.filter(c => c.paciente_id === pacienteId);
    return this.enrichCitasData(citas);
  }

  async getCitaById(citaId: number): Promise<any | null> {
    const cita = mockData.citas.find(c => c.id === citaId);
    if (!cita) return null;

    const enrichedCitas = await this.enrichCitasData([cita]);
    return enrichedCitas[0] || null;
  }

  private async enrichCitasData(citas: Cita[]): Promise<any[]> {
    return citas.map(cita => {
      const paciente = mockData.usuarios.find(u => u.id === cita.paciente_id);
      const medico = mockData.medicos.find(m => m.id === cita.medico_id);
      const personal = medico ? mockData.personal_hospitalario.find(p => p.id === medico.personal_id) : null;
      const medicoUsuario = personal ? mockData.usuarios.find(u => u.id === personal.usuario_id) : null;
      const estado = mockData.estados_citas.find(e => e.id === cita.estado_id);
      const tipo = mockData.tipos_citas.find(t => t.id === cita.tipo_cita_id);
      const hospital = hospitales.find(h => h.id === cita.hospital_id.toString());
      const especialidad = medico ? especialidades.find(e => e.id === medico.especialidad_principal_id.toString()) : null;

      return {
        ...cita,
        paciente_nombre: paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Desconocido',
        paciente_telefono: paciente?.telefono,
        paciente_email: paciente?.email,
        paciente_documento: paciente?.numero_documento,
        paciente_genero: paciente?.genero,
        paciente_fecha_nacimiento: paciente?.fecha_nacimiento,
        medico_nombre: medicoUsuario ? `Dr. ${medicoUsuario.nombres} ${medicoUsuario.apellidos}` : 'Desconocido',
        medico_especialidad: especialidad?.nombre || 'General',
        medico_telefono: medicoUsuario?.telefono,
        medico_experiencia: medico?.anos_experiencia,
        hospital_nombre: hospital?.nombre || 'Desconocido',
        estado_nombre: estado?.nombre || 'Desconocido',
        estado_color: estado?.color || '#000000',
        tipo_nombre: tipo?.nombre || 'Desconocido',
        tipo_duracion: tipo?.duracion_minutos || 30,
        puede_modificar: this.canModifyAppointment(cita)
      };
    });
  }

  private canModifyAppointment(cita: Cita): boolean {
    const now = new Date();
    const citaDateTime = new Date(`${cita.fecha_cita}T${cita.hora_inicio}`);
    const hoursUntilAppointment = (citaDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Se puede modificar si faltan más de 24 horas y no está completada o cancelada
    return hoursUntilAppointment > 24 && ![4, 5, 6].includes(cita.estado_id); // COMPLETADA, CANCELADA, NO_SHOW
  }

  async createCita(citaData: Partial<Cita>): Promise<Cita> {
    const nuevaCita: Cita = {
      id: mockData.citas.length + 1,
      codigo_cita: `C${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(citaData.hospital_id).padStart(3, '0')}${String(mockData.citas.length + 1).padStart(6, '0')}`,
      paciente_id: citaData.paciente_id!,
      medico_id: citaData.medico_id!,
      hospital_id: citaData.hospital_id!,
      tipo_cita_id: citaData.tipo_cita_id || 1,
      estado_id: 1, // PROGRAMADA
      fecha_cita: citaData.fecha_cita!,
      hora_inicio: citaData.hora_inicio!,
      hora_fin: citaData.hora_fin!,
      motivo_consulta: citaData.motivo_consulta,
      notas_paciente: citaData.notas_paciente,
      precio: citaData.precio || 200.00,
      confirmada_por_paciente: false,
      confirmada_por_medico: false,
      recordatorio_enviado: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockData.citas.push(nuevaCita);
    return nuevaCita;
  }

  async updateCitaEstado(citaId: number, nuevoEstadoId: number, usuarioId?: number, motivo?: string): Promise<boolean> {
    const cita = mockData.citas.find(c => c.id === citaId);
    if (cita) {
      const estadoAnterior = cita.estado_id;
      cita.estado_id = nuevoEstadoId;
      cita.updated_at = new Date().toISOString();

      // Registrar en historial
      if (usuarioId) {
        mockData.historial_citas = mockData.historial_citas || [];
        mockData.historial_citas.push({
          id: mockData.historial_citas.length + 1,
          cita_id: citaId,
          estado_anterior_id: estadoAnterior,
          estado_nuevo_id: nuevoEstadoId,
          usuario_cambio_id: usuarioId,
          motivo_cambio: motivo,
          fecha_cambio: new Date().toISOString()
        });
      }

      return true;
    }
    return false;
  }

  async confirmarCita(citaId: number, confirmarPor: 'paciente' | 'medico', usuarioId: number): Promise<boolean> {
    const cita = mockData.citas.find(c => c.id === citaId);
    if (cita) {
      if (confirmarPor === 'paciente') {
        cita.confirmada_por_paciente = true;
      } else {
        cita.confirmada_por_medico = true;
      }

      // Si ambos confirmaron, cambiar estado a CONFIRMADA
      if (cita.confirmada_por_paciente && cita.confirmada_por_medico) {
        await this.updateCitaEstado(citaId, 2, usuarioId, `Cita confirmada por ${confirmarPor}`); // CONFIRMADA
      }

      cita.fecha_confirmacion = new Date().toISOString();
      cita.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  async cancelarCita(citaId: number, usuarioId: number, motivo: string): Promise<boolean> {
    return await this.updateCitaEstado(citaId, 5, usuarioId, motivo); // CANCELADA
  }

  async reprogramarCita(citaId: number, nuevaFecha: string, nuevaHoraInicio: string, nuevaHoraFin: string, usuarioId: number): Promise<boolean> {
    const cita = mockData.citas.find(c => c.id === citaId);
    if (cita && this.canModifyAppointment(cita)) {
      cita.fecha_cita = nuevaFecha;
      cita.hora_inicio = nuevaHoraInicio;
      cita.hora_fin = nuevaHoraFin;
      cita.updated_at = new Date().toISOString();
      
      await this.updateCitaEstado(citaId, 7, usuarioId, 'Cita reprogramada'); // REPROGRAMADA
      return true;
    }
    return false;
  }

  async marcarNoShow(citaId: number, usuarioId: number): Promise<boolean> {
    return await this.updateCitaEstado(citaId, 6, usuarioId, 'Paciente no se presentó'); // NO_SHOW
  }

  async completarCita(citaId: number, usuarioId: number): Promise<boolean> {
    return await this.updateCitaEstado(citaId, 4, usuarioId, 'Cita completada'); // COMPLETADA
  }

  // =====================================================
  // MÉTODOS DE PERSONAL
  // =====================================================

  async getPersonalByHospital(hospitalId: number): Promise<any[]> {
    const personal = mockData.personal_hospitalario.filter(p => 
      p.hospital_id === hospitalId && p.estado === 'ACTIVO'
    );

    return personal.map(p => {
      const usuario = mockData.usuarios.find(u => u.id === p.usuario_id);
      const rol = mockData.roles_personal.find(r => r.id === p.rol_id);
      const medico = mockData.medicos.find(m => m.personal_id === p.id);
      const especialidad = medico ? especialidades.find(e => e.id === medico.especialidad_principal_id.toString()) : null;

      return {
        ...p,
        nombre_completo: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Desconocido',
        email: usuario?.email,
        telefono: usuario?.telefono,
        rol_nombre: rol?.nombre || 'Desconocido',
        especialidad_nombre: especialidad?.nombre,
        es_medico: !!medico
      };
    });
  }

  // =====================================================
  // MÉTODOS DE MÉTRICAS Y REPORTES
  // =====================================================

  async getMetricasHospital(hospitalId: number, fechaInicio?: string, fechaFin?: string): Promise<any> {
    const metricas = mockData.metricas_sistema.find(m => m.hospital_id === hospitalId);
    const citas = await this.getCitasByHospital(hospitalId, fechaInicio, fechaFin);
    
    const citasCompletadas = citas.filter(c => c.estado_id === 4).length;
    const citasCanceladas = citas.filter(c => c.estado_id === 5).length;
    const citasNoShow = citas.filter(c => c.estado_id === 6).length;
    
    return {
      hospital_id: hospitalId,
      total_citas: citas.length,
      citas_completadas: citasCompletadas,
      citas_canceladas: citasCanceladas,
      citas_no_show: citasNoShow,
      tasa_completacion: citas.length > 0 ? (citasCompletadas / citas.length * 100).toFixed(2) : '0.00',
      satisfaccion_promedio: metricas?.satisfaccion_promedio || 4.2,
      tiempo_promedio_espera: metricas?.tiempo_promedio_espera || 25,
      usuarios_activos: metricas?.usuarios_activos || 50
    };
  }

  async getMetricasGenerales(): Promise<any> {
    const totalCitas = mockData.citas.length;
    const citasCompletadas = mockData.citas.filter(c => c.estado_id === 4).length;
    const totalUsuarios = mockData.usuarios.filter(u => u.tipo_usuario === 'PACIENTE').length;
    const totalPersonal = mockData.usuarios.filter(u => u.tipo_usuario === 'PERSONAL').length;

    return {
      total_hospitales: hospitales.length,
      total_citas: totalCitas,
      citas_completadas: citasCompletadas,
      total_pacientes: totalUsuarios,
      total_personal: totalPersonal,
      tasa_completacion: totalCitas > 0 ? (citasCompletadas / totalCitas * 100).toFixed(2) : '0.00',
      satisfaccion_promedio: 4.3,
      hospitales_activos: hospitales.filter(h => h.estado === 'ACTIVO').length
    };
  }

  // =====================================================
  // MÉTODOS DE COLA VIRTUAL
  // =====================================================

  async getColaVirtualByHospital(hospitalId: number): Promise<any[]> {
    const hoy = new Date().toISOString().split('T')[0];
    const citas = await this.getCitasByHospital(hospitalId, hoy, hoy);
    
    return citas
      .filter(c => c.estado_id === 2 || c.estado_id === 3) // CONFIRMADA o EN_CURSO
      .map((cita, index) => ({
        id: index + 1,
        cita_id: cita.id,
        numero_turno: index + 1,
        estado: index === 0 ? 'EN_ATENCION' : 'ESPERANDO',
        paciente_nombre: cita.paciente_nombre,
        medico_nombre: cita.medico_nombre,
        hora_cita: cita.hora_inicio,
        tiempo_espera: Math.floor(Math.random() * 30) + 5
      }));
  }

  // =====================================================
  // MÉTODOS DE ADMINISTRACIÓN UNIVERSAL
  // =====================================================

  async isAdminUniversal(usuarioId: number): Promise<boolean> {
    const usuario = mockData.usuarios.find(u => u.id === usuarioId);
    return usuario?.numero_documento === '001-770601-1004I'; // Isaac Espinoza
  }

  async getAllHospitalsData(): Promise<any[]> {
    const hospitalesData = [];
    
    for (const hospital of hospitales) {
      const hospitalId = parseInt(hospital.id);
      const metricas = await this.getMetricasHospital(hospitalId);
      const personal = await this.getPersonalByHospital(hospitalId);
      
      hospitalesData.push({
        ...hospital,
        id: hospitalId,
        metricas,
        total_personal: personal.length,
        personal_resumen: {
          medicos: personal.filter(p => p.es_medico).length,
          enfermeros: personal.filter(p => p.rol_nombre.includes('Enfermero')).length,
          administrativos: personal.filter(p => p.rol_nombre.includes('Administrativo')).length
        }
      });
    }
    
    return hospitalesData;
  }

  // =====================================================
  // MÉTODOS DE UTILIDAD
  // =====================================================

  async getEstadosCitas(): Promise<EstadoCita[]> {
    return mockData.estados_citas;
  }

  async getTiposCitas(): Promise<TipoCita[]> {
    return mockData.tipos_citas;
  }

  async getRolesPersonal(): Promise<RolPersonal[]> {
    return mockData.roles_personal;
  }

  async getEspecialidades(): Promise<any[]> {
    return especialidades;
  }

  async getDepartamentos(): Promise<any[]> {
    return departamentos;
  }

  // Método para reset de datos (útil para testing)
  async resetMockData(): Promise<void> {
    initializeMockData();
  }
}

// Instancia singleton del servicio
export const databaseService = new DatabaseService();

// Funciones de utilidad para componentes
export const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-NI', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatearHora = (hora: string): string => {
  return hora.substring(0, 5); // HH:MM
};

export const calcularTiempoEspera = (horaLlegada: string, horaActual: string): number => {
  const llegada = new Date(`1970-01-01T${horaLlegada}`);
  const actual = new Date(`1970-01-01T${horaActual}`);
  return Math.floor((actual.getTime() - llegada.getTime()) / (1000 * 60));
};

export default databaseService;