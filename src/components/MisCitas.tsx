import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Video,
  MessageSquare,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner@2.0.3';

interface CitaMedica {
  id: string;
  fecha: string;
  hora: string;
  especialidad: string;
  doctor: string;
  hospital: string;
  direccion: string;
  estado: 'PROGRAMADA' | 'CONFIRMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA' | 'REAGENDADA';
  motivo: string;
  tipo: 'PRESENCIAL' | 'VIRTUAL';
  telefono: string;
  observaciones?: string;
  receta?: string;
  proximaRevision?: string;
}

interface MisCitasProps {
  onBack: () => void;
}

const mockCitas: CitaMedica[] = [
  {
    id: '1',
    fecha: '2025-01-15',
    hora: '09:00',
    especialidad: 'Medicina General',
    doctor: 'Dr. Carlos Méndez Gutiérrez',
    hospital: 'Hospital Metropolitano Vivian Pellas',
    direccion: 'Carretera a Masaya km 9.5, Managua',
    estado: 'CONFIRMADA',
    motivo: 'Control rutinario de presión arterial',
    tipo: 'PRESENCIAL',
    telefono: '2255-8000'
  },
  {
    id: '2',
    fecha: '2025-01-22',
    hora: '14:30',
    especialidad: 'Cardiología',
    doctor: 'Dr. Roberto Sánchez',
    hospital: 'Hospital Bautista',
    direccion: 'Barrio Largaespada, Managua',
    estado: 'PROGRAMADA',
    motivo: 'Seguimiento post-operatorio',
    tipo: 'PRESENCIAL',
    telefono: '2249-7777'
  },
  {
    id: '3',
    fecha: '2025-01-08',
    hora: '11:00',
    especialidad: 'Dermatología',
    doctor: 'Dra. Patricia López',
    hospital: 'Hospital Alemán Nicaragüense',
    direccion: 'Pista Juan Pablo II, Managua',
    estado: 'COMPLETADA',
    motivo: 'Revisión de lunares',
    tipo: 'PRESENCIAL',
    telefono: '2289-4700',
    observaciones: 'Evolución favorable. No se encontraron anomalías.',
    receta: 'Protector solar SPF 50+ aplicar diariamente',
    proximaRevision: '2025-07-08'
  },
  {
    id: '4',
    fecha: '2025-01-18',
    hora: '16:00',
    especialidad: 'Teleconsulta - Medicina General',
    doctor: 'Dra. María Elena Vásquez',
    hospital: 'Hospital San Francisco de Asís',
    direccion: 'Consulta Virtual',
    estado: 'CONFIRMADA',
    motivo: 'Consulta de seguimiento - Diabetes',
    tipo: 'VIRTUAL',
    telefono: '2277-2662'
  },
  {
    id: '5',
    fecha: '2024-12-28',
    hora: '10:30',
    especialidad: 'Oftalmología',
    doctor: 'Dr. Fernando Castro',
    hospital: 'Hospital Monte España',
    direccion: 'Plaza El Sol, Managua',
    estado: 'CANCELADA',
    motivo: 'Examen de la vista rutinario',
    tipo: 'PRESENCIAL',
    telefono: '2289-4201'
  }
];

const estadoConfig = {
  'PROGRAMADA': {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    icon: Clock,
    label: 'Programada'
  },
  'CONFIRMADA': {
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    icon: CheckCircle,
    label: 'Confirmada'
  },
  'EN_CURSO': {
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    icon: AlertCircle,
    label: 'En Curso'
  },
  'COMPLETADA': {
    color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
    icon: CheckCircle,
    label: 'Completada'
  },
  'CANCELADA': {
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    icon: XCircle,
    label: 'Cancelada'
  },
  'REAGENDADA': {
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    icon: Calendar,
    label: 'Reagendada'
  }
};

export function MisCitas({ onBack }: MisCitasProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [citas, setCitas] = useState<CitaMedica[]>(mockCitas);
  const [filteredCitas, setFilteredCitas] = useState<CitaMedica[]>(mockCitas);
  const [activeTab, setActiveTab] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [selectedCita, setSelectedCita] = useState<CitaMedica | null>(null);

  useEffect(() => {
    let filtered = citas;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(cita => 
        cita.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.motivo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'todas') {
      filtered = filtered.filter(cita => cita.estado === statusFilter);
    }

    // Filtrar por tab
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (activeTab) {
      case 'proximas':
        filtered = filtered.filter(cita => 
          cita.fecha >= today && 
          (cita.estado === 'PROGRAMADA' || cita.estado === 'CONFIRMADA')
        );
        break;
      case 'completadas':
        filtered = filtered.filter(cita => cita.estado === 'COMPLETADA');
        break;
      case 'canceladas':
        filtered = filtered.filter(cita => 
          cita.estado === 'CANCELADA' || cita.estado === 'REAGENDADA'
        );
        break;
      default:
        // todas - no filtrar adicional
        break;
    }

    setFilteredCitas(filtered.sort((a, b) => 
      new Date(b.fecha + ' ' + b.hora).getTime() - new Date(a.fecha + ' ' + a.hora).getTime()
    ));
  }, [citas, searchTerm, statusFilter, activeTab]);

  const handleCancelCita = (citaId: string) => {
    setCitas(prev => prev.map(cita => 
      cita.id === citaId 
        ? { ...cita, estado: 'CANCELADA' as const }
        : cita
    ));
    toast.success('Cita cancelada exitosamente');
  };

  const handleRescheduleCita = (citaId: string) => {
    toast.info('Funcionalidad de reagendado próximamente');
  };

  const formatDate = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (hora: string) => {
    const [hours, minutes] = hora.split(':');
    const date = new Date(2025, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const CitaCard = ({ cita }: { cita: CitaMedica }) => {
    const estado = estadoConfig[cita.estado];
    const IconComponent = estado.icon;
    const isVirtual = cita.tipo === 'VIRTUAL';
    const isPast = new Date(cita.fecha) < new Date();
    const canCancel = !isPast && ['PROGRAMADA', 'CONFIRMADA'].includes(cita.estado);

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
              <div className="flex items-center space-x-3">
                <div className={`rounded-full p-2 ${isVirtual ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                  {isVirtual ? <Video className="size-5 text-purple-600 dark:text-purple-400" /> : <Calendar className="size-5 text-blue-600 dark:text-blue-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{cita.especialidad}</h3>
                  <p className="text-muted-foreground">{cita.doctor}</p>
                </div>
              </div>
              <Badge className={`${estado.color} border-0`}>
                <IconComponent className="size-3 mr-1" />
                {estado.label}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="size-4 mr-2" />
                {formatDate(cita.fecha)} - {formatTime(cita.hora)}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="size-4 mr-2" />
                {isVirtual ? 'Consulta Virtual' : cita.hospital}
              </div>

              {cita.motivo && (
                <div className="flex items-start text-sm text-muted-foreground">
                  <MessageSquare className="size-4 mr-2 mt-0.5" />
                  {cita.motivo}
                </div>
              )}
            </div>

            {cita.observaciones && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-sm text-green-800 dark:text-green-400 mb-1">Observaciones médicas:</h4>
                <p className="text-sm text-green-700 dark:text-green-300">{cita.observaciones}</p>
              </div>
            )}

            {cita.receta && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-sm text-blue-800 dark:text-blue-400 mb-1">Receta médica:</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">{cita.receta}</p>
              </div>
            )}

            {cita.proximaRevision && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-sm text-orange-800 dark:text-orange-400 mb-1">Próxima revisión:</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">{formatDate(cita.proximaRevision)}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCita(cita)}
                >
                  <Eye className="size-4 mr-1" />
                  Ver Detalles
                </Button>
                
                {cita.estado === 'COMPLETADA' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Descarga de resultados próximamente')}
                  >
                    <Download className="size-4 mr-1" />
                    Descargar
                  </Button>
                )}
              </div>

              <div className="flex space-x-2">
                {canCancel && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRescheduleCita(cita.id)}
                    >
                      <Edit className="size-4 mr-1" />
                      Reagendar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelCita(cita.id)}
                    >
                      <Trash2 className="size-4 mr-1" />
                      Cancelar
                    </Button>
                  </>
                )}

                {cita.telefono && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${cita.telefono}`, '_self')}
                  >
                    <Phone className="size-4 mr-1" />
                    Llamar
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="size-4 mr-2" />
                Volver
              </Button>
              <h1 className="ml-4 text-xl font-semibold">Mis Citas Médicas</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              {filteredCitas.length} citas
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Buscar por doctor, especialidad o hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="size-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos los estados</SelectItem>
                  <SelectItem value="PROGRAMADA">Programadas</SelectItem>
                  <SelectItem value="CONFIRMADA">Confirmadas</SelectItem>
                  <SelectItem value="COMPLETADA">Completadas</SelectItem>
                  <SelectItem value="CANCELADA">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="proximas">Próximas</TabsTrigger>
              <TabsTrigger value="completadas">Completadas</TabsTrigger>
              <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredCitas.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Calendar className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No se encontraron citas
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'todas' 
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'No tienes citas programadas en este momento'
                    }
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filteredCitas.map((cita, index) => (
                    <motion.div
                      key={cita.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CitaCard cita={cita} />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">¿Necesitas agendar una nueva cita?</h3>
                  <p className="text-blue-100 text-sm">
                    Programa tu consulta médica en cualquiera de nuestros hospitales afiliados
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 mt-4 sm:mt-0"
                  onClick={onBack}
                >
                  <Calendar className="size-4 mr-2" />
                  Solicitar Cita
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}