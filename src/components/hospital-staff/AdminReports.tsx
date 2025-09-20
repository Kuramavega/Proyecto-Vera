import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Clock,
  FileText,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  PieChart,
  LineChart,
  Building2,
  Stethoscope,
  Heart,
  UserCheck,
  Timer,
  Award,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminReportsProps {
  staffData: any;
}

// Mock data for reports
const mockReportData = {
  overview: {
    totalPatients: 1248,
    totalAppointments: 2156,
    revenue: 'C$ 125,480',
    satisfaction: 4.6,
    trends: {
      patients: 12.5,
      appointments: 8.3,
      revenue: 15.2,
      satisfaction: 2.1
    }
  },
  appointments: {
    today: 24,
    thisWeek: 167,
    thisMonth: 742,
    completed: 89,
    cancelled: 12,
    noShow: 8,
    avgWaitTime: 18,
    byDepartment: [
      { name: 'Medicina General', count: 45, percentage: 27 },
      { name: 'Cardiología', count: 32, percentage: 19 },
      { name: 'Pediatría', count: 28, percentage: 17 },
      { name: 'Ginecología', count: 24, percentage: 14 },
      { name: 'Neurología', count: 20, percentage: 12 },
      { name: 'Otros', count: 18, percentage: 11 }
    ]
  },
  performance: {
    avgConsultationTime: 25,
    patientTurnover: 32,
    bedOccupancy: 78,
    staffUtilization: 85,
    emergencyResponseTime: 4.2,
    patientSatisfaction: 4.6,
    byDoctor: [
      { name: 'Dr. Carlos Mendoza', patients: 42, rating: 4.8, efficiency: 92 },
      { name: 'Dra. Ana Herrera', patients: 38, rating: 4.7, efficiency: 88 },
      { name: 'Dr. Luis Morales', patients: 35, rating: 4.6, efficiency: 90 },
      { name: 'Dra. Patricia Ruiz', patients: 33, rating: 4.5, efficiency: 85 },
      { name: 'Dr. Miguel Torres', patients: 30, rating: 4.4, efficiency: 82 }
    ]
  },
  financial: {
    dailyRevenue: 'C$ 4,520',
    weeklyRevenue: 'C$ 31,640',
    monthlyRevenue: 'C$ 125,480',
    yearlyRevenue: 'C$ 1,485,200',
    paymentMethods: [
      { name: 'Efectivo', amount: 'C$ 45,200', percentage: 36 },
      { name: 'Tarjeta', amount: 'C$ 38,150', percentage: 30 },
      { name: 'Seguros', amount: 'C$ 32,100', percentage: 26 },
      { name: 'Transferencia', amount: 'C$ 10,030', percentage: 8 }
    ],
    expenses: {
      salaries: 'C$ 68,000',
      supplies: 'C$ 22,500',
      equipment: 'C$ 15,200',
      utilities: 'C$ 8,500',
      maintenance: 'C$ 6,300'
    }
  },
  quality: {
    patientSatisfaction: 4.6,
    complaintRate: 2.1,
    resolutionTime: 24,
    readmissionRate: 5.8,
    infectionRate: 1.2,
    mortalityRate: 0.8,
    qualityIndicators: [
      { name: 'Satisfacción del Paciente', value: 4.6, target: 4.5, status: 'good' },
      { name: 'Tiempo de Espera', value: 18, target: 20, status: 'good' },
      { name: 'Tasa de Infección', value: 1.2, target: 2.0, status: 'good' },
      { name: 'Readmisiones', value: 5.8, target: 5.0, status: 'warning' },
      { name: 'Quejas', value: 2.1, target: 3.0, status: 'good' }
    ]
  }
};

export function AdminReports({ staffData }: AdminReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeMetric, setActiveMetric] = useState('overview');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="size-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="size-4 text-yellow-500" />;
      case 'critical': return <XCircle className="size-4 text-red-500" />;
      default: return <Activity className="size-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? (
      <TrendingUp className="size-4 text-green-500" />
    ) : (
      <TrendingDown className="size-4 text-red-500" />
    );
  };

  const exportReport = () => {
    toast.success('Reporte exportado exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reportes y Administración</h2>
          <p className="text-muted-foreground">
            Análisis integral del desempeño hospitalario
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <RefreshCw className="size-4 mr-2" />
            Actualizar
          </Button>
          
          <Button onClick={exportReport} className="bg-gradient-to-r from-blue-500 to-green-500">
            <Download className="size-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pacientes</p>
                <p className="text-2xl font-bold">{mockReportData.overview.totalPatients.toLocaleString()}</p>
                <div className="flex items-center text-sm mt-2">
                  {getTrendIcon(mockReportData.overview.trends.patients)}
                  <span className="text-green-500 ml-1">+{mockReportData.overview.trends.patients}%</span>
                  <span className="text-muted-foreground ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Users className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Citas Totales</p>
                <p className="text-2xl font-bold">{mockReportData.overview.totalAppointments.toLocaleString()}</p>
                <div className="flex items-center text-sm mt-2">
                  {getTrendIcon(mockReportData.overview.trends.appointments)}
                  <span className="text-green-500 ml-1">+{mockReportData.overview.trends.appointments}%</span>
                  <span className="text-muted-foreground ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Calendar className="size-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
                <p className="text-2xl font-bold">{mockReportData.overview.revenue}</p>
                <div className="flex items-center text-sm mt-2">
                  {getTrendIcon(mockReportData.overview.trends.revenue)}
                  <span className="text-green-500 ml-1">+{mockReportData.overview.trends.revenue}%</span>
                  <span className="text-muted-foreground ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <DollarSign className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Satisfacción</p>
                <p className="text-2xl font-bold">{mockReportData.overview.satisfaction}/5</p>
                <div className="flex items-center text-sm mt-2">
                  {getTrendIcon(mockReportData.overview.trends.satisfaction)}
                  <span className="text-green-500 ml-1">+{mockReportData.overview.trends.satisfaction}%</span>
                  <span className="text-muted-foreground ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Heart className="size-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appointments">Citas</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
          <TabsTrigger value="quality">Calidad</TabsTrigger>
        </TabsList>

        {/* Appointments Report */}
        <TabsContent value="appointments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="size-5" />
                  <span>Estadísticas de Citas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{mockReportData.appointments.completed}</p>
                    <p className="text-sm text-muted-foreground">Completadas</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{mockReportData.appointments.cancelled}</p>
                    <p className="text-sm text-muted-foreground">Canceladas</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{mockReportData.appointments.noShow}</p>
                    <p className="text-sm text-muted-foreground">No Show</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{mockReportData.appointments.avgWaitTime}m</p>
                    <p className="text-sm text-muted-foreground">Tiempo Prom.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="size-5" />
                  <span>Citas por Departamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportData.appointments.byDepartment.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-blue-${500 + index * 100}`}></div>
                        <span className="text-sm font-medium">{dept.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{dept.count}</span>
                        <Badge variant="outline">{dept.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Report */}
        <TabsContent value="performance">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tiempo Consulta</p>
                      <p className="text-2xl font-bold">{mockReportData.performance.avgConsultationTime}m</p>
                    </div>
                    <Timer className="size-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ocupación Camas</p>
                      <p className="text-2xl font-bold">{mockReportData.performance.bedOccupancy}%</p>
                    </div>
                    <Activity className="size-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Utilización Personal</p>
                      <p className="text-2xl font-bold">{mockReportData.performance.staffUtilization}%</p>
                    </div>
                    <Users className="size-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="size-5" />
                  <span>Rendimiento por Médico</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReportData.performance.byDoctor.map((doctor, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                            <Stethoscope className="size-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{doctor.name}</h4>
                            <p className="text-sm text-muted-foreground">{doctor.patients} pacientes</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-4 text-right">
                          <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <div className="flex items-center">
                              <Heart className="size-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{doctor.rating}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Eficiencia</p>
                            <Badge className={getStatusColor(doctor.efficiency > 85 ? 'good' : 'warning')}>
                              {doctor.efficiency}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Report */}
        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="size-5" />
                  <span>Ingresos por Período</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{mockReportData.financial.dailyRevenue}</p>
                    <p className="text-sm text-muted-foreground">Diario</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{mockReportData.financial.weeklyRevenue}</p>
                    <p className="text-sm text-muted-foreground">Semanal</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{mockReportData.financial.monthlyRevenue}</p>
                    <p className="text-sm text-muted-foreground">Mensual</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-lg font-bold text-yellow-600">{mockReportData.financial.yearlyRevenue}</p>
                    <p className="text-sm text-muted-foreground">Anual</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="size-5" />
                  <span>Métodos de Pago</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportData.financial.paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{method.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{method.amount}</span>
                        <Badge variant="outline">{method.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="size-5" />
                  <span>Gastos Operativos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(mockReportData.financial.expenses).map(([key, value], index) => (
                    <div key={key} className="text-center p-4 border rounded-lg">
                      <p className="text-lg font-bold">{value}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {key === 'salaries' ? 'Salarios' :
                         key === 'supplies' ? 'Suministros' :
                         key === 'equipment' ? 'Equipos' :
                         key === 'utilities' ? 'Servicios' :
                         'Mantenimiento'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quality Report */}
        <TabsContent value="quality">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Satisfacción</p>
                      <p className="text-2xl font-bold">{mockReportData.quality.patientSatisfaction}/5</p>
                    </div>
                    <Heart className="size-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tasa Quejas</p>
                      <p className="text-2xl font-bold">{mockReportData.quality.complaintRate}%</p>
                    </div>
                    <AlertTriangle className="size-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Readmisiones</p>
                      <p className="text-2xl font-bold">{mockReportData.quality.readmissionRate}%</p>
                    </div>
                    <RotateCcw className="size-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="size-5" />
                  <span>Indicadores de Calidad</span>
                </CardTitle>
                <CardDescription>
                  Comparación con objetivos establecidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReportData.quality.qualityIndicators.map((indicator, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(indicator.status)}
                          <div>
                            <h4 className="font-medium">{indicator.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Objetivo: {indicator.target}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold">{indicator.value}</p>
                          <Badge className={getStatusColor(indicator.status)}>
                            {indicator.status === 'good' ? 'Objetivo alcanzado' :
                             indicator.status === 'warning' ? 'Requiere atención' :
                             'Crítico'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="size-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Reportes Personalizados</h3>
            <p className="text-sm text-muted-foreground">
              Genera reportes específicos
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Building2 className="size-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Comparación Hospitales</h3>
            <p className="text-sm text-muted-foreground">
              Benchmarking con otros centros
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Activity className="size-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Análisis Predictivo</h3>
            <p className="text-sm text-muted-foreground">
              Predicciones y tendencias
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <UserCheck className="size-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Auditoría Médica</h3>
            <p className="text-sm text-muted-foreground">
              Revisión de calidad
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}