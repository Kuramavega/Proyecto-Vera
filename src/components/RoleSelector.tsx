import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, 
  Stethoscope, 
  Heart, 
  Calendar, 
  FileText, 
  Activity,
  ChevronRight,
  Shield,
  Clock,
  UserCheck,
  Building2,
  Workflow
} from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: 'patient' | 'staff') => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'patient',
      title: 'Soy Paciente',
      description: 'Accede a servicios médicos, agenda citas y gestiona tu salud fácilmente',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      features: [
        'Agendar citas médicas',
        'Consultar historial clínico',
        'Encontrar hospitales cercanos',
        'Chat con IA médica',
        'Gestión de expedientes'
      ]
    },
    {
      id: 'staff',
      title: 'Personal Hospitalario',
      description: 'Acceso profesional para gestión hospitalaria y atención médica',
      icon: Stethoscope,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      features: [
        'Gestión de citas y agendas',
        'Expedientes clínicos electrónicos',
        'Flujo de pacientes',
        'Reportes y administración',
        'Panel de control profesional'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Heart className="size-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  SaludCerca
                </h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestión Médica</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-3">Selecciona tu perfil de acceso</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elige el tipo de acceso que necesitas para comenzar a utilizar el sistema de gestión médica
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon;
            
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredRole(role.id)}
                onHoverEnd={() => setHoveredRole(null)}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative"
              >
                <Card className={`border-2 ${role.borderColor} ${role.bgColor} cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden`}>
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-5`} />
                  
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="size-8 text-white" />
                      </div>
                      
                      <motion.div
                        animate={{ x: hoveredRole === role.id ? 8 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <ChevronRight className="size-6 text-muted-foreground" />
                      </motion.div>
                    </div>
                    
                    <CardTitle className="text-xl mb-2">{role.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {role.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative pt-0">
                    {/* Features List */}
                    <div className="space-y-3 mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Funciones principales:</h4>
                      <div className="space-y-2">
                        {role.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + idx * 0.05 }}
                            className="flex items-center space-x-3"
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${role.color}`} />
                            <span className="text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full group relative overflow-hidden"
                      size="lg"
                      onClick={() => onSelectRole(role.id as 'patient' | 'staff')}
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <span>Continuar como {role.id === 'patient' ? 'Paciente' : 'Personal'}</span>
                        <motion.div
                          animate={{ x: hoveredRole === role.id ? 4 : 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <ChevronRight className="size-4" />
                        </motion.div>
                      </span>
                      <div className={`absolute inset-0 bg-gradient-to-r ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Shield className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Seguro y Confiable</p>
                <p className="text-xs text-muted-foreground">Datos protegidos</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Clock className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Disponible 24/7</p>
                <p className="text-xs text-muted-foreground">Acceso continuo</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Activity className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Gestión Eficiente</p>
                <p className="text-xs text-muted-foreground">Procesos optimizados</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg max-w-2xl mx-auto">
            <p className="text-xs text-muted-foreground">
              Sistema de gestión médica integral diseñado para optimizar la atención hospitalaria 
              y mejorar la experiencia del paciente en Nicaragua.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}