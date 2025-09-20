import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Users,
  Clock,
  MapPin,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Timer,
  User,
  Activity,
  Bed,
  Stethoscope,
  Heart,
  Eye,
  RotateCcw,
  Plus,
  Filter,
  Search,
  Navigation,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PatientFlowProps {
  staffData: any;
}

// Mock data for patient flow
const mockPatientFlow = [
  {
    id: 'PF001',
    patient: {
      name: 'María González',
      id: 'PAT001',
      age: 45,
      priority: 'normal'
    },
    currentLocation: 'Sala de Espera',
    currentLocationId: 'waiting',
    status: 'waiting',
    arrivalTime: '08:30',
    estimatedWaitTime: 15,
    appointmentTime: '09:00',
    doctor: 'Dr. Carlos Mendoza',
    department: 'Cardiología',
    room: 'Consultorio 3',
    steps: [
      { id: 'registration', name: 'Registro', status: 'completed', time: '08:30' },
      { id: 'waiting', name: 'Sala de Espera', status: 'current', time: '08:35' },
      { id: 'consultation', name: 'Consulta', status: 'pending', time: null },
      { id: 'checkout', name: 'Alta', status: 'pending', time: null }
    ]
  },
  {
    id: 'PF002',
    patient: {
      name: 'Roberto Vega',
      id: 'PAT002',
      age: 32,
      priority: 'urgent'
    },
    currentLocation: 'Consultorio 1',
    currentLocationId: 'consultation',
    status: 'in_consultation',
    arrivalTime: '09:00',
    estimatedWaitTime: 0,
    appointmentTime: '09:30',
    doctor: 'Dra. Ana Herrera',
    department: 'Medicina Interna',
    room: 'Consultorio 1',
    steps: [
      { id: 'registration', name: 'Registro', status: 'completed', time: '09:00' },
      { id: 'waiting', name: 'Sala de Espera', status: 'completed', time: '09:05' },
      { id: 'consultation', name: 'Consulta', status: 'current', time: '09:30' },
      { id: 'checkout', name: 'Alta', status: 'pending', time: null }
    ]
  },
  {
    id: 'PF003',
    patient: {
      name: 'Elena Rodríguez',
      id: 'PAT003',
      age: 28,
      priority: 'emergency'
    },
    currentLocation: 'Emergencias',
    currentLocationId: 'emergency',
    status: 'emergency',
    arrivalTime: '10:15',
    estimatedWaitTime: 0,
    appointmentTime: 'Inmediato',
    doctor: 'Dr. Luis Morales',
    department: 'Emergencias',
    room: 'Trauma 1',
    steps: [
      { id: 'registration', name: 'Registro', status: 'completed', time: '10:15' },
      { id: 'triage', name: 'Triaje', status: 'completed', time: '10:17' },
      { id: 'emergency', name: 'Emergencias', status: 'current', time: '10:20' },
      { id: 'checkout', name: 'Alta/Traslado', status: 'pending', time: null }
    ]
  },
  {
    id: 'PF004',
    patient: {
      name: 'José Martínez',
      id: 'PAT004',
      age: 55,
      priority: 'normal'
    },
    currentLocation: 'Laboratorio',
    currentLocationId: 'lab',
    status: 'in_lab',
    arrivalTime: '09:45',
    estimatedWaitTime: 10,
    appointmentTime: '10:00',
    doctor: 'Dr. Patricia Ruiz',
    department: 'Medicina General',
    room: 'Lab 2',
    steps: [
      { id: 'registration', name: 'Registro', status: 'completed', time: '09:45' },
      { id: 'waiting', name: 'Sala de Espera', status: 'completed', time: '09:50' },
      { id: 'consultation', name: 'Consulta', status: 'completed', time: '10:00' },
      { id: 'lab', name: 'Laboratorio', status: 'current', time: '10:30' },
      { id: 'checkout', name: 'Alta', status: 'pending', time: null }
    ]
  }
];

const locations = [
  { id: 'registration', name: 'Registro', icon: UserCheck, color: 'blue' },
  { id: 'waiting', name: 'Sala de Espera', icon: Clock, color: 'yellow' },
  { id: 'triage', name: 'Triaje', icon: Activity, color: 'orange' },
  { id: 'consultation', name: 'Consulta', icon: Stethoscope, color: 'green' },
  { id: 'emergency', name: 'Emergencias', icon: AlertTriangle, color: 'red' },
  { id: 'lab', name: 'Laboratorio', icon: Timer, color: 'purple' },
  { id: 'imaging', name: 'Imagenología', icon: Eye, color: 'indigo' },
  { id: 'pharmacy', name: 'Farmacia', icon: Plus, color: 'pink' },
  { id: 'checkout', name: 'Alta', icon: UserX, color: 'gray' }
];

export function PatientFlow({ staffData }: PatientFlowProps) {
  const [patientFlow, setPatientFlow] = useState(mockPatientFlow);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'urgent': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'normal': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in_consultation': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'emergency': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'in_lab': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getLocationIcon = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.icon : MapPin;
  };

  const movePatient = (patientId: string, newLocationId: string) => {
    setPatientFlow(prev => 
      prev.map(patient => {
        if (patient.id === patientId) {
          const location = locations.find(loc => loc.id === newLocationId);
          const updatedSteps = patient.steps.map(step => {
            if (step.id === patient.currentLocationId) {
              return { ...step, status: 'completed' };
            }
            if (step.id === newLocationId) {
              return { ...step, status: 'current', time: currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) };
            }
            return step;
          });

          return {
            ...patient,
            currentLocation: location?.name || newLocationId,
            currentLocationId: newLocationId,
            steps: updatedSteps
          };
        }
        return patient;
      })
    );
    toast.success('Paciente movido exitosamente');
  };

  const filteredPatients = patientFlow.filter(patient => {
    const matchesSearch = patient.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === 'all' || patient.currentLocationId === selectedLocation;
    
    return matchesSearch && matchesLocation;
  });

  const locationStats = locations.map(location => ({
    ...location,
    count: patientFlow.filter(p => p.currentLocationId === location.id).length
  }));

  const overallStats = {
    total: patientFlow.length,
    waiting: patientFlow.filter(p => p.status === 'waiting').length,
    inConsultation: patientFlow.filter(p => p.status === 'in_consultation').length,
    emergency: patientFlow.filter(p => p.status === 'emergency').length,
    avgWaitTime: Math.round(patientFlow.reduce((acc, p) => acc + p.estimatedWaitTime, 0) / patientFlow.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Flujo de Pacientes</h2>
          <p className="text-muted-foreground">
            Monitoreo en tiempo real del flujo hospitalario
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Última actualización</p>
          <p className="font-medium">{currentTime.toLocaleTimeString('es-ES')}</p>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pacientes</p>
                <p className="text-2xl font-bold">{overallStats.total}</p>
              </div>
              <Users className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En Espera</p>
                <p className="text-2xl font-bold text-yellow-600">{overallStats.waiting}</p>
              </div>
              <Clock className="size-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En Consulta</p>
                <p className="text-2xl font-bold text-blue-600">{overallStats.inConsultation}</p>
              </div>
              <Stethoscope className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergencias</p>
                <p className="text-2xl font-bold text-red-600">{overallStats.emergency}</p>
              </div>
              <AlertTriangle className="size-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Prom.</p>
                <p className="text-2xl font-bold text-green-600">{overallStats.avgWaitTime}m</p>
              </div>
              <Timer className="size-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="size-5" />
            <span>Estado por Ubicación</span>
          </CardTitle>
          <CardDescription>
            Distribución de pacientes por área del hospital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {locationStats.map((location) => {
              const Icon = location.icon;
              return (
                <div
                  key={location.id}
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedLocation === location.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                  }`}
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <Icon className={`size-6 mx-auto mb-2 text-${location.color}-500`} />
                  <p className="text-xs font-medium">{location.name}</p>
                  <p className="text-lg font-bold">{location.count}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Buscar paciente, ID o médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ubicaciones</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedLocation('all');
                setSearchTerm('');
              }}
            >
              <RotateCcw className="size-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patient Flow List */}
      <Card>
        <CardHeader>
          <CardTitle>Flujo Actual de Pacientes</CardTitle>
          <CardDescription>
            {filteredPatients.length} pacientes en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map((patient) => {
              const CurrentLocationIcon = getLocationIcon(patient.currentLocationId);
              
              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <User className="size-6 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{patient.patient.name}</h3>
                          <Badge className={getPriorityColor(patient.patient.priority)}>
                            {patient.patient.priority === 'emergency' ? 'Emergencia' : 
                             patient.patient.priority === 'urgent' ? 'Urgente' : 'Normal'}
                          </Badge>
                          <Badge className={getStatusColor(patient.status)}>
                            <CurrentLocationIcon className="size-3 mr-1" />
                            {patient.currentLocation}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="size-4" />
                            <span>ID: {patient.patient.id}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="size-4" />
                            <span>Llegada: {patient.arrivalTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Stethoscope className="size-4" />
                            <span>{patient.doctor}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="size-4" />
                            <span>{patient.room}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {patient.estimatedWaitTime > 0 && (
                        <div className="text-right mr-4">
                          <p className="text-sm text-muted-foreground">Tiempo estimado</p>
                          <p className="font-semibold">{patient.estimatedWaitTime} min</p>
                        </div>
                      )}
                      
                      <Select
                        value={patient.currentLocationId}
                        onValueChange={(value) => movePatient(patient.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => {
                            const Icon = location.icon;
                            return (
                              <SelectItem key={location.id} value={location.id}>
                                <div className="flex items-center space-x-2">
                                  <Icon className="size-4" />
                                  <span>{location.name}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Patient Journey Steps */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="text-sm font-medium mb-3">Recorrido del Paciente</h4>
                    <div className="flex items-center space-x-2 overflow-x-auto">
                      {patient.steps.map((step, index) => {
                        const StepIcon = getLocationIcon(step.id);
                        const isCompleted = step.status === 'completed';
                        const isCurrent = step.status === 'current';
                        
                        return (
                          <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center space-y-1 min-w-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted ? 'bg-green-500 text-white' :
                                isCurrent ? 'bg-blue-500 text-white' :
                                'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="size-4" />
                                ) : (
                                  <StepIcon className="size-4" />
                                )}
                              </div>
                              <p className={`text-xs text-center ${
                                isCurrent ? 'font-medium' : 'text-muted-foreground'
                              }`}>
                                {step.name}
                              </p>
                              {step.time && (
                                <p className="text-xs text-muted-foreground">{step.time}</p>
                              )}
                            </div>
                            
                            {index < patient.steps.length - 1 && (
                              <ArrowRight className={`size-4 ${
                                isCompleted ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'
                              }`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No se encontraron pacientes
              </h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}