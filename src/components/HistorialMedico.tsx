import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  Stethoscope,
  Pill,
  TestTube,
  Heart,
  Download,
  Search,
  Filter,
  Eye,
  Printer,
  Share,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { registrarActividad } from '../hooks/useHealthIndex';

interface RegistroMedico {
  id: string;
  fecha: string;
  tipo: 'CONSULTA' | 'EXAMEN' | 'PROCEDIMIENTO' | 'VACUNA' | 'EMERGENCIA';
  especialidad: string;
  doctor: string;
  hospital: string;
  diagnostico: string;
  tratamiento: string;
  medicamentos: {
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
  }[];
  examenes: {
    tipo: string;
    resultado: string;
    valores: string;
    estado: 'NORMAL' | 'ANORMAL' | 'PENDIENTE';
  }[];
  observaciones: string;
  proximaRevision?: string;
  archivos: {
    nombre: string;
    tipo: 'RECETA' | 'EXAMEN' | 'INFORME' | 'IMAGEN';
    url: string;
  }[];
  estado: 'ACTIVO' | 'COMPLETADO' | 'CANCELADO';
}

interface HistorialMedicoProps {
  onBack: () => void;
}

const mockHistorial: RegistroMedico[] = [
  {
    id: '1',
    fecha: '2025-01-08',
    tipo: 'CONSULTA',
    especialidad: 'Dermatología',
    doctor: 'Dra. Patricia López',
    hospital: 'Hospital Alemán Nicaragüense',
    diagnostico: 'Nevus atípico - Control preventivo',
    tratamiento: 'Seguimiento dermatológico preventivo. Aplicación diaria de protector solar.',
    medicamentos: [
      {
        nombre: 'Protector Solar SPF 50+',
        dosis: 'Aplicar generosamente',
        frecuencia: 'Diariamente',
        duracion: 'Uso continuo'
      }
    ],
    examenes: [
      {
        tipo: 'Dermatoscopia Digital',
        resultado: 'Patrón benigno confirmado',
        valores: 'ABCD Score: 3.2 (Benigno)',
        estado: 'NORMAL'
      }
    ],
    observaciones: 'Evolución favorable. No se encontraron cambios malignos. Continuar con protección solar y controles semestrales.',
    proximaRevision: '2025-07-08',
    archivos: [
      { nombre: 'Dermatoscopia_01082025.pdf', tipo: 'EXAMEN', url: '#' },
      { nombre: 'Receta_Protector_Solar.pdf', tipo: 'RECETA', url: '#' }
    ],
    estado: 'COMPLETADO'
  },
  {
    id: '2',
    fecha: '2025-01-02',
    tipo: 'EXAMEN',
    especialidad: 'Cardiología',
    doctor: 'Dr. Roberto Sánchez',
    hospital: 'Hospital Metropolitano Vivian Pellas',
    diagnostico: 'Control post-operatorio - Evolución satisfactoria',
    tratamiento: 'Continuar con medicación antihipertensiva. Dieta baja en sodio.',
    medicamentos: [
      {
        nombre: 'Losartán',
        dosis: '50 mg',
        frecuencia: '1 vez al día',
        duracion: '3 meses'
      },
      {
        nombre: 'Atorvastatina',
        dosis: '20 mg',
        frecuencia: '1 vez por la noche',
        duracion: '3 meses'
      }
    ],
    examenes: [
      {
        tipo: 'Electrocardiograma',
        resultado: 'Ritmo sinusal normal',
        valores: 'FC: 72 lpm, QRS: 0.08 s',
        estado: 'NORMAL'
      },
      {
        tipo: 'Ecocardiograma',
        resultado: 'Función sistólica conservada',
        valores: 'FEVI: 65%, Septum: 0.9 cm',
        estado: 'NORMAL'
      },
      {
        tipo: 'Perfil Lipídico',
        resultado: 'Colesterol controlado',
        valores: 'CT: 180 mg/dl, LDL: 110 mg/dl',
        estado: 'NORMAL'
      }
    ],
    observaciones: 'Excelente evolución post-quirúrgica. Parámetros cardiovasculares estables. Continuar con tratamiento actual.',
    proximaRevision: '2025-04-02',
    archivos: [
      { nombre: 'ECG_02012025.pdf', tipo: 'EXAMEN', url: '#' },
      { nombre: 'Ecocardiograma_02012025.pdf', tipo: 'EXAMEN', url: '#' },
      { nombre: 'Receta_Cardiologia.pdf', tipo: 'RECETA', url: '#' }
    ],
    estado: 'ACTIVO'
  },
  {
    id: '3',
    fecha: '2024-12-15',
    tipo: 'CONSULTA',
    especialidad: 'Medicina General',
    doctor: 'Dr. Carlos Méndez Gutiérrez',
    hospital: 'Hospital Metropolitano Vivian Pellas',
    diagnostico: 'Hipertensión Arterial Esencial - Control rutinario',
    tratamiento: 'Ajuste de medicación antihipertensiva. Recomendaciones dietéticas.',
    medicamentos: [
      {
        nombre: 'Losartán',
        dosis: '50 mg',
        frecuencia: '1 vez al día',
        duracion: '3 meses'
      }
    ],
    examenes: [
      {
        tipo: 'Presión Arterial',
        resultado: 'Controlada con medicación',
        valores: '130/80 mmHg',
        estado: 'NORMAL'
      },
      {
        tipo: 'Glucemia',
        resultado: 'Normal',
        valores: '95 mg/dl',
        estado: 'NORMAL'
      }
    ],
    observaciones: 'Control rutinario satisfactorio. Presión arterial bien controlada con la medicación actual.',
    proximaRevision: '2025-03-15',
    archivos: [
      { nombre: 'Receta_Medicina_General.pdf', tipo: 'RECETA', url: '#' }
    ],
    estado: 'ACTIVO'
  },
  {
    id: '4',
    fecha: '2024-11-20',
    tipo: 'VACUNA',
    especialidad: 'Medicina Preventiva',
    doctor: 'Enf. Ana María Solórzano',
    hospital: 'Hospital Bautista',
    diagnostico: 'Inmunización - Vacuna Influenza 2024-2025',
    tratamiento: 'Administración de vacuna antigripal estacional.',
    medicamentos: [],
    examenes: [],
    observaciones: 'Vacunación completada sin complicaciones. Próxima dosis en temporada 2025-2026.',
    proximaRevision: '2025-11-20',
    archivos: [
      { nombre: 'Certificado_Vacuna_Influenza.pdf', tipo: 'INFORME', url: '#' }
    ],
    estado: 'COMPLETADO'
  },
  {
    id: '5',
    fecha: '2024-10-08',
    tipo: 'EMERGENCIA',
    especialidad: 'Medicina de Urgencias',
    doctor: 'Dr. Luis Alberto Herrera',
    hospital: 'Hospital San Francisco de Asís',
    diagnostico: 'Gastroenteritis aguda - Tratamiento sintomático',
    tratamiento: 'Hidratación oral, dieta blanda, medicación sintomática.',
    medicamentos: [
      {
        nombre: 'Suero Oral',
        dosis: '1 sobre',
        frecuencia: 'Cada 6 horas',
        duracion: '3 días'
      },
      {
        nombre: 'Loperamida',
        dosis: '2 mg',
        frecuencia: 'Según necesidad',
        duracion: '2 días'
      }
    ],
    examenes: [
      {
        tipo: 'Coprocultivo',
        resultado: 'Negativo para patógenos',
        valores: 'Flora normal',
        estado: 'NORMAL'
      }
    ],
    observaciones: 'Cuadro autolimitado resuelto satisfactoriamente. Sin complicaciones.',
    archivos: [
      { nombre: 'Informe_Urgencias.pdf', tipo: 'INFORME', url: '#' }
    ],
    estado: 'COMPLETADO'
  }
];

const tipoConfig = {
  'CONSULTA': {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    icon: Stethoscope,
    label: 'Consulta'
  },
  'EXAMEN': {
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    icon: TestTube,
    label: 'Examen'
  },
  'PROCEDIMIENTO': {
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    icon: Activity,
    label: 'Procedimiento'
  },
  'VACUNA': {
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    icon: Heart,
    label: 'Vacuna'
  },
  'EMERGENCIA': {
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    icon: AlertTriangle,
    label: 'Emergencia'
  }
};

const estadoExamenConfig = {
  'NORMAL': { color: 'text-green-600 dark:text-green-400', icon: CheckCircle },
  'ANORMAL': { color: 'text-red-600 dark:text-red-400', icon: AlertTriangle },
  'PENDIENTE': { color: 'text-yellow-600 dark:text-yellow-400', icon: Clock }
};

export function HistorialMedico({ onBack }: HistorialMedicoProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [historial, setHistorial] = useState<RegistroMedico[]>(mockHistorial);
  const [filteredHistorial, setFilteredHistorial] = useState<RegistroMedico[]>(mockHistorial);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('TODOS');
  const [especialidadFilter, setEspecialidadFilter] = useState('TODAS');
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroMedico | null>(null);
  const [activeTab, setActiveTab] = useState('historial');

  const especialidades = [
    'TODAS',
    ...Array.from(new Set(mockHistorial.map(r => r.especialidad))).sort()
  ];

  useEffect(() => {
    // Registrar que el usuario revisó su historial médico
    registrarActividad('historial_revisado');
    
    let filtered = historial;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(registro => 
        registro.diagnostico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.tratamiento.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (tipoFilter !== 'TODOS') {
      filtered = filtered.filter(registro => registro.tipo === tipoFilter);
    }

    // Filtrar por especialidad
    if (especialidadFilter !== 'TODAS') {
      filtered = filtered.filter(registro => registro.especialidad === especialidadFilter);
    }

    // Ordenar por fecha (más recientes primero)
    filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    setFilteredHistorial(filtered);
  }, [historial, searchTerm, tipoFilter, especialidadFilter]);

  const formatDate = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const RegistroCard = ({ registro }: { registro: RegistroMedico }) => {
    const tipo = tipoConfig[registro.tipo];
    const IconComponent = tipo.icon;

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
                <div className={`rounded-full p-2 ${tipo.color.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-').replace('-700', '-600').replace('-300', '-400')}`}>
                  <IconComponent className="size-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{registro.especialidad}</h3>
                    <Badge className={`${tipo.color} border-0`}>
                      {tipo.label}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{formatDate(registro.fecha)}</p>
                </div>
              </div>
              <Badge 
                variant={registro.estado === 'ACTIVO' ? 'default' : 'outline'}
                className={registro.estado === 'ACTIVO' ? 'bg-green-100 text-green-700 border-0' : ''}
              >
                {registro.estado}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Diagnóstico:</h4>
                <p className="text-sm text-muted-foreground">{registro.diagnostico}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Doctor:</h4>
                <p className="text-sm text-muted-foreground">{registro.doctor} - {registro.hospital}</p>
              </div>

              {registro.tratamiento && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Tratamiento:</h4>
                  <p className="text-sm text-muted-foreground">{registro.tratamiento}</p>
                </div>
              )}
            </div>

            {/* Medicamentos */}
            {registro.medicamentos.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-sm text-blue-800 dark:text-blue-400 mb-2 flex items-center">
                  <Pill className="size-4 mr-1" />
                  Medicamentos:
                </h4>
                <div className="space-y-2">
                  {registro.medicamentos.map((med, index) => (
                    <div key={index} className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-medium">{med.nombre}</span> - {med.dosis} - {med.frecuencia}
                      {med.duracion && ` por ${med.duracion}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exámenes */}
            {registro.examenes.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-sm text-purple-800 dark:text-purple-400 mb-2 flex items-center">
                  <TestTube className="size-4 mr-1" />
                  Exámenes:
                </h4>
                <div className="space-y-2">
                  {registro.examenes.map((examen, index) => {
                    const estadoConfig = estadoExamenConfig[examen.estado];
                    const EstadoIcon = estadoConfig.icon;
                    
                    return (
                      <div key={index} className="flex items-start space-x-2">
                        <EstadoIcon className={`size-4 mt-0.5 ${estadoConfig.color}`} />
                        <div className="text-sm text-purple-700 dark:text-purple-300">
                          <div className="font-medium">{examen.tipo}</div>
                          <div>{examen.resultado} - {examen.valores}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Próxima revisión */}
            {registro.proximaRevision && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-sm text-orange-800 dark:text-orange-400 mb-1 flex items-center">
                  <Calendar className="size-4 mr-1" />
                  Próxima revisión:
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  {formatDate(registro.proximaRevision)}
                </p>
              </div>
            )}

            {/* Archivos */}
            {registro.archivos.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Documentos:</h4>
                <div className="flex flex-wrap gap-2">
                  {registro.archivos.map((archivo, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted">
                      <FileText className="size-3 mr-1" />
                      {archivo.nombre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRegistro(registro)}
              >
                <Eye className="size-4 mr-1" />
                Ver Detalles
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                >
                  <Printer className="size-4 mr-1" />
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Simular descarga
                    const link = document.createElement('a');
                    link.download = `historial_${registro.fecha}.pdf`;
                    link.click();
                  }}
                >
                  <Download className="size-4 mr-1" />
                  Descargar
                </Button>
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
              <h1 className="ml-4 text-xl font-semibold">Mi Historial Médico</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              {filteredHistorial.length} registros
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    placeholder="Buscar en historial..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de registro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos los tipos</SelectItem>
                    <SelectItem value="CONSULTA">Consultas</SelectItem>
                    <SelectItem value="EXAMEN">Exámenes</SelectItem>
                    <SelectItem value="PROCEDIMIENTO">Procedimientos</SelectItem>
                    <SelectItem value="VACUNA">Vacunas</SelectItem>
                    <SelectItem value="EMERGENCIA">Emergencias</SelectItem>
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
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="historial">Historial Completo</TabsTrigger>
              <TabsTrigger value="medicamentos">Medicamentos Activos</TabsTrigger>
              <TabsTrigger value="examenes">Resultados de Exámenes</TabsTrigger>
            </TabsList>

            <TabsContent value="historial" className="mt-6">
              {filteredHistorial.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No se encontraron registros
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || tipoFilter !== 'TODOS' 
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Tu historial médico aparecerá aquí'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistorial.map((registro, index) => (
                    <motion.div
                      key={registro.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RegistroCard registro={registro} />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="medicamentos" className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="size-6 mr-2" />
                    Medicamentos Activos
                  </CardTitle>
                  <CardDescription>
                    Medicamentos que debes tomar actualmente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockHistorial
                      .filter(r => r.estado === 'ACTIVO' && r.medicamentos.length > 0)
                      .flatMap(r => r.medicamentos.map(med => ({ ...med, fecha: r.fecha })))
                      .map((med, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{med.nombre}</h4>
                            <p className="text-sm text-muted-foreground">
                              {med.dosis} - {med.frecuencia} - {med.duracion}
                            </p>
                          </div>
                          <Badge variant="outline">Activo</Badge>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examenes" className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="size-6 mr-2" />
                    Resultados de Exámenes
                  </CardTitle>
                  <CardDescription>
                    Historial completo de exámenes y resultados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockHistorial
                      .filter(r => r.examenes.length > 0)
                      .flatMap(r => r.examenes.map(ex => ({ 
                        ...ex, 
                        fecha: r.fecha, 
                        doctor: r.doctor,
                        hospital: r.hospital 
                      })))
                      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                      .map((examen, index) => {
                        const estadoConfig = estadoExamenConfig[examen.estado];
                        const EstadoIcon = estadoConfig.icon;
                        
                        return (
                          <div key={index} className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <EstadoIcon className={`size-5 mt-0.5 ${estadoConfig.color}`} />
                              <div>
                                <h4 className="font-medium">{examen.tipo}</h4>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {examen.resultado}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(examen.fecha)} - {examen.doctor}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={estadoConfig.color} variant="outline">
                                {examen.estado}
                              </Badge>
                              <p className="text-sm font-mono mt-1">{examen.valores}</p>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Resumen estadístico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mockHistorial.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Registros</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockHistorial.filter(r => r.estado === 'ACTIVO').length}
              </div>
              <div className="text-sm text-muted-foreground">Tratamientos Activos</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mockHistorial.filter(r => r.examenes.length > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Exámenes Realizados</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {mockHistorial.filter(r => r.proximaRevision && new Date(r.proximaRevision) > new Date()).length}
              </div>
              <div className="text-sm text-muted-foreground">Próximas Revisiones</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}