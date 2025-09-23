import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, MapPin, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Hospital, Doctor } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { registrarActividad } from '../hooks/useHealthIndex';

interface SolicitarCitaProps {
  onBack: () => void;
}

// Hospitales de Managua actualizados con especialidades completas
const mockHospitales: Hospital[] = [
  // Hospitales Públicos de Managua - Disponibles
  {
    id: '1',
    nombre: 'Hospital Bertha Calderón Roque',
    direccion: 'Barrio Edgard Lang, Carretera Norte',
    municipio: 'Managua',
    telefono: '2233-1111',
    coordenadas: { lat: 12.1142, lng: -86.2362 },
    servicios: ['Ginecología', 'Obstetricia', 'Pediatría', 'Neonatología', 'Medicina General', 'Cirugía General'],
    tipo: 'Público'
  },
  {
    id: '2',
    nombre: 'Hospital Manolo Morales',
    direccion: 'Barrio Venezuela, Managua',
    municipio: 'Managua',
    telefono: '2233-2222',
    coordenadas: { lat: 12.1385, lng: -86.2681 },
    servicios: ['Medicina Interna', 'Cardiología', 'Neurología', 'Gastroenterología', 'Neumología', 'Medicina General'],
    tipo: 'Público'
  },
  {
    id: '3',
    nombre: 'Hospital Nacional Rosales',
    direccion: 'Barrio Larreynaga, Managua',
    municipio: 'Managua',
    telefono: '2233-3333',
    coordenadas: { lat: 12.1289, lng: -86.2504 },
    servicios: ['Cardiología', 'Neurología', 'Medicina General', 'Cirugía Cardiovascular', 'Medicina Crítica'],
    tipo: 'Público'
  },
  {
    id: '4',
    nombre: 'Hospital Militar Dr. Alejandro Dávila Bolaños',
    direccion: 'Barrio San Judas, Managua',
    municipio: 'Managua',
    telefono: '2222-2949',
    coordenadas: { lat: 12.1150, lng: -86.2362 },
    servicios: ['Medicina General', 'Traumatología', 'Cirugía General', 'Pediatría', 'Ginecología', 'Oftalmología'],
    tipo: 'Público'
  },
  {
    id: '5',
    nombre: 'Hospital Roberto Huembes',
    direccion: 'Distrito VI, Managua',
    municipio: 'Managua',
    telefono: '2244-1234',
    coordenadas: { lat: 12.1064, lng: -86.2504 },
    servicios: ['Medicina General', 'Pediatría', 'Ginecología', 'Medicina Interna', 'Dermatología', 'Oftalmología'],
    tipo: 'Público'
  },
  {
    id: '6',
    nombre: 'Hospital Amistad Japón-Nicaragua',
    direccion: 'Carretera Masaya, Km 14.5',
    municipio: 'Managua',
    telefono: '2278-4000',
    coordenadas: { lat: 12.0847, lng: -86.2504 },
    servicios: ['Medicina General', 'Pediatría', 'Ginecología', 'Medicina Interna', 'Cirugía General'],
    tipo: 'Semi-privado'
  },

  // Hospitales Privados de Managua - Disponibles
  {
    id: '7',
    nombre: 'Hospital Metropolitano Vivian Pellas',
    direccion: 'Carretera a Masaya km 9.8',
    municipio: 'Managua',
    telefono: '2255-8000',
    coordenadas: { lat: 12.0682, lng: -86.1735 },
    servicios: ['Medicina General', 'Pediatría', 'Ginecología', 'Cardiología', 'Dermatología', 'Neurología', 'Oncología', 'Oftalmología'],
    tipo: 'Privado'
  },
  {
    id: '8',
    nombre: 'Hospital Bautista',
    direccion: 'Barrio Largaespada, Managua',
    municipio: 'Managua', 
    telefono: '2249-1010',
    coordenadas: { lat: 12.1364, lng: -86.2514 },
    servicios: ['Medicina General', 'Pediatría', 'Oftalmología', 'Cardiología', 'Neurología', 'Ginecología'],
    tipo: 'Privado'
  },
  {
    id: '9',
    nombre: 'Hospital Alemán Nicaragüense',
    direccion: 'Km 9.5 Carretera Sur, Managua',
    municipio: 'Managua',
    telefono: '2289-4700',
    coordenadas: { lat: 12.1150, lng: -86.2362 },
    servicios: ['Medicina General', 'Ginecología', 'Dermatología', 'Oftalmología', 'Pediatría', 'Cardiología'],
    tipo: 'Privado'
  },

  // Otros departamentos - Próximamente
  {
    id: '10',
    nombre: 'Hospital Escuela Oscar Danilo Rosales',
    direccion: 'Barrio Sutiaba, León',
    municipio: 'León',
    telefono: '2311-4271',
    coordenadas: { lat: 12.4333, lng: -86.8833 },
    servicios: ['Medicina General', 'Traumatología', 'Medicina Interna']
  },
  {
    id: '11',
    nombre: 'Hospital San Juan de Dios',
    direccion: 'Costado Este del Parque Central, Granada',
    municipio: 'Granada',
    telefono: '2552-2778',
    coordenadas: { lat: 11.9342, lng: -85.9553 },
    servicios: ['Medicina General', 'Pediatría', 'Ginecología']
  }
];

const mockDoctores: Doctor[] = [
  // Hospital Bertha Calderón Roque (Público)
  {
    id: '1',
    nombre: 'Dra. Ana Herrera',
    especialidad: 'Ginecología',
    hospitalId: '1',
    disponible: true,
    horarios: 'Lunes a Viernes 8:00 AM - 4:00 PM'
  },
  {
    id: '2',
    nombre: 'Dr. Fernando Castillo',
    especialidad: 'Pediatría',
    hospitalId: '1',
    disponible: true,
    horarios: 'Lunes a Viernes 7:00 AM - 3:00 PM'
  },
  {
    id: '3',
    nombre: 'Dr. José Martínez',
    especialidad: 'Medicina General',
    hospitalId: '1',
    disponible: true,
    horarios: 'Lunes a Viernes 7:00 AM - 3:00 PM'
  },

  // Hospital Manolo Morales (Público)
  {
    id: '4',
    nombre: 'Dr. Eduardo Morales',
    especialidad: 'Medicina Interna',
    hospitalId: '2',
    disponible: true,
    horarios: 'Lunes a Viernes 7:00 AM - 2:00 PM'
  },
  {
    id: '5',
    nombre: 'Dra. Patricia Vega',
    especialidad: 'Cardiología',
    hospitalId: '2',
    disponible: true,
    horarios: 'Martes a Sábado 8:00 AM - 3:00 PM'
  },
  {
    id: '6',
    nombre: 'Dr. Miguel Hernández',
    especialidad: 'Neurología',
    hospitalId: '2',
    disponible: true,
    horarios: 'Lunes, Miércoles y Viernes 8:00 AM - 2:00 PM'
  },
  {
    id: '7',
    nombre: 'Dr. Alejandro Torres',
    especialidad: 'Medicina General',
    hospitalId: '2',
    disponible: true,
    horarios: 'Lunes a Viernes 7:00 AM - 3:00 PM'
  },

  // Hospital Nacional Rosales (Público)
  {
    id: '8',
    nombre: 'Dr. Carlos Mendoza',
    especialidad: 'Cardiología',
    hospitalId: '3',
    disponible: true,
    horarios: 'Lunes a Viernes 8:00 AM - 4:00 PM'
  },
  {
    id: '9',
    nombre: 'Dr. Roberto Silva',
    especialidad: 'Neurología',
    hospitalId: '3',
    disponible: true,
    horarios: 'Martes y Jueves 9:00 AM - 5:00 PM'
  },
  {
    id: '10',
    nombre: 'Dr. Manuel Rosales',
    especialidad: 'Medicina General',
    hospitalId: '3',
    disponible: true,
    horarios: 'Lunes a Viernes 7:00 AM - 3:00 PM'
  },

  // Hospital Militar (Público)
  {
    id: '11',
    nombre: 'Dr. Luis Ramírez',
    especialidad: 'Traumatología',
    hospitalId: '4',
    disponible: true,
    horarios: 'Lunes, Miércoles y Viernes 7:00 AM - 2:00 PM'
  },
  {
    id: '12',
    nombre: 'Dra. Carmen López',
    especialidad: 'Medicina General',
    hospitalId: '4',
    disponible: true,
    horarios: 'Lunes a Viernes 7:00 AM - 3:00 PM'
  },
  {
    id: '13',
    nombre: 'Dr. Antonio Ruiz',
    especialidad: 'Pediatría',
    hospitalId: '4',
    disponible: true,
    horarios: 'Martes a Sábado 8:00 AM - 3:00 PM'
  },

  // Hospital Roberto Huembes (Público)
  {
    id: '14',
    nombre: 'Dr. Jaime Rodríguez',
    especialidad: 'Pediatría',
    hospitalId: '5',
    disponible: true,
    horarios: 'Lunes a Viernes 7:00 AM - 2:00 PM'
  },
  {
    id: '15',
    nombre: 'Dra. Sofía Martínez',
    especialidad: 'Ginecología',
    hospitalId: '5',
    disponible: true,
    horarios: 'Martes a Sábado 8:00 AM - 3:00 PM'
  },
  {
    id: '16',
    nombre: 'Dr. Ricardo Vargas',
    especialidad: 'Medicina General',
    hospitalId: '5',
    disponible: true,
    horarios: 'Lunes a Viernes 7:00 AM - 4:00 PM'
  },

  // Hospital Amistad Japón-Nicaragua (Semi-privado)
  {
    id: '17',
    nombre: 'Dr. Alejandro Núñez',
    especialidad: 'Medicina Interna',
    hospitalId: '6',
    disponible: true,
    horarios: 'Lunes a Viernes 8:00 AM - 4:00 PM'
  },
  {
    id: '18',
    nombre: 'Dra. Yolanda Reyes',
    especialidad: 'Pediatría',
    hospitalId: '6',
    disponible: true,
    horarios: 'Lunes a Viernes 8:00 AM - 3:00 PM'
  },

  // Hospital Metropolitano Vivian Pellas (Privado)
  {
    id: '19',
    nombre: 'Dr. Rafael Aguilar',
    especialidad: 'Neurología',
    hospitalId: '7',
    disponible: true,
    horarios: 'Lunes a Viernes 9:00 AM - 6:00 PM'
  },
  {
    id: '20',
    nombre: 'Dra. Isabella Moreno',
    especialidad: 'Cardiología',
    hospitalId: '7',
    disponible: true,
    horarios: 'Martes a Viernes 8:00 AM - 5:00 PM'
  },
  {
    id: '21',
    nombre: 'Dr. Gabriel Rueda',
    especialidad: 'Pediatría',
    hospitalId: '7',
    disponible: true,
    horarios: 'Lunes a Sábado 8:00 AM - 5:00 PM'
  },
  {
    id: '22',
    nombre: 'Dra. Valeria Contreras',
    especialidad: 'Ginecología',
    hospitalId: '7',
    disponible: true,
    horarios: 'Lunes a Viernes 8:00 AM - 6:00 PM'
  },

  // Hospital Bautista (Privado)
  {
    id: '23',
    nombre: 'Dra. María González',
    especialidad: 'Pediatría',
    hospitalId: '8',
    disponible: true,
    horarios: 'Lunes a Sábado 7:00 AM - 3:00 PM'
  },
  {
    id: '24',
    nombre: 'Dr. Octavio Herrera',
    especialidad: 'Neurología',
    hospitalId: '8',
    disponible: true,
    horarios: 'Lunes, Miércoles y Viernes 2:00 PM - 7:00 PM'
  },
  {
    id: '25',
    nombre: 'Dr. Fernando Bautista',
    especialidad: 'Cardiología',
    hospitalId: '8',
    disponible: true,
    horarios: 'Martes a Viernes 8:00 AM - 4:00 PM'
  },

  // Hospital Alemán Nicaragüense (Privado)
  {
    id: '26',
    nombre: 'Dr. Hans Mueller',
    especialidad: 'Dermatología',
    hospitalId: '9',
    disponible: true,
    horarios: 'Martes a Sábado 9:00 AM - 5:00 PM'
  },
  {
    id: '27',
    nombre: 'Dra. Claudia Schmidt',
    especialidad: 'Oftalmología',
    hospitalId: '9',
    disponible: true,
    horarios: 'Lunes a Viernes 8:00 AM - 4:00 PM'
  },
  {
    id: '28',
    nombre: 'Dr. Wolfgang Weber',
    especialidad: 'Medicina General',
    hospitalId: '9',
    disponible: true,
    horarios: 'Lunes a Viernes 7:00 AM - 5:00 PM'
  }
];

// Departamentos de Nicaragua
const departamentos = [
  { id: 'managua', nombre: 'Managua', disponible: true },
  { id: 'leon', nombre: 'León', disponible: false },
  { id: 'granada', nombre: 'Granada', disponible: false },
  { id: 'masaya', nombre: 'Masaya', disponible: false },
  { id: 'carazo', nombre: 'Carazo', disponible: false },
  { id: 'chinandega', nombre: 'Chinandega', disponible: false },
  { id: 'esteli', nombre: 'Estelí', disponible: false },
  { id: 'matagalpa', nombre: 'Matagalpa', disponible: false },
  { id: 'jinotega', nombre: 'Jinotega', disponible: false },
  { id: 'nueva-segovia', nombre: 'Nueva Segovia', disponible: false },
  { id: 'madriz', nombre: 'Madriz', disponible: false },
  { id: 'boaco', nombre: 'Boaco', disponible: false },
  { id: 'chontales', nombre: 'Chontales', disponible: false },
  { id: 'rio-san-juan', nombre: 'Río San Juan', disponible: false },
  { id: 'rivas', nombre: 'Rivas', disponible: false },
  { id: 'racn', nombre: 'RACN', disponible: false },
  { id: 'racs', nombre: 'RACS', disponible: false }
];

export function SolicitarCita({ onBack }: SolicitarCitaProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    departamento: '',
    especialidad: '',
    hospitalId: '',
    doctorId: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  
  const [hospitalesFiltrados, setHospitalesFiltrados] = useState<Hospital[]>([]);
  const [doctoresFiltrados, setDoctoresFiltrados] = useState<Doctor[]>([]);
  const [horasDisponibles] = useState(['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const especialidades = [
    'Medicina General',
    'Medicina Interna', 
    'Pediatría',
    'Ginecología',
    'Cardiología',
    'Neurología',
    'Dermatología',
    'Oftalmología',
    'Traumatología',
    'Cirugía General',
    'Obstetricia',
    'Neonatología',
    'Gastroenterología',
    'Neumología'
  ];

  // Obtener la fecha mínima (hoy) y máxima (6 meses adelante) para 2025
  const getDateLimits = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Si estamos en 2024, la fecha mínima es 1 enero 2025
    const minDate = currentYear < 2025 
      ? new Date(2025, 0, 1) 
      : today;
      
    const maxDate = new Date(2025, 11, 31); // 31 diciembre 2025
    
    return {
      min: minDate.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0]
    };
  };

  const { min: minDate, max: maxDate } = getDateLimits();

  useEffect(() => {
    if (formData.departamento) {
      const departamento = departamentos.find(d => d.id === formData.departamento);
      if (!departamento?.disponible) {
        setHospitalesFiltrados([]);
        return;
      }
      
      // Solo mostrar hospitales de Managua (disponibles)
      const hospitalesDelDepartamento = mockHospitales.filter(h => 
        h.municipio.toLowerCase() === departamento.nombre.toLowerCase()
      );
      
      if (formData.especialidad) {
        const hospitalesConEspecialidad = hospitalesDelDepartamento.filter(h => 
          h.servicios.includes(formData.especialidad)
        );
        setHospitalesFiltrados(hospitalesConEspecialidad);
      } else {
        setHospitalesFiltrados(hospitalesDelDepartamento);
      }
    } else {
      setHospitalesFiltrados([]);
    }
  }, [formData.departamento, formData.especialidad]);

  useEffect(() => {
    if (formData.hospitalId && formData.especialidad) {
      const doctores = mockDoctores.filter(d => 
        d.hospitalId === formData.hospitalId && 
        d.especialidad === formData.especialidad
      );
      setDoctoresFiltrados(doctores);
    } else {
      setDoctoresFiltrados([]);
    }
  }, [formData.hospitalId, formData.especialidad]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular proceso de envío
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
      
      // Registrar la actividad de agendar cita
      registrarActividad('cita_agendada', {
        especialidad: selectedEspecialidad,
        hospital: selectedHospital,
        motivo: selectedRazon
      });
      
      toast.success('¡Cita solicitada exitosamente!');
    }, 2000);
  };

  const canProceedToStep2 = formData.departamento && formData.especialidad && formData.hospitalId;
  const canProceedToStep3 = canProceedToStep2 && formData.doctorId;
  const canSubmit = canProceedToStep3 && formData.fecha && formData.hora;

  const isDepartamentoDisponible = () => {
    if (!formData.departamento) return true;
    const departamento = departamentos.find(d => d.id === formData.departamento);
    return departamento?.disponible || false;
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center space-y-6">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full size-20 flex items-center justify-center mx-auto">
              <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">{t('appointment.requested')}</h1>
              <p className="text-muted-foreground mt-2">
                {t('appointment.requestedDesc')}
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departamento:</span>
                    <span>{departamentos.find(d => d.id === formData.departamento)?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('appointment.specialty')}:</span>
                    <span>{formData.especialidad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('appointment.hospital')}:</span>
                    <span>{hospitalesFiltrados.find(h => h.id === formData.hospitalId)?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doctor:</span>
                    <span>{doctoresFiltrados.find(d => d.id === formData.doctorId)?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha y hora:</span>
                    <span>{formData.fecha} - {formData.hora}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={onBack} className="w-full">
                {t('appointment.backToHome')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('appointment.notifications')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="ml-2 font-semibold">{t('appointment.title')}</h1>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center mt-4 space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`size-8 rounded-full flex items-center justify-center text-sm ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step 1: Departamento, Especialidad y Hospital */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="size-5 mr-2" />
                {t('appointment.step1')}
              </CardTitle>
              <CardDescription>
                {t('appointment.step1Desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Departamento</Label>
                <Select 
                  value={formData.departamento}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    departamento: value, 
                    hospitalId: '', 
                    doctorId: '' 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((depto) => (
                      <SelectItem key={depto.id} value={depto.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{depto.nombre}</span>
                          {!depto.disponible && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Próximamente
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.departamento && !isDepartamentoDisponible() && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="size-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                          Servicio próximamente
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400">
                          Las citas en {departamentos.find(d => d.id === formData.departamento)?.nombre} estarán disponibles próximamente. 
                          Actualmente solo se pueden agendar citas en Managua.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('appointment.specialty')}</Label>
                <Select 
                  value={formData.especialidad}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, especialidad: value, hospitalId: '', doctorId: '' }))}
                  disabled={!formData.departamento}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('appointment.selectSpecialty')} />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidades.map((esp) => (
                      <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('appointment.hospital')}</Label>
                <div className="space-y-3">
                  {hospitalesFiltrados.map((hospital) => (
                    <Card 
                      key={hospital.id}
                      className={`cursor-pointer transition-all ${
                        formData.hospitalId === hospital.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      } ${!isDepartamentoDisponible() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (isDepartamentoDisponible()) {
                          setFormData(prev => ({ ...prev, hospitalId: hospital.id, doctorId: '' }));
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{hospital.nombre}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="size-4 mr-1" />
                              {hospital.direccion}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {hospital.municipio}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {hospital.servicios.map((servicio) => (
                            <Badge 
                              key={servicio} 
                              variant={servicio === formData.especialidad ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {servicio}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {formData.departamento && formData.especialidad && hospitalesFiltrados.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No hay hospitales disponibles para esta especialidad en el departamento seleccionado.</p>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!canProceedToStep2 || !isDepartamentoDisponible()}
                className="w-full"
              >
                {t('appointment.continue')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Doctor */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="size-5 mr-2" />
                {t('appointment.step2')}
              </CardTitle>
              <CardDescription>
                {t('appointment.step2Desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {doctoresFiltrados.map((doctor) => (
                  <Card 
                    key={doctor.id}
                    className={`cursor-pointer transition-all ${
                      formData.doctorId === doctor.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, doctorId: doctor.id }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{doctor.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{doctor.especialidad}</p>
                        </div>
                        <div className="flex items-center text-green-600">
                          <div className="size-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">{t('appointment.available')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  {t('appointment.back')}
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!canProceedToStep3}
                  className="flex-1"
                >
                  {t('appointment.continue')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Fecha, Hora y Motivo */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="size-5 mr-2" />
                {t('appointment.step3')}
              </CardTitle>
              <CardDescription>
                {t('appointment.step3Desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('appointment.preferredDate')}</Label>
                  <Input
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={formData.fecha}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                  />
                  <div className="text-xs text-muted-foreground">
                    Disponible del 1 enero al 31 diciembre 2025
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>{t('appointment.preferredTime')}</Label>
                  <Select 
                    value={formData.hora}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, hora: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('appointment.selectTime')} />
                    </SelectTrigger>
                    <SelectContent>
                      {horasDisponibles.map((hora) => (
                        <SelectItem key={hora} value={hora}>
                          <div className="flex items-center">
                            <Clock className="size-4 mr-2" />
                            {hora}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('appointment.reason')}</Label>
                <Textarea
                  placeholder={t('appointment.reasonPlaceholder')}
                  value={formData.motivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  {t('appointment.back')}
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!canSubmit || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full size-4 border-b-2 border-white mr-2"></div>
                      {t('appointment.sending')}
                    </>
                  ) : (
                    t('appointment.request')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}