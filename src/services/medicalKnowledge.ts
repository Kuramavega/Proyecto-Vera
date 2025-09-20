// Base de conocimiento médico para el asistente AI
export interface MedicalCondition {
  name: string;
  symptoms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  recommendations: string[];
  relatedSpecialties: string[];
  commonTreatments: string[];
  description: string;
  causes: string[];
  prevention: string[];
  complications?: string[];
}

export interface MedicalSpecialist {
  name: string;
  specialty: string;
  hospital: string;
  description: string;
  commonConditions: string[];
  availability: string;
  experience: string;
}

export interface Hospital {
  name: string;
  address: string;
  phone: string;
  specialties: string[];
  emergencyServices: boolean;
  description: string;
  workingHours: string;
  equipment: string[];
}

export interface DrugInteraction {
  medications: string[];
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
}

export interface SymptomAnalysis {
  symptom: string;
  possibleCauses: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  homeCareTips: string[];
  whenToSeekHelp: string[];
  relatedSymptoms: string[];
}

// Hospitales en Managua, Nicaragua - Expandido con más hospitales públicos
export const hospitals: Hospital[] = [
  {
    name: 'Hospital Bertha Calderón Roque',
    address: 'Barrio Edgard Lang, Carretera Norte, Managua',
    phone: '+505 2233-1111',
    specialties: [
      'Ginecología', 'Obstetricia', 'Neonatología', 'Pediatría',
      'Medicina Materno-Infantil', 'Cirugía General', 'Anestesiología'
    ],
    emergencyServices: true,
    description: 'Hospital público especializado en salud materno-infantil, referente nacional',
    workingHours: '24/7 para emergencias y partos, consultas 7:00 AM - 5:00 PM',
    equipment: ['UCI Neonatal', 'Sala de Partos', 'Incubadoras', 'Quirófanos', 'Rayos X', 'Ultrasonido']
  },
  {
    name: 'Hospital Manolo Morales',
    address: 'Barrio Venezuela, Managua',
    phone: '+505 2233-2222',
    specialties: [
      'Medicina Interna', 'Cirugía General', 'Emergencias', 'Cardiología',
      'Neurología', 'Gastroenterología', 'Neumología', 'Hematología'
    ],
    emergencyServices: true,
    description: 'Hospital público de referencia nacional, especializado en medicina interna',
    workingHours: '24/7 para emergencias, consultas 7:00 AM - 4:00 PM',
    equipment: ['UCI', 'Quirófanos', 'Laboratorio Clínico', 'Rayos X', 'Tomografía', 'Electrocardiografía']
  },
  {
    name: 'Hospital Nacional Rosales',
    address: 'Barrio Larreynaga, Managua',
    phone: '+505 2233-3333',
    specialties: [
      'Cardiología', 'Neurología', 'Medicina General', 'Cirugía Cardiovascular',
      'Electrofisiología', 'Hemodinamia', 'Medicina Crítica'
    ],
    emergencyServices: true,
    description: 'Hospital público especializado en cardiología y neurología',
    workingHours: '24/7 para emergencias, consultas 7:00 AM - 4:00 PM',
    equipment: ['Cateterismo Cardíaco', 'Ecocardiografía', 'Holter', 'UCI Cardíaca', 'Quirófanos']
  },
  {
    name: 'Hospital Militar Dr. Alejandro Dávila Bolaños',
    address: 'Barrio San Judas, Managua',
    phone: '+505 2222-2949',
    specialties: [
      'Medicina General', 'Cirugía General', 'Traumatología', 'Ortopedia',
      'Medicina Interna', 'Pediatría', 'Ginecología', 'Oftalmología'
    ],
    emergencyServices: true,
    description: 'Hospital público militar con atención abierta al público',
    workingHours: '24/7 para emergencias, consultas 7:00 AM - 5:00 PM',
    equipment: ['Rayos X', 'Laboratorio', 'Quirófanos', 'UCI', 'Tomografía']
  },
  {
    name: 'Hospital Roberto Huembes',
    address: 'Distrito VI, Managua',
    phone: '+505 2244-1234',
    specialties: [
      'Medicina General', 'Pediatría', 'Ginecología', 'Medicina Interna',
      'Cirugía General', 'Dermatología', 'Oftalmología'
    ],
    emergencyServices: true,
    description: 'Hospital público de atención primaria y secundaria',
    workingHours: '24/7 para emergencias, consultas 7:00 AM - 4:00 PM',
    equipment: ['Rayos X', 'Laboratorio Básico', 'Quirófano', 'Sala de Partos']
  },
  {
    name: 'Hospital Amistad Japón-Nicaragua',
    address: 'Carretera Masaya, Km 14.5, Managua',
    phone: '+505 2278-4000',
    specialties: [
      'Medicina General', 'Pediatría', 'Ginecología', 'Medicina Interna',
      'Cirugía General', 'Anestesiología', 'Radiología'
    ],
    emergencyServices: true,
    description: 'Hospital público semi-privado con moderna infraestructura',
    workingHours: '24/7 para emergencias, consultas 7:00 AM - 5:00 PM',
    equipment: ['Tomografía', 'Rayos X Digital', 'Laboratorio', 'Quirófanos', 'UCI']
  },
  {
    name: 'Hospital Metropolitano Vivian Pellas',
    address: 'Carretera a Masaya, Km 9.8, Managua',
    phone: '+505 2255-8000',
    specialties: [
      'Cardiología', 'Neurología', 'Oncología', 'Ginecología', 'Pediatría',
      'Cirugía General', 'Medicina Interna', 'Traumatología', 'Urología',
      'Oftalmología', 'Dermatología', 'Endocrinología', 'Neurocirugía'
    ],
    emergencyServices: true,
    description: 'Hospital privado de alta complejidad con tecnología de vanguardia',
    workingHours: '24/7 para emergencias, consultas 7:00 AM - 8:00 PM',
    equipment: ['Resonancia Magnética', 'Tomografía', 'Cateterismo Cardíaco', 'Cirugía Robótica']
  },
  {
    name: 'Hospital Bautista',
    address: 'Barrio Largaespada, Managua',
    phone: '+505 2249-1010',
    specialties: [
      'Medicina General', 'Cardiología', 'Ginecología', 'Pediatría',
      'Cirugía General', 'Traumatología', 'Medicina Interna', 'Neurología'
    ],
    emergencyServices: true,
    description: 'Hospital privado con tradición en atención médica de calidad',
    workingHours: '24/7 para emergencias, consultas 6:00 AM - 6:00 PM',
    equipment: ['Rayos X', 'Ultrasonido', 'Laboratorio Clínico', 'Quirófanos']
  },
  {
    name: 'Hospital Alemán Nicaragüense',
    address: 'Km 9.5 Carretera Sur, Managua',
    phone: '+505 2289-4700',
    specialties: [
      'Medicina General', 'Ginecología', 'Dermatología', 'Oftalmología',
      'Pediatría', 'Cardiología', 'Cirugía General'
    ],
    emergencyServices: true,
    description: 'Hospital privado con enfoque en especialidades médicas',
    workingHours: '6:30 AM - 9:00 PM, emergencias 24/7',
    equipment: ['Laboratorio', 'Rayos X', 'Ultrasonido', 'Quirófanos']
  }
];

// Especialistas médicos expandido - Hospitales públicos y privados de Managua
export const medicalSpecialists: MedicalSpecialist[] = [
  // Hospital Bertha Calderón Roque (Público)
  {
    name: 'Dra. Ana Herrera',
    specialty: 'Ginecología',
    hospital: 'Hospital Bertha Calderón Roque',
    description: 'Ginecóloga especializada en salud reproductiva y obstetricia',
    commonConditions: ['Control Prenatal', 'Infecciones Ginecológicas', 'Planificación Familiar', 'Parto'],
    availability: 'Lunes a Viernes 8:00 AM - 4:00 PM',
    experience: '10 años de experiencia en gineco-obstetricia'
  },
  {
    name: 'Dr. Fernando Castillo',
    specialty: 'Pediatría',
    hospital: 'Hospital Bertha Calderón Roque',
    description: 'Pediatra especializado en neonatología y cuidados intensivos pediátricos',
    commonConditions: ['Recién Nacidos', 'Prematuros', 'Infecciones Neonatales', 'Desarrollo Infantil'],
    availability: 'Lunes a Viernes 7:00 AM - 3:00 PM',
    experience: '8 años de experiencia en pediatría y neonatología'
  },
  
  // Hospital Manolo Morales (Público)
  {
    name: 'Dr. Eduardo Morales',
    specialty: 'Medicina Interna',
    hospital: 'Hospital Manolo Morales',
    description: 'Internista especializado en enfermedades crónicas y medicina hospitalaria',
    commonConditions: ['Diabetes', 'Hipertensión', 'Insuficiencia Renal', 'Enfermedades Hepáticas'],
    availability: 'Lunes a Viernes 7:00 AM - 2:00 PM',
    experience: '16 años de experiencia en medicina interna'
  },
  {
    name: 'Dra. Patricia Vega',
    specialty: 'Cardiología',
    hospital: 'Hospital Manolo Morales',
    description: 'Cardióloga especializada en ecocardiografía y medicina preventiva',
    commonConditions: ['Hipertensión', 'Insuficiencia Cardíaca', 'Valvulopatías', 'Prevención Cardiovascular'],
    availability: 'Martes a Sábado 8:00 AM - 3:00 PM',
    experience: '12 años de experiencia en cardiología'
  },
  {
    name: 'Dr. Miguel Hernández',
    specialty: 'Neurología',
    hospital: 'Hospital Manolo Morales',
    description: 'Neurólogo especializado en epilepsia y trastornos del movimiento',
    commonConditions: ['Epilepsia', 'Migraña', 'Parkinson', 'Demencias'],
    availability: 'Lunes, Miércoles y Viernes 8:00 AM - 2:00 PM',
    experience: '14 años de experiencia en neurología'
  },
  
  // Hospital Nacional Rosales (Público)
  {
    name: 'Dr. Carlos Mendoza',
    specialty: 'Cardiología',
    hospital: 'Hospital Nacional Rosales',
    description: 'Cardiólogo especialista en hemodinamia y cateterismo cardíaco',
    commonConditions: ['Infarto', 'Angina de Pecho', 'Arritmias', 'Cateterismo Cardíaco'],
    availability: 'Lunes a Viernes 8:00 AM - 4:00 PM',
    experience: '15 años de experiencia, Subespecialidad en Hemodinámica'
  },
  {
    name: 'Dr. Roberto Silva',
    specialty: 'Neurología',
    hospital: 'Hospital Nacional Rosales',
    description: 'Neurólogo especializado en accidentes cerebrovasculares y neurofisiología',
    commonConditions: ['Accidente Cerebrovascular', 'Epilepsia', 'Migraña', 'Neuropatías'],
    availability: 'Martes y Jueves 9:00 AM - 5:00 PM',
    experience: '18 años de experiencia, Subespecialidad en Neurofisiología'
  },
  
  // Hospital Militar (Público)
  {
    name: 'Dr. Luis Ramírez',
    specialty: 'Traumatología',
    hospital: 'Hospital Militar Dr. Alejandro Dávila Bolaños',
    description: 'Traumatólogo especialista en cirugía ortopédica y deportiva',
    commonConditions: ['Fracturas', 'Lesiones Deportivas', 'Artritis', 'Hernias Discales'],
    availability: 'Lunes, Miércoles y Viernes 7:00 AM - 2:00 PM',
    experience: '14 años de experiencia en traumatología'
  },
  {
    name: 'Dra. Carmen López',
    specialty: 'Medicina General',
    hospital: 'Hospital Militar Dr. Alejandro Dávila Bolaños',
    description: 'Médico general especializado en medicina familiar y atención primaria',
    commonConditions: ['Hipertensión', 'Diabetes', 'Infecciones Respiratorias', 'Control de Salud'],
    availability: 'Lunes a Viernes 7:00 AM - 3:00 PM',
    experience: '9 años de experiencia en medicina general'
  },
  
  // Hospital Roberto Huembes (Público)
  {
    name: 'Dr. Jaime Rodríguez',
    specialty: 'Pediatría',
    hospital: 'Hospital Roberto Huembes',
    description: 'Pediatra especializado en enfermedades infectocontagiosas infantiles',
    commonConditions: ['Dengue Infantil', 'Diarreas', 'Infecciones Respiratorias', 'Vacunación'],
    availability: 'Lunes a Viernes 7:00 AM - 2:00 PM',
    experience: '11 años de experiencia en pediatría'
  },
  {
    name: 'Dra. Sofía Martínez',
    specialty: 'Ginecología',
    hospital: 'Hospital Roberto Huembes',
    description: 'Ginecóloga especializada en planificación familiar y salud reproductiva',
    commonConditions: ['Planificación Familiar', 'Infecciones Ginecológicas', 'Papanicolaou', 'Menopausia'],
    availability: 'Martes a Sábado 8:00 AM - 3:00 PM',
    experience: '7 años de experiencia en ginecología'
  },
  
  // Hospital Amistad Japón-Nicaragua (Semi-privado)
  {
    name: 'Dr. Alejandro Núñez',
    specialty: 'Medicina Interna',
    hospital: 'Hospital Amistad Japón-Nicaragua',
    description: 'Internista especializado en medicina preventiva y enfermedades crónicas',
    commonConditions: ['Diabetes', 'Hipertensión', 'Dislipidemia', 'Síndrome Metabólico'],
    availability: 'Lunes a Viernes 8:00 AM - 4:00 PM',
    experience: '13 años de experiencia en medicina interna'
  },
  
  // Hospital Metropolitano Vivian Pellas (Privado)
  {
    name: 'Dr. Rafael Aguilar',
    specialty: 'Neurología',
    hospital: 'Hospital Metropolitano Vivian Pellas',
    description: 'Neurólogo especializado en neurocirugía y trastornos complejos del SNC',
    commonConditions: ['Tumores Cerebrales', 'Hidrocefalia', 'Traumatismo Craneal', 'Neurocirugía'],
    availability: 'Lunes a Viernes 9:00 AM - 6:00 PM',
    experience: '20 años de experiencia, Subespecialidad en Neurocirugía'
  },
  {
    name: 'Dra. Isabella Moreno',
    specialty: 'Cardiología',
    hospital: 'Hospital Metropolitano Vivian Pellas',
    description: 'Cardióloga pediátrica especializada en cardiopatías congénitas',
    commonConditions: ['Cardiopatías Congénitas', 'Soplos Cardíacos', 'Arritmias Pediátricas'],
    availability: 'Martes a Viernes 8:00 AM - 5:00 PM',
    experience: '10 años de experiencia en cardiología pediátrica'
  },
  
  // Hospital Bautista (Privado)
  {
    name: 'Dra. María González',
    specialty: 'Pediatría',
    hospital: 'Hospital Bautista',
    description: 'Pediatra con especialización en enfermedades respiratorias infantiles',
    commonConditions: ['Asma Infantil', 'Neumonía', 'Bronquitis', 'Desarrollo Infantil'],
    availability: 'Lunes a Sábado 7:00 AM - 3:00 PM',
    experience: '12 años de experiencia en pediatría'
  },
  {
    name: 'Dr. Octavio Herrera',
    specialty: 'Neurología',
    hospital: 'Hospital Bautista',
    description: 'Neurólogo especializado en cefaleas y trastornos del sueño',
    commonConditions: ['Migraña', 'Cefalea Tensional', 'Insomnio', 'Apnea del Sueño'],
    availability: 'Lunes, Miércoles y Viernes 2:00 PM - 7:00 PM',
    experience: '16 años de experiencia en neurología'
  },
  
  // Hospital Alemán Nicaragüense (Privado)
  {
    name: 'Dr. Hans Mueller',
    specialty: 'Dermatología',
    hospital: 'Hospital Alemán Nicaragüense',
    description: 'Dermatólogo especializado en dermatología clínica y estética',
    commonConditions: ['Acné', 'Dermatitis', 'Psoriasis', 'Cáncer de Piel'],
    availability: 'Martes a Sábado 9:00 AM - 5:00 PM',
    experience: '15 años de experiencia en dermatología'
  },
  {
    name: 'Dra. Claudia Schmidt',
    specialty: 'Oftalmología',
    hospital: 'Hospital Alemán Nicaragüense',
    description: 'Oftalmóloga especializada en cirugía refractiva y cataratas',
    commonConditions: ['Cataratas', 'Glaucoma', 'Miopía', 'Retinopatía Diabética'],
    availability: 'Lunes a Viernes 8:00 AM - 4:00 PM',
    experience: '11 años de experiencia en oftalmología'
  }
];

// Condiciones médicas comunes en Nicaragua
export const medicalConditions: MedicalCondition[] = [
  {
    name: 'Hipertensión Arterial',
    symptoms: ['dolor de cabeza', 'mareos', 'visión borrosa', 'palpitaciones', 'fatiga'],
    urgencyLevel: 'medium',
    description: 'Presión arterial elevada que puede causar complicaciones serias si no se trata',
    causes: ['Obesidad', 'Sedentarismo', 'Estrés', 'Consumo excesivo de sal', 'Genética'],
    prevention: ['Dieta baja en sodio', 'Ejercicio regular', 'Control de peso', 'Evitar alcohol'],
    recommendations: [
      'Controlar la presión arterial regularmente',
      'Reducir el consumo de sal a menos de 6g diarios',
      'Ejercicio aeróbico 30 min, 5 días a la semana',
      'Tomar medicación según prescripción médica',
      'Evitar el estrés y practicar técnicas de relajación'
    ],
    relatedSpecialties: ['Cardiología', 'Medicina Interna', 'Nefrología'],
    commonTreatments: ['Losartán', 'Amlodipino', 'Enalapril', 'Hidroclorotiazida'],
    complications: ['Infarto', 'Accidente cerebrovascular', 'Insuficiencia renal']
  },
  {
    name: 'Diabetes Mellitus Tipo 2',
    symptoms: ['sed excesiva', 'orina frecuente', 'fatiga', 'visión borrosa', 'hambre excesiva', 'heridas que sanan lento'],
    urgencyLevel: 'medium',
    description: 'Enfermedad metabólica caracterizada por niveles altos de glucosa en sangre',
    causes: ['Resistencia a la insulina', 'Obesidad', 'Sedentarismo', 'Genética', 'Edad'],
    prevention: ['Mantener peso saludable', 'Ejercicio regular', 'Dieta balanceada', 'Evitar azúcares refinados'],
    recommendations: [
      'Controlar glucosa en sangre diariamente',
      'Dieta con índice glucémico bajo',
      'Ejercicio 150 min por semana',
      'Tomar medicación según horarios estrictos',
      'Control médico cada 3 meses'
    ],
    relatedSpecialties: ['Endocrinología', 'Medicina Interna', 'Nutrición'],
    commonTreatments: ['Metformina', 'Insulina', 'Glibenclamida', 'Empagliflozina'],
    complications: ['Neuropatía', 'Retinopatía', 'Nefropatía', 'Pie diabético']
  },
  {
    name: 'Dengue',
    symptoms: ['fiebre alta súbita', 'dolor de cabeza intenso', 'dolor detrás de los ojos', 'dolor muscular', 'náuseas', 'erupciones'],
    urgencyLevel: 'high',
    description: 'Enfermedad viral transmitida por mosquitos Aedes aegypti, común en Nicaragua',
    causes: ['Picadura de mosquito Aedes aegypti infectado'],
    prevention: ['Eliminar criaderos de mosquitos', 'Usar repelente', 'Ropa manga larga', 'Mantener recipientes tapados'],
    recommendations: [
      'Hidratación abundante con suero oral',
      'Reposo absoluto en cama',
      'Paracetamol para fiebre (NUNCA aspirina)',
      'Monitoreo médico constante',
      'Vigilar signos de alarma: sangrado, dolor abdominal severo'
    ],
    relatedSpecialties: ['Medicina Interna', 'Infectología', 'Medicina de Emergencias'],
    commonTreatments: ['Paracetamol', 'Suero oral', 'Hidratación intravenosa'],
    complications: ['Dengue hemorrágico', 'Shock por dengue', 'Insuficiencia orgánica']
  },
  {
    name: 'Gastroenteritis Aguda',
    symptoms: ['diarrea', 'vómitos', 'dolor abdominal', 'fiebre', 'deshidratación', 'náuseas'],
    urgencyLevel: 'medium',
    description: 'Inflamación del tracto gastrointestinal, común en época lluviosa',
    causes: ['Virus', 'Bacterias', 'Parásitos', 'Alimentos contaminados', 'Agua no potable'],
    prevention: ['Lavado frecuente de manos', 'Consumir agua potable', 'Alimentos bien cocidos', 'Higiene alimentaria'],
    recommendations: [
      'Hidratación con suero oral',
      'Dieta blanda: arroz, plátano, manzana',
      'Evitar lácteos temporalmente',
      'Probióticos para restaurar flora intestinal'
    ],
    relatedSpecialties: ['Gastroenterología', 'Medicina General', 'Pediatría'],
    commonTreatments: ['Suero oral', 'Probióticos', 'Loperamida (en casos específicos)'],
    complications: ['Deshidratación severa', 'Desequilibrio electrolítico']
  },
  {
    name: 'Infarto Agudo de Miocardio',
    symptoms: ['dolor de pecho intenso', 'dolor en brazo izquierdo', 'sudoración profusa', 'náuseas', 'dificultad respiratoria', 'mareos'],
    urgencyLevel: 'urgent',
    description: 'Emergencia médica por obstrucción de arterias coronarias',
    causes: ['Aterosclerosis', 'Trombosis', 'Hipertensión', 'Diabetes', 'Tabaquismo'],
    prevention: ['Ejercicio regular', 'Dieta saludable', 'No fumar', 'Control de factores de riesgo'],
    recommendations: [
      '🚨 LLAMAR 911 INMEDIATAMENTE',
      'Aspirina 300mg si no hay contraindicaciones',
      'Reposo absoluto hasta llegada de ambulancia',
      'NO manejar al hospital',
      'Aflojarse la ropa apretada'
    ],
    relatedSpecialties: ['Cardiología', 'Medicina de Emergencias', 'Cuidados Intensivos'],
    commonTreatments: ['Aspirina', 'Clopidogrel', 'Estatinas', 'Betabloqueadores'],
    complications: ['Muerte súbita', 'Insuficiencia cardíaca', 'Arritmias']
  },
  {
    name: 'Asma Bronquial',
    symptoms: ['dificultad respiratoria', 'silbidos en el pecho', 'tos seca', 'opresión en el pecho', 'fatiga'],
    urgencyLevel: 'medium',
    description: 'Enfermedad respiratoria crónica caracterizada por inflamación de vías aéreas',
    causes: ['Alérgenos', 'Ejercicio', 'Estrés', 'Infecciones respiratorias', 'Contaminación'],
    prevention: ['Evitar alérgenos conocidos', 'Mantener casa libre de polvo', 'Vacunación antigripal'],
    recommendations: [
      'Usar inhalador según prescripción',
      'Identificar y evitar desencadenantes',
      'Plan de acción para crisis asmáticas',
      'Control médico regular'
    ],
    relatedSpecialties: ['Neumología', 'Alergología', 'Medicina Interna'],
    commonTreatments: ['Salbutamol', 'Beclometasona', 'Prednisolona', 'Montelukast'],
    complications: ['Estado asmático', 'Insuficiencia respiratoria']
  }
];

// Análisis de síntomas expandido
export const symptomAnalysis: SymptomAnalysis[] = [
  {
    symptom: 'dolor de cabeza',
    possibleCauses: ['Tensión muscular', 'Migraña', 'Hipertensión', 'Deshidratación', 'Sinusitis', 'Estrés'],
    urgencyLevel: 'low',
    homeCareTips: [
      'Descansar en lugar oscuro y silencioso',
      'Aplicar compresas frías en frente y sienes',
      'Hidratarse con agua abundante',
      'Masaje suave en cuello y hombros',
      'Paracetamol 500mg cada 8 horas según necesidad'
    ],
    whenToSeekHelp: [
      'Dolor súbito e intenso tipo "trueno"',
      'Acompañado de fiebre alta y rigidez de cuello',
      'Cambios en la visión o pérdida de consciencia',
      'Dolor persistente por más de 3 días',
      'Empeoramiento progresivo'
    ],
    relatedSymptoms: ['náuseas', 'vómitos', 'sensibilidad a la luz', 'mareos']
  },
  {
    symptom: 'fiebre',
    possibleCauses: ['Infección viral', 'Infección bacteriana', 'Dengue', 'Malaria', 'COVID-19'],
    urgencyLevel: 'medium',
    homeCareTips: [
      'Hidratación abundante: agua, sueros, jugos naturales',
      'Reposo en cama',
      'Paños húmedos en frente y muñecas',
      'Paracetamol 500mg cada 6 horas',
      'Ropa ligera y ambiente fresco'
    ],
    whenToSeekHelp: [
      'Fiebre mayor a 39°C que no baja con medicamentos',
      'Persistencia por más de 3 días',
      'Dificultad respiratoria',
      'Erupciones en la piel',
      'Signos de deshidratación'
    ],
    relatedSymptoms: ['escalofríos', 'sudoración', 'dolor de cabeza', 'malestar general']
  },
  {
    symptom: 'dolor de pecho',
    possibleCauses: ['Angina de pecho', 'Infarto', 'Reflujo gastroesofágico', 'Ansiedad', 'Problemas musculares'],
    urgencyLevel: 'high',
    homeCareTips: [
      'Suspender toda actividad física inmediatamente',
      'Sentarse o recostarse en posición cómoda',
      'Respiración profunda y pausada',
      'Aflojar ropa apretada'
    ],
    whenToSeekHelp: [
      'Dolor intenso, aplastante o como "presión"',
      'Irradiación a brazo izquierdo, mandíbula o espalda',
      'Sudoración profusa',
      'Náuseas o mareos asociados',
      '🚨 BUSCAR ATENCIÓN INMEDIATA - LLAMAR 911'
    ],
    relatedSymptoms: ['sudoración', 'náuseas', 'dificultad respiratoria', 'mareos']
  },
  {
    symptom: 'diarrea',
    possibleCauses: ['Gastroenteritis viral', 'Intoxicación alimentaria', 'Estrés', 'Medicamentos', 'Síndrome intestino irritable'],
    urgencyLevel: 'medium',
    homeCareTips: [
      'Hidratación constante con suero oral',
      'Dieta BRAT: plátano, arroz, manzana, tostadas',
      'Evitar lácteos y comidas grasosas',
      'Probióticos para restaurar flora intestinal'
    ],
    whenToSeekHelp: [
      'Diarrea con sangre o moco',
      'Fiebre alta asociada',
      'Signos de deshidratación severa',
      'Duración mayor a 3 días',
      'Dolor abdominal severo'
    ],
    relatedSymptoms: ['dolor abdominal', 'náuseas', 'vómitos', 'fiebre']
  }
];

// Interacciones medicamentosas expandidas
export const drugInteractions: DrugInteraction[] = [
  {
    medications: ['Aspirina', 'Warfarina'],
    severity: 'severe',
    description: 'Aumenta significativamente el riesgo de sangrado gastrointestinal y cerebral',
    recommendation: 'NUNCA combinar sin supervisión médica estricta. Monitoreo de INR frecuente'
  },
  {
    medications: ['Paracetamol', 'Alcohol'],
    severity: 'moderate',
    description: 'Puede causar daño hepático severo, especialmente con uso crónico',
    recommendation: 'Evitar alcohol completamente mientras toma paracetamol'
  },
  {
    medications: ['Metformina', 'Contraste iodado'],
    severity: 'severe',
    description: 'Riesgo de acidosis láctica, especialmente en pacientes con problemas renales',
    recommendation: 'Suspender metformina 48 horas antes y después del contraste'
  },
  {
    medications: ['Losartán', 'Espironolactona'],
    severity: 'moderate',
    description: 'Puede causar hiperpotasemia (exceso de potasio en sangre)',
    recommendation: 'Monitoreo frecuente de potasio sérico'
  }
];

// Funciones de análisis mejoradas
export class MedicalKnowledgeEngine {
  
  static analyzeSymptoms(symptoms: string[]): {
    possibleConditions: MedicalCondition[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
    recommendations: string[];
    specialists: MedicalSpecialist[];
  } {
    const possibleConditions: MedicalCondition[] = [];
    let maxUrgency: 'low' | 'medium' | 'high' | 'urgent' = 'low';
    const specialists: MedicalSpecialist[] = [];
    
    for (const condition of medicalConditions) {
      const matchedSymptoms = symptoms.filter(symptom => 
        condition.symptoms.some(condSymptom => 
          condSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(condSymptom.toLowerCase())
        )
      );
      
      if (matchedSymptoms.length >= 1) {
        possibleConditions.push(condition);
        
        // Encontrar especialistas relacionados
        condition.relatedSpecialties.forEach(specialty => {
          const relatedSpecialists = medicalSpecialists.filter(s => 
            s.specialty.toLowerCase().includes(specialty.toLowerCase())
          );
          specialists.push(...relatedSpecialists);
        });
        
        // Actualizar nivel de urgencia máximo
        const urgencyLevels = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4 };
        if (urgencyLevels[condition.urgencyLevel] > urgencyLevels[maxUrgency]) {
          maxUrgency = condition.urgencyLevel;
        }
      }
    }
    
    // Generar recomendaciones específicas
    const recommendations = [];
    if (maxUrgency === 'urgent') {
      recommendations.push('🚨 EMERGENCIA MÉDICA - Buscar atención inmediata');
      recommendations.push('Llamar al 911 o dirigirse al hospital más cercano');
      recommendations.push('No intentar automedicarse');
    } else if (maxUrgency === 'high') {
      recommendations.push('Consultar con médico en las próximas 2-4 horas');
      recommendations.push('Monitorear síntomas de cerca');
      recommendations.push('Preparar lista de medicamentos actuales');
    } else if (maxUrgency === 'medium') {
      recommendations.push('Agendar cita médica en 24-48 horas');
      recommendations.push('Seguir cuidados en casa apropiados');
      recommendations.push('Mantener registro de síntomas');
    } else {
      recommendations.push('Considerar cita médica si persisten los síntomas');
      recommendations.push('Cuidados en casa y observación');
      recommendations.push('Medidas preventivas generales');
    }
    
    return {
      possibleConditions: possibleConditions.slice(0, 3), // Top 3 condiciones
      urgencyLevel: maxUrgency,
      recommendations,
      specialists: [...new Set(specialists)].slice(0, 2) // Top 2 especialistas únicos
    };
  }
  
  static getSymptomAdvice(symptom: string): SymptomAnalysis | null {
    return symptomAnalysis.find(analysis => 
      analysis.symptom.toLowerCase().includes(symptom.toLowerCase()) ||
      symptom.toLowerCase().includes(analysis.symptom.toLowerCase())
    ) || null;
  }
  
  static checkDrugInteractions(medications: string[]): DrugInteraction[] {
    const interactions: DrugInteraction[] = [];
    
    for (const interaction of drugInteractions) {
      const hasAllMeds = interaction.medications.every(med =>
        medications.some(userMed => 
          userMed.toLowerCase().includes(med.toLowerCase()) ||
          med.toLowerCase().includes(userMed.toLowerCase())
        )
      );
      
      if (hasAllMeds) {
        interactions.push(interaction);
      }
    }
    
    return interactions;
  }
  
  static getSpecialtyRecommendation(symptoms: string[]): string {
    const analysis = this.analyzeSymptoms(symptoms);
    
    if (analysis.specialists.length > 0) {
      return analysis.specialists[0].specialty;
    }
    
    // Fallback basado en síntomas específicos - Expandido
    const symptomText = symptoms.join(' ').toLowerCase();
    
    // Neurología
    if (symptomText.includes('cabeza') || symptomText.includes('migraña') || symptomText.includes('dolor de cabeza') || 
        symptomText.includes('mareo') || symptomText.includes('convulsión') || symptomText.includes('epilepsia') ||
        symptomText.includes('pérdida de memoria') || symptomText.includes('temblor') || symptomText.includes('parkinson') ||
        symptomText.includes('accidente cerebrovascular') || symptomText.includes('neurológico') || symptomText.includes('ictus')) {
      return 'Neurología';
    }
    
    // Cardiología
    if (symptomText.includes('corazón') || symptomText.includes('pecho') || symptomText.includes('palpitaciones') ||
        symptomText.includes('arritmia') || symptomText.includes('hipertensión') || symptomText.includes('infarto') ||
        symptomText.includes('cardíaco') || symptomText.includes('cardiovascular')) {
      return 'Cardiología';
    }
    
    // Dermatología
    if (symptomText.includes('piel') || symptomText.includes('erupción') || symptomText.includes('alergia') ||
        symptomText.includes('acné') || symptomText.includes('dermatitis') || symptomText.includes('psoriasis') ||
        symptomText.includes('lunar') || symptomText.includes('mancha')) {
      return 'Dermatología';
    }
    
    // Oftalmología
    if (symptomText.includes('ojo') || symptomText.includes('visión') || symptomText.includes('ver') ||
        symptomText.includes('catarata') || symptomText.includes('glaucoma') || symptomText.includes('miopía') ||
        symptomText.includes('vista borrosa') || symptomText.includes('conjuntivitis')) {
      return 'Oftalmología';
    }
    
    // Ginecología
    if (symptomText.includes('embarazo') || symptomText.includes('menstruación') || symptomText.includes('ginecológico') ||
        symptomText.includes('útero') || symptomText.includes('ovario') || symptomText.includes('vaginal') ||
        symptomText.includes('prenatal') || symptomText.includes('parto')) {
      return 'Ginecología';
    }
    
    // Pediatría
    if (symptomText.includes('niño') || symptomText.includes('bebé') || symptomText.includes('pediátrico') ||
        symptomText.includes('infantil') || symptomText.includes('menor de edad') || symptomText.includes('adolescente')) {
      return 'Pediatría';
    }
    
    // Traumatología
    if (symptomText.includes('fractura') || symptomText.includes('hueso') || symptomText.includes('articulación') ||
        symptomText.includes('rodilla') || symptomText.includes('tobillo') || symptomText.includes('muñeca') ||
        symptomText.includes('espalda') || symptomText.includes('lumbar') || symptomText.includes('cervical')) {
      return 'Traumatología';
    }
    
    // Medicina Interna
    if (symptomText.includes('diabetes') || symptomText.includes('azúcar') || symptomText.includes('tiroides') ||
        symptomText.includes('riñón') || symptomText.includes('hígado') || symptomText.includes('endocrino')) {
      return 'Medicina Interna';
    }
    
    return 'Medicina General';
  }

  static findHospitalsBySpecialty(specialty: string): Hospital[] {
    return hospitals.filter(hospital => 
      hospital.specialties.some(s => 
        s.toLowerCase().includes(specialty.toLowerCase()) ||
        specialty.toLowerCase().includes(s.toLowerCase())
      )
    );
  }

  static getSpecialistsBySpecialty(specialty: string): MedicalSpecialist[] {
    return medicalSpecialists.filter(specialist =>
      specialist.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
      specialty.toLowerCase().includes(specialist.specialty.toLowerCase())
    );
  }

  static getEmergencyGuidance(): {
    numbers: { [key: string]: string };
    instructions: string[];
    redFlags: string[];
  } {
    return {
      numbers: {
        'Emergencias Generales': '911',
        'Bomberos': '911',
        'Policía': '118',
        'Cruz Roja': '+505 2265-0761'
      },
      instructions: [
        'Mantener la calma y evaluar la situación',
        'Asegurar la escena antes de acercarse',
        'Llamar al 911 y dar información clara',
        'No mover a la persona a menos que sea necesario',
        'Aplicar primeros auxilios básicos si sabe cómo'
      ],
      redFlags: [
        'Pérdida de consciencia',
        'Dificultad respiratoria severa',
        'Sangrado abundante',
        'Dolor de pecho intenso',
        'Signos de accidente cerebrovascular'
      ]
    };
  }
}

// Datos específicos de salud en Nicaragua
export const nicaraguanHealthContext = {
  commonDiseases: [
    'Dengue', 'Chikungunya', 'Zika', 'Hipertensión', 'Diabetes',
    'Gastroenteritis', 'Infecciones respiratorias', 'Malaria', 'Leptospirosis'
  ],
  seasonalConcerns: {
    'rainy': ['Dengue', 'Malaria', 'Leptospirosis', 'Gastroenteritis', 'Infecciones de la piel'],
    'dry': ['Infecciones respiratorias', 'Deshidratación', 'Conjuntivitis', 'Asma']
  },
  emergencyNumbers: {
    general: '911',
    fireAndRescue: '911',
    police: '118',
    redCross: '+505 2265-0761'
  },
  publicHealthRecommendations: [
    'Eliminar criaderos de mosquitos en patios y casas',
    'Usar repelente durante época lluviosa (mayo-octubre)',
    'Mantener hidratación adecuada, especialmente en época seca',
    'Vacunación según esquema nacional (sarampión, polio, BCG)',
    'Higiene de manos frecuente con agua y jabón',
    'Consumir agua potable o hervida',
    'Protegerse del sol con bloqueador solar',
    'Mantener ambientes ventilados durante época de calor'
  ],
  healthTips: {
    nutrition: [
      'Consumir frutas tropicales ricas en vitamina C (guayaba, naranja)',
      'Incluir frijoles rojos en la dieta diaria (proteína y hierro)',
      'Beber suficiente agua (8-10 vasos diarios)',
      'Limitar el consumo de gaseosas y comida frita'
    ],
    exercise: [
      'Ejercitarse en horas frescas (antes de 9 AM o después de 5 PM)',
      'Caminar 30 minutos diarios',
      'Actividades acuáticas para refrescarse',
      'Deportes en equipo populares: fútbol, béisbol'
    ]
  }
};