// =====================================================
// DATOS COMPLETOS DE NICARAGUA - HOSPITALES Y GEOGRAFIA
// Actualizado con información real de hospitales nicaragüenses
// =====================================================

export interface Departamento {
  id: number;
  nombre: string;
  codigo: string;
  municipios: Municipio[];
}

export interface Municipio {
  id: number;
  nombre: string;
  codigo: string;
  departamento_id: number;
}

export interface Hospital {
  id: string;
  nombre: string;
  codigo_establecimiento: string;
  tipo: 'PUBLICO' | 'PRIVADO' | 'MIXTO';
  nivel_complejidad: 'I' | 'II' | 'III' | 'IV';
  municipio: string;
  departamento: string;
  direccion: string;
  telefono?: string;
  email?: string;
  website?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
  capacidad_camas: number;
  especialidades: string[];
  servicios: string[];
  estado: 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO';
}

export interface Especialidad {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  requiere_referencia: boolean;
}

// Departamentos de Nicaragua
export const departamentos: Departamento[] = [
  {
    id: 1,
    nombre: 'Boaco',
    codigo: 'BO',
    municipios: [
      { id: 101, nombre: 'Boaco', codigo: 'BO01', departamento_id: 1 },
      { id: 102, nombre: 'Camoapa', codigo: 'BO02', departamento_id: 1 },
      { id: 103, nombre: 'San José de los Remates', codigo: 'BO03', departamento_id: 1 },
      { id: 104, nombre: 'San Lorenzo', codigo: 'BO04', departamento_id: 1 },
      { id: 105, nombre: 'Santa Lucía', codigo: 'BO05', departamento_id: 1 },
      { id: 106, nombre: 'Teustepe', codigo: 'BO06', departamento_id: 1 }
    ]
  },
  {
    id: 2,
    nombre: 'Carazo',
    codigo: 'CA',
    municipios: [
      { id: 201, nombre: 'Jinotepe', codigo: 'CA01', departamento_id: 2 },
      { id: 202, nombre: 'Diriamba', codigo: 'CA02', departamento_id: 2 },
      { id: 203, nombre: 'Dolores', codigo: 'CA03', departamento_id: 2 },
      { id: 204, nombre: 'El Rosario', codigo: 'CA04', departamento_id: 2 },
      { id: 205, nombre: 'La Conquista', codigo: 'CA05', departamento_id: 2 },
      { id: 206, nombre: 'La Paz de Carazo', codigo: 'CA06', departamento_id: 2 },
      { id: 207, nombre: 'San Marcos', codigo: 'CA07', departamento_id: 2 },
      { id: 208, nombre: 'Santa Teresa', codigo: 'CA08', departamento_id: 2 }
    ]
  },
  {
    id: 3,
    nombre: 'Chinandega',
    codigo: 'CH',
    municipios: [
      { id: 301, nombre: 'Chinandega', codigo: 'CH01', departamento_id: 3 },
      { id: 302, nombre: 'Chichigalpa', codigo: 'CH02', departamento_id: 3 },
      { id: 303, nombre: 'Corinto', codigo: 'CH03', departamento_id: 3 },
      { id: 304, nombre: 'El Realejo', codigo: 'CH04', departamento_id: 3 },
      { id: 305, nombre: 'El Viejo', codigo: 'CH05', departamento_id: 3 },
      { id: 306, nombre: 'Posoltega', codigo: 'CH06', departamento_id: 3 },
      { id: 307, nombre: 'Puerto Morazán', codigo: 'CH07', departamento_id: 3 },
      { id: 308, nombre: 'San Francisco del Norte', codigo: 'CH08', departamento_id: 3 },
      { id: 309, nombre: 'San Pedro del Norte', codigo: 'CH09', departamento_id: 3 },
      { id: 310, nombre: 'Santo Tomás del Norte', codigo: 'CH10', departamento_id: 3 },
      { id: 311, nombre: 'Somotillo', codigo: 'CH11', departamento_id: 3 },
      { id: 312, nombre: 'Villanueva', codigo: 'CH12', departamento_id: 3 },
      { id: 313, nombre: 'Cinco Pinos', codigo: 'CH13', departamento_id: 3 }
    ]
  },
  {
    id: 4,
    nombre: 'Chontales',
    codigo: 'CO',
    municipios: [
      { id: 401, nombre: 'Juigalpa', codigo: 'CO01', departamento_id: 4 },
      { id: 402, nombre: 'Acoyapa', codigo: 'CO02', departamento_id: 4 },
      { id: 403, nombre: 'Comalapa', codigo: 'CO03', departamento_id: 4 },
      { id: 404, nombre: 'Cuapa', codigo: 'CO04', departamento_id: 4 },
      { id: 405, nombre: 'El Coral', codigo: 'CO05', departamento_id: 4 },
      { id: 406, nombre: 'La Libertad', codigo: 'CO06', departamento_id: 4 },
      { id: 407, nombre: 'San Pedro de Lóvago', codigo: 'CO07', departamento_id: 4 },
      { id: 408, nombre: 'Santo Domingo', codigo: 'CO08', departamento_id: 4 },
      { id: 409, nombre: 'Santo Tomás', codigo: 'CO09', departamento_id: 4 },
      { id: 410, nombre: 'Villa Sandino', codigo: 'CO10', departamento_id: 4 }
    ]
  },
  {
    id: 5,
    nombre: 'Estelí',
    codigo: 'ES',
    municipios: [
      { id: 501, nombre: 'Estelí', codigo: 'ES01', departamento_id: 5 },
      { id: 502, nombre: 'Condega', codigo: 'ES02', departamento_id: 5 },
      { id: 503, nombre: 'La Trinidad', codigo: 'ES03', departamento_id: 5 },
      { id: 504, nombre: 'Pueblo Nuevo', codigo: 'ES04', departamento_id: 5 },
      { id: 505, nombre: 'San Juan de Limay', codigo: 'ES05', departamento_id: 5 },
      { id: 506, nombre: 'San Nicolás', codigo: 'ES06', departamento_id: 5 }
    ]
  },
  {
    id: 6,
    nombre: 'Granada',
    codigo: 'GR',
    municipios: [
      { id: 601, nombre: 'Granada', codigo: 'GR01', departamento_id: 6 },
      { id: 602, nombre: 'Diriá', codigo: 'GR02', departamento_id: 6 },
      { id: 603, nombre: 'Diriomo', codigo: 'GR03', departamento_id: 6 },
      { id: 604, nombre: 'Nandaime', codigo: 'GR04', departamento_id: 6 }
    ]
  },
  {
    id: 7,
    nombre: 'Jinotega',
    codigo: 'JI',
    municipios: [
      { id: 701, nombre: 'Jinotega', codigo: 'JI01', departamento_id: 7 },
      { id: 702, nombre: 'El Cuá', codigo: 'JI02', departamento_id: 7 },
      { id: 703, nombre: 'La Concordia', codigo: 'JI03', departamento_id: 7 },
      { id: 704, nombre: 'San José de Bocay', codigo: 'JI04', departamento_id: 7 },
      { id: 705, nombre: 'San Rafael del Norte', codigo: 'JI05', departamento_id: 7 },
      { id: 706, nombre: 'San Sebastián de Yalí', codigo: 'JI06', departamento_id: 7 },
      { id: 707, nombre: 'Santa María de Pantasma', codigo: 'JI07', departamento_id: 7 },
      { id: 708, nombre: 'Wiwilí de Nueva Segovia', codigo: 'JI08', departamento_id: 7 }
    ]
  },
  {
    id: 8,
    nombre: 'León',
    codigo: 'LE',
    municipios: [
      { id: 801, nombre: 'León', codigo: 'LE01', departamento_id: 8 },
      { id: 802, nombre: 'Achuapa', codigo: 'LE02', departamento_id: 8 },
      { id: 803, nombre: 'El Jicaral', codigo: 'LE03', departamento_id: 8 },
      { id: 804, nombre: 'El Sauce', codigo: 'LE04', departamento_id: 8 },
      { id: 805, nombre: 'La Paz Centro', codigo: 'LE05', departamento_id: 8 },
      { id: 806, nombre: 'Larreynaga', codigo: 'LE06', departamento_id: 8 },
      { id: 807, nombre: 'Nagarote', codigo: 'LE07', departamento_id: 8 },
      { id: 808, nombre: 'Quezalguaque', codigo: 'LE08', departamento_id: 8 },
      { id: 809, nombre: 'Santa Rosa del Peñón', codigo: 'LE09', departamento_id: 8 },
      { id: 810, nombre: 'Telica', codigo: 'LE10', departamento_id: 8 }
    ]
  },
  {
    id: 9,
    nombre: 'Madriz',
    codigo: 'MD',
    municipios: [
      { id: 901, nombre: 'Somoto', codigo: 'MD01', departamento_id: 9 },
      { id: 902, nombre: 'Las Sabanas', codigo: 'MD02', departamento_id: 9 },
      { id: 903, nombre: 'Palacagüina', codigo: 'MD03', departamento_id: 9 },
      { id: 904, nombre: 'San José de Cusmapa', codigo: 'MD04', departamento_id: 9 },
      { id: 905, nombre: 'San Juan de Río Coco', codigo: 'MD05', departamento_id: 9 },
      { id: 906, nombre: 'San Lucas', código: 'MD06', departamento_id: 9 },
      { id: 907, nombre: 'Telpaneca', codigo: 'MD07', departamento_id: 9 },
      { id: 908, nombre: 'Totogalpa', codigo: 'MD08', departamento_id: 9 },
      { id: 909, nombre: 'Yalagüina', codigo: 'MD09', departamento_id: 9 }
    ]
  },
  {
    id: 10,
    nombre: 'Managua',
    codigo: 'MN',
    municipios: [
      { id: 1001, nombre: 'Managua', codigo: 'MN01', departamento_id: 10 },
      { id: 1002, nombre: 'Ciudad Sandino', codigo: 'MN02', departamento_id: 10 },
      { id: 1003, nombre: 'El Crucero', codigo: 'MN03', departamento_id: 10 },
      { id: 1004, nombre: 'Mateare', codigo: 'MN04', departamento_id: 10 },
      { id: 1005, nombre: 'San Francisco Libre', codigo: 'MN05', departamento_id: 10 },
      { id: 1006, nombre: 'San Rafael del Sur', codigo: 'MN06', departamento_id: 10 },
      { id: 1007, nombre: 'Ticuantepe', codigo: 'MN07', departamento_id: 10 },
      { id: 1008, nombre: 'Tipitapa', codigo: 'MN08', departamento_id: 10 },
      { id: 1009, nombre: 'Villa Carlos Fonseca', codigo: 'MN09', departamento_id: 10 }
    ]
  },
  {
    id: 11,
    nombre: 'Masaya',
    codigo: 'MS',
    municipios: [
      { id: 1101, nombre: 'Masaya', codigo: 'MS01', departamento_id: 11 },
      { id: 1102, nombre: 'Catarina', codigo: 'MS02', departamento_id: 11 },
      { id: 1103, nombre: 'La Concepción', codigo: 'MS03', departamento_id: 11 },
      { id: 1104, nombre: 'Masatepe', codigo: 'MS04', departamento_id: 11 },
      { id: 1105, nombre: 'Nandasmo', codigo: 'MS05', departamento_id: 11 },
      { id: 1106, nombre: 'Nindirí', codigo: 'MS06', departamento_id: 11 },
      { id: 1107, nombre: 'Niquinohomo', codigo: 'MS07', departamento_id: 11 },
      { id: 1108, nombre: 'San Juan de Oriente', codigo: 'MS08', departamento_id: 11 },
      { id: 1109, nombre: 'Tisma', codigo: 'MS09', departamento_id: 11 }
    ]
  },
  {
    id: 12,
    nombre: 'Matagalpa',
    codigo: 'MT',
    municipios: [
      { id: 1201, nombre: 'Matagalpa', codigo: 'MT01', departamento_id: 12 },
      { id: 1202, nombre: 'Ciudad Darío', codigo: 'MT02', departamento_id: 12 },
      { id: 1203, nombre: 'El Tuma - La Dalia', codigo: 'MT03', departamento_id: 12 },
      { id: 1204, nombre: 'Esquipulas', codigo: 'MT04', departamento_id: 12 },
      { id: 1205, nombre: 'Matiguás', codigo: 'MT05', departamento_id: 12 },
      { id: 1206, nombre: 'Muy Muy', codigo: 'MT06', departamento_id: 12 },
      { id: 1207, nombre: 'Rancho Grande', codigo: 'MT07', departamento_id: 12 },
      { id: 1208, nombre: 'Río Blanco', codigo: 'MT08', departamento_id: 12 },
      { id: 1209, nombre: 'San Dionisio', codigo: 'MT09', departamento_id: 12 },
      { id: 1210, nombre: 'San Isidro', codigo: 'MT10', departamento_id: 12 },
      { id: 1211, nombre: 'San Ramón', codigo: 'MT11', departamento_id: 12 },
      { id: 1212, nombre: 'Sébaco', codigo: 'MT12', departamento_id: 12 },
      { id: 1213, nombre: 'Terrabona', codigo: 'MT13', departamento_id: 12 }
    ]
  },
  {
    id: 13,
    nombre: 'Nueva Segovia',
    codigo: 'NS',
    municipios: [
      { id: 1301, nombre: 'Ocotal', codigo: 'NS01', departamento_id: 13 },
      { id: 1302, nombre: 'Ciudad Antigua', codigo: 'NS02', departamento_id: 13 },
      { id: 1303, nombre: 'Dipilto', codigo: 'NS03', departamento_id: 13 },
      { id: 1304, nombre: 'El Jícaro', codigo: 'NS04', departamento_id: 13 },
      { id: 1305, nombre: 'Jalapa', codigo: 'NS05', departamento_id: 13 },
      { id: 1306, nombre: 'Macuelizo', codigo: 'NS06', departamento_id: 13 },
      { id: 1307, nombre: 'Mozonte', codigo: 'NS07', departamento_id: 13 },
      { id: 1308, nombre: 'Murra', codigo: 'NS08', departamento_id: 13 },
      { id: 1309, nombre: 'Quilalí', codigo: 'NS09', departamento_id: 13 },
      { id: 1310, nombre: 'San Fernando', codigo: 'NS10', departamento_id: 13 },
      { id: 1311, nombre: 'Santa María', codigo: 'NS11', departamento_id: 13 },
      { id: 1312, nombre: 'Wiwilí de Nueva Segovia', codigo: 'NS12', departamento_id: 13 }
    ]
  },
  {
    id: 14,
    nombre: 'Río San Juan',
    codigo: 'SJ',
    municipios: [
      { id: 1401, nombre: 'San Carlos', codigo: 'SJ01', departamento_id: 14 },
      { id: 1402, nombre: 'El Castillo', codigo: 'SJ02', departamento_id: 14 },
      { id: 1403, nombre: 'Morrito', codigo: 'SJ03', departamento_id: 14 },
      { id: 1404, nombre: 'San Juan de Nicaragua', codigo: 'SJ04', departamento_id: 14 },
      { id: 1405, nombre: 'San Miguelito', codigo: 'SJ05', departamento_id: 14 }
    ]
  },
  {
    id: 15,
    nombre: 'Rivas',
    codigo: 'RI',
    municipios: [
      { id: 1501, nombre: 'Rivas', codigo: 'RI01', departamento_id: 15 },
      { id: 1502, nombre: 'Altagracia', codigo: 'RI02', departamento_id: 15 },
      { id: 1503, nombre: 'Belén', codigo: 'RI03', departamento_id: 15 },
      { id: 1504, nombre: 'Buenos Aires', codigo: 'RI04', departamento_id: 15 },
      { id: 1505, nombre: 'Cárdenas', codigo: 'RI05', departamento_id: 15 },
      { id: 1506, nombre: 'Moyogalpa', codigo: 'RI06', departamento_id: 15 },
      { id: 1507, nombre: 'Potosí', codigo: 'RI07', departamento_id: 15 },
      { id: 1508, nombre: 'San Jorge', codigo: 'RI08', departamento_id: 15 },
      { id: 1509, nombre: 'San Juan del Sur', codigo: 'RI09', departamento_id: 15 },
      { id: 1510, nombre: 'Tola', codigo: 'RI10', departamento_id: 15 }
    ]
  },
  {
    id: 16,
    nombre: 'RACCS',
    codigo: 'AS',
    municipios: [
      { id: 1601, nombre: 'Bluefields', codigo: 'AS01', departamento_id: 16 },
      { id: 1602, nombre: 'Corn Island', codigo: 'AS02', departamento_id: 16 },
      { id: 1603, nombre: 'Desembocadura de la Cruz de Río Grande', codigo: 'AS03', departamento_id: 16 },
      { id: 1604, nombre: 'El Ayote', codigo: 'AS04', departamento_id: 16 },
      { id: 1605, nombre: 'El Rama', codigo: 'AS05', departamento_id: 16 },
      { id: 1606, nombre: 'El Tortuguero', codigo: 'AS06', departamento_id: 16 },
      { id: 1607, nombre: 'Kukra Hill', codigo: 'AS07', departamento_id: 16 },
      { id: 1608, nombre: 'La Cruz de Río Grande', codigo: 'AS08', departamento_id: 16 },
      { id: 1609, nombre: 'Laguna de Perlas', codigo: 'AS09', departamento_id: 16 },
      { id: 1610, nombre: 'Muelle de los Bueyes', codigo: 'AS10', departamento_id: 16 },
      { id: 1611, nombre: 'Nueva Guinea', codigo: 'AS11', departamento_id: 16 },
      { id: 1612, nombre: 'Paiwas', codigo: 'AS12', departamento_id: 16 }
    ]
  },
  {
    id: 17,
    nombre: 'RACCN',
    codigo: 'AN',
    municipios: [
      { id: 1701, nombre: 'Puerto Cabezas', codigo: 'AN01', departamento_id: 17 },
      { id: 1702, nombre: 'Bonanza', codigo: 'AN02', departamento_id: 17 },
      { id: 1703, nombre: 'Mulukukú', codigo: 'AN03', departamento_id: 17 },
      { id: 1704, nombre: 'Prinzapolka', codigo: 'AN04', departamento_id: 17 },
      { id: 1705, nombre: 'Rosita', codigo: 'AN05', departamento_id: 17 },
      { id: 1706, nombre: 'Siuna', codigo: 'AN06', departamento_id: 17 },
      { id: 1707, nombre: 'Waslala', codigo: 'AN07', departamento_id: 17 },
      { id: 1708, nombre: 'Waspam', codigo: 'AN08', departamento_id: 17 }
    ]
  }
];

// Especialidades médicas disponibles
export const especialidades: Especialidad[] = [
  { id: '1', nombre: 'Medicina General', codigo: 'MG', descripcion: 'Atención médica general y preventiva', requiere_referencia: false },
  { id: '2', nombre: 'Cardiología', codigo: 'CA', descripcion: 'Especialidad del corazón y sistema cardiovascular', requiere_referencia: true },
  { id: '3', nombre: 'Pediatría', codigo: 'PE', descripcion: 'Atención médica infantil', requiere_referencia: false },
  { id: '4', nombre: 'Ginecología', codigo: 'GI', descripcion: 'Salud femenina y reproductiva', requiere_referencia: false },
  { id: '5', nombre: 'Neurología', codigo: 'NE', descripcion: 'Sistema nervioso y cerebro', requiere_referencia: true },
  { id: '6', nombre: 'Traumatología', codigo: 'TR', descripcion: 'Huesos, articulaciones y traumatismos', requiere_referencia: true },
  { id: '7', nombre: 'Dermatología', codigo: 'DE', descripcion: 'Enfermedades de la piel', requiere_referencia: true },
  { id: '8', nombre: 'Oftalmología', codigo: 'OF', descripcion: 'Enfermedades de los ojos', requiere_referencia: true },
  { id: '9', nombre: 'Oncología', codigo: 'ON', descripcion: 'Tratamiento del cáncer', requiere_referencia: true },
  { id: '10', nombre: 'Medicina Interna', codigo: 'MI', descripcion: 'Medicina interna del adulto', requiere_referencia: true },
  { id: '11', nombre: 'Emergencias', codigo: 'EM', descripcion: 'Atención de emergencias médicas', requiere_referencia: false },
  { id: '12', nombre: 'Psiquiatría', codigo: 'PS', descripcion: 'Salud mental', requiere_referencia: true },
  { id: '13', nombre: 'Urología', codigo: 'UR', descripcion: 'Sistema genitourinario', requiere_referencia: true },
  { id: '14', nombre: 'Endocrinología', codigo: 'EN', descripcion: 'Glándulas y hormonas', requiere_referencia: true },
  { id: '15', nombre: 'Gastroenterología', codigo: 'GA', descripcion: 'Sistema digestivo', requiere_referencia: true },
  { id: '16', nombre: 'Neumología', codigo: 'NM', descripcion: 'Sistema respiratorio', requiere_referencia: true },
  { id: '17', nombre: 'Reumatología', codigo: 'RE', descripcion: 'Enfermedades reumáticas', requiere_referencia: true },
  { id: '18', nombre: 'Otorrinolaringología', codigo: 'OT', descripcion: 'Oído, nariz y garganta', requiere_referencia: true },
  { id: '19', nombre: 'Cirugía General', codigo: 'CG', descripcion: 'Cirugía general', requiere_referencia: true },
  { id: '20', nombre: 'Anestesiología', codigo: 'AN', descripcion: 'Anestesia y cuidados perioperatorios', requiere_referencia: true }
];

// Interfaces expandidas para recursos hospitalarios
export interface RecursoHospitalario {
  categoria: string;
  items: {
    nombre: string;
    cantidad: number;
    estado: 'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'FUERA_SERVICIO';
    ubicacion?: string;
  }[];
}

export interface AreaHospitalaria {
  id: string;
  nombre: string;
  tipo: 'CLINICA' | 'QUIRURGICA' | 'DIAGNOSTICA' | 'ADMINISTRATIVA' | 'APOYO';
  capacidad_pacientes?: number;
  personal_asignado: number;
  especialidades: string[];
  equipos_principales: string[];
  horario_funcionamiento: string;
  estado: 'OPERATIVA' | 'MANTENIMIENTO' | 'CERRADA';
}

// Extender interface Hospital
export interface Hospital {
  id: string;
  nombre: string;
  codigo_establecimiento: string;
  tipo: 'PUBLICO' | 'PRIVADO' | 'MIXTO';
  nivel_complejidad: 'I' | 'II' | 'III' | 'IV';
  municipio: string;
  departamento: string;
  direccion: string;
  telefono?: string;
  email?: string;
  website?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
  capacidad_camas: number;
  especialidades: string[];
  servicios: string[];
  recursos?: RecursoHospitalario[];
  areas?: AreaHospitalaria[];
  certificaciones?: string[];
  director_medico?: string;
  ano_fundacion?: number;
  estado: 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO';
}

// Lista completa de hospitales nicaragüenses expandida
export const hospitales: Hospital[] = [
  // MANAGUA - Hospitales Privados
  {
    id: '1',
    nombre: 'Hospital Metropolitano Vivian Pellas',
    codigo_establecimiento: 'HMVP001',
    tipo: 'PRIVADO',
    nivel_complejidad: 'IV',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Km 9.5 Carretera Masaya, Managua',
    telefono: '+505 2255-6900',
    email: 'info@metropolitano.com.ni',
    website: 'https://www.hospitalmetropolitano.com.ni',
    coordenadas: { latitud: 12.081389, longitud: -86.236111 },
    capacidad_camas: 200,
    especialidades: ['Cardiología', 'Neurología', 'Oncología', 'Pediatría', 'Medicina General', 'Emergencias', 'Cirugía General', 'Traumatología', 'Ginecología', 'Urología'],
    servicios: ['UCI', 'Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia', 'Ambulancias', 'Telemedicina'],
    director_medico: 'Dr. Roberto Mendoza Silva',
    ano_fundacion: 2012,
    certificaciones: ['JCI', 'ISO 9001:2015', 'Acreditación MINSA'],
    recursos: [
      {
        categoria: 'Equipos de Diagnóstico',
        items: [
          { nombre: 'Resonancia Magnética 1.5T', cantidad: 2, estado: 'DISPONIBLE', ubicacion: 'Imagenología Piso 1' },
          { nombre: 'Tomógrafo 64 Cortes', cantidad: 1, estado: 'DISPONIBLE', ubicacion: 'Imagenología Piso 1' },
          { nombre: 'Ecógrafo Doppler', cantidad: 8, estado: 'DISPONIBLE', ubicacion: 'Consultorios Externos' },
          { nombre: 'Rayos X Digital', cantidad: 4, estado: 'DISPONIBLE', ubicacion: 'Imagenología' },
          { nombre: 'Mamógrafo Digital', cantidad: 1, estado: 'DISPONIBLE', ubicacion: 'Ginecología' }
        ]
      },
      {
        categoria: 'Equipos de Cuidados Intensivos',
        items: [
          { nombre: 'Ventilador Mecánico', cantidad: 24, estado: 'DISPONIBLE', ubicacion: 'UCI/Emergencias' },
          { nombre: 'Monitor Multiparámetro', cantidad: 45, estado: 'DISPONIBLE', ubicacion: 'UCI/Hospitalización' },
          { nombre: 'Bomba de Infusión', cantidad: 60, estado: 'DISPONIBLE', ubicacion: 'UCI/Hospitalización' },
          { nombre: 'Desfibrilador', cantidad: 12, estado: 'DISPONIBLE', ubicacion: 'UCI/Emergencias/Cardiología' }
        ]
      },
      {
        categoria: 'Quirófanos',
        items: [
          { nombre: 'Quirófano Cardiovascular', cantidad: 2, estado: 'DISPONIBLE', ubicacion: 'Bloque Quirúrgico Piso 3' },
          { nombre: 'Quirófano General', cantidad: 6, estado: 'DISPONIBLE', ubicacion: 'Bloque Quirúrgico Piso 3' },
          { nombre: 'Quirófano Neurocirugía', cantidad: 1, estado: 'DISPONIBLE', ubicacion: 'Bloque Quirúrgico Piso 4' },
          { nombre: 'Mesa Quirúrgica', cantidad: 9, estado: 'DISPONIBLE', ubicacion: 'Bloque Quirúrgico' }
        ]
      },
      {
        categoria: 'Laboratorio',
        items: [
          { nombre: 'Analizador Hematológico', cantidad: 3, estado: 'DISPONIBLE', ubicacion: 'Laboratorio Piso 2' },
          { nombre: 'Analizador Bioquímico', cantidad: 2, estado: 'DISPONIBLE', ubicacion: 'Laboratorio Piso 2' },
          { nombre: 'Microscopio', cantidad: 8, estado: 'DISPONIBLE', ubicacion: 'Laboratorio/Patología' },
          { nombre: 'Centrífuga', cantidad: 6, estado: 'DISPONIBLE', ubicacion: 'Laboratorio Piso 2' }
        ]
      }
    ],
    areas: [
      {
        id: 'emerg-001',
        nombre: 'Sala de Emergencias',
        tipo: 'CLINICA',
        capacidad_pacientes: 30,
        personal_asignado: 15,
        especialidades: ['Emergencias', 'Medicina Interna', 'Cirugía General'],
        equipos_principales: ['Ventiladores', 'Monitores', 'Desfibriladores', 'Rayos X Portátil'],
        horario_funcionamiento: '24 horas',
        estado: 'OPERATIVA'
      },
      {
        id: 'uci-001',
        nombre: 'Unidad de Cuidados Intensivos',
        tipo: 'CLINICA',
        capacidad_pacientes: 24,
        personal_asignado: 35,
        especialidades: ['Medicina Crítica', 'Cardiología', 'Neurología'],
        equipos_principales: ['Ventiladores Mecánicos', 'Monitores Multiparámetro', 'Bombas de Infusión'],
        horario_funcionamiento: '24 horas',
        estado: 'OPERATIVA'
      },
      {
        id: 'cardio-001',
        nombre: 'Unidad de Cardiología',
        tipo: 'CLINICA',
        capacidad_pacientes: 20,
        personal_asignado: 12,
        especialidades: ['Cardiología', 'Cardiología Intervencionista'],
        equipos_principales: ['Catlab', 'Ecocardiógrafos', 'Electrocardiógrafos', 'Holter'],
        horario_funcionamiento: '6:00 AM - 10:00 PM',
        estado: 'OPERATIVA'
      },
      {
        id: 'onco-001',
        nombre: 'Centro de Oncología',
        tipo: 'CLINICA',
        capacidad_pacientes: 15,
        personal_asignado: 8,
        especialidades: ['Oncología Médica', 'Hematología'],
        equipos_principales: ['Acelerador Lineal', 'Simulador CT', 'Bombas de Quimioterapia'],
        horario_funcionamiento: '7:00 AM - 6:00 PM',
        estado: 'OPERATIVA'
      },
      {
        id: 'quir-001',
        nombre: 'Bloque Quirúrgico',
        tipo: 'QUIRURGICA',
        capacidad_pacientes: 45,
        personal_asignado: 25,
        especialidades: ['Cirugía General', 'Neurocirugía', 'Cirugía Cardiovascular', 'Traumatología'],
        equipos_principales: ['Quirófanos', 'Mesas Quirúrgicas', 'Aparatos de Anestesia', 'Microscopios Quirúrgicos'],
        horario_funcionamiento: '24 horas',
        estado: 'OPERATIVA'
      },
      {
        id: 'imagen-001',
        nombre: 'Servicio de Imagenología',
        tipo: 'DIAGNOSTICA',
        personal_asignado: 18,
        especialidades: ['Radiología', 'Imagenología'],
        equipos_principales: ['Resonancia Magnética', 'Tomógrafo', 'Rayos X', 'Ecógrafos', 'Mamógrafo'],
        horario_funcionamiento: '24 horas',
        estado: 'OPERATIVA'
      },
      {
        id: 'lab-001',
        nombre: 'Laboratorio Clínico',
        tipo: 'DIAGNOSTICA',
        personal_asignado: 22,
        especialidades: ['Patología Clínica', 'Microbiología', 'Inmunología'],
        equipos_principales: ['Analizadores Automáticos', 'Microscopios', 'Centrífugas', 'Incubadoras'],
        horario_funcionamiento: '24 horas',
        estado: 'OPERATIVA'
      }
    ],
    estado: 'ACTIVO'
  },
  {
    id: '2',
    nombre: 'Hospital Bautista',
    codigo_establecimiento: 'HB001',
    tipo: 'PRIVADO',
    nivel_complejidad: 'III',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Barrio Largaespada, Managua',
    telefono: '+505 2249-7070',
    email: 'contacto@bautista.com.ni',
    website: 'https://www.hospitalbautista.com.ni',
    coordenadas: { latitud: 12.114722, longitud: -86.270833 },
    capacidad_camas: 150,
    especialidades: ['Pediatría', 'Ginecología', 'Cardiología', 'Medicina General', 'Emergencias', 'Oftalmología', 'Dermatología'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia', 'Ambulancias'],
    estado: 'ACTIVO'
  },
  {
    id: '3',
    nombre: 'Hospital Alemán Nicaragüense',
    codigo_establecimiento: 'HAN001',
    tipo: 'PRIVADO',
    nivel_complejidad: 'III',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Pista Jean Paul Genie, Managua',
    telefono: '+505 2228-6171',
    email: 'info@hospitalaleman.com.ni',
    coordenadas: { latitud: 12.089722, longitud: -86.275 },
    capacidad_camas: 100,
    especialidades: ['Ginecología', 'Dermatología', 'Oftalmología', 'Medicina General', 'Pediatría', 'Cardiología'],
    servicios: ['Urgencias', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },
  {
    id: '4',
    nombre: 'Hospital Salud Integral',
    codigo_establecimiento: 'HSI001',
    tipo: 'PRIVADO',
    nivel_complejidad: 'III',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Plaza El Sol, Managua',
    telefono: '+505 2255-8888',
    coordenadas: { latitud: 12.097222, longitud: -86.240833 },
    capacidad_camas: 80,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Cardiología', 'Gastroenterología', 'Endocrinología'],
    servicios: ['Urgencias', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },
  {
    id: '5',
    nombre: 'Hospital Monte España',
    codigo_establecimiento: 'HME001',
    tipo: 'PRIVADO',
    nivel_complejidad: 'III',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Km 11 Carretera Sur, Managua',
    telefono: '+505 2255-8300',
    coordenadas: { latitud: 12.075, longitud: -86.235556 },
    capacidad_camas: 120,
    especialidades: ['Medicina General', 'Cardiología', 'Neurología', 'Traumatología', 'Cirugía General', 'Ginecología'],
    servicios: ['UCI', 'Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia', 'Ambulancias'],
    estado: 'ACTIVO'
  },
  {
    id: '6',
    nombre: 'Hospital Angloamericano',
    codigo_establecimiento: 'HAA001',
    tipo: 'PRIVADO',
    nivel_complejidad: 'II',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Carretera Norte, Managua',
    telefono: '+505 2244-2000',
    coordenadas: { latitud: 12.150000, longitud: -86.283333 },
    capacidad_camas: 60,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Dermatología', 'Oftalmología'],
    servicios: ['Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // MANAGUA - Hospitales Públicos
  {
    id: '7',
    nombre: 'Hospital Escuela Dr. Roberto Calderón Gutiérrez',
    codigo_establecimiento: 'HERC001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'IV',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Barrio Altagracia, Managua',
    telefono: '+505 2222-2200',
    coordenadas: { latitud: 12.134167, longitud: -86.251389 },
    capacidad_camas: 400,
    especialidades: ['Medicina General', 'Medicina Interna', 'Cardiología', 'Neurología', 'Oncología', 'Emergencias', 'Cirugía General', 'Traumatología'],
    servicios: ['UCI', 'Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia', 'Ambulancias', 'Docencia'],
    estado: 'ACTIVO'
  },
  {
    id: '8',
    nombre: 'Hospital Bertha Calderón Roque',
    codigo_establecimiento: 'HBCR001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Villa Libertad, Managua',
    telefono: '+505 2289-4700',
    coordenadas: { latitud: 12.115278, longitud: -86.290833 },
    capacidad_camas: 250,
    especialidades: ['Ginecología', 'Obstetricia', 'Pediatría', 'Neonatología', 'Medicina General'],
    servicios: ['UCI Neonatal', 'Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia', 'Ambulancias'],
    estado: 'ACTIVO'
  },
  {
    id: '9',
    nombre: 'Hospital Fernando Vélez Paiz',
    codigo_establecimiento: 'HFVP001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Villa Venezuela, Managua',
    telefono: '+505 2248-9900',
    coordenadas: { latitud: 12.127778, longitud: -86.298611 },
    capacidad_camas: 200,
    especialidades: ['Medicina Interna', 'Geriatría', 'Medicina General', 'Cardiología', 'Neumología'],
    servicios: ['Urgencias', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },
  {
    id: '10',
    nombre: 'Hospital Escuela César Amador Molina',
    codigo_establecimiento: 'HECAM001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Carretera Norte, Managua',
    telefono: '+505 2233-4455',
    coordenadas: { latitud: 12.166667, longitud: -86.283333 },
    capacidad_camas: 180,
    especialidades: ['Dermatología', 'Infectología', 'Medicina General', 'Medicina Interna'],
    servicios: ['Urgencias', 'Laboratorio', 'Imagenología', 'Farmacia', 'Docencia'],
    estado: 'ACTIVO'
  },
  {
    id: '11',
    nombre: 'Hospital Enrique Bolaños',
    codigo_establecimiento: 'HEB001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'II',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Distrito VI, Managua',
    telefono: '+505 2244-5566',
    coordenadas: { latitud: 12.105556, longitud: -86.263889 },
    capacidad_camas: 100,
    especialidades: ['Medicina General', 'Pediatría', 'Emergencias'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Farmacia'],
    estado: 'ACTIVO'
  },
  {
    id: '12',
    nombre: 'Hospital Lenin Fonseca',
    codigo_establecimiento: 'HLF001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'IV',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Barrio Ducualí, Managua',
    telefono: '+505 2222-6677',
    coordenadas: { latitud: 12.126389, longitud: -86.263889 },
    capacidad_camas: 300,
    especialidades: ['Emergencias', 'Traumatología', 'Cirugía General', 'Medicina General', 'Medicina Interna'],
    servicios: ['UCI', 'Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia', 'Ambulancias'],
    estado: 'ACTIVO'
  },
  {
    id: '13',
    nombre: 'Hospital de la Mujer Bertha Calderón',
    codigo_establecimiento: 'HMBC001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Ciudad Sandino',
    departamento: 'Managua',
    direccion: 'Ciudad Sandino, Managua',
    telefono: '+505 2269-8800',
    coordenadas: { latitud: 12.158333, longitud: -86.341667 },
    capacidad_camas: 150,
    especialidades: ['Ginecología', 'Obstetricia', 'Pediatría', 'Neonatología'],
    servicios: ['UCI Neonatal', 'Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },
  {
    id: '14',
    nombre: 'Hospital Infantil Manuel de Jesús Rivera (La Mascota)',
    codigo_establecimiento: 'HIMJR001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'IV',
    municipio: 'Managua',
    departamento: 'Managua',
    direccion: 'Barrio Ducualí, Managua',
    telefono: '+505 2222-7788',
    coordenadas: { latitud: 12.128056, longitud: -86.265278 },
    capacidad_camas: 200,
    especialidades: ['Pediatría', 'Neonatología', 'Cirugía Pediátrica', 'Cardiología Pediátrica', 'Oncología Pediátrica'],
    servicios: ['UCI Pediátrica', 'UCI Neonatal', 'Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // LEÓN
  {
    id: '15',
    nombre: 'Hospital Escuela Oscar Danilo Rosales Argüello (HEODRA)',
    codigo_establecimiento: 'HEODR001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'IV',
    municipio: 'León',
    departamento: 'León',
    direccion: 'León Centro, León',
    telefono: '+505 2311-2200',
    coordenadas: { latitud: 12.433333, longitud: -86.883333 },
    capacidad_camas: 350,
    especialidades: ['Medicina General', 'Medicina Interna', 'Traumatología', 'Cirugía General', 'Cardiología', 'Neurología', 'Emergencias'],
    servicios: ['UCI', 'Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia', 'Ambulancias', 'Docencia'],
    estado: 'ACTIVO'
  },
  {
    id: '16',
    nombre: 'Hospital San Vicente',
    codigo_establecimiento: 'HSV001',
    tipo: 'PRIVADO',
    nivel_complejidad: 'II',
    municipio: 'León',
    departamento: 'León',
    direccion: 'León Centro, León',
    telefono: '+505 2311-5500',
    coordenadas: { latitud: 12.431111, longitud: -86.881111 },
    capacidad_camas: 80,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Cardiología'],
    servicios: ['Urgencias', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // GRANADA
  {
    id: '17',
    nombre: 'Hospital San Juan de Dios',
    codigo_establecimiento: 'HSJD001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Granada',
    departamento: 'Granada',
    direccion: 'Granada Centro, Granada',
    telefono: '+505 2552-2778',
    coordenadas: { latitud: 11.933333, longitud: -85.95 },
    capacidad_camas: 150,
    especialidades: ['Pediatría', 'Ginecología', 'Medicina General', 'Emergencias', 'Cirugía General'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },
  {
    id: '18',
    nombre: 'Hospital Cocibolca',
    codigo_establecimiento: 'HC001',
    tipo: 'PRIVADO',
    nivel_complejidad: 'II',
    municipio: 'Granada',
    departamento: 'Granada',
    direccion: 'Granada, Granada',
    telefono: '+505 2552-4000',
    coordenadas: { latitud: 11.931111, longitud: -85.948889 },
    capacidad_camas: 60,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología'],
    servicios: ['Urgencias', 'Laboratorio', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // MASAYA
  {
    id: '19',
    nombre: 'Hospital Humberto Alvarado Vásquez',
    codigo_establecimiento: 'HHAV001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Masaya',
    departamento: 'Masaya',
    direccion: 'Masaya Centro, Masaya',
    telefono: '+505 2522-2789',
    coordenadas: { latitud: 11.966667, longitud: -86.1 },
    capacidad_camas: 120,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Emergencias', 'Medicina Interna'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // CHINANDEGA
  {
    id: '20',
    nombre: 'Hospital España',
    codigo_establecimiento: 'HE001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Chinandega',
    departamento: 'Chinandega',
    direccion: 'Chinandega Centro, Chinandega',
    telefono: '+505 2341-2345',
    coordenadas: { latitud: 12.628889, longitud: -87.128889 },
    capacidad_camas: 140,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Emergencias', 'Medicina Interna'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // ESTELÍ
  {
    id: '21',
    nombre: 'Hospital San Juan de Dios de Estelí',
    codigo_establecimiento: 'HSJDE001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Estelí',
    departamento: 'Estelí',
    direccion: 'Estelí Centro, Estelí',
    telefono: '+505 2713-2301',
    coordenadas: { latitud: 13.091667, longitud: -86.356944 },
    capacidad_camas: 130,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Emergencias', 'Medicina Interna'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // MATAGALPA
  {
    id: '22',
    nombre: 'Hospital César Amador Molina',
    codigo_establecimiento: 'HCAM001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Matagalpa',
    departamento: 'Matagalpa',
    direccion: 'Matagalpa Centro, Matagalpa',
    telefono: '+505 2772-3920',
    coordenadas: { latitud: 12.925, longitud: -85.917222 },
    capacidad_camas: 150,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Emergencias', 'Medicina Interna'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // JINOTEGA
  {
    id: '23',
    nombre: 'Hospital Dr. Guillermo Díaz González',
    codigo_establecimiento: 'HGDG001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'II',
    municipio: 'Jinotega',
    departamento: 'Jinotega',
    direccion: 'Jinotega Centro, Jinotega',
    telefono: '+505 2782-2491',
    coordenadas: { latitud: 13.091667, longitud: -86.001944 },
    capacidad_camas: 100,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Emergencias'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // JUIGALPA
  {
    id: '24',
    nombre: 'Hospital Asunción de Juigalpa',
    codigo_establecimiento: 'HAJ001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'II',
    municipio: 'Juigalpa',
    departamento: 'Chontales',
    direccion: 'Juigalpa Centro, Chontales',
    telefono: '+505 2512-2359',
    coordenadas: { latitud: 12.1, longitud: -85.366667 },
    capacidad_camas: 80,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Emergencias'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Farmacia'],
    estado: 'ACTIVO'
  },

  // BLUEFIELDS
  {
    id: '25',
    nombre: 'Hospital Ernesto Sequeira Blanco',
    codigo_establecimiento: 'HESB001',
    tipo: 'PUBLICO',
    nivel_complejidad: 'III',
    municipio: 'Bluefields',
    departamento: 'RACCS',
    direccion: 'Bluefields Centro, RACCS',
    telefono: '+505 2572-2391',
    coordenadas: { latitud: 12.01, longitud: -83.766667 },
    capacidad_camas: 120,
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Emergencias', 'Medicina Interna'],
    servicios: ['Urgencias 24h', 'Laboratorio', 'Imagenología', 'Farmacia'],
    estado: 'ACTIVO'
  }
];

// Funciones de utilidad para trabajar con los datos
export const getDepartamentoPorCodigo = (codigo: string): Departamento | undefined => {
  return departamentos.find(dept => dept.codigo === codigo);
};

export const getMunicipiosPorDepartamento = (departamentoId: number): Municipio[] => {
  const departamento = departamentos.find(dept => dept.id === departamentoId);
  return departamento ? departamento.municipios : [];
};

export const getHospitalesPorMunicipio = (municipio: string): Hospital[] => {
  return hospitales.filter(hospital => hospital.municipio === municipio);
};

export const getHospitalesPorDepartamento = (departamento: string): Hospital[] => {
  return hospitales.filter(hospital => hospital.departamento === departamento);
};

export const getHospitalesPorTipo = (tipo: 'PUBLICO' | 'PRIVADO' | 'MIXTO'): Hospital[] => {
  return hospitales.filter(hospital => hospital.tipo === tipo);
};

export const getHospitalesPorEspecialidad = (especialidad: string): Hospital[] => {
  return hospitales.filter(hospital => 
    hospital.especialidades.some(esp => 
      esp.toLowerCase().includes(especialidad.toLowerCase())
    )
  );
};

export const getEspecialidadPorCodigo = (codigo: string): Especialidad | undefined => {
  return especialidades.find(esp => esp.codigo === codigo);
};

export const buscarHospitales = (termino: string): Hospital[] => {
  const terminoLower = termino.toLowerCase();
  return hospitales.filter(hospital => 
    hospital.nombre.toLowerCase().includes(terminoLower) ||
    hospital.municipio.toLowerCase().includes(terminoLower) ||
    hospital.departamento.toLowerCase().includes(terminoLower) ||
    hospital.especialidades.some(esp => esp.toLowerCase().includes(terminoLower))
  );
};

// Datos estadísticos
export const estadisticasGenerales = {
  totalHospitales: hospitales.length,
  hospitalesPublicos: hospitales.filter(h => h.tipo === 'PUBLICO').length,
  hospitalesPrivados: hospitales.filter(h => h.tipo === 'PRIVADO').length,
  totalCapacidadCamas: hospitales.reduce((total, h) => total + h.capacidad_camas, 0),
  departamentosConHospitales: [...new Set(hospitales.map(h => h.departamento))].length,
  municipiosConHospitales: [...new Set(hospitales.map(h => h.municipio))].length,
  especialidadesDisponibles: especialidades.length
};

export default {
  departamentos,
  hospitales,
  especialidades,
  getDepartamentoPorCodigo,
  getMunicipiosPorDepartamento,
  getHospitalesPorMunicipio,
  getHospitalesPorDepartamento,
  getHospitalesPorTipo,
  getHospitalesPorEspecialidad,
  getEspecialidadPorCodigo,
  buscarHospitales,
  estadisticasGenerales
};