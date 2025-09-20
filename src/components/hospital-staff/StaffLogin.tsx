import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft,
  Stethoscope, 
  Hospital, 
  UserCheck, 
  Shield,
  Eye,
  EyeOff,
  Building2,
  Users,
  Heart,
  Activity,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { validators } from '../../utils/validators';

interface StaffLoginProps {
  onBack: () => void;
  onLogin: (staffData: any) => void;
}

interface ValidationErrors {
  [key: string]: string;
}

import { hospitales as hospitalesData } from '../../data/nicaraguaData';
import { databaseService } from '../../services/database';

// Hospitales disponibles con sus especialidades
const hospitales = hospitalesData.map(h => ({
  id: h.id,
  nombre: h.nombre,
  municipio: h.municipio,
  departamento: h.departamento,
  departamentos: h.especialidades,
  tipo: h.tipo,
  nivel_complejidad: h.nivel_complejidad
}));

const roles = [
  { id: 'medico', label: 'Médico', icon: Stethoscope },
  { id: 'enfermero', label: 'Enfermero/a', icon: Heart },
  { id: 'administrativo', label: 'Personal Administrativo', icon: Users },
  { id: 'direccion', label: 'Dirección/Gerencia', icon: Building2 }
];

export function StaffLogin({ onBack, onLogin }: StaffLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hospital: '',
    departamento: '',
    rol: '',
    numeroLicencia: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validación en tiempo real
  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'email':
        const emailValidation = validators.email(value);
        if (!emailValidation.isValid) {
          error = emailValidation.message;
        }
        break;
      case 'password':
        const passwordValidation = validators.password(value);
        if (!passwordValidation.isValid) {
          error = passwordValidation.message;
        }
        break;
      case 'numeroLicencia':
        if (formData.rol === 'medico' && !value.trim()) {
          error = 'El número de licencia médica es requerido';
        } else if (value && !/^[A-Z0-9\-]+$/.test(value.toUpperCase())) {
          error = 'Formato de licencia inválido. Use letras, números y guiones';
        }
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error === '';
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'numeroLicencia') {
      // Formatear licencia médica a mayúsculas
      formattedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    validateField(field, formattedValue);
  };

  const handleHospitalChange = (hospitalId: string) => {
    const hospital = hospitales.find(h => h.id === hospitalId);
    setSelectedHospital(hospital);
    setFormData(prev => ({
      ...prev,
      hospital: hospitalId,
      departamento: ''
    }));
  };

  const handleRolChange = (rol: string) => {
    setFormData(prev => ({
      ...prev,
      rol,
      numeroLicencia: rol !== 'medico' ? '' : prev.numeroLicencia
    }));
    
    // Limpiar error de licencia si ya no es médico
    if (rol !== 'medico') {
      setErrors(prev => ({ ...prev, numeroLicencia: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    const licenciaValid = formData.rol !== 'medico' || validateField('numeroLicencia', formData.numeroLicencia);
    
    // Validar campos requeridos
    if (!formData.hospital) {
      toast.error('Por favor, selecciona un hospital');
      return;
    }
    
    if (!formData.rol) {
      toast.error('Por favor, selecciona tu rol');
      return;
    }
    
    if (!emailValid || !passwordValid || !licenciaValid) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);

    // Autenticación usando el servicio de base de datos
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const authResult = await databaseService.authenticateStaff(
        formData.email, 
        formData.password, 
        parseInt(formData.hospital)
      );

      if (authResult) {
        const staffData = {
          ...formData,
          hospitalInfo: selectedHospital,
          name: `${authResult.usuario.nombres} ${authResult.usuario.apellidos}`,
          id: authResult.usuario.id.toString(),
          personal_info: authResult.personal,
          es_admin_universal: authResult.personal.es_admin_universal || false
        };

        if (authResult.personal.es_admin_universal) {
          toast.success('🔐 Acceso de Administrador Universal autorizado. Bienvenido Isaac!');
        } else {
          toast.success('Acceso autorizado. Bienvenido al sistema profesional.');
        }
        
        onLogin(staffData);
      } else {
        // Permitir acceso de demo con credenciales específicas
        if (formData.email === 'demo@hospital.com' && formData.password === 'demo123') {
          const staffData = {
            ...formData,
            hospitalInfo: selectedHospital,
            name: `Demo ${selectedHospital?.nombre}`,
            id: 'demo-' + Date.now().toString(),
            es_demo: true
          };
          toast.success('Acceso DEMO autorizado. Modo demostración activado.');
          onLogin(staffData);
        } else {
          toast.error('Credenciales incorrectas. Para admin universal use: isaac.espinoza@saludcerca.ni / 77960601');
        }
      }
    } catch (error) {
      toast.error('Error al conectar con el sistema. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6 self-start"
          >
            <ArrowLeft className="size-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Stethoscope className="size-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Acceso Profesional</h1>
          <p className="text-muted-foreground">
            Portal exclusivo para personal autorizado del sistema hospitalario
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="size-5" />
                <span>Inicio de Sesión Seguro</span>
              </CardTitle>
              <CardDescription className="text-green-50">
                Complete sus credenciales profesionales para acceder al sistema
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <UserCheck className="size-5 text-green-600" />
                    <span>Información Personal</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Institucional *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nombre@hospital.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                        required
                      />
                      {errors.email && (
                        <div className="flex items-center space-x-2 text-sm text-destructive">
                          <AlertCircle className="size-4" />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={errors.password ? 'border-destructive' : ''}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4 text-muted-foreground" />
                          ) : (
                            <Eye className="size-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <div className="flex items-center space-x-2 text-sm text-destructive">
                          <AlertCircle className="size-4" />
                          <span>{errors.password}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información Institucional */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Hospital className="size-5 text-blue-600" />
                    <span>Información Institucional</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hospital *</Label>
                      <Select value={formData.hospital} onValueChange={handleHospitalChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione hospital" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {hospitales.map((hospital) => (
                            <SelectItem key={hospital.id} value={hospital.id}>
                              <div className="flex items-center space-x-2">
                                <Building2 className="size-4" />
                                <div>
                                  <div className="font-medium text-sm">{hospital.nombre}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {hospital.municipio}, {hospital.departamento} • {hospital.tipo}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rol">Rol/Posición *</Label>
                      <Select value={formData.rol} onValueChange={handleRolChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((rol) => {
                            const Icon = rol.icon;
                            return (
                              <SelectItem key={rol.id} value={rol.id}>
                                <div className="flex items-center space-x-2">
                                  <Icon className="size-4" />
                                  <span>{rol.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedHospital && (
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento/Especialidad</Label>
                      <Select value={formData.departamento} onValueChange={(value) => setFormData(prev => ({ ...prev, departamento: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedHospital.departamentos.map((dept: string) => (
                            <SelectItem key={dept} value={dept}>
                              <div className="flex items-center space-x-2">
                                <Activity className="size-4" />
                                <span>{dept}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.rol === 'medico' && (
                    <div className="space-y-2">
                      <Label htmlFor="numeroLicencia">Número de Licencia Médica *</Label>
                      <Input
                        id="numeroLicencia"
                        placeholder="Ej: MED-2024-001234"
                        value={formData.numeroLicencia}
                        onChange={(e) => handleInputChange('numeroLicencia', e.target.value)}
                        className={errors.numeroLicencia ? 'border-destructive' : ''}
                        required={formData.rol === 'medico'}
                      />
                      {errors.numeroLicencia && (
                        <div className="flex items-center space-x-2 text-sm text-destructive">
                          <AlertCircle className="size-4" />
                          <span>{errors.numeroLicencia}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                        Acceso Controlado
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Este sistema está destinado exclusivamente para personal autorizado. 
                        Todas las actividades son registradas y monitoreadas por seguridad.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verificando credenciales...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="size-4" />
                      <span>Acceder al Sistema</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Users, label: 'Gestión de Pacientes', color: 'text-blue-600' },
            { icon: Activity, label: 'Reportes Médicos', color: 'text-green-600' },
            { icon: Heart, label: 'Seguimiento Clínico', color: 'text-red-600' },
            { icon: Shield, label: 'Seguridad Avanzada', color: 'text-purple-600' }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Icon className={`size-6 ${feature.color} mx-auto mb-2`} />
                <p className="text-xs text-muted-foreground">{feature.label}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}