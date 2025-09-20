import React from 'react';
import { motion } from 'motion/react';
import { ImprovedDashboard } from './ImprovedDashboard';
import { SolicitarCita } from './SolicitarCita';
import { PreclasificarSintomas } from './PreclasificarSintomas';
import { ColaVirtual } from './ColaVirtual';
import { UserProfile } from './UserProfile';
import { HealthIndexView } from './HealthIndexView';
import { MisCitas } from './MisCitas';
import { UnidadesCercanas } from './UnidadesCercanas';
import { HistorialMedico } from './HistorialMedico';
import { View } from '../types';

interface ViewRouterProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onBack: () => void;
  onOpenChat?: () => void;
}

export function ViewRouter({ currentView, onNavigate, onBack, onOpenChat }: ViewRouterProps) {
  const renderView = () => {
    switch (currentView) {
      case 'solicitar-cita':
        return <SolicitarCita onBack={onBack} />;
      
      case 'preclasificar':
        return (
          <PreclasificarSintomas 
            onBack={onBack}
            onSolicitarCita={() => onNavigate('solicitar-cita')}
          />
        );
      
      case 'cola-virtual':
        return <ColaVirtual onBack={onBack} />;
      
      case 'perfil':
        return <UserProfile onBack={onBack} />;
      
      case 'mis-citas':
        return <MisCitas onBack={onBack} />;
      
      case 'unidades-cercanas':
        return <UnidadesCercanas onBack={onBack} />;
      
      case 'historial':
        return <HistorialMedico onBack={onBack} />;
      
      case 'indice-salud':
        return <HealthIndexView onBack={onBack} onNavigate={onNavigate} />;
      
      default:
        return <ImprovedDashboard onNavigate={onNavigate} onOpenChat={onOpenChat} />;
    }
  };

  return (
    <motion.div
      key={currentView}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {renderView()}
    </motion.div>
  );
}