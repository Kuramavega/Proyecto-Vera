import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner@2.0.3';
import { Loader2, Heart, Shield, Users, AlertCircle, ArrowLeft } from 'lucide-react';
import { validators, formatPhoneNumber, formatCedula } from '../utils/validators';

interface ValidationErrors {
  [key: string]: string;
}

interface AuthProps {
  onBack?: () => void;
}

export function Auth({ onBack }: AuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { t } = useLanguage();
  
  const [loginData, setLoginData] = useState({
    telefono: '+505 8888 9999',
    password: '123456'
  });
  
  const [registerData, setRegisterData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    fechaNacimiento: '',
    municipio: '',
    password: ''
  });

  const [loginErrors, setLoginErrors] = useState<ValidationErrors>({});
  const [registerErrors, setRegisterErrors] = useState<ValidationErrors>({});

  // Validación en tiempo real para login
  const validateLoginField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'telefono':
        const phoneValidation = validators.phone(value);
        if (!phoneValidation.isValid) {
          error = phoneValidation.message;
        }
        break;
      case 'password':
        const passwordValidation = validators.password(value);
        if (!passwordValidation.isValid) {
          error = passwordValidation.message;
        }
        break;
    }
    
    setLoginErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error === '';
  };

  // Validación en tiempo real para registro
  const validateRegisterField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'nombre':
        const nameValidation = validators.name(value);
        if (!nameValidation.isValid) {
          error = nameValidation.message;
        }
        break;
      case 'cedula':
        const cedulaValidation = validators.cedula(value);
        if (!cedulaValidation.isValid) {
          error = cedulaValidation.message;
        }
        break;
      case 'telefono':
        const phoneValidation = validators.phone(value);
        if (!phoneValidation.isValid) {
          error = phoneValidation.message;
        }
        break;
      case 'email':
        const emailValidation = validators.email(value);
        if (!emailValidation.isValid) {
          error = emailValidation.message;
        }
        break;
      case 'fechaNacimiento':
        const birthDateValidation = validators.birthDate(value);
        if (!birthDateValidation.isValid) {
          error = birthDateValidation.message;
        }
        break;
      case 'password':
        const passwordValidation = validators.password(value);
        if (!passwordValidation.isValid) {
          error = passwordValidation.message;
        }
        break;
    }
    
    setRegisterErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error === '';
  };

  // Manejadores de cambio con validación
  const handleLoginChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'telefono') {
      formattedValue = formatPhoneNumber(value);
    }
    
    setLoginData(prev => ({ ...prev, [field]: formattedValue }));
    validateLoginField(field, formattedValue);
  };

  const handleRegisterChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'telefono') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'cedula') {
      formattedValue = formatCedula(value);
    } else if (field === 'nombre') {
      // Solo permitir letras, espacios y acentos mientras se escribe
      formattedValue = value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
    }
    
    setRegisterData(prev => ({ ...prev, [field]: formattedValue }));
    validateRegisterField(field, formattedValue);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const phoneValid = validateLoginField('telefono', loginData.telefono);
    const passwordValid = validateLoginField('password', loginData.password);
    
    if (!phoneValid || !passwordValid) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }
    
    setIsLoading(true);
    
    const success = await login(loginData.telefono, loginData.password);
    
    if (success) {
      toast.success(t('auth.welcomeBack'));
    } else {
      toast.error(t('auth.invalidCredentials'));
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const validations = [
      validateRegisterField('nombre', registerData.nombre),
      validateRegisterField('cedula', registerData.cedula),
      validateRegisterField('telefono', registerData.telefono),
      validateRegisterField('email', registerData.email),
      validateRegisterField('fechaNacimiento', registerData.fechaNacimiento),
      validateRegisterField('password', registerData.password)
    ];
    
    const allValid = validations.every(v => v);
    
    if (!allValid) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }
    
    setIsLoading(true);
    
    const success = await register(registerData);
    
    if (success) {
      toast.success(t('auth.welcomeNew'));
    } else {
      toast.error(t('auth.registerError'));
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Heart className="size-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">{t('app.title')}</h1>
          <p className="text-muted-foreground">{t('app.subtitle')}</p>
        </div>

        {/* Botón para volver a la selección de roles */}
        {onBack && (
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground border-dashed hover:border-solid transition-all duration-200"
            >
              <ArrowLeft className="size-4" />
              {t('auth.backToRoleSelection')}
            </Button>
          </div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.loginTitle')}</CardTitle>
                <CardDescription>
                  {t('auth.loginDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-telefono">{t('auth.phone')}</Label>
                    <Input
                      id="login-telefono"
                      type="tel"
                      placeholder="+505 8888 9999"
                      value={loginData.telefono}
                      onChange={(e) => handleLoginChange('telefono', e.target.value)}
                      className={loginErrors.telefono ? 'border-destructive' : ''}
                      required
                    />
                    {loginErrors.telefono && (
                      <div className="flex items-center space-x-2 text-sm text-destructive">
                        <AlertCircle className="size-4" />
                        <span>{loginErrors.telefono}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t('auth.password')}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••"
                      value={loginData.password}
                      onChange={(e) => handleLoginChange('password', e.target.value)}
                      className={loginErrors.password ? 'border-destructive' : ''}
                      required
                    />
                    {loginErrors.password && (
                      <div className="flex items-center space-x-2 text-sm text-destructive">
                        <AlertCircle className="size-4" />
                        <span>{loginErrors.password}</span>
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        {t('auth.loggingIn')}
                      </>
                    ) : (
                      t('auth.loginButton')
                    )}
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Demo:</strong> Usa +505 8888 9999 y contraseña: 123456
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.registerTitle')}</CardTitle>
                <CardDescription>
                  {t('auth.registerDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-nombre">{t('auth.fullName')}</Label>
                      <Input
                        id="register-nombre"
                        placeholder="María Cristina González"
                        value={registerData.nombre}
                        onChange={(e) => handleRegisterChange('nombre', e.target.value)}
                        className={registerErrors.nombre ? 'border-destructive' : ''}
                        required
                      />
                      {registerErrors.nombre && (
                        <div className="flex items-center space-x-2 text-sm text-destructive">
                          <AlertCircle className="size-4" />
                          <span>{registerErrors.nombre}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-cedula">{t('auth.cedula')}</Label>
                      <Input
                        id="register-cedula"
                        placeholder="001-120890-0001C"
                        value={registerData.cedula}
                        onChange={(e) => handleRegisterChange('cedula', e.target.value)}
                        className={registerErrors.cedula ? 'border-destructive' : ''}
                        required
                      />
                      {registerErrors.cedula && (
                        <div className="flex items-center space-x-2 text-sm text-destructive">
                          <AlertCircle className="size-4" />
                          <span>{registerErrors.cedula}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-telefono">{t('auth.phone')}</Label>
                    <Input
                      id="register-telefono"
                      type="tel"
                      placeholder="+505 8888 9999"
                      value={registerData.telefono}
                      onChange={(e) => handleRegisterChange('telefono', e.target.value)}
                      className={registerErrors.telefono ? 'border-destructive' : ''}
                      required
                    />
                    {registerErrors.telefono && (
                      <div className="flex items-center space-x-2 text-sm text-destructive">
                        <AlertCircle className="size-4" />
                        <span>{registerErrors.telefono}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t('auth.email')}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="maria@example.com"
                      value={registerData.email}
                      onChange={(e) => handleRegisterChange('email', e.target.value)}
                      className={registerErrors.email ? 'border-destructive' : ''}
                      required
                    />
                    {registerErrors.email && (
                      <div className="flex items-center space-x-2 text-sm text-destructive">
                        <AlertCircle className="size-4" />
                        <span>{registerErrors.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-fecha">{t('auth.birthDate')}</Label>
                      <Input
                        id="register-fecha"
                        type="date"
                        value={registerData.fechaNacimiento}
                        onChange={(e) => handleRegisterChange('fechaNacimiento', e.target.value)}
                        className={registerErrors.fechaNacimiento ? 'border-destructive' : ''}
                        max={new Date(new Date().getFullYear() - 1, 11, 31).toISOString().split('T')[0]}
                        required
                      />
                      {registerErrors.fechaNacimiento && (
                        <div className="flex items-center space-x-2 text-sm text-destructive">
                          <AlertCircle className="size-4" />
                          <span>{registerErrors.fechaNacimiento}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-municipio">{t('auth.municipality')}</Label>
                      <Input
                        id="register-municipio"
                        placeholder="Managua"
                        value={registerData.municipio}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, municipio: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t('auth.password')}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••"
                      value={registerData.password}
                      onChange={(e) => handleRegisterChange('password', e.target.value)}
                      className={registerErrors.password ? 'border-destructive' : ''}
                      required
                    />
                    {registerErrors.password && (
                      <div className="flex items-center space-x-2 text-sm text-destructive">
                        <AlertCircle className="size-4" />
                        <span>{registerErrors.password}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        {t('auth.registering')}
                      </>
                    ) : (
                      t('auth.registerButton')
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <Shield className="size-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">{t('auth.secureData')}</p>
          </div>
          <div className="text-center">
            <Heart className="size-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">{t('auth.reliableHealth')}</p>
          </div>
          <div className="text-center">
            <Users className="size-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">{t('auth.hospitalNetwork')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}