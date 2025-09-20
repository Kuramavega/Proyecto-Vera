import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Locate,
  Target,
  Route,
  Star,
  Clock,
  AlertCircle,
  Stethoscope,
  Plus,
  Minus,
  RotateCcw,
  Navigation2,
  Crosshair,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
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
  tipo?: 'Público' | 'Privado' | 'Semi-privado';
}

interface InteractiveMapProps {
  hospitals: Hospital[];
  userLocation: { lat: number; lng: number } | null;
  selectedHospital: Hospital | null;
  onHospitalSelect: (hospital: Hospital) => void;
  onGetDirections: (hospital: Hospital) => void;
}

export function InteractiveMap({ 
  hospitals, 
  userLocation, 
  selectedHospital, 
  onHospitalSelect,
  onGetDirections 
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 12.1364, lng: -86.2514 });
  const [mapZoom, setMapZoom] = useState(11);
  const [showOverlays, setShowOverlays] = useState(true);
  const [isHospitalListExpanded, setIsHospitalListExpanded] = useState(false);

  // Función para calcular distancia entre dos puntos
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

  // Función para obtener ubicación en tiempo real
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLoadingLocation(true);
    setIsTrackingLocation(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setMapCenter(newLocation);
        setIsLoadingLocation(false);
        
        if (!isTrackingLocation) {
          toast.success("Seguimiento de ubicación activado");
        }
      },
      (error) => {
        console.error('Error de geolocalización:', error);
        setIsLoadingLocation(false);
        setIsTrackingLocation(false);
        
        let errorMessage = "Error al obtener la ubicación";
        let toastMessage = errorMessage;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permisos de ubicación denegados o bloqueados por política de seguridad";
            toastMessage = "No se pudo acceder a la ubicación. Usando ubicación por defecto en Managua.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible";
            toastMessage = "Ubicación no disponible. Usando ubicación por defecto.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado";
            toastMessage = "Tiempo de espera agotado. Usando ubicación por defecto.";
            break;
        }
        
        toast.error(toastMessage);
        
        // Usar ubicación por defecto de Managua
        const defaultLocation = { lat: 12.1364, lng: -86.2514 };
        setMapCenter(defaultLocation);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minuto
      }
    );

    setLocationWatchId(watchId);
  };

  // Función para parar el seguimiento de ubicación
  const stopLocationTracking = () => {
    if (locationWatchId !== null) {
      navigator.geolocation.clearWatch(locationWatchId);
      setLocationWatchId(null);
    }
    setIsTrackingLocation(false);
    toast.info("Seguimiento de ubicación desactivado");
  };

  // Función para manejar ubicación única
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      // Usar ubicación por defecto
      setMapCenter({ lat: 12.1364, lng: -86.2514 });
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setMapCenter(newLocation);
        setMapZoom(14);
        setIsLoadingLocation(false);
        toast.success("Ubicación actualizada");
      },
      (error) => {
        setIsLoadingLocation(false);
        let errorMessage = "Error al obtener la ubicación";
        let toastMessage = errorMessage;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permisos de ubicación denegados o bloqueados por política de seguridad";
            toastMessage = "No se pudo acceder a la ubicación. Centrando en Managua.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible";
            toastMessage = "Ubicación no disponible. Centrando en Managua.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado";
            toastMessage = "Tiempo de espera agotado. Centrando en Managua.";
            break;
        }
        
        toast.error(toastMessage);
        
        // Usar ubicación por defecto de Managua
        setMapCenter({ lat: 12.1364, lng: -86.2514 });
        setMapZoom(11);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  // Función para centrar en ubicación del usuario
  const centerOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(14);
    } else {
      toast.error("Ubicación del usuario no disponible");
    }
  };

  // Función para centrar en un hospital
  const centerOnHospital = (hospital: Hospital) => {
    onHospitalSelect(hospital);
    setMapCenter(hospital.coordenadas);
    setMapZoom(16);
  };

  // Función para resetear el mapa
  const resetMap = () => {
    setMapZoom(11);
    setMapCenter({ lat: 12.1364, lng: -86.2514 });
    onHospitalSelect(null);
  };

  // Función para abrir en Google Maps
  const openInGoogleMaps = () => {
    const hospitalsParams = hospitals.map(h => 
      `${h.coordenadas.lat},${h.coordenadas.lng}`
    ).join('|');
    
    let url = `https://www.google.com/maps/@${mapCenter.lat},${mapCenter.lng},${mapZoom}z`;
    
    if (userLocation) {
      url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/@${mapCenter.lat},${mapCenter.lng},${mapZoom}z`;
    }
    
    window.open(url, '_blank');
  };

  // Limpiar el watch de geolocalización al desmontar
  useEffect(() => {
    return () => {
      if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
      }
    };
  }, [locationWatchId]);

  // Actualizar centro del mapa cuando cambie userLocation
  useEffect(() => {
    if (userLocation && !selectedHospital) {
      setMapCenter(userLocation);
    }
  }, [userLocation, selectedHospital]);

  // Efecto para recargar el iframe cuando cambien las coordenadas o zoom
  useEffect(() => {
    if (mapRef.current) {
      const newUrl = createSimpleMapUrl();
      mapRef.current.src = newUrl;
    }
  }, [mapCenter, mapZoom, selectedHospital]);

  // Crear URL para Google Maps Embed
  const createMapUrl = () => {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // En producción, usar variable de entorno
    const center = `${mapCenter.lat},${mapCenter.lng}`;
    const zoom = mapZoom;
    
    // Crear marcadores para hospitales
    const markers = hospitals.map(hospital => {
      const color = hospital.isEmergency ? 'red' : 'blue';
      const label = hospital.isEmergency ? 'H' : 'M';
      return `markers=color:${color}%7Clabel:${label}%7C${hospital.coordenadas.lat},${hospital.coordenadas.lng}`;
    }).join('&');
    
    // Agregar marcador de usuario si existe
    const userMarker = userLocation ? 
      `&markers=color:green%7Clabel:U%7C${userLocation.lat},${userLocation.lng}` : '';
    
    return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${center}&zoom=${zoom}&${markers}${userMarker}`;
  };

  // Como no tenemos API key, usamos el modo de iframe simple con marcadores
  const createSimpleMapUrl = () => {
    const center = `${mapCenter.lat},${mapCenter.lng}`;
    const zoom = mapZoom;
    
    // Para el iframe básico sin API key
    let url = `https://maps.google.com/maps?q=${center}&z=${zoom}&output=embed`;
    
    // Si hay un hospital seleccionado, centramos en él con información
    if (selectedHospital) {
      const hospitalName = encodeURIComponent(selectedHospital.nombre);
      url = `https://maps.google.com/maps?q=${hospitalName}+${selectedHospital.coordenadas.lat},${selectedHospital.coordenadas.lng}&z=16&output=embed`;
    }
    
    return url;
  };

  const HospitalMarker = ({ hospital, isSelected }: { hospital: Hospital; isSelected: boolean }) => {
    const distance = userLocation ? 
      calculateDistance(userLocation.lat, userLocation.lng, hospital.coordenadas.lat, hospital.coordenadas.lng) : 
      null;

    return (
      <Card className={`border-0 shadow-lg w-64 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm">{hospital.nombre}</h3>
              <p className="text-xs text-muted-foreground">{hospital.direccion}</p>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Star className="size-3 text-yellow-500 mr-1" />
                <span>{hospital.rating}</span>
              </div>
              <div className="flex items-center">
                <Clock className="size-3 mr-1" />
                <span>{hospital.tiempoAtencion}</span>
              </div>
              {distance && (
                <div className="flex items-center">
                  <Navigation className="size-3 mr-1" />
                  <span>{distance.toFixed(1)} km</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onGetDirections(hospital)}
              >
                <Route className="size-3 mr-1" />
                Ruta
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => window.open(`tel:${hospital.telefono}`, '_self')}
              >
                <Phone className="size-3 mr-1" />
                Llamar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Hospitales completos de Managua - Formato completo compatible
  const hospitalesManagua = [
    {
      id: '1',
      nombre: 'Hospital Bertha Calderón Roque',
      direccion: 'Barrio Edgard Lang, Carretera Norte',
      municipio: 'Managua',
      departamento: 'Managua',
      telefono: '2233-1111',
      rating: 4.2,
      tiempoAtencion: '20-35 min',
      especialidades: ['Ginecología', 'Obstetricia', 'Pediatría', 'Neonatología'],
      servicios: ['Emergencias 24h', 'Maternidad', 'UCI Neonatal', 'Laboratorio'],
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
      acceptsInsurance: true,
      tipo: 'Público'
    },
    {
      id: '2',
      nombre: 'Hospital Manolo Morales',
      direccion: 'Barrio Venezuela, Managua',
      municipio: 'Managua',
      departamento: 'Managua',
      telefono: '2233-2222',
      rating: 4.0,
      tiempoAtencion: '25-45 min',
      especialidades: ['Medicina Interna', 'Cardiología', 'Neurología', 'Gastroenterología'],
      servicios: ['Emergencias 24h', 'UCI', 'Laboratorio', 'Tomografía'],
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
      acceptsInsurance: true,
      tipo: 'Público'
    },
    {
      id: '3',
      nombre: 'Hospital Nacional Rosales',
      direccion: 'Barrio Larreynaga, Managua',
      municipio: 'Managua',
      departamento: 'Managua',
      telefono: '2233-3333',
      rating: 3.8,
      tiempoAtencion: '30-50 min',
      especialidades: ['Cardiología', 'Neurología', 'Cirugía Cardiovascular'],
      servicios: ['Emergencias 24h', 'Cateterismo Cardíaco', 'UCI Cardíaca'],
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
      acceptsInsurance: true,
      tipo: 'Público'
    },
    {
      id: '4',
      nombre: 'Hospital Militar Dr. Alejandro Dávila Bolaños',
      direccion: 'Barrio San Judas, Managua',
      municipio: 'Managua',
      departamento: 'Managua',
      telefono: '2222-2949',
      rating: 3.9,
      tiempoAtencion: '20-40 min',
      especialidades: ['Medicina General', 'Traumatología', 'Cirugía General'],
      servicios: ['Emergencias 24h', 'Quirófanos', 'UCI', 'Laboratorio'],
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
      acceptsInsurance: true,
      tipo: 'Público'
    },
    {
      id: '5',
      nombre: 'Hospital Roberto Huembes',
      direccion: 'Distrito VI, Managua',
      municipio: 'Managua',
      departamento: 'Managua',
      telefono: '2244-1234',
      rating: 3.6,
      tiempoAtencion: '30-60 min',
      especialidades: ['Medicina General', 'Pediatría', 'Ginecología'],
      servicios: ['Emergencias 24h', 'Laboratorio', 'Rayos X'],
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
      acceptsInsurance: true,
      tipo: 'Público'
    },
    {
      id: '6',
      nombre: 'Hospital Amistad Japón-Nicaragua',
      direccion: 'Carretera Masaya, Km 14.5',
      municipio: 'Managua',
      departamento: 'Managua',
      telefono: '2278-4000',
      rating: 4.1,
      tiempoAtencion: '15-30 min',
      especialidades: ['Medicina General', 'Pediatría', 'Medicina Interna'],
      servicios: ['Emergencias 24h', 'Tomografía', 'UCI', 'Laboratorio'],
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
      acceptsInsurance: true,
      tipo: 'Semi-privado'
    },
    {
      id: '7',
      nombre: 'Hospital Metropolitano Vivian Pellas',
      direccion: 'Carretera a Masaya, Km 9.8',
      municipio: 'Managua',
      departamento: 'Managua',
      telefono: '2255-8000',
      rating: 4.6,
      tiempoAtencion: '10-20 min',
      especialidades: ['Oncología', 'Cardiología', 'Neurología', 'Neurocirugía'],
      servicios: ['Emergencias 24h', 'Cirugía Robótica', 'UCI', 'Imagenología'],
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
      acceptsInsurance: true,
      tipo: 'Privado'
    },
    {
      id: '8',
      nombre: 'Hospital Bautista',
      direccion: 'Barrio Largaespada, Managua',
      municipio: 'Managua',
      departamento: 'Managua',
      telefono: '2249-1010',
      rating: 4.4,
      tiempoAtencion: '15-25 min',
      especialidades: ['Medicina General', 'Cardiología', 'Neurología', 'Pediatría'],
      servicios: ['Emergencias 24h', 'Maternidad', 'Laboratorio', 'Farmacia'],
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
      acceptsInsurance: true,
      tipo: 'Privado'
    },
    {
      id: '9',
      nombre: 'Hospital Alemán Nicaragüense',
      direccion: 'Km 9.5 Carretera Sur, Managua',
      municipio: 'Managua',
      departamento: 'Managua',
      telefono: '2289-4700',
      rating: 4.3,
      tiempoAtencion: '10-20 min',
      especialidades: ['Dermatología', 'Oftalmología', 'Medicina General'],
      servicios: ['Emergencias 24h', 'Cirugía Ambulatoria', 'Laboratorio'],
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
      acceptsInsurance: false,
      tipo: 'Privado'
    }
  ];

  // Ordenar hospitales: públicos primero, luego por rating
  const hospitalesOrdenados = [
    ...hospitals,
    ...hospitalesManagua.filter(h => !hospitals.find(hospital => hospital.id === h.id))
  ].sort((a, b) => {
    // Priorizar hospitales públicos
    if (a.tipo === 'Público' && b.tipo !== 'Público') return -1;
    if (b.tipo === 'Público' && a.tipo !== 'Público') return 1;
    // Luego por rating
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-4">
      {/* Panel de información superior - fuera del mapa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Información de hospitales */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center">
                <Stethoscope className="size-4 mr-2 text-blue-500" />
                Hospitales ({hospitalesOrdenados.length})
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0"
                onClick={() => setIsHospitalListExpanded(!isHospitalListExpanded)}
              >
                {isHospitalListExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </Button>
            </div>
            
            {isHospitalListExpanded ? (
              <div className="max-h-40 overflow-y-auto space-y-2">
                {hospitalesOrdenados.map((hospital) => (
                  <div
                    key={hospital.id}
                    className={`p-2 rounded cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedHospital?.id === hospital.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => centerOnHospital(hospital)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            hospital.tipo === 'Público' ? 'bg-green-500' : 
                            hospital.tipo === 'Semi-privado' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}></div>
                          <span className="text-xs font-medium truncate">{hospital.nombre}</span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-1 py-0 ${
                              hospital.tipo === 'Público' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              hospital.tipo === 'Semi-privado' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}
                          >
                            {hospital.tipo || 'Privado'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                          <span>{hospital.rating}★</span>
                          <span>{hospital.tiempoAtencion}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-6 h-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onGetDirections(hospital);
                          }}
                        >
                          <Route className="size-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-6 h-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${hospital.telefono}`, '_self');
                          }}
                        >
                          <Phone className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                Haz clic para ver los {hospitalesOrdenados.length} hospitales de Managua
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leyenda */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <Eye className="size-4 mr-2 text-gray-500" />
              Leyenda
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Hospitales Públicos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Hospitales Semi-privados</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Hospitales Privados</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Emergencias 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isTrackingLocation ? 'bg-green-500' : 'bg-purple-600'
                }`}></div>
                <span>Tu ubicación</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controles del mapa */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <Navigation className="size-4 mr-2 text-purple-500" />
              Controles
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={isTrackingLocation ? stopLocationTracking : startLocationTracking}
                disabled={isLoadingLocation}
                className="text-xs"
              >
                {isLoadingLocation ? (
                  <Target className="size-3 animate-spin mr-1" />
                ) : isTrackingLocation ? (
                  <Navigation2 className="size-3 text-green-500 mr-1" />
                ) : (
                  <Locate className="size-3 mr-1" />
                )}
                {isTrackingLocation ? 'Parar' : 'Seguir'}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="text-xs"
              >
                <Crosshair className="size-3 mr-1" />
                Mi Ubicación
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={resetMap}
                className="text-xs"
              >
                <RotateCcw className="size-3 mr-1" />
                Resetear
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={openInGoogleMaps}
                className="text-xs"
              >
                <ExternalLink className="size-3 mr-1" />
                Abrir Maps
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapa principal - área limpia sin overlays */}
      <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border shadow-sm">
        {/* Google Maps Iframe */}
        <iframe
          ref={mapRef}
          src={createSimpleMapUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />

        {/* Solo controles de zoom en el mapa */}
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0"
              onClick={() => setMapZoom(prev => Math.min(prev + 1, 20))}
              disabled={mapZoom >= 20}
            >
              <Plus className="size-4" />
            </Button>
            <div className="w-full text-center text-xs py-1 font-medium">
              {mapZoom}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0"
              onClick={() => setMapZoom(prev => Math.max(prev - 1, 5))}
              disabled={mapZoom <= 5}
            >
              <Minus className="size-4" />
            </Button>
          </div>
        </div>

        {/* Overlay de carga */}
        {isLoadingLocation && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-40">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 flex items-center space-x-3">
                <Target className="size-6 animate-spin text-blue-500" />
                <span className="text-sm font-medium">Obteniendo ubicación...</span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Información del hospital seleccionado - debajo del mapa */}
      {selectedHospital && (
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold">{selectedHospital.nombre}</h3>
                  {selectedHospital.tipo === 'Público' && (
                    <Badge variant="secondary" className="text-xs">Público</Badge>
                  )}
                  {selectedHospital.isEmergency && (
                    <Badge variant="destructive" className="text-xs">24h</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedHospital.direccion}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0 ml-2"
                onClick={() => onHospitalSelect(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="flex items-center justify-between text-sm mb-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="size-4 text-yellow-500 mr-1" />
                  <span>{selectedHospital.rating}</span>
                </div>
                {selectedHospital.distancia && (
                  <div className="flex items-center">
                    <Navigation className="size-4 mr-1" />
                    <span>{selectedHospital.distancia} km</span>
                  </div>
                )}
                <span className="text-muted-foreground">{selectedHospital.tiempoAtencion}</span>
              </div>
            </div>

            {selectedHospital.especialidades && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedHospital.especialidades.map((esp, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {esp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onGetDirections(selectedHospital)}
              >
                <Route className="size-4 mr-2" />
                Obtener Direcciones
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => window.open(`tel:${selectedHospital.telefono}`, '_self')}
              >
                <Phone className="size-4 mr-2" />
                Llamar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}