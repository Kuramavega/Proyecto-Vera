import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Building2,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Heart,
  Activity,
  MapPin,
  Phone,
  Globe,
  Bed,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings,
  Shield
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { hospitales } from '../../data/nicaraguaData';
import { HospitalDetails } from './HospitalDetails';

interface UniversalAdminDashboardProps {
  staffData: any;
  onSelectHospital: (hospitalData: any) => void;
}

export function UniversalAdminDashboard({ staffData, onSelectHospital }: UniversalAdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [allHospitalsData, setAllHospitalsData] = useState<any[]>([]);
  const [generalMetrics, setGeneralMetrics] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [showHospitalDetails, setShowHospitalDetails] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos de todos los hospitales
      const hospitalsData = await databaseService.getAllHospitalsData();
      setAllHospitalsData(hospitalsData);

      // Cargar métricas generales
      const metrics = await databaseService.getMetricasGenerales();
      setGeneralMetrics(metrics);

    } catch (error) {
      console.error('Error cargando datos administrativos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar hospitales
  const filteredHospitals = allHospitalsData.filter(hospital => {
    const matchesSearch = !searchTerm || 
      hospital.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || hospital.departamento === selectedDepartment;
    const matchesType = !selectedType || hospital.tipo === selectedType;

    return matchesSearch && matchesDepartment && matchesType;
  });

  // Estadísticas consolidadas
  const consolidatedStats = {
    totalHospitales: allHospitalsData.length,
    hospitalesActivos: allHospitalsData.filter(h => h.estado === 'ACTIVO').length,
    totalCamas: allHospitalsData.reduce((sum, h) => sum + (h.capacidad_camas || 0), 0),
    totalPersonal: allHospitalsData.reduce((sum, h) => sum + (h.total_personal || 0), 0),
    totalCitasHoy: allHospitalsData.reduce((sum, h) => sum + (h.metricas?.total_citas || 0), 0),
    tasaOcupacion: 85.4,
    satisfaccionPromedio: 4.2
  };

  // Departamentos únicos para filtro
  const departamentos = [...new Set(allHospitalsData.map(h => h.departamento))];
  const tipos = [...new Set(allHospitalsData.map(h => h.tipo))];

  const handleViewHospitalDetails = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    setShowHospitalDetails(true);
  };

  const handleBackToAdmin = () => {
    setShowHospitalDetails(false);
    setSelectedHospitalId(null);
  };

  // Mostrar detalles del hospital si está seleccionado
  if (showHospitalDetails && selectedHospitalId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HospitalDetails 
            hospitalId={selectedHospitalId}
            onBack={handleBackToAdmin}
            isAdminView={true}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse mb-4">
            <Shield className="size-8 text-white" />
          </div>
          <p className="text-lg font-medium">Cargando Panel Administrativo Universal...</p>
          <p className="text-sm text-muted-foreground">Accediendo a todos los hospitales del sistema</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Administrativo */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">SaludCerca - Administración Universal</h1>
                <p className="text-sm text-muted-foreground">Panel de Control Centralizado</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <Shield className="size-3 mr-1" />
                Administrador Universal
              </Badge>
              <Button variant="outline" size="sm" onClick={loadAdminData}>
                <RefreshCw className="size-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-8">
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="hospitals">Gestión Hospitales</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Resumen General */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Estadísticas Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Hospitales Activos</p>
                          <p className="text-2xl font-bold">{consolidatedStats.hospitalesActivos}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Building2 className="size-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="size-4 text-green-500 mr-1" />
                        <span className="text-green-500">100%</span>
                        <span className="text-muted-foreground ml-1">operativos</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Personal</p>
                          <p className="text-2xl font-bold">{consolidatedStats.totalPersonal.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Users className="size-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="size-4 text-green-500 mr-1" />
                        <span className="text-green-500">+5%</span>
                        <span className="text-muted-foreground ml-1">vs mes anterior</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Capacidad Total</p>
                          <p className="text-2xl font-bold">{consolidatedStats.totalCamas.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <Bed className="size-6 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <Activity className="size-4 text-blue-500 mr-1" />
                        <span className="text-blue-500">{consolidatedStats.tasaOcupacion}%</span>
                        <span className="text-muted-foreground ml-1">ocupación</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Citas Hoy</p>
                          <p className="text-2xl font-bold">{consolidatedStats.totalCitasHoy.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                          <Calendar className="size-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <Heart className="size-4 text-red-500 mr-1" />
                        <span className="text-red-500">{consolidatedStats.satisfaccionPromedio}</span>
                        <span className="text-muted-foreground ml-1">satisfacción</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Hospitales Destacados */}
              <Card>
                <CardHeader>
                  <CardTitle>Hospitales Destacados</CardTitle>
                  <CardDescription>
                    Principales centros médicos con mejor rendimiento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allHospitalsData.slice(0, 6).map((hospital) => (
                      <div key={hospital.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{hospital.nombre}</h4>
                            <p className="text-xs text-muted-foreground">
                              {hospital.municipio}, {hospital.departamento}
                            </p>
                          </div>
                          <Badge variant={hospital.tipo === 'PUBLICO' ? 'default' : 'secondary'}>
                            {hospital.tipo}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Personal:</span>
                            <span className="font-medium ml-1">{hospital.total_personal || 0}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Camas:</span>
                            <span className="font-medium ml-1">{hospital.capacidad_camas}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Citas:</span>
                            <span className="font-medium ml-1">{hospital.metricas?.total_citas || 0}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Nivel:</span>
                            <span className="font-medium ml-1">{hospital.nivel_complejidad}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleViewHospitalDetails(hospital.id.toString())}
                          >
                            <Eye className="size-3 mr-2" />
                            Detalles
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => onSelectHospital(hospital)}
                          >
                            Dashboard
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gestión de Hospitales */}
          <TabsContent value="hospitals">
            <div className="space-y-6">
              {/* Filtros */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar hospital..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos los departamentos</SelectItem>
                        {departamentos.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        {tipos.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Hospitales */}
              <div className="grid gap-4">
                {filteredHospitals.map((hospital) => (
                  <Card key={hospital.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                              <Building2 className="size-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{hospital.nombre}</h3>
                                <Badge variant={hospital.tipo === 'PUBLICO' ? 'default' : 'secondary'}>
                                  {hospital.tipo}
                                </Badge>
                                <Badge variant="outline">
                                  Nivel {hospital.nivel_complejidad}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="size-3" />
                                  {hospital.municipio}, {hospital.departamento}
                                </div>
                                {hospital.telefono && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="size-3" />
                                    {hospital.telefono}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Bed className="size-3" />
                                  {hospital.capacidad_camas} camas
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="size-3" />
                                  {hospital.total_personal || 0} personal
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="grid grid-cols-3 gap-4 text-center mr-4">
                            <div>
                              <p className="text-2xl font-bold text-blue-600">{hospital.metricas?.total_citas || 0}</p>
                              <p className="text-xs text-muted-foreground">Citas</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-600">{hospital.metricas?.citas_completadas || 0}</p>
                              <p className="text-xs text-muted-foreground">Completadas</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-purple-600">{hospital.metricas?.tasa_completacion || '0.0'}%</p>
                              <p className="text-xs text-muted-foreground">Efectividad</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              onClick={() => handleViewHospitalDetails(hospital.id.toString())}
                            >
                              <Eye className="size-4 mr-2" />
                              Ver Detalles
                            </Button>
                            <Button 
                              variant="default"
                              onClick={() => onSelectHospital(hospital)}
                            >
                              Dashboard
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analíticas */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analíticas del Sistema</CardTitle>
                <CardDescription>
                  Análisis detallado del rendimiento del sistema de salud
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="size-12 mx-auto mb-4 opacity-50" />
                  <p>Panel de analíticas en desarrollo</p>
                  <p className="text-sm">Próximamente: gráficos interactivos y análisis predictivo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reportes */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generador de Reportes</CardTitle>
                <CardDescription>
                  Genere reportes personalizados del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="size-12 mx-auto mb-4 opacity-50" />
                  <p>Generador de reportes en desarrollo</p>
                  <p className="text-sm">Próximamente: reportes automatizados y exportación de datos</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}