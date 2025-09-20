import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Users, 
  MapPin,
  Bell,
  Calendar,
  Loader2,
  Phone
} from 'lucide-react';
import { Cita, ColaVirtual as ColaVirtualType } from '../types';

interface ColaVirtualProps {
  onBack: () => void;
}

// Mock data
const mockCitaHoy: Cita = {
  id: '1',
  pacienteId: '1',
  doctorId: '1',
  hospitalId: '1',
  fecha: new Date().toISOString().split('T')[0],
  hora: '10:30',
  especialidad: 'Medicina General',
  estado: 'CONFIRMADA',
  motivo: 'Control rutinario'
};

export function ColaVirtual({ onBack }: ColaVirtualProps) {
  const [citaActual, setCitaActual] = useState<Cita | null>(mockCitaHoy);
  const [colaStatus, setColaStatus] = useState<ColaVirtualType | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Simular actualización de la cola cada 30 segundos
  useEffect(() => {
    if (isCheckedIn && colaStatus) {
      const interval = setInterval(() => {
        setColaStatus(prev => {
          if (!prev) return null;
          
          // Simular progreso en la cola
          const nuevaPosicion = Math.max(1, prev.posicion - Math.floor(Math.random() * 2));
          const nuevaEstimacion = Math.max(5, prev.estimacionEspera - Math.floor(Math.random() * 10));
          
          return {
            ...prev,
            posicion: nuevaPosicion,
            estimacionEspera: nuevaEstimacion,
            estado: nuevaPosicion <= 2 ? 'LLAMADO' : 'ESPERANDO'
          };
        });
      }, 30000); // 30 segundos

      return () => clearInterval(interval);
    }
  }, [isCheckedIn, colaStatus]);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    
    // Simular proceso de check-in
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular asignación de posición en cola
    const mockColaStatus: ColaVirtualType = {
      citaId: citaActual?.id || '1',
      posicion: Math.floor(Math.random() * 8) + 3, // 3-10
      estimacionEspera: Math.floor(Math.random() * 45) + 15, // 15-60 minutos
      estado: 'ESPERANDO'
    };
    
    setColaStatus(mockColaStatus);
    setIsCheckedIn(true);
    setIsCheckingIn(false);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'LLAMADO': return 'text-green-600 bg-green-100';
      case 'ESPERANDO': return 'text-blue-600 bg-blue-100';
      case 'EN_CONSULTA': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'LLAMADO': return 'Te están llamando';
      case 'ESPERANDO': return 'En espera';
      case 'EN_CONSULTA': return 'En consulta';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="size-4 mr-2" />
              Volver
            </Button>
            <h1 className="ml-4 text-xl font-semibold">Cola Virtual</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Información de la cita */}
        {citaActual && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                <Calendar className="size-5 mr-2" />
                Tu Cita de Hoy
              </CardTitle>
              <CardDescription>
                Información de tu cita programada para hoy
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-muted-foreground font-medium">Especialidad:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {citaActual.especialidad}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-muted-foreground font-medium">Hora programada:</span>
                  <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                    {citaActual.hora}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-muted-foreground font-medium">Hospital:</span>
                  <span className="font-semibold">Hospital Bertha Calderón Roque</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-muted-foreground font-medium">Doctor:</span>
                  <span className="font-semibold">Dr. Carlos Mendoza</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-muted-foreground font-medium">Estado:</span>
                  <Badge className="bg-green-100 text-green-800 border-0">
                    <CheckCircle className="size-3 mr-1" />
                    Confirmada
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado del check-in */}
        {!isCheckedIn ? (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
              <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
                <Bell className="size-5 mr-2" />
                Check-in Digital
              </CardTitle>
              <CardDescription>
                Realiza tu check-in cuando llegues al hospital para unirte a la cola virtual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Bell className="size-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">¿Cómo funciona?</h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="size-4 mr-2 text-green-600" />
                        Haz check-in al llegar al hospital
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="size-4 mr-2 text-green-600" />
                        Te asignaremos tu posición en la cola
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="size-4 mr-2 text-green-600" />
                        Recibirás notificaciones de tu turno
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="size-4 mr-2 text-green-600" />
                        Podrás esperar cómodamente en cualquier lugar
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2">
                  <Clock className="size-4 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Importante:</strong> Solo puedes hacer check-in cuando estés físicamente en el hospital
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleCheckIn} 
                disabled={isCheckingIn}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {isCheckingIn ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Realizando Check-in...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 size-4" />
                    Hacer Check-in
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Estado de la cola */
          <>
            <Card className={`border-0 shadow-lg ${
              colaStatus?.estado === 'LLAMADO' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <Users className="size-5 mr-2" />
                    Tu Posición en Cola
                  </CardTitle>
                  <Badge className={`${getEstadoColor(colaStatus?.estado || '')} px-3 py-1 font-semibold`}>
                    {getEstadoTexto(colaStatus?.estado || '')}
                  </Badge>
                </div>
                <CardDescription>
                  Estado actual de tu cita en la cola virtual
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="text-6xl font-bold text-primary mb-2">
                      #{colaStatus?.posicion}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {colaStatus?.posicion === 1 ? 'Siguiente en la cola' : 
                       colaStatus?.posicion === 2 ? 'Segundo en la cola' :
                       `${colaStatus?.posicion - 1} personas antes que tú`}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                      <div className="flex items-center justify-center text-muted-foreground mb-2">
                        <Clock className="size-4 mr-2" />
                        Tiempo estimado de espera
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {colaStatus?.estimacionEspera} minutos
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{Math.max(0, 100 - ((colaStatus?.posicion || 1) * 10))}%</span>
                      </div>
                      <Progress 
                        value={Math.max(0, 100 - ((colaStatus?.posicion || 1) * 10))} 
                        className="w-full h-3"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notificación especial si está siendo llamado */}
            {colaStatus?.estado === 'LLAMADO' && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center text-green-700 dark:text-green-300">
                    <Bell className="size-6 mr-3 animate-bounce" />
                    <div className="text-center">
                      <p className="font-bold text-lg">¡Es tu turno!</p>
                      <p className="text-sm">Dirígete al consultorio 3, Piso 2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información adicional */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="flex items-center text-purple-800 dark:text-purple-200">
                  <MapPin className="size-5 mr-2" />
                  Información del Hospital
                </CardTitle>
                <CardDescription>
                  Detalles de ubicación y estado de la cola
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <span className="text-muted-foreground text-sm">Consultorio:</span>
                    <div className="font-semibold text-lg">Sala 3 - Piso 2</div>
                    <div className="text-xs text-muted-foreground mt-1">Edificio Principal</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <span className="text-muted-foreground text-sm">Personas en cola:</span>
                    <div className="font-semibold text-lg">{(colaStatus?.posicion || 1) + 2} pacientes</div>
                    <div className="text-xs text-muted-foreground mt-1">Incluyéndote a ti</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-2">
                    <Bell className="size-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                        Tip importante:
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Puedes salir del hospital y regresar antes de tu turno. 
                        Te notificaremos por la app 10 minutos antes de que sea tu momento.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-2">
                    <Clock className="size-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Recuerda:
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Mantén tu teléfono encendido para recibir las notificaciones de tu turno.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCheckedIn(false)}
                className="w-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Clock className="size-4 mr-2" />
                Cancelar Check-in
              </Button>
              <Button 
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                onClick={() => window.open('tel:2233-1111', '_self')}
              >
                <Phone className="size-4 mr-2" />
                Contactar Hospital
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}