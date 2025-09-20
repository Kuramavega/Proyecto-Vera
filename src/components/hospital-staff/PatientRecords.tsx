import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText,
  Search,
  Plus,
  User,
  Calendar,
  Activity,
  Heart,
  Pill,
  FileImage,
  Download,
  Upload,
  Edit,
  Save,
  X,
  AlertTriangle,
  Clock,
  Phone,
  MapPin,
  Eye,
  History,
  TestTube,
  Stethoscope
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PatientRecordsProps {
  staffData: any;
}

// Mock patient data
const mockPatients = [
  {
    id: 'PAT001',
    name: 'María González Pérez',
    age: 45,
    gender: 'Femenino',
    phone: '8765-4321',
    email: 'maria.gonzalez@email.com',
    address: 'Barrio San José, Managua',
    bloodType: 'O+',
    emergencyContact: {
      name: 'Carlos González',
      phone: '8765-4322',
      relation: 'Esposo'
    },
    medicalHistory: [
      {
        id: 1,
        date: '2024-08-20',
        doctor: 'Dr. Carlos Mendoza',
        diagnosis: 'Diabetes Tipo 2',
        treatment: 'Metformina 500mg',
        notes: 'Control rutinario, niveles estables'
      },
      {
        id: 2,
        date: '2024-07-15',
        doctor: 'Dra. Ana Herrera',
        diagnosis: 'Hipertensión',
        treatment: 'Enalapril 10mg',
        notes: 'Presión arterial controlada'
      }
    ],
    labResults: [
      {
        id: 1,
        date: '2024-08-18',
        type: 'Glucosa en ayunas',
        result: '110 mg/dL',
        status: 'normal',
        reference: '70-100 mg/dL'
      },
      {
        id: 2,
        date: '2024-08-18',
        type: 'Hemoglobina A1c',
        result: '6.8%',
        status: 'elevated',
        reference: '<7%'
      }
    ],
    medications: [
      {
        id: 1,
        name: 'Metformina',
        dosage: '500mg',
        frequency: '2 veces al día',
        prescribed: '2024-01-15',
        prescribedBy: 'Dr. Carlos Mendoza'
      },
      {
        id: 2,
        name: 'Enalapril',
        dosage: '10mg',
        frequency: '1 vez al día',
        prescribed: '2024-02-20',
        prescribedBy: 'Dra. Ana Herrera'
      }
    ],
    allergies: ['Penicilina', 'Mariscos'],
    vitals: {
      lastUpdate: '2024-08-20',
      bloodPressure: '130/80',
      heartRate: '72',
      temperature: '36.5',
      weight: '68',
      height: '165'
    }
  },
  {
    id: 'PAT002',
    name: 'Roberto Vega Martínez',
    age: 32,
    gender: 'Masculino',
    phone: '8912-3456',
    email: 'roberto.vega@email.com',
    address: 'Colonia Centro América, Managua',
    bloodType: 'A+',
    emergencyContact: {
      name: 'Ana Vega',
      phone: '8912-3457',
      relation: 'Madre'
    },
    medicalHistory: [
      {
        id: 1,
        date: '2024-08-10',
        doctor: 'Dra. Patricia Ruiz',
        diagnosis: 'Post-operatorio Apendicectomía',
        treatment: 'Antibióticos, reposo',
        notes: 'Recuperación satisfactoria'
      }
    ],
    labResults: [
      {
        id: 1,
        date: '2024-08-08',
        type: 'Hemograma completo',
        result: 'Normal',
        status: 'normal',
        reference: 'Valores normales'
      }
    ],
    medications: [
      {
        id: 1,
        name: 'Amoxicilina',
        dosage: '500mg',
        frequency: '3 veces al día',
        prescribed: '2024-08-10',
        prescribedBy: 'Dra. Patricia Ruiz'
      }
    ],
    allergies: [],
    vitals: {
      lastUpdate: '2024-08-20',
      bloodPressure: '120/80',
      heartRate: '68',
      temperature: '36.2',
      weight: '75',
      height: '178'
    }
  }
];

export function PatientRecords({ staffData }: PatientRecordsProps) {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingRecord, setIsEditingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    treatment: '',
    notes: ''
  });

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsEditingRecord(false);
  };

  const handleAddRecord = () => {
    if (!newRecord.diagnosis || !newRecord.treatment) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    const record = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      doctor: staffData.name,
      ...newRecord
    };

    setSelectedPatient(prev => ({
      ...prev,
      medicalHistory: [record, ...prev.medicalHistory]
    }));

    setNewRecord({ diagnosis: '', treatment: '', notes: '' });
    setIsEditingRecord(false);
    toast.success('Registro médico agregado exitosamente');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'elevated': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expedientes Clínicos</h2>
          <p className="text-muted-foreground">
            Gestión completa de historiales médicos electrónicos
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-green-500">
          <Plus className="size-4 mr-2" />
          Nuevo Paciente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="size-5" />
                <span>Lista de Pacientes</span>
              </CardTitle>
              <CardDescription>
                Selecciona un paciente para ver su expediente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    placeholder="Buscar paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        selectedPatient?.id === patient.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                      }`}
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <User className="size-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                          <p className="text-xs text-muted-foreground">{patient.age} años • {patient.gender}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Info Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <User className="size-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{selectedPatient.name}</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="size-4" />
                            <span>ID: {selectedPatient.id}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="size-4" />
                            <span>{selectedPatient.age} años • {selectedPatient.gender}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="size-4" />
                            <span>{selectedPatient.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="size-4" />
                            <span>Tipo: {selectedPatient.bloodType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="size-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="size-4 mr-1" />
                        Exportar
                      </Button>
                    </div>
                  </div>

                  {/* Allergies */}
                  {selectedPatient.allergies.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="size-4 text-red-600" />
                        <span className="font-medium text-red-800 dark:text-red-300">Alergias:</span>
                        <div className="flex space-x-2">
                          {selectedPatient.allergies.map((allergy: string, index: number) => (
                            <Badge key={index} className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="history" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="history">Historial</TabsTrigger>
                  <TabsTrigger value="vitals">Vitales</TabsTrigger>
                  <TabsTrigger value="medications">Medicamentos</TabsTrigger>
                  <TabsTrigger value="labs">Laboratorios</TabsTrigger>
                  <TabsTrigger value="images">Imágenes</TabsTrigger>
                </TabsList>

                {/* Medical History */}
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center space-x-2">
                          <History className="size-5" />
                          <span>Historial Médico</span>
                        </CardTitle>
                        <Button 
                          onClick={() => setIsEditingRecord(!isEditingRecord)}
                          className="bg-gradient-to-r from-blue-500 to-green-500"
                        >
                          <Plus className="size-4 mr-2" />
                          Nuevo Registro
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* New Record Form */}
                      {isEditingRecord && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <h4 className="font-medium mb-4">Nuevo Registro Médico</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Diagnóstico *</label>
                              <Input
                                placeholder="Ej: Diabetes Tipo 2"
                                value={newRecord.diagnosis}
                                onChange={(e) => setNewRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Tratamiento *</label>
                              <Input
                                placeholder="Ej: Metformina 500mg"
                                value={newRecord.treatment}
                                onChange={(e) => setNewRecord(prev => ({ ...prev, treatment: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="text-sm font-medium mb-2 block">Notas</label>
                            <Textarea
                              placeholder="Notas adicionales sobre la consulta..."
                              value={newRecord.notes}
                              onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                              rows={3}
                            />
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button onClick={handleAddRecord}>
                              <Save className="size-4 mr-2" />
                              Guardar
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditingRecord(false)}>
                              <X className="size-4 mr-2" />
                              Cancelar
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Medical History List */}
                      <div className="space-y-4">
                        {selectedPatient.medicalHistory.map((record: any) => (
                          <div key={record.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold">{record.diagnosis}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {record.doctor} • {new Date(record.date).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                              <Badge variant="outline">
                                <Stethoscope className="size-3 mr-1" />
                                Consulta
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Tratamiento:</span>
                                <p className="text-muted-foreground">{record.treatment}</p>
                              </div>
                              {record.notes && (
                                <div>
                                  <span className="font-medium">Notas:</span>
                                  <p className="text-muted-foreground">{record.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Vital Signs */}
                <TabsContent value="vitals">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="size-5" />
                        <span>Signos Vitales</span>
                      </CardTitle>
                      <CardDescription>
                        Última actualización: {new Date(selectedPatient.vitals.lastUpdate).toLocaleDateString('es-ES')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Heart className="size-4 text-red-500" />
                            <span className="text-sm font-medium">Presión Arterial</span>
                          </div>
                          <p className="text-2xl font-bold">{selectedPatient.vitals.bloodPressure}</p>
                          <p className="text-xs text-muted-foreground">mmHg</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Activity className="size-4 text-blue-500" />
                            <span className="text-sm font-medium">Freq. Cardíaca</span>
                          </div>
                          <p className="text-2xl font-bold">{selectedPatient.vitals.heartRate}</p>
                          <p className="text-xs text-muted-foreground">lpm</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="size-4 text-orange-500" />
                            <span className="text-sm font-medium">Temperatura</span>
                          </div>
                          <p className="text-2xl font-bold">{selectedPatient.vitals.temperature}</p>
                          <p className="text-xs text-muted-foreground">°C</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="size-4 text-green-500" />
                            <span className="text-sm font-medium">Peso</span>
                          </div>
                          <p className="text-2xl font-bold">{selectedPatient.vitals.weight}</p>
                          <p className="text-xs text-muted-foreground">kg</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="size-4 text-purple-500" />
                            <span className="text-sm font-medium">Altura</span>
                          </div>
                          <p className="text-2xl font-bold">{selectedPatient.vitals.height}</p>
                          <p className="text-xs text-muted-foreground">cm</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Activity className="size-4 text-indigo-500" />
                            <span className="text-sm font-medium">IMC</span>
                          </div>
                          <p className="text-2xl font-bold">
                            {(parseFloat(selectedPatient.vitals.weight) / Math.pow(parseFloat(selectedPatient.vitals.height) / 100, 2)).toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">kg/m²</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Medications */}
                <TabsContent value="medications">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Pill className="size-5" />
                        <span>Medicamentos Actuales</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedPatient.medications.map((medication: any) => (
                          <div key={medication.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{medication.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {medication.dosage} • {medication.frequency}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Prescrito por {medication.prescribedBy} el {new Date(medication.prescribed).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                Activo
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Lab Results */}
                <TabsContent value="labs">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TestTube className="size-5" />
                        <span>Resultados de Laboratorio</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedPatient.labResults.map((result: any) => (
                          <div key={result.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{result.type}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(result.date).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                              <Badge className={getStatusColor(result.status)}>
                                {result.status}
                              </Badge>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Resultado:</span>
                                <p className="text-muted-foreground">{result.result}</p>
                              </div>
                              <div>
                                <span className="font-medium">Referencia:</span>
                                <p className="text-muted-foreground">{result.reference}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Medical Images */}
                <TabsContent value="images">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileImage className="size-5" />
                        <span>Imágenes Médicas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <FileImage className="size-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                          No hay imágenes disponibles
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Las imágenes médicas aparecerán aquí
                        </p>
                        <Button variant="outline">
                          <Upload className="size-4 mr-2" />
                          Subir Imagen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Selecciona un paciente
                </h3>
                <p className="text-muted-foreground">
                  Elige un paciente de la lista para ver su expediente clínico completo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}