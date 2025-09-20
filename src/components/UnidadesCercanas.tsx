import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Navigation, 
  Filter,
  Search,
  Star,
  Clock,
  Stethoscope,
  Heart,
  Baby,
  Eye,
  Users,
  Zap,
  Wifi,
  Car,
  Shield,
  AlertCircle,
  Target,
  Route,
  Locate
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { hospitals } from '../services/medicalKnowledge';
import { InteractiveMap } from './InteractiveMap';
import { toast } from 'sonner@2.0.3';

interface Hospital {
  id: string;
  nombre: string;
  direccion: string;
  municipio: string;
  departamento: string;
  telefono: string;
  distancia?: number;
  rating: number;
  tiempoAtencion: string;
  especialidades: string[];
  servicios: string[];
  horario: {
    lunes_viernes: string;
    sabados: string;
    domingos: string;
    emergencias: string;
  };
  coordenadas: {
    lat: number;
    lng: number;
  };
  isEmergency?: boolean;
  hasParking?: boolean;
  hasWifi?: boolean;
  acceptsInsurance?: boolean;
}

interface UnidadesCercanasProps {
  onBack: () => void;
}

const mockHospitales: Hospital[] = [
  // Hospitales Públicos de Managua
  {
    id: '1',
    nombre: 'Hospital Bertha Calderón Roque',
    direccion: 'Barrio Edgard Lang, Carretera Norte',
    municipio: 'Managua',
    departamento: 'Managua',
    telefono: '2233-1111',
    distancia: 2.1,
    rating: 4.2,
    tiempoAtencion: '20-35 min',
    especialidades: ['Ginecología', 'Obstetricia', 'Pediatría', 'Neonatología', 'Medicina General'],
    servicios: ['Emergencias 24h', 'Maternidad', 'UCI Neonatal', 'Laboratorio', 'Quirófanos'],
    horario: {
      lunes_viernes: '07:00 - 17:00',
      sabados: '08:00 - 14:00',
      domingos: 'Solo emergencias',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.1142, lng: -86.2362 },
    isEmergency: true,
    hasParking: true,
    hasWifi: false,
    acceptsInsurance: true
  },
  {
    id: '2',
    nombre: 'Hospital Manolo Morales',
    direccion: 'Barrio Venezuela, Managua',
    municipio: 'Managua',
    departamento: 'Managua',
    telefono: '2233-2222',
    distancia: 2.8,
    rating: 4.0,
    tiempoAtencion: '25-45 min',
    especialidades: ['Medicina Interna', 'Cardiología', 'Neurología', 'Gastroenterología', 'Medicina General'],
    servicios: ['Emergencias 24h', 'UCI', 'Laboratorio', 'Tomografía', 'Quirófanos'],
    horario: {
      lunes_viernes: '07:00 - 16:00',
      sabados: '08:00 - 12:00',
      domingos: 'Solo emergencias',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.1385, lng: -86.2681 },
    isEmergency: true,
    hasParking: true,
    hasWifi: false,
    acceptsInsurance: true
  },
  {
    id: '3',
    nombre: 'Hospital Nacional Rosales',
    direccion: 'Barrio Larreynaga, Managua',
    municipio: 'Managua',
    departamento: 'Managua',
    telefono: '2233-3333',
    distancia: 3.2,
    rating: 3.8,
    tiempoAtencion: '30-50 min',
    especialidades: ['Cardiología', 'Neurología', 'Medicina General', 'Cirugía Cardiovascular'],
    servicios: ['Emergencias 24h', 'Cateterismo Cardíaco', 'UCI Cardíaca', 'Laboratorio'],
    horario: {
      lunes_viernes: '07:00 - 16:00',
      sabados: '08:00 - 12:00',
      domingos: 'Solo emergencias',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.1289, lng: -86.2504 },
    isEmergency: true,
    hasParking: true,
    hasWifi: false,
    acceptsInsurance: true
  },
  {
    id: '4',
    nombre: 'Hospital Militar Dr. Alejandro Dávila Bolaños',
    direccion: 'Barrio San Judas, Managua',
    municipio: 'Managua',
    departamento: 'Managua',
    telefono: '2222-2949',
    distancia: 3.5,
    rating: 3.9,
    tiempoAtencion: '20-40 min',
    especialidades: ['Medicina General', 'Traumatología', 'Cirugía General', 'Pediatría', 'Ginecología'],
    servicios: ['Emergencias 24h', 'Quirófanos', 'UCI', 'Laboratorio', 'Rayos X'],
    horario: {
      lunes_viernes: '07:00 - 17:00',
      sabados: '08:00 - 14:00',
      domingos: 'Solo emergencias',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.1150, lng: -86.2362 },
    isEmergency: true,
    hasParking: true,
    hasWifi: false,
    acceptsInsurance: true
  },
  {
    id: '5',
    nombre: 'Hospital Roberto Huembes',
    direccion: 'Distrito VI, Managua',
    municipio: 'Managua',
    departamento: 'Managua',
    telefono: '2244-1234',
    distancia: 4.1,
    rating: 3.6,
    tiempoAtencion: '30-60 min',
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Medicina Interna', 'Dermatología'],
    servicios: ['Emergencias 24h', 'Laboratorio', 'Rayos X', 'Quirófano'],
    horario: {
      lunes_viernes: '07:00 - 16:00',
      sabados: '08:00 - 12:00',
      domingos: 'Solo emergencias',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.1064, lng: -86.2504 },
    isEmergency: true,
    hasParking: false,
    hasWifi: false,
    acceptsInsurance: true
  },
  {
    id: '6',
    nombre: 'Hospital Amistad Japón-Nicaragua',
    direccion: 'Carretera Masaya, Km 14.5',
    municipio: 'Managua',
    departamento: 'Managua',
    telefono: '2278-4000',
    distancia: 4.8,
    rating: 4.1,
    tiempoAtencion: '15-30 min',
    especialidades: ['Medicina General', 'Pediatría', 'Medicina Interna', 'Ginecología', 'Cirugía General'],
    servicios: ['Emergencias 24h', 'Tomografía', 'UCI', 'Laboratorio', 'Quirófanos'],
    horario: {
      lunes_viernes: '07:00 - 17:00',
      sabados: '08:00 - 14:00',
      domingos: 'Solo emergencias',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.0847, lng: -86.2504 },
    isEmergency: true,
    hasParking: true,
    hasWifi: true,
    acceptsInsurance: true
  },

  // Hospitales Privados de Managua
  {
    id: '7',
    nombre: 'Hospital Metropolitano Vivian Pellas',
    direccion: 'Carretera a Masaya km 9.8',
    municipio: 'Managua',
    departamento: 'Managua',
    telefono: '2255-8000',
    distancia: 2.3,
    rating: 4.6,
    tiempoAtencion: '10-20 min',
    especialidades: ['Medicina General', 'Cardiología', 'Neurología', 'Oncología', 'Pediatría', 'Neurocirugía'],
    servicios: ['Emergencias 24h', 'Laboratorio', 'Imagenología', 'Cirugía Robótica', 'UCI'],
    horario: {
      lunes_viernes: '07:00 - 20:00',
      sabados: '08:00 - 18:00',
      domingos: '09:00 - 17:00',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.0682, lng: -86.1735 },
    isEmergency: true,
    hasParking: true,
    hasWifi: true,
    acceptsInsurance: true
  },
  {
    id: '8',
    nombre: 'Hospital Bautista',
    direccion: 'Barrio Largaespada, Managua',
    municipio: 'Managua',
    departamento: 'Managua',
    telefono: '2249-1010',
    distancia: 3.1,
    rating: 4.4,
    tiempoAtencion: '15-25 min',
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología', 'Cardiología', 'Neurología'],
    servicios: ['Emergencias 24h', 'Maternidad', 'Laboratorio', 'Farmacia', 'Quirófanos'],
    horario: {
      lunes_viernes: '06:00 - 18:00',
      sabados: '07:00 - 16:00',
      domingos: '08:00 - 14:00',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.1364, lng: -86.2514 },
    isEmergency: true,
    hasParking: true,
    hasWifi: true,
    acceptsInsurance: true
  },
  {
    id: '9',
    nombre: 'Hospital Alemán Nicaragüense',
    direccion: 'Km 9.5 Carretera Sur, Managua',
    municipio: 'Managua',
    departamento: 'Managua',
    telefono: '2289-4700',
    distancia: 4.2,
    rating: 4.3,
    tiempoAtencion: '10-20 min',
    especialidades: ['Medicina General', 'Ginecología', 'Dermatología', 'Oftalmología', 'Pediatría'],
    servicios: ['Emergencias 24h', 'Cirugía Ambulatoria', 'Laboratorio', 'Consulta Externa'],
    horario: {
      lunes_viernes: '06:30 - 21:00',
      sabados: '07:00 - 18:00',
      domingos: '08:00 - 16:00',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.1150, lng: -86.2362 },
    isEmergency: true,
    hasParking: true,
    hasWifi: true,
    acceptsInsurance: false
  },

  // Otros departamentos (próximamente)
  {
    id: '10',
    nombre: 'Hospital Escuela Oscar Danilo Rosales',
    direccion: 'Barrio Sutiaba, León',
    municipio: 'León',
    departamento: 'León',
    telefono: '2311-4271',
    distancia: 92.5,
    rating: 4.2,
    tiempoAtencion: '30-60 min',
    especialidades: ['Medicina General', 'Traumatología', 'Medicina Interna'],
    servicios: ['Emergencias 24h', 'Maternidad', 'Pediatría'],
    horario: {
      lunes_viernes: '07:00 - 17:00',
      sabados: '08:00 - 14:00',
      domingos: 'Solo emergencias',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 12.4333, lng: -86.8833 },
    isEmergency: true,
    hasParking: false,
    hasWifi: false,
    acceptsInsurance: true
  },
  {
    id: '11',
    nombre: 'Hospital San Juan de Dios',
    direccion: 'Costado Este del Parque Central, Granada',
    municipio: 'Granada',
    departamento: 'Granada',
    telefono: '2552-2778',
    distancia: 47.3,
    rating: 4.0,
    tiempoAtencion: '25-45 min',
    especialidades: ['Medicina General', 'Pediatría', 'Ginecología'],
    servicios: ['Emergencias', 'Laboratorio Básico'],
    horario: {
      lunes_viernes: '07:00 - 16:00',
      sabados: '08:00 - 12:00',
      domingos: 'Solo emergencias',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 11.9342, lng: -85.9553 },
    isEmergency: true,
    hasParking: false,
    hasWifi: false,
    acceptsInsurance: true
  },
  {
    id: '12',
    nombre: 'Hospital Regional Santiago de Jinotepe',
    direccion: 'Km 41.5 Carretera Masaya-Jinotepe',
    municipio: 'Jinotepe',
    departamento: 'Carazo',
    telefono: '2532-2609',
    distancia: 38.7,
    rating: 3.8,
    tiempoAtencion: '40-70 min',
    especialidades: ['Medicina General', 'Medicina Interna'],
    servicios: ['Emergencias', 'Maternidad'],
    horario: {
      lunes_viernes: '07:00 - 15:00',
      sabados: '08:00 - 12:00',
      domingos: 'Solo emergencias',
      emergencias: '24 horas'
    },
    coordenadas: { lat: 11.8456, lng: -86.1989 },
    isEmergency: true,
    hasParking: false,
    hasWifi: false,
    acceptsInsurance: true
  }
];

const departamentos = [
  'Todos',
  'Managua', 
  'León', 
  'Granada', 
  'Masaya', 
  'Carazo', 
  'Chinandega', 
  'Estelí', 
  'Matagalpa', 
  'Jinotega',
  'Nueva Segovia',
  'Madriz',
  'Boaco',
  'Chontales',
  'Río San Juan',
  'Rivas',
  'RACN',
  'RACS'
];

export function UnidadesCercanas({ onBack }: UnidadesCercanasProps) {
  const { t } = useLanguage();
  const [hospitales, setHospitales] = useState<Hospital[]>(mockHospitales);
  const [filteredHospitales, setFilteredHospitales] = useState<Hospital[]>(mockHospitales);
  const [searchTerm, setSearchTerm] = useState('');
  const [departamentoFilter, setDepartamentoFilter] = useState('Todos');
  const [especialidadFilter, setEspecialidadFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState('distancia');
  const [activeTab, setActiveTab] = useState('lista');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const especialidades = [
    'Todas',
    'Medicina General',
    'Cardiología',
    'Pediatría',
    'Ginecología',
    'Dermatología',
    'Oftalmología',
    'Neurología',
    'Oncología',
    'Traumatología',
    'Medicina Interna'
  ];

  // Función para calcular distancia entre dos coordenadas
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Función para obtener mensajes de error de geolocalización
  const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Acceso a la ubicación denegado o bloqueado por política de seguridad.";
      case error.POSITION_UNAVAILABLE:
        return "Información de ubicación no disponible. Verifica tu conexión y permisos.";
      case error.TIMEOUT:
        return "La solicitud de ubicación ha expirado. Intenta nuevamente.";
      default:
        return "Error desconocido al obtener la ubicación. Intenta nuevamente.";
    }
  };

  // Función para obtener ubicación actual
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        
        // Recalcular distancias para todos los hospitales
        const updatedHospitales = mockHospitales.map(hospital => ({
          ...hospital,
          distancia: parseFloat(calculateDistance(
            newLocation.lat, 
            newLocation.lng, 
            hospital.coordenadas.lat, 
            hospital.coordenadas.lng
          ).toFixed(1))
        }));
        
        setHospitales(updatedHospitales);
        setIsLoadingLocation(false);
        toast.success("Ubicación actualizada correctamente");
      },
      (error) => {
        const errorMessage = getGeolocationErrorMessage(error);
        console.warn('Error de geolocalización:', {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString()
        });
        
        setIsLoadingLocation(false);
        
        // Mostrar mensaje de error específico pero no alarmante
        if (error.code === error.PERMISSION_DENIED) {
          toast.info("Geolocalización no disponible. Usando ubicación por defecto en Managua centro.");
        } else {
          toast.error(errorMessage);
        }
        
        // Usar ubicación por defecto si no existe una
        if (!userLocation) {
          const defaultLocation = { lat: 12.1364, lng: -86.2514 };
          setUserLocation(defaultLocation);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000 // 1 minuto - reducido para mayor precisión
      }
    );
  };

  // Nueva función para seguimiento continuo de ubicación
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLoadingLocation(true);
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Actualizar ubicación del usuario
        setUserLocation(newLocation);
        
        // Recalcular distancias dinámicamente
        const updatedHospitales = mockHospitales.map(hospital => ({
          ...hospital,
          distancia: parseFloat(calculateDistance(
            newLocation.lat, 
            newLocation.lng, 
            hospital.coordenadas.lat, 
            hospital.coordenadas.lng
          ).toFixed(1))
        }));
        
        setHospitales(updatedHospitales);
        setIsLoadingLocation(false);
        
        // Solo mostrar el toast la primera vez
        if (isLoadingLocation) {
          toast.success("Seguimiento de ubicación activado");
        }
      },
      (error) => {
        const errorMessage = getGeolocationErrorMessage(error);
        console.error('Error de seguimiento de ubicación:', {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString()
        });
        
        toast.error(`Seguimiento falló: ${errorMessage}`);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000 // 30 segundos para seguimiento continuo
      }
    );

    // Guardar el ID del watch para poder limpiarlo después
    return watchId;
  };

  useEffect(() => {
    // Intentar obtener ubicación del usuario al cargar el componente
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          
          // Recalcular distancias para todos los hospitales con ubicación real
          const updatedHospitales = mockHospitales.map(hospital => ({
            ...hospital,
            distancia: parseFloat(calculateDistance(
              newLocation.lat, 
              newLocation.lng, 
              hospital.coordenadas.lat, 
              hospital.coordenadas.lng
            ).toFixed(1))
          }));
          
          setHospitales(updatedHospitales);
        },
        (error) => {
          // Usar ubicación por defecto (Managua centro) si falla la geolocalización
          const defaultLocation = { lat: 12.1364, lng: -86.2514 };
          setUserLocation(defaultLocation);
          
          // Solo registrar en consola para diagnóstico, no mostrar error al usuario
          console.info('Geolocalización no disponible en la carga inicial:', {
            code: error.code,
            message: error.message,
            note: 'Usando ubicación por defecto de Managua centro'
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 5000, // Reducir timeout para carga inicial
          maximumAge: 600000
        }
      );
    } else {
      // Si el navegador no soporta geolocalización
      const defaultLocation = { lat: 12.1364, lng: -86.2514 };
      setUserLocation(defaultLocation);
    }
  }, []);

  useEffect(() => {
    let filtered = hospitales;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(hospital => 
        hospital.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.especialidades.some(esp => esp.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por departamento
    if (departamentoFilter !== 'Todos') {
      filtered = filtered.filter(hospital => hospital.departamento === departamentoFilter);
    }

    // Filtrar por especialidad
    if (especialidadFilter !== 'Todas') {
      filtered = filtered.filter(hospital => 
        hospital.especialidades.includes(especialidadFilter)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distancia':
          return (a.distancia || 999) - (b.distancia || 999);
        case 'rating':
          return b.rating - a.rating;
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        default:
          return 0;
      }
    });

    setFilteredHospitales(filtered);
  }, [hospitales, searchTerm, departamentoFilter, especialidadFilter, sortBy]);

  const handleGetDirections = (hospital: Hospital) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.coordenadas.lat},${hospital.coordenadas.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(hospital.direccion + ', ' + hospital.municipio + ', Nicaragua')}`;
      window.open(url, '_blank');
    }
  };

  const HospitalCard = ({ hospital }: { hospital: Hospital }) => {
    const isOutsideManagua = hospital.departamento !== 'Managua';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-lg">{hospital.nombre}</h3>
                  {hospital.isEmergency && (
                    <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-0">
                      <AlertCircle className="size-3 mr-1" />
                      24h
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="size-4 mr-1" />
                  {hospital.direccion}, {hospital.municipio}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Star className="size-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{hospital.rating}</span>
                  </div>
                  {hospital.distancia && (
                    <div className="flex items-center text-muted-foreground">
                      <Navigation className="size-4 mr-1" />
                      {hospital.distancia} km
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="size-4 mr-1" />
                    {hospital.tiempoAtencion}
                  </div>
                </div>
              </div>
            </div>

            {/* Especialidades */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Especialidades:</h4>
              <div className="flex flex-wrap gap-1">
                {hospital.especialidades.slice(0, 4).map((especialidad, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {especialidad}
                  </Badge>
                ))}
                {hospital.especialidades.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{hospital.especialidades.length - 4} más
                  </Badge>
                )}
              </div>
            </div>

            {/* Servicios */}
            <div className="mb-4">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {hospital.hasParking && (
                  <div className="flex items-center">
                    <Car className="size-3 mr-1" />
                    Parking
                  </div>
                )}
                {hospital.hasWifi && (
                  <div className="flex items-center">
                    <Wifi className="size-3 mr-1" />
                    WiFi
                  </div>
                )}
                {hospital.acceptsInsurance && (
                  <div className="flex items-center">
                    <Shield className="size-3 mr-1" />
                    Seguros
                  </div>
                )}
              </div>
            </div>

            {/* Horarios */}
            <div className="mb-4 text-xs">
              <span className="text-muted-foreground">Horario: </span>
              <span>{hospital.horario.lunes_viernes}</span>
              {hospital.isEmergency && (
                <span className="text-red-600 dark:text-red-400 ml-2">• Emergencias 24h</span>
              )}
            </div>

            {isOutsideManagua && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="size-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                      Servicio próximamente
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      Las citas en {hospital.departamento} estarán disponibles próximamente. 
                      Por ahora solo puedes ver información y contactar directamente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedHospital(hospital)}
                >
                  Ver Detalles
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGetDirections(hospital)}
                >
                  <Navigation className="size-4 mr-1" />
                  Direcciones
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${hospital.telefono}`, '_self')}
                >
                  <Phone className="size-4 mr-1" />
                  Llamar
                </Button>
                
                {!isOutsideManagua && (
                  <Button
                    size="sm"
                    onClick={() => {/* Función para agendar cita */}}
                  >
                    <Stethoscope className="size-4 mr-1" />
                    Agendar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="size-4 mr-2" />
                Volver
              </Button>
              <h1 className="ml-4 text-xl font-semibold">Hospitales Cercanos</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="text-xs"
              >
                {isLoadingLocation ? (
                  <Target className="size-4 mr-2 animate-spin" />
                ) : (
                  <Locate className="size-4 mr-2" />
                )}
                {isLoadingLocation ? 'Localizando...' : 'Mi Ubicación'}
              </Button>
              
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                {filteredHospitales.length} hospitales
              </Badge>
            </div>
          </div>
          
          {/* Indicador de ubicación */}
          {userLocation && (
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <MapPin className="size-3 mr-1" />
              <span>
                Ubicación: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Banner informativo sobre geolocalización */}
        {!userLocation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="size-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Ubicación no disponible
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                      La geolocalización está deshabilitada o no es compatible. Mostrando hospitales en Managua centro como referencia.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isLoadingLocation}
                      className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      {isLoadingLocation ? (
                        <Target className="size-3 mr-1 animate-spin" />
                      ) : (
                        <Locate className="size-3 mr-1" />
                      )}
                      Intentar nuevamente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    placeholder="Buscar hospitales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map(depto => (
                      <SelectItem key={depto} value={depto}>
                        {depto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={especialidadFilter} onValueChange={setEspecialidadFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidades.map(esp => (
                      <SelectItem key={esp} value={esp}>
                        {esp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distancia">Distancia</SelectItem>
                    <SelectItem value="rating">Calificación</SelectItem>
                    <SelectItem value="nombre">Nombre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contenido principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="lista">Lista de Hospitales</TabsTrigger>
              <TabsTrigger value="mapa">Vista de Mapa</TabsTrigger>
            </TabsList>

            <TabsContent value="lista">
              {filteredHospitales.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No se encontraron hospitales
                  </h3>
                  <p className="text-muted-foreground">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHospitales.map((hospital, index) => (
                    <motion.div
                      key={hospital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <HospitalCard hospital={hospital} />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="mapa">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                  <InteractiveMap
                    hospitals={filteredHospitales}
                    userLocation={userLocation}
                    selectedHospital={selectedHospital}
                    onHospitalSelect={setSelectedHospital}
                    onGetDirections={handleGetDirections}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Estadísticas rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 w-12 h-12 mx-auto mb-2">
                <MapPin className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold">{mockHospitales.length}</div>
              <div className="text-sm text-muted-foreground">Hospitales</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3 w-12 h-12 mx-auto mb-2">
                <AlertCircle className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold">
                {mockHospitales.filter(h => h.isEmergency).length}
              </div>
              <div className="text-sm text-muted-foreground">Emergencias 24h</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 w-12 h-12 mx-auto mb-2">
                <Stethoscope className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm text-muted-foreground">Especialidades</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3 w-12 h-12 mx-auto mb-2">
                <Star className="size-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold">4.5</div>
              <div className="text-sm text-muted-foreground">Calificación Prom.</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}