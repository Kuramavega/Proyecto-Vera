import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Building2,
  Users,
  Bed,
  Activity,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Stethoscope,
  Heart,
  UserCheck,
  Award,
  Shield,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Star,
  Target
} from 'lucide-react';
import { databaseService } from '../../services/database';

interface HospitalDetailsProps {
  hospitalId: string;
  onBack: () => void;
  isAdminView?: boolean;
}

export function HospitalDetails({ hospitalId, onBack, isAdminView = false }: HospitalDetailsProps) {
  const [hospitalData, setHospitalData] = useState<any>(null);
  const [personalData, setPersonalData] = useState<any[]>([]);
  const [metricas, setMetricas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadHospitalDetails();
  }, [hospitalId]);

  const loadHospitalDetails = async () => {
    try {
      setLoading(true);
      
      // Cargar datos del hospital
      const hospital = await databaseService.getHospitalById(parseInt(hospitalId));
      setHospitalData(hospital);

      // Cargar personal del hospital
      const personal = await databaseService.getPersonalByHospital(parseInt(hospitalId));
      setPersonalData(personal);

      // Cargar métricas
      const hospitalMetricas = await databaseService.getMetricasHospital(parseInt(hospitalId));
      setMetricas(hospitalMetricas);

    } catch (error) {
      console.error('Error cargando detalles del hospital:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="size-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p>Cargando detalles del hospital...</p>
        </div>
      </div>
    );
  }

  if (!hospitalData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="size-12 mx-auto mb-4 text-muted-foreground" />
        <p>No se pudo cargar la información del hospital</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="size-4 mr-2" />
          Volver
        </Button>
      </div>
    );
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'INACTIVO': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'MANTENIMIENTO': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'PUBLICO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'PRIVADO': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'MIXTO': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="size-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{hospitalData.nombre}</h1>
            <p className="text-muted-foreground">
              {hospitalData.municipio}, {hospitalData.departamento}
            </p>
          </div>
        </div>
        
        {isAdminView && (
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Edit className="size-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline">
              <Download className="size-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={loadHospitalDetails}>
              <RefreshCw className="size-4 mr-2" />
              Actualizar
            </Button>
          </div>
        )}
      </div>

      {/* Información Básica */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Building2 className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Código</p>
                <p className="font-semibold">{hospitalData.codigo_establecimiento}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge className={getTipoColor(hospitalData.tipo)}>
                {hospitalData.tipo}
              </Badge>
              <div>
                <p className="text-sm text-muted-foreground">Nivel</p>
                <p className="font-semibold">{hospitalData.nivel_complejidad}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Bed className="size-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Capacidad</p>
                <p className="font-semibold">{hospitalData.capacidad_camas} camas</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(hospitalData.estado)}>
                {hospitalData.estado}
              </Badge>
              <div>
                <p className="text-sm text-muted-foreground">Fundado</p>
                <p className="font-semibold">{hospitalData.ano_fundacion || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {hospitalData.telefono && (
              <div className="flex items-center space-x-2">
                <Phone className="size-4 text-muted-foreground" />
                <span>{hospitalData.telefono}</span>
              </div>
            )}
            {hospitalData.email && (
              <div className="flex items-center space-x-2">
                <Mail className="size-4 text-muted-foreground" />
                <span>{hospitalData.email}</span>
              </div>
            )}
            {hospitalData.website && (
              <div className="flex items-center space-x-2">
                <Globe className="size-4 text-muted-foreground" />
                <a href={hospitalData.website} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  Sitio web
                </a>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span>{hospitalData.direccion}</span>
            </div>
            {hospitalData.director_medico && (
              <div className="flex items-center space-x-2">
                <UserCheck className="size-4 text-muted-foreground" />
                <span>Director: {hospitalData.director_medico}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      {metricas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Citas</p>
                  <p className="text-2xl font-bold">{metricas.total_citas}</p>
                </div>
                <Calendar className="size-8 text-blue-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="size-4 text-green-500 mr-1" />
                <span className="text-green-500">+12%</span>
                <span className="text-muted-foreground ml-1">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                  <p className="text-2xl font-bold">{metricas.citas_completadas}</p>
                </div>
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Tasa de éxito</span>
                  <span className="font-medium">{metricas.tasa_completacion}%</span>
                </div>
                <Progress value={parseFloat(metricas.tasa_completacion)} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Personal Activo</p>
                  <p className="text-2xl font-bold">{personalData.length}</p>
                </div>
                <Users className="size-8 text-purple-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Users className="size-4 text-muted-foreground mr-1" />
                <span>{personalData.filter(p => p.es_medico).length} médicos</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Satisfacción</p>
                  <p className="text-2xl font-bold">{metricas.satisfaccion_promedio}</p>
                </div>
                <Star className="size-8 text-yellow-600" />
              </div>
              <div className="mt-2">
                <div className="flex items-center text-sm">
                  <Heart className="size-4 text-red-500 mr-1" />
                  <span>Tiempo espera: {metricas.tiempo_promedio_espera}min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs de Detalles */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="specialties">Especialidades</TabsTrigger>
          <TabsTrigger value="staff">Personal</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
          <TabsTrigger value="areas">Áreas</TabsTrigger>
        </TabsList>

        {/* Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Especialidades Médicas</CardTitle>
                <CardDescription>
                  {hospitalData.especialidades?.length || 0} especialidades disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hospitalData.especialidades?.map((especialidad: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {especialidad}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Servicios</CardTitle>
                <CardDescription>
                  {hospitalData.servicios?.length || 0} servicios disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hospitalData.servicios?.map((servicio: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {servicio}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {hospitalData.certificaciones && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="size-5" />
                  <span>Certificaciones y Acreditaciones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hospitalData.certificaciones.map((cert: string, index: number) => (
                    <Badge key={index} className="bg-gold-100 text-gold-800">
                      <Shield className="size-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Especialidades */}
        <TabsContent value="specialties">
          <Card>
            <CardHeader>
              <CardTitle>Especialidades Médicas Disponibles</CardTitle>
              <CardDescription>
                Lista completa de especialidades y servicios médicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospitalData.especialidades?.map((especialidad: string, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="size-6 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">{especialidad}</h4>
                        <p className="text-sm text-muted-foreground">
                          {personalData.filter(p => p.especialidad_nombre === especialidad).length} médicos
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Personal Hospitalario</CardTitle>
              <CardDescription>
                {personalData.length} miembros del personal registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalData.map((persona) => (
                  <div key={persona.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        {persona.es_medico ? (
                          <Stethoscope className="size-6 text-white" />
                        ) : (
                          <UserCheck className="size-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{persona.nombre_completo}</h4>
                        <p className="text-sm text-muted-foreground">{persona.rol_nombre}</p>
                        {persona.especialidad_nombre && (
                          <p className="text-xs text-blue-600">{persona.especialidad_nombre}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Phone className="size-3" />
                        <span>{persona.telefono}</span>
                      </div>
                      <Badge variant="outline">
                        {persona.estado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recursos */}
        <TabsContent value="resources">
          <div className="space-y-6">
            {hospitalData.recursos?.map((categoria: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{categoria.categoria}</CardTitle>
                  <CardDescription>
                    {categoria.items.length} equipos registrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoria.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{item.nombre}</h5>
                          <Badge className={getStatusColor(item.estado)}>
                            {item.estado}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Cantidad: {item.cantidad}</p>
                          {item.ubicacion && <p>Ubicación: {item.ubicacion}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Áreas */}
        <TabsContent value="areas">
          <div className="space-y-4">
            {hospitalData.areas?.map((area: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">{area.nombre}</h4>
                      <p className="text-sm text-muted-foreground">{area.tipo}</p>
                    </div>
                    <Badge className={getStatusColor(area.estado)}>
                      {area.estado}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {area.capacidad_pacientes && (
                      <div>
                        <strong>Capacidad:</strong> {area.capacidad_pacientes} pacientes
                      </div>
                    )}
                    <div>
                      <strong>Personal:</strong> {area.personal_asignado} personas
                    </div>
                    <div>
                      <strong>Horario:</strong> {area.horario_funcionamiento}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Especialidades:</h5>
                    <div className="flex flex-wrap gap-1">
                      {area.especialidades.map((esp: string, espIndex: number) => (
                        <Badge key={espIndex} variant="outline" className="text-xs">
                          {esp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Equipos Principales:</h5>
                    <div className="flex flex-wrap gap-1">
                      {area.equipos_principales.map((equipo: string, equipoIndex: number) => (
                        <Badge key={equipoIndex} variant="secondary" className="text-xs">
                          {equipo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}