import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Heart,
  Edit3,
  Save,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Settings,
  Moon,
  Sun,
  Globe,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    municipio: user?.municipio || '',
    alergias: user?.alergias?.join(', ') || '',
    antecedentes: user?.antecedentes?.join(', ') || ''
  });

  const [notifications, setNotifications] = useState({
    citas: true,
    recordatorios: true,
    promociones: false,
    emergencias: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const updatedData = {
        ...formData,
        alergias: formData.alergias.split(',').map(a => a.trim()).filter(Boolean),
        antecedentes: formData.antecedentes.split(',').map(a => a.trim()).filter(Boolean)
      };
      
      await updateProfile(updatedData);
      setIsEditing(false);
      toast.success(t('profile.updated'));
    } catch (error) {
      toast.error(t('profile.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success(t('profile.loggedOut'));
  };

  const handleLanguageChange = (newLanguage: 'es' | 'en') => {
    setLanguage(newLanguage);
    toast.success(
      newLanguage === 'es' 
        ? 'Idioma cambiado a Español' 
        : 'Language changed to English'
    );
  };

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success(
      theme === 'light' 
        ? t('profile.darkMode') + ' ' + (language === 'es' ? 'activado' : 'activated')
        : t('profile.lightMode') + ' ' + (language === 'es' ? 'activado' : 'activated')
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="size-4 mr-2" />
              {t('profile.back')}
            </Button>
            <h1 className="font-semibold">{t('profile.title')}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="size-4 mr-2" />
                  {t('profile.save')}
                </>
              ) : (
                <>
                  <Edit3 className="size-4 mr-2" />
                  {t('profile.edit')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24"></div>
            <CardContent className="relative -mt-12 pb-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4">
                      <User className="size-12 text-white" />
                    </div>
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-1 -right-1 rounded-full size-8 p-0"
                    >
                      <Camera className="size-4" />
                    </Button>
                  )}
                </div>
                <h2 className="text-xl font-bold mt-4">{user?.nombre}</h2>
                <p className="text-muted-foreground">{t('profile.patient')}</p>
                <div className="flex items-center mt-2">
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600">
                    <CheckCircle className="size-3 mr-1" />
                    {t('profile.verified')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Settings - Theme and Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="size-5 mr-2" />
                {language === 'es' ? 'Configuración de Apariencia' : 'Appearance Settings'}
              </CardTitle>
              <CardDescription>
                {language === 'es' 
                  ? 'Personaliza la apariencia e idioma de la aplicación' 
                  : 'Customize the app appearance and language'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    {theme === 'light' ? (
                      <Sun className="size-5 text-primary" />
                    ) : (
                      <Moon className="size-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{t('profile.theme')}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('profile.themeDesc')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{t('profile.lightMode')}</span>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={handleThemeToggle}
                  />
                  <span className="text-sm">{t('profile.darkMode')}</span>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Globe className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{t('profile.language')}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('profile.languageDesc')}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={language === 'es' ? 'default' : 'outline'}
                      onClick={() => handleLanguageChange('es')}
                      className="w-full"
                    >
                      🇪🇸 {t('profile.spanish')}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={language === 'en' ? 'default' : 'outline'}
                      onClick={() => handleLanguageChange('en')}
                      className="w-full"
                    >
                      🇺🇸 {t('profile.english')}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="size-5 mr-2" />
                {t('profile.personalInfo')}
              </CardTitle>
              <CardDescription>
                {t('profile.personalInfoDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('profile.fullName')}</Label>
                  {isEditing ? (
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md flex items-center">
                      <User className="size-4 mr-2 text-muted-foreground" />
                      {user?.nombre}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Cédula</Label>
                  <div className="p-3 bg-muted rounded-md text-muted-foreground">
                    {user?.cedula}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('profile.phone')}</Label>
                  {isEditing ? (
                    <Input
                      value={formData.telefono}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md flex items-center">
                      <Phone className="size-4 mr-2 text-muted-foreground" />
                      {user?.telefono}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>{t('profile.email')}</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md flex items-center">
                      <Mail className="size-4 mr-2 text-muted-foreground" />
                      {user?.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('profile.municipality')}</Label>
                  {isEditing ? (
                    <Input
                      value={formData.municipio}
                      onChange={(e) => setFormData(prev => ({ ...prev, municipio: e.target.value }))}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md flex items-center">
                      <MapPin className="size-4 mr-2 text-muted-foreground" />
                      {user?.municipio}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>{t('profile.birthDate')}</Label>
                  <div className="p-3 bg-muted rounded-md flex items-center">
                    <Calendar className="size-4 mr-2 text-muted-foreground" />
                    {user?.fechaNacimiento}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full size-4 border-b-2 border-white mr-2"></div>
                        {t('profile.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="size-4 mr-2" />
                        {t('profile.saveChanges')}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    {t('profile.cancel')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Medical Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="size-5 mr-2" />
                {t('profile.medicalInfo')}
              </CardTitle>
              <CardDescription>
                {t('profile.medicalInfoDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('profile.allergies')}</Label>
                {isEditing ? (
                  <Textarea
                    placeholder={t('profile.allergiesPlaceholder')}
                    value={formData.alergias}
                    onChange={(e) => setFormData(prev => ({ ...prev, alergias: e.target.value }))}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    {user?.alergias?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {user.alergias.map((alergia, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700">
                            <AlertTriangle className="size-3 mr-1" />
                            {alergia}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{t('profile.noAllergies')}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>{t('profile.medicalHistory')}</Label>
                {isEditing ? (
                  <Textarea
                    placeholder={t('profile.medicalHistoryPlaceholder')}
                    value={formData.antecedentes}
                    onChange={(e) => setFormData(prev => ({ ...prev, antecedentes: e.target.value }))}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    {user?.antecedentes?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {user.antecedentes.map((antecedente, index) => (
                          <Badge key={index} variant="outline" className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700">
                            {antecedente}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{t('profile.noMedicalHistory')}</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="size-5 mr-2" />
                {t('profile.notifications')}
              </CardTitle>
              <CardDescription>
                {t('profile.notificationsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'citas', label: t('profile.appointmentReminders'), description: t('profile.appointmentRemindersDesc') },
                { key: 'recordatorios', label: t('profile.medicalReminders'), description: t('profile.medicalRemindersDesc') },
                { key: 'promociones', label: t('profile.promotions'), description: t('profile.promotionsDesc') },
                { key: 'emergencias', label: t('profile.emergencyAlerts'), description: t('profile.emergencyAlertsDesc') }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{setting.label}</div>
                    <div className="text-sm text-muted-foreground">{setting.description}</div>
                  </div>
                  <Switch
                    checked={notifications[setting.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [setting.key]: checked }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="size-5 mr-2" />
                {t('profile.security')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="size-4 mr-2" />
                {t('profile.changePassword')}
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="size-4 mr-2" />
                {t('profile.privacySettings')}
              </Button>
              
              <Separator />
              
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full"
              >
                {t('profile.logout')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}