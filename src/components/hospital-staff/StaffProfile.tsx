import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Stethoscope,
  Shield,
  Palette,
  Globe,
  Bell,
  Lock,
  Save,
  Camera,
  Edit,
  Calendar,
  Activity,
  Award,
  Settings,
  Moon,
  Sun,
  Languages,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface StaffProfileProps {
  staffData: any;
  onBack: () => void;
  onUpdateProfile?: (data: any) => void;
}

export function StaffProfile({ staffData, onBack, onUpdateProfile }: StaffProfileProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    appointments: true,
    emergencies: true,
    reports: false,
    system: true
  });

  const [profileData, setProfileData] = useState({
    name: staffData.name || 'Dr. Carlos Mendoza',
    email: staffData.email || 'carlos.mendoza@hospital.com',
    phone: '+505 8765-4321',
    position: staffData.rol || 'Médico',
    department: staffData.departamento || 'Cardiología',
    hospital: staffData.hospitalInfo?.nombre || 'Hospital Metropolitano Vivian Pellas',
    licenseNumber: staffData.numeroLicencia || 'MED-2024-001234',
    specialization: 'Cardiología Intervencionista',
    experience: '15 años',
    education: 'Universidad Nacional Autónoma de Nicaragua'
  });

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(profileData);
    }
    setIsEditing(false);
    toast.success('Perfil actualizado exitosamente');
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success('Configuración de notificaciones actualizada');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="size-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="text-right">
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
            <p className="text-muted-foreground">Gestiona tu información y preferencias</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="size-12 text-white" />
                    </div>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      onClick={() => toast.info('Función de cambio de foto próximamente')}
                    >
                      <Camera className="size-4" />
                    </Button>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{profileData.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <Stethoscope className="size-4" />
                      <span>{profileData.position}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Building2 className="size-4" />
                      <span>{profileData.department}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="size-4" />
                      <span>{profileData.hospital}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{profileData.experience}</p>
                      <p className="text-xs text-muted-foreground">Experiencia</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-lg font-bold text-green-600">4.8★</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="size-4 mr-2" />
                    {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="size-5" />
                  <span>Actividad Reciente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pacientes Hoy</span>
                    <Badge>12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Citas Completadas</span>
                    <Badge variant="outline">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pendientes</span>
                    <Badge variant="secondary">4</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="size-5" />
                  <span>Información Personal</span>
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal y profesional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre Completo</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">{profileData.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Correo Electrónico</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">{profileData.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">{profileData.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Número de Licencia</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.licenseNumber}
                        onChange={(e) => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">{profileData.licenseNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Especialización</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.specialization}
                        onChange={(e) => setProfileData(prev => ({ ...prev, specialization: e.target.value }))}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">{profileData.specialization}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Educación</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.education}
                        onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded">{profileData.education}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSave}>
                      <Save className="size-4 mr-2" />
                      Guardar Cambios
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="size-5" />
                  <span>Apariencia e Idioma</span>
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia y el idioma del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {theme === 'dark' ? <Moon className="size-5" /> : <Sun className="size-5" />}
                    <div>
                      <Label>Tema</Label>
                      <p className="text-sm text-muted-foreground">
                        {theme === 'dark' ? 'Modo oscuro activo' : 'Modo claro activo'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Languages className="size-5" />
                    <div>
                      <Label>Idioma</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Español' : 'English'}
                      </p>
                    </div>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="size-5" />
                  <span>Notificaciones</span>
                </CardTitle>
                <CardDescription>
                  Configura tus preferencias de notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Citas y Horarios</Label>
                    <p className="text-sm text-muted-foreground">Recordatorios de citas y cambios de horario</p>
                  </div>
                  <Switch
                    checked={notifications.appointments}
                    onCheckedChange={(checked) => handleNotificationChange('appointments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Emergencias</Label>
                    <p className="text-sm text-muted-foreground">Alertas de emergencias y casos urgentes</p>
                  </div>
                  <Switch
                    checked={notifications.emergencies}
                    onCheckedChange={(checked) => handleNotificationChange('emergencies', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reportes</Label>
                    <p className="text-sm text-muted-foreground">Notificaciones sobre reportes y estadísticas</p>
                  </div>
                  <Switch
                    checked={notifications.reports}
                    onCheckedChange={(checked) => handleNotificationChange('reports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sistema</Label>
                    <p className="text-sm text-muted-foreground">Actualizaciones del sistema y mantenimiento</p>
                  </div>
                  <Switch
                    checked={notifications.system}
                    onCheckedChange={(checked) => handleNotificationChange('system', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="size-5" />
                  <span>Información Profesional</span>
                </CardTitle>
                <CardDescription>
                  Detalles de tu perfil profesional y certificaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Hospital</Label>
                    <p className="mt-1">{profileData.hospital}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Departamento</Label>
                    <p className="mt-1">{profileData.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Posición</Label>
                    <p className="mt-1">{profileData.position}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Experiencia</Label>
                    <p className="mt-1">{profileData.experience}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-3 block">Certificaciones</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      <Award className="size-3 mr-1" />
                      Cardiología Certificada
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      <Award className="size-3 mr-1" />
                      RCP Avanzado
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      <Award className="size-3 mr-1" />
                      Intervencionismo
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}