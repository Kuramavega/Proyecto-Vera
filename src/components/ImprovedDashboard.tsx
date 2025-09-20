import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope, 
  FileText, 
  Bell, 
  User,
  Heart,
  AlertTriangle,
  TrendingUp,
  Activity,
  Users,
  Zap,
  Star,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useDashboardData } from '../hooks/useDashboardData';

interface ImprovedDashboardProps {
  onNavigate: (view: string) => void;
  onOpenChat?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function ImprovedDashboard({ onNavigate, onOpenChat }: ImprovedDashboardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { proximaCita, citasPendientes, notificaciones } = useDashboardData();
  const [healthScore, setHealthScore] = useState(85);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      id: 'solicitar-cita',
      title: t('services.requestAppointment'),
      description: t('services.requestAppointmentDesc'),
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      action: () => onNavigate('solicitar-cita'),
      badge: null,
      featured: true
    },
    {
      id: 'mis-citas',
      title: t('services.myAppointments'),
      description: t('services.myAppointmentsDesc'),
      icon: Clock,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      badge: citasPendientes > 0 ? citasPendientes.toString() : null,
      action: () => onNavigate('mis-citas')
    },
    {
      id: 'preclasificar',
      title: t('services.evaluateSymptoms'),
      description: t('services.evaluateSymptomsDesc'),
      icon: Stethoscope,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      action: () => onNavigate('preclasificar'),
      badge: 'IA'
    },
    {
      id: 'cola-virtual',
      title: t('services.virtualQueue'),
      description: t('services.virtualQueueDesc'),
      icon: Bell,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      action: () => onNavigate('cola-virtual')
    },
    {
      id: 'unidades-cercanas',
      title: t('services.nearbyHospitals'),
      description: t('services.nearbyHospitalsDesc'),
      icon: MapPin,
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      action: () => onNavigate('unidades-cercanas')
    },
    {
      id: 'historial',
      title: t('services.myHistory'),
      description: t('services.myHistoryDesc'),
      icon: FileText,
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      action: () => onNavigate('historial')
    }
  ];

  const stats = [
    {
      title: t('dashboard.appointmentsCompleted'),
      value: '12',
      change: `+2 ${t('dashboard.thisMonth')}`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: t('dashboard.generalHealth'),
      value: `${healthScore}%`,
      change: `+5% ${t('dashboard.previous')}`,
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: t('dashboard.pendingReminders'),
      value: notificaciones.length.toString(),
      change: t('dashboard.pending'),
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="bg-primary rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center"
          >
            <Heart className="size-8 text-white" />
          </motion.div>
          <h2 className="font-semibold text-lg">{t('app.loading')}</h2>
          <p className="text-muted-foreground">{t('app.tagline')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-primary to-blue-600 rounded-full p-3"
              >
                <Heart className="size-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {t('app.title')}
                </h1>
                <p className="text-muted-foreground">
                  {t('dashboard.welcome', { name: user?.nombre?.split(' ')[0] || '' })} ✨
                </p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('perfil')}
                className="rounded-full"
              >
                <User className="size-4 mr-2" />
                {t('dashboard.myProfile')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 py-6 space-y-8"
      >
        {/* Health Score Card */}
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-xl bg-gradient-to-r from-green-500 to-teal-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    <Activity className="size-6 mr-2" />
                    {t('dashboard.healthScore')}
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    {t('dashboard.healthScoreDesc')}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{healthScore}%</div>
                  <div className="text-green-100 text-sm flex items-center">
                    <TrendingUp className="size-4 mr-1" />
                    {t('dashboard.monthlyChange')}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <Progress value={healthScore} className="bg-white/20" />
              <div className="flex justify-between text-sm mt-2 text-green-100">
                <span>{t('dashboard.healthScoreGood')}</span>
                <span>{t('dashboard.healthScoreKeepUp')}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={cardVariants} className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.title}</div>
                      <div className="text-xs text-green-600">{stat.change}</div>
                    </div>
                    <div className={`${stat.bgColor} rounded-full p-2`}>
                      <stat.icon className={`size-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Próxima cita con animación */}
        {proximaCita && (
          <motion.div variants={cardVariants}>
            <Card className="border-0 shadow-xl border-l-4 border-l-blue-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-full -translate-y-12 translate-x-12"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="size-6 mr-2 text-blue-500" />
                    {t('dashboard.nextAppointment')}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    {proximaCita.fecha} - {proximaCita.hora}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{proximaCita.especialidad}</h3>
                    <p className="text-muted-foreground flex items-center mt-1">
                      <MapPin className="size-4 mr-1" />
                      Hospital Metropolitano Vivian Pellas
                    </p>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('mis-citas')}
                    >
                      Ver Detalles
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        onClick={() => onNavigate('cola-virtual')}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Zap className="size-4 mr-1" />
                        Check-in
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Notificaciones importantes */}
        {notificaciones.length > 0 && (
          <motion.div variants={cardVariants}>
            <Card className="border-0 shadow-lg border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="size-5 mr-2 text-orange-500" />
                  {t('dashboard.reminders')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notificaciones.map((notif, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="size-2 bg-orange-500 rounded-full"></div>
                        <p className="text-sm">{notif.mensaje}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {notif.tiempo}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Servicios principales con animaciones mejoradas */}
        <motion.div variants={cardVariants}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t('dashboard.mainServices')}</h2>
              <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <Star className="size-3 mr-1" />
                {t('dashboard.newFeatures')}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={feature.action}
                    className={`relative cursor-pointer group ${feature.featured ? 'md:col-span-1' : ''}`}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <CardContent className="p-4 h-full">
                        <div className="flex flex-col items-center text-center space-y-3 h-full">
                          <div className={`bg-gradient-to-r ${feature.color} ${feature.hoverColor} rounded-full p-3 relative group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="size-6 text-white" />
                            {feature.badge && (
                              <Badge 
                                className="absolute -top-2 -right-2 text-xs px-2 py-0.5 bg-red-500 text-white border-0"
                              >
                                {feature.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('dashboard.needHelp')}</h3>
                  <p className="text-purple-100 text-sm">
                    {t('dashboard.helpDesc')}
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                    onClick={onOpenChat}
                  >
                    <Users className="size-4 mr-2" />
                    {t('dashboard.helpChat')}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}