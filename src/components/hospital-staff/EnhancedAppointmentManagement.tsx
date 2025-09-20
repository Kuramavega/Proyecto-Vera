import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  MessageSquare,
  UserCheck,
  CalendarDays,
  Stethoscope,
  Hospital,
  AlertTriangle,
  Timer,
  PhoneCall
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { formatearFecha, formatearHora } from '../../services/database';
import { toast } from 'sonner@2.0.3';

interface EnhancedAppointmentManagementProps {
  staffData: any;
}

export function EnhancedAppointmentManagement({ staffData }: EnhancedAppointmentManagementProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | 'complete' | 'noshow'>('confirm');
  const [actionReason, setActionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [activeTab, setActiveTab] = useState('today');

  // Estados para formularios
  const [rescheduleForm, setRescheduleForm] = useState({
    newDate: '',
    newStartTime: '',
    newEndTime: '',
    reason: ''
  });

  useEffect(() => {
    loadAppointments();
  }, [staffData, activeTab]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const hospitalId = parseInt(staffData.hospitalInfo?.id || '1');
      
      let fechaInicio = '';
      let fechaFin = '';
      const today = new Date();

      switch (activeTab) {
        case 'today':
          fechaInicio = fechaFin = today.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          fechaInicio = weekStart.toISOString().split('T')[0];
          fechaFin = weekEnd.toISOString().split('T')[0];
          break;
        case 'month':
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          fechaInicio = monthStart.toISOString().split('T')[0];
          fechaFin = monthEnd.toISOString().split('T')[0];
          break;
      }

      let citas;
      if (staffData.es_admin_universal) {
        // Admin universal ve todas las citas del hospital
        citas = await databaseService.getCitasByHospital(hospitalId, fechaInicio, fechaFin);
      } else {
        // Personal específico ve sus citas o las del hospital según su rol
        citas = await databaseService.getCitasByHospital(hospitalId, fechaInicio, fechaFin);
      }

      setAppointments(citas);
    } catch (error) {
      console.error('Error cargando citas:', error);
      toast.error('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.paciente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.medico_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.codigo_cita?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.paciente_telefono?.includes(searchTerm) ||
        apt.motivo_consulta?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter(apt => apt.estado_nombre === statusFilter);
    }

    // Filtro por fecha
    if (dateFilter) {
      filtered = filtered.filter(apt => apt.fecha_cita === dateFilter);
    }

    setFilteredAppointments(filtered);
  };

  const handleAction = async (appointment: any, action: string) => {
    setSelectedAppointment(appointment);
    setActionType(action as any);
    setActionReason('');
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedAppointment) return;

    try {
      const usuarioId = parseInt(staffData.id);
      let success = false;
      let message = '';

      switch (actionType) {
        case 'confirm':
          success = await databaseService.confirmarCita(
            selectedAppointment.id, 
            'medico', 
            usuarioId
          );
          message = 'Cita confirmada exitosamente';
          break;
        
        case 'cancel':
          success = await databaseService.cancelarCita(
            selectedAppointment.id, 
            usuarioId, 
            actionReason || 'Cancelada por el personal médico'
          );
          message = 'Cita cancelada exitosamente';
          break;
        
        case 'complete':
          success = await databaseService.completarCita(
            selectedAppointment.id, 
            usuarioId
          );
          message = 'Cita marcada como completada';
          break;
        
        case 'noshow':
          success = await databaseService.marcarNoShow(
            selectedAppointment.id, 
            usuarioId
          );
          message = 'Paciente marcado como No Show';
          break;
      }

      if (success) {
        toast.success(message);
        await loadAppointments();
        setShowConfirmDialog(false);
      } else {
        toast.error('Error al realizar la acción');
      }
    } catch (error) {
      console.error('Error en acción:', error);
      toast.error('Error al procesar la solicitud');
    }
  };

  const handleReschedule = async () => {
    if (!selectedAppointment || !rescheduleForm.newDate || !rescheduleForm.newStartTime) {
      toast.error('Complete todos los campos requeridos');
      return;
    }

    try {
      const usuarioId = parseInt(staffData.id);
      const success = await databaseService.reprogramarCita(
        selectedAppointment.id,
        rescheduleForm.newDate,
        rescheduleForm.newStartTime,
        rescheduleForm.newEndTime || '00:00',
        usuarioId
      );

      if (success) {
        toast.success('Cita reprogramada exitosamente');
        await loadAppointments();
        setShowDetails(false);
        setRescheduleForm({ newDate: '', newStartTime: '', newEndTime: '', reason: '' });
      } else {
        toast.error('No se pudo reprogramar la cita');
      }
    } catch (error) {
      console.error('Error reprogramando cita:', error);
      toast.error('Error al reprogramar la cita');
    }
  };

  const getStatusBadge = (appointment: any) => {
    const status = appointment.estado_nombre;
    const colorMap: Record<string, string> = {
      'PROGRAMADA': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'CONFIRMADA': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'EN_CURSO': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'COMPLETADA': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'CANCELADA': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'NO_SHOW': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'REPROGRAMADA': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    };

    return (
      <Badge className={colorMap[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROGRAMADA': return <Calendar className="size-4 text-blue-500" />;
      case 'CONFIRMADA': return <CheckCircle className="size-4 text-green-500" />;
      case 'EN_CURSO': return <Timer className="size-4 text-yellow-500" />;
      case 'COMPLETADA': return <CheckCircle className="size-4 text-emerald-500" />;
      case 'CANCELADA': return <XCircle className="size-4 text-red-500" />;
      case 'NO_SHOW': return <AlertTriangle className="size-4 text-orange-500" />;
      case 'REPROGRAMADA': return <RefreshCw className="size-4 text-purple-500" />;
      default: return <Clock className="size-4 text-gray-500" />;
    }
  };

  const canPerformAction = (appointment: any, action: string) => {
    const status = appointment.estado_nombre;
    
    switch (action) {
      case 'confirm':
        return ['PROGRAMADA'].includes(status);
      case 'cancel':
        return ['PROGRAMADA', 'CONFIRMADA'].includes(status) && appointment.puede_modificar;
      case 'complete':
        return ['CONFIRMADA', 'EN_CURSO'].includes(status);
      case 'noshow':
        return ['CONFIRMADA'].includes(status);
      case 'reschedule':
        return ['PROGRAMADA', 'CONFIRMADA'].includes(status) && appointment.puede_modificar;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="size-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p>Cargando citas médicas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Citas Médicas</h2>
          <p className="text-muted-foreground">
            {staffData.es_admin_universal ? 'Vista administrativa universal' : `${staffData.hospitalInfo?.nombre}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadAppointments}>
            <RefreshCw className="size-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabs y Filtros */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="today">Hoy</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
              <TabsTrigger value="all">Todas</TabsTrigger>
            </TabsList>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por paciente, médico, código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="PROGRAMADA">Programada</SelectItem>
                  <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
                  <SelectItem value="EN_CURSO">En Curso</SelectItem>
                  <SelectItem value="COMPLETADA">Completada</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                  <SelectItem value="NO_SHOW">No Show</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Citas', 
            value: filteredAppointments.length, 
            icon: Calendar, 
            color: 'text-blue-600' 
          },
          { 
            label: 'Confirmadas', 
            value: filteredAppointments.filter(a => a.estado_nombre === 'CONFIRMADA').length, 
            icon: CheckCircle, 
            color: 'text-green-600' 
          },
          { 
            label: 'Pendientes', 
            value: filteredAppointments.filter(a => a.estado_nombre === 'PROGRAMADA').length, 
            icon: Clock, 
            color: 'text-yellow-600' 
          },
          { 
            label: 'Completadas', 
            value: filteredAppointments.filter(a => a.estado_nombre === 'COMPLETADA').length, 
            icon: UserCheck, 
            color: 'text-emerald-600' 
          }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`size-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de Citas */}
      <Card>
        <CardHeader>
          <CardTitle>Citas Médicas</CardTitle>
          <CardDescription>
            {filteredAppointments.length} citas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="size-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron citas</p>
              <p className="text-sm">Ajuste los filtros para ver más resultados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(appointment.estado_nombre)}
                        <div>
                          <h4 className="font-semibold text-lg">
                            {appointment.paciente_nombre}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Código: {appointment.codigo_cita}
                          </p>
                        </div>
                        {getStatusBadge(appointment)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="size-4 text-muted-foreground" />
                          <span>{appointment.medico_nombre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="size-4 text-muted-foreground" />
                          <span>{formatearFecha(appointment.fecha_cita)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-muted-foreground" />
                          <span>{formatearHora(appointment.hora_inicio)} - {formatearHora(appointment.hora_fin)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="size-4 text-muted-foreground" />
                          <span>{appointment.paciente_telefono}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="truncate">{appointment.motivo_consulta}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hospital className="size-4 text-muted-foreground" />
                          <span>${appointment.precio}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="size-4 mr-1" />
                        Ver
                      </Button>

                      {canPerformAction(appointment, 'confirm') && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAction(appointment, 'confirm')}
                        >
                          <CheckCircle className="size-4 mr-1" />
                          Confirmar
                        </Button>
                      )}

                      {canPerformAction(appointment, 'complete') && (
                        <Button
                          variant="default"
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAction(appointment, 'complete')}
                        >
                          <UserCheck className="size-4 mr-1" />
                          Completar
                        </Button>
                      )}

                      {canPerformAction(appointment, 'cancel') && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleAction(appointment, 'cancel')}
                        >
                          <XCircle className="size-4 mr-1" />
                          Cancelar
                        </Button>
                      )}

                      {canPerformAction(appointment, 'noshow') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(appointment, 'noshow')}
                        >
                          <AlertTriangle className="size-4 mr-1" />
                          No Show
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <PhoneCall className="size-4 mr-1" />
                        Llamar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Confirmación de Acciones */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'confirm' && 'Confirmar Cita'}
              {actionType === 'cancel' && 'Cancelar Cita'}
              {actionType === 'complete' && 'Completar Cita'}
              {actionType === 'noshow' && 'Marcar No Show'}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment && (
                <>
                  Esta acción afectará la cita de <strong>{selectedAppointment.paciente_nombre}</strong> 
                  {' '}programada para el {formatearFecha(selectedAppointment.fecha_cita)} 
                  {' '}a las {formatearHora(selectedAppointment.hora_inicio)}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {(actionType === 'cancel' || actionType === 'noshow') && (
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo {actionType === 'cancel' ? 'de cancelación' : 'del no show'}</Label>
              <Textarea
                id="reason"
                placeholder={`Describa el motivo ${actionType === 'cancel' ? 'de la cancelación' : 'del no show'}...`}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmAction}
              variant={actionType === 'cancel' || actionType === 'noshow' ? 'destructive' : 'default'}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalles de Cita */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Cita</DialogTitle>
            <DialogDescription>
              Información completa de la cita médica
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6">
              {/* Información del Paciente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Información del Paciente</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nombre:</strong> {selectedAppointment.paciente_nombre}</div>
                    <div><strong>Teléfono:</strong> {selectedAppointment.paciente_telefono}</div>
                    <div><strong>Email:</strong> {selectedAppointment.paciente_email}</div>
                    <div><strong>Documento:</strong> {selectedAppointment.paciente_documento}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Información Médica</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Médico:</strong> {selectedAppointment.medico_nombre}</div>
                    <div><strong>Especialidad:</strong> {selectedAppointment.medico_especialidad}</div>
                    <div><strong>Hospital:</strong> {selectedAppointment.hospital_nombre}</div>
                    <div><strong>Precio:</strong> ${selectedAppointment.precio}</div>
                  </div>
                </div>
              </div>

              {/* Información de la Cita */}
              <div>
                <h4 className="font-semibold mb-2">Detalles de la Cita</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Código:</strong> {selectedAppointment.codigo_cita}</div>
                  <div><strong>Estado:</strong> {getStatusBadge(selectedAppointment)}</div>
                  <div><strong>Fecha:</strong> {formatearFecha(selectedAppointment.fecha_cita)}</div>
                  <div><strong>Hora:</strong> {formatearHora(selectedAppointment.hora_inicio)} - {formatearHora(selectedAppointment.hora_fin)}</div>
                  <div><strong>Tipo:</strong> {selectedAppointment.tipo_nombre}</div>
                  <div><strong>Duración:</strong> {selectedAppointment.tipo_duracion} min</div>
                </div>
              </div>

              {/* Motivo de Consulta */}
              {selectedAppointment.motivo_consulta && (
                <div>
                  <h4 className="font-semibold mb-2">Motivo de Consulta</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {selectedAppointment.motivo_consulta}
                  </p>
                </div>
              )}

              {/* Notas del Paciente */}
              {selectedAppointment.notas_paciente && (
                <div>
                  <h4 className="font-semibold mb-2">Notas del Paciente</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {selectedAppointment.notas_paciente}
                  </p>
                </div>
              )}

              {/* Reprogramación */}
              {canPerformAction(selectedAppointment, 'reschedule') && (
                <div>
                  <h4 className="font-semibold mb-2">Reprogramar Cita</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newDate">Nueva Fecha</Label>
                      <Input
                        id="newDate"
                        type="date"
                        value={rescheduleForm.newDate}
                        onChange={(e) => setRescheduleForm(prev => ({...prev, newDate: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newStartTime">Nueva Hora</Label>
                      <Input
                        id="newStartTime"
                        type="time"
                        value={rescheduleForm.newStartTime}
                        onChange={(e) => setRescheduleForm(prev => ({...prev, newStartTime: e.target.value}))}
                      />
                    </div>
                  </div>
                  <Button className="mt-2" onClick={handleReschedule}>
                    <RefreshCw className="size-4 mr-2" />
                    Reprogramar
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}