import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RoleSelector } from './components/RoleSelector';
import { StaffLogin } from './components/hospital-staff/StaffLogin';
import { StaffDashboard } from './components/hospital-staff/StaffDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { Auth } from './components/Auth';
import { LoadingScreen } from './components/LoadingScreen';
import { ViewRouter } from './components/ViewRouter';
import { Chatbot, FloatingChatButton } from './components/Chatbot';
import { Toaster } from './components/ui/sonner';
import { AnimatePresence } from 'motion/react';
import { View } from './types';

interface AppContentProps {
  onBackToRoleSelector?: () => void;
}

function AppContent({ onBackToRoleSelector }: AppContentProps) {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadChat, setHasUnreadChat] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Auth onBack={onBackToRoleSelector} />;
  }

  if (showRoleSelector) {
    return <RoleSelector onSelectRole={() => setShowRoleSelector(false)} />;
  }

  const handleNavigate = (view: string) => {
    if (view === 'role-selector') {
      setShowRoleSelector(true);
      return;
    }
    setCurrentView(view as View);
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setHasUnreadChat(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <ViewRouter 
          currentView={currentView}
          onNavigate={handleNavigate}
          onBack={handleBack}
          onOpenChat={toggleChat}
        />
      </AnimatePresence>

      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <FloatingChatButton 
            onClick={toggleChat}
            hasUnread={hasUnreadChat}
          />
        )}
      </AnimatePresence>

      {/* Chatbot */}
      <Chatbot 
        isOpen={isChatOpen}
        onClose={toggleChat}
        onNavigate={handleNavigate}
      />
      
      <Toaster 
        position="top-center"
        expand={false}
        richColors
      />
    </div>
  );
}

function App() {
  const [selectedRole, setSelectedRole] = useState<'patient' | 'staff' | null>(null);
  const [staffData, setStaffData] = useState<any>(null);

  const handleRoleSelect = (role: 'patient' | 'staff') => {
    setSelectedRole(role);
  };

  const handleStaffLogin = (data: any) => {
    setStaffData(data);
  };

  const handleStaffLogout = () => {
    setStaffData(null);
    setSelectedRole(null);
  };

  const handleBackToRoleSelector = () => {
    setSelectedRole(null);
    setStaffData(null);
  };

  // Staff Portal Flow - Now with Theme, Language and Appointment support
  if (selectedRole === 'staff') {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <AppointmentProvider>
            <AuthProvider>
              {staffData ? (
                <StaffDashboard staffData={staffData} onLogout={handleStaffLogout} />
              ) : (
                <StaffLogin onBack={handleBackToRoleSelector} onLogin={handleStaffLogin} />
              )}
            </AuthProvider>
          </AppointmentProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  // Patient Portal Flow (existing application) - Also with Appointment support
  if (selectedRole === 'patient') {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <AppointmentProvider>
            <AuthProvider>
              <AppContent onBackToRoleSelector={handleBackToRoleSelector} />
            </AuthProvider>
          </AppointmentProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  // Role Selection (Initial Screen)
  return <RoleSelector onSelectRole={handleRoleSelect} />;
}

export default App;