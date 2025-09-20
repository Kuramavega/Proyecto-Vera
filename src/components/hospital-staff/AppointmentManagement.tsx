import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Calendar as CalendarIcon,
  Timer,
  Users,
  Activity
} from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';
import { toast } from 'sonner@2.0.3';

interface AppointmentManagementProps {
  staffData: any;
}

// Mock data for appointments
const mockAppointments = [
  {
    id: '1',
    patient: {
      name: 'María González Pérez',
      phone: '8765-4321',
      age: 45,
      id: 'PAT001'
    },
    date: '2024-08-24',
    time: '09:00',
    duration: 30,
    type: 'Consulta General',
    status: 'confirmed',
    notes: 'Control rutinario diabetes',
    doctor: 'Dr. Carlos Mendoza',
    room: 'Consultorio 3'
  },
  {
    id: '2',
    patient: {
      name: 'Roberto Vega Martinez',
      phone: '8912-3456',
      age: 32,
      id: 'PAT002'
    },
    date: '2024-08-24',
    time: '09:30',
    duration: 45,
    type: 'Cardiología',
    status: 'pending',
    notes: 'Seguimiento post-quirúrgico',
    doctor: 'Dra. Ana Herrera',
    room: 'Consultorio 1'
  },
  {
    id: '3',
    patient: {
      name: 'Elena Rodríguez Silva',
      phone: '8654-7890',
      age: 28,
      id: 'PAT003'
    },
    date: '2024-08-24',
    time: '10:00',
    duration: 30,
    type: 'Pediatría',
    status: 'completed',
    notes: 'Vacunación infantil',
    doctor: 'Dr. Luis Morales',
    room: 'Consultorio 5'
  },
  {
    id: '4',
    patient: {
      name: 'José Martínez López',
      phone: '8333-2222',
      age: 55,
      id: 'PAT004'
    },
    date: '2024-08-24',
    time: '10:30',
    duration: 60,
    type: 'Neurología',
    status: 'cancelled',
    notes: 'Cancelado por el paciente',
    doctor: 'Dr. Patricia Ruiz',
    room: 'Consultorio 2'
  },
  {
    id: '5',
    patient: {
      name: 'Carmen Flores Ortega',
      phone: '8777-8888',
      age: 67,
      id: 'PAT005'
    },
    date: '2024-08-24',
    time: '11:00',
    duration: 30,
    type: 'Medicina Interna',
    status: 'confirmed',
    notes: 'Control presión arterial',
    doctor: 'Dr. Miguel Torres',
    room: 'Consultorio 4'
  }
];

export function AppointmentManagement({ staffData }: AppointmentManagementProps) {
  const { appointments: contextAppointments, updateAppointmentStatus } = useAppointments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Filter appointments by hospital
  const hospitalAppointments = contextAppointments.filter(
    app => app.hospitalId === (staffData.hospitalInfo?.id || '1')
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="size-4 text-green-500" />;
      case 'pending': return <Clock className="size-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="size-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="size-4 text-red-500" />;
      default: return <Clock className="size-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    await updateAppointmentStatus(appointmentId, newStatus as any);
  };

  const filteredAppointments = hospitalAppointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patientPhone.includes(searchTerm) ||
                         appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statsData = {
    total: hospitalAppointments.length,
    confirmed: hospitalAppointments.filter(a => a.status === 'confirmed').length,
    pending: hospitalAppointments.filter(a => a.status === 'pending').length,
    completed: hospitalAppointments.filter(a => a.status === 'completed').length,
    cancelled: hospitalAppointments.filter(a => a.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Citas</h2>
          <p className="text-muted-foreground">
            Administra y gestiona las citas médicas del hospital
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-green-500">
          <Plus className="size-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{statsData.total}</p>
              </div>
              <Calendar className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600">{statsData.confirmed}</p>
              </div>
              <CheckCircle className="size-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{statsData.pending}</p>
              </div>
              <Clock className="size-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold text-blue-600">{statsData.completed}</p>
              </div>
              <Activity className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{statsData.cancelled}</p>
              </div>
              <XCircle className="size-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Buscar paciente, teléfono o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="confirmed">Confirmadas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="tomorrow">Mañana</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="size-4" />
              <span>Más filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Citas - {new Date().toLocaleDateString('es-ES')}</CardTitle>
          <CardDescription>
            {filteredAppointments.length} citas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <User className="size-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{appointment.patientName}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="size-4" />
                          <span>{appointment.time} ({appointment.duration} min)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="size-4" />
                          <span>{appointment.patientPhone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="size-4" />
                          <span>{appointment.room}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="size-4" />
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Notas:</strong> {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {appointment.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        >
                          <CheckCircle className="size-4 mr-1" />
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        >
                          <XCircle className="size-4 mr-1" />
                          Cancelar
                        </Button>
                      </>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        onClick={() => handleStatusChange(appointment.id, 'completed')}
                      >
                        <CheckCircle className="size-4 mr-1" />
                        Completar
                      </Button>
                    )}

                    <Button size="sm" variant="ghost">
                      <Edit className="size-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No se encontraron citas
              </h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <CalendarIcon className="size-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Programar Cita</h3>
            <p className="text-sm text-muted-foreground">
              Agenda una nueva cita médica
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Timer className="size-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Gestión de Horarios</h3>
            <p className="text-sm text-muted-foreground">
              Administra horarios disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="size-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Lista de Espera</h3>
            <p className="text-sm text-muted-foreground">
              Gestiona pacientes en espera
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}