import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar,
  Users,
  FileText,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Stethoscope,
  Activity,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  LogOut,
  Building2,
  Heart,
  UserCheck,
  ClipboardList,
  Timer,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { AppointmentManagement } from './AppointmentManagement';
import { EnhancedAppointmentManagement } from './EnhancedAppointmentManagement';
import { PatientRecords } from './PatientRecords';
import { PatientFlow } from './PatientFlow';
import { AdminReports } from './AdminReports';
import { StaffProfile } from './StaffProfile';
import { useAppointments } from '../../context/AppointmentContext';
import { databaseService } from '../../services/database';
import { UniversalAdminDashboard } from '../admin/UniversalAdminDashboard';

interface StaffDashboardProps {
  staffData: any;
  onLogout: () => void;
}

export function StaffDashboard({ staffData, onLogout }: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState(12);
  const [hospitalData, setHospitalData] = useState<any>(null);
  const [metricas, setMetricas] = useState<any>(null);
  const [citasHoy, setCitasHoy] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(staffData.es_admin_universal || false);
  const [currentHospitalData, setCurrentHospitalData] = useState(staffData);
  const { getAppointmentsByHospital } = useAppointments();

  // Cargar datos del hospital y métricas
  useEffect(() => {
    const loadHospitalData = async () => {
      try {
        const hospitalId = parseInt(currentHospitalData.hospitalInfo?.id || '1');
        
        // Cargar datos del hospital
        const hospital = await databaseService.getHospitalById(hospitalId);
        setHospitalData(hospital);

        // Cargar métricas
        const hospitalMetricas = await databaseService.getMetricasHospital(hospitalId);
        setMetricas(hospitalMetricas);

        // Cargar citas de hoy
        const hoy = new Date().toISOString().split('T')[0];
        const citas = await databaseService.getCitasByHospital(hospitalId, hoy, hoy);
        setCitasHoy(citas);

      } catch (error) {
        console.error('Error cargando datos del hospital:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!showAdminPanel) {
      loadHospitalData();
    } else {
      setLoading(false);
    }
  }, [currentHospitalData.hospitalInfo?.id, showAdminPanel]);

  // Función para cambiar de hospital (solo para admin universal)
  const handleSelectHospital = (hospitalData: any) => {
    setCurrentHospitalData({
      ...staffData,
      hospitalInfo: hospitalData
    });
    setShowAdminPanel(false);
    setActiveTab('dashboard');
    setLoading(true);
  };

  // Get real appointment data for this hospital (fallback)
  const hospitalAppointments = getAppointmentsByHospital(currentHospitalData.hospitalInfo?.id || '1');
  
  // Datos reales del dashboard
  const dashboardStats = {
    today: {
      appointments: citasHoy.length || hospitalAppointments.length,
      patients: citasHoy.filter((app, index, self) => 
        self.findIndex(a => a.paciente_id === app.paciente_id) === index
      ).length || hospitalAppointments.filter((app, index, self) => 
        self.findIndex(a => a.patientId === app.patientId) === index
      ).length,
      completed: citasHoy.filter(app => app.estado_nombre === 'COMPLETADA').length || hospitalAppointments.filter(app => app.status === 'completed').length,
      pending: citasHoy.filter(app => app.estado_nombre === 'PROGRAMADA' || app.estado_nombre === 'CONFIRMADA').length || hospitalAppointments.filter(app => app.status === 'pending').length
    },
    thisWeek: {
      totalPatients: metricas?.usuarios_activos || 142,
      emergencies: Math.floor((metricas?.total_citas || 20) * 0.15),
      surgeries: Math.floor((metricas?.total_citas || 20) * 0.25),
      revenue: `C$ ${((metricas?.total_citas || 20) * 250).toLocaleString()}`
    }
  };

  // Actividad reciente basada en citas reales
  const recentActivity = citasHoy.slice(0, 4).map((cita, index) => ({
    id: cita.id,
    type: 'appointment',
    patient: cita.paciente_nombre || `Paciente ${index + 1}`,
    time: cita.hora_inicio?.substring(0, 5) || '00:00',
    status: cita.estado_nombre?.toLowerCase() === 'completada' ? 'completed' : 
            cita.estado_nombre?.toLowerCase() === 'confirmada' ? 'confirmed' : 
            cita.estado_nombre?.toLowerCase() === 'programada' ? 'pending' : 'pending',
    description: cita.motivo_consulta || cita.tipo_nombre || 'Consulta médica'
  })).concat([
    // Datos por defecto si no hay suficientes citas reales
    {
      id: 999,
      type: 'system',
      patient: 'Sistema',
      time: new Date().toTimeString().substring(0, 5),
      status: 'completed',
      description: 'Sistema actualizado correctamente'
    }
  ]).slice(0, 4);

  // Próximas citas basadas en datos reales
  const currentTime = new Date().toTimeString().substring(0, 5);
  const upcomingAppointments = citasHoy
    .filter(cita => cita.hora_inicio > currentTime)
    .slice(0, 3)
    .map((cita, index) => ({
      id: cita.id,
      patient: cita.paciente_nombre || `Paciente ${index + 1}`,
      time: cita.hora_inicio?.substring(0, 5) || '00:00',
      type: cita.tipo_nombre || 'Consulta',
      room: `Consultorio ${(index % 5) + 1}`
    }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="size-4 text-green-500" />;
      case 'urgent': return <AlertCircle className="size-4 text-red-500" />;
      case 'completed': return <CheckCircle className="size-4 text-blue-500" />;
      case 'pending': return <Clock className="size-4 text-yellow-500" />;
      default: return <Clock className="size-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Si es admin universal y está en modo admin, mostrar panel administrativo
  if (staffData.es_admin_universal && showAdminPanel) {
    return (
      <UniversalAdminDashboard 
        staffData={staffData}
        onSelectHospital={handleSelectHospital}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse mb-4">
            <Stethoscope className="size-8 text-white" />
          </div>
          <p className="text-lg font-medium">Cargando dashboard...</p>
          <p className="text-sm text-muted-foreground">Obteniendo datos del hospital</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">SaludCerca Pro</h1>
                <p className="text-sm text-muted-foreground">Sistema Hospitalario</p>
              </div>
            </div>

            {/* Información del usuario */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="size-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {notifications > 9 ? '9+' : notifications}
                  </Badge>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-2"
              >
                <Settings className="size-4" />
                <span>Perfil</span>
              </Button>

              <div className="flex items-center space-x-3 pl-4 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium">{staffData.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {staffData.rol} - {staffData.hospitalInfo?.nombre}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <User className="size-4 text-white" />
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="size-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="size-4" />
              <span>Citas</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center space-x-2">
              <FileText className="size-4" />
              <span>Expedientes</span>
            </TabsTrigger>
            <TabsTrigger value="flow" className="flex items-center space-x-2">
              <Users className="size-4" />
              <span>Flujo</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="size-4" />
              <span>Reportes</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Bienvenido, {staffData.name}
                      {staffData.es_admin_universal && (
                        <Badge className="ml-2 bg-yellow-500 text-black">
                          Admin Universal
                        </Badge>
                      )}
                    </h2>
                    <p className="text-blue-100">
                      {staffData.hospitalInfo?.nombre}
                      {staffData.hospitalInfo?.municipio && ` • ${staffData.hospitalInfo.municipio}, ${staffData.hospitalInfo.departamento}`}
                    </p>
                    {hospitalData && (
                      <p className="text-xs text-blue-200 mt-1">
                        {hospitalData.tipo} • Nivel {hospitalData.nivel_complejidad} • {hospitalData.capacidad_camas} camas
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100">Hoy es</p>
                    <p className="text-lg font-semibold">
                      {new Date().toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Citas Hoy</p>
                          <p className="text-2xl font-bold">{dashboardStats.today.appointments}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Calendar className="size-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="size-4 text-green-500 mr-1" />
                        <span className="text-green-500">+12%</span>
                        <span className="text-muted-foreground ml-1">vs ayer</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pacientes</p>
                          <p className="text-2xl font-bold">{dashboardStats.today.patients}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Users className="size-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="size-4 text-green-500 mr-1" />
                        <span className="text-green-500">+8%</span>
                        <span className="text-muted-foreground ml-1">vs ayer</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completadas</p>
                          <p className="text-2xl font-bold">{dashboardStats.today.completed}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <CheckCircle className="size-6 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="size-4 text-green-500 mr-1" />
                        <span className="text-green-500">+15%</span>
                        <span className="text-muted-foreground ml-1">eficiencia</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                          <p className="text-2xl font-bold">{dashboardStats.today.pending}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                          <Clock className="size-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingDown className="size-4 text-red-500 mr-1" />
                        <span className="text-red-500">-5%</span>
                        <span className="text-muted-foreground ml-1">vs ayer</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="size-5" />
                        <span>Actividad Reciente</span>
                      </CardTitle>
                      <CardDescription>
                        Últimas actividades en el sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                            {getStatusIcon(activity.status)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{activity.patient}</p>
                                <span className="text-sm text-muted-foreground">{activity.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Appointments */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="size-5" />
                        <span>Próximas Citas</span>
                      </CardTitle>
                      <CardDescription>
                        Agenda del resto del día
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {upcomingAppointments.map((appointment) => (
                          <div key={appointment.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{appointment.time}</span>
                              <Badge variant="outline" className="text-xs">
                                {appointment.room}
                              </Badge>
                            </div>
                            <p className="font-medium">{appointment.patient}</p>
                            <p className="text-sm text-muted-foreground">{appointment.type}</p>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Plus className="size-4 mr-2" />
                        Ver todas las citas
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="appointments">
            <EnhancedAppointmentManagement staffData={currentHospitalData} />
          </TabsContent>

          <TabsContent value="records">
            <PatientRecords staffData={staffData} />
          </TabsContent>

          <TabsContent value="flow">
            <PatientFlow staffData={staffData} />
          </TabsContent>

          <TabsContent value="reports">
            <AdminReports staffData={staffData} />
          </TabsContent>

          <TabsContent value="profile">
            <StaffProfile 
              staffData={staffData} 
              onBack={() => setActiveTab('dashboard')}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}