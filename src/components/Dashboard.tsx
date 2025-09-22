import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope, 
  FileText, 
  Bell, 
  User,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { HealthIndexCard } from './HealthIndexCard';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { proximaCita, citasPendientes, notificaciones } = useDashboardData();

  const features = [
    {
      id: 'solicitar-cita',
      title: 'Solicitar Cita',
      description: 'Agenda tu consulta médica',
      icon: Calendar,
      color: 'bg-blue-500',
      action: () => onNavigate('solicitar-cita')
    },
    {
      id: 'mis-citas',
      title: 'Mis Citas',
      description: 'Ver y gestionar citas',
      icon: Clock,
      color: 'bg-green-500',
      badge: citasPendientes > 0 ? citasPendientes.toString() : undefined,
      action: () => onNavigate('mis-citas')
    },
    {
      id: 'preclasificar',
      title: 'Preclasificar Síntomas',
      description: 'Evalúa tu estado de salud',
      icon: Stethoscope,
      color: 'bg-orange-500',
      action: () => onNavigate('preclasificar')
    },
    {
      id: 'cola-virtual',
      title: 'Cola Virtual',
      description: 'Check-in para tu cita',
      icon: Bell,
      color: 'bg-purple-500',
      action: () => onNavigate('cola-virtual')
    },
    {
      id: 'unidades-cercanas',
      title: 'Unidades Cercanas',
      description: 'Encuentra hospitales cerca',
      icon: MapPin,
      color: 'bg-red-500',
      action: () => onNavigate('unidades-cercanas')
    },
    {
      id: 'historial',
      title: 'Mi Historial',
      description: 'Consultas y recetas',
      icon: FileText,
      color: 'bg-teal-500',
      action: () => onNavigate('historial')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-full p-2">
                <Heart className="size-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">SaludCerca</h1>
                <p className="text-sm text-muted-foreground">Hola, {user?.nombre}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('perfil')}
            >
              <User className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Próxima cita */}
        {proximaCita && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Próxima Cita</CardTitle>
                <Badge variant="secondary">
                  {proximaCita.fecha} - {proximaCita.hora}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{proximaCita.especialidad}</p>
                  <p className="text-sm text-muted-foreground">
                    Hospital San José
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onNavigate('cola-virtual')}
                >
                  Check-in
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Índice de Salud */}
        <HealthIndexCard 
          onDetailsClick={() => onNavigate('indice-salud')}
        />

        {/* Notificaciones importantes */}
        {notificaciones.length > 0 && (
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="size-5 mr-2 text-orange-500" />
                Recordatorios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notificaciones.map((notif, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <p className="text-sm">{notif.mensaje}</p>
                    <Badge variant="outline" className="text-xs">
                      {notif.tiempo}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Servicios principales */}
        <div>
          <h2 className="font-semibold mb-4">Servicios Principales</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={feature.action}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`${feature.color} rounded-full p-3 relative`}>
                        <IconComponent className="size-6 text-white" />
                        {feature.badge && (
                          <Badge 
                            className="absolute -top-2 -right-2 size-5 p-0 flex items-center justify-center text-xs"
                            variant="destructive"
                          >
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-xs text-muted-foreground">Citas este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-xs text-muted-foreground">Consultas totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <p className="text-xs text-muted-foreground">Especialistas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}