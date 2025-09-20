import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Sistema de traducciones
const translations = {
  es: {
    // App general
    'app.title': 'SaludCerca',
    'app.subtitle': 'Tu salud, más cerca que nunca',
    'app.tagline': 'Conectando tu salud con la tecnología',
    'app.loading': 'Cargando SaludCerca...',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.loginTitle': 'Iniciar Sesión',
    'auth.loginDesc': 'Ingresa con tu número de teléfono registrado',
    'auth.registerTitle': 'Crear Cuenta',
    'auth.registerDesc': 'Regístrate para acceder a todos los servicios',
    'auth.phone': 'Teléfono',
    'auth.password': 'Contraseña',
    'auth.fullName': 'Nombre completo',
    'auth.cedula': 'Cédula',
    'auth.email': 'Email',
    'auth.birthDate': 'Fecha nacimiento',
    'auth.municipality': 'Municipio',
    'auth.loginButton': 'Ingresar',
    'auth.registerButton': 'Crear Cuenta',
    'auth.loginDemo': 'Demo: Usa +505 8888 9999 y contraseña: 123456',
    'auth.loggingIn': 'Ingresando...',
    'auth.registering': 'Registrando...',
    'auth.welcomeBack': '¡Bienvenido a SaludCerca!',
    'auth.welcomeNew': '¡Registro exitoso! Bienvenido a SaludCerca',
    'auth.invalidCredentials': 'Credenciales incorrectas. Intenta con +505 8888 9999 y password: 123456',
    'auth.registerError': 'Error en el registro. Intenta nuevamente.',
    'auth.secureData': 'Datos seguros',
    'auth.reliableHealth': 'Salud confiable',
    'auth.hospitalNetwork': 'Red hospitalaria',
    'auth.backToRoleSelection': 'Volver a Seleccionar Perfil',

    // Dashboard
    'dashboard.welcome': 'Bienvenido, {name}',
    'dashboard.hello': 'Hola, {name}',
    'dashboard.myProfile': 'Mi Perfil',
    'dashboard.healthScore': 'Tu Índice de Salud',
    'dashboard.healthScoreDesc': 'Basado en tu actividad reciente',
    'dashboard.healthScoreGood': 'Excelente estado de salud',
    'dashboard.healthScoreKeepUp': 'Sigue así 💪',
    'dashboard.monthlyChange': '+5% vs mes anterior',
    'dashboard.nextAppointment': 'Próxima Cita',
    'dashboard.reminders': 'Recordatorios Importantes',
    'dashboard.mainServices': 'Servicios Principales',
    'dashboard.newFeatures': 'Nuevas características',
    'dashboard.appointmentsCompleted': 'Citas Completadas',
    'dashboard.generalHealth': 'Salud General',
    'dashboard.pendingReminders': 'Recordatorios',
    'dashboard.thisMonth': 'este mes',
    'dashboard.pending': 'Pendientes',
    'dashboard.previous': 'vs anterior',
    'dashboard.needHelp': '¿Necesitas ayuda rápida?',
    'dashboard.helpDesc': 'Nuestro asistente virtual está disponible 24/7',
    'dashboard.helpChat': 'Chat de Ayuda',

    // Services
    'services.requestAppointment': 'Solicitar Cita',
    'services.requestAppointmentDesc': 'Agenda tu consulta médica',
    'services.myAppointments': 'Mis Citas',
    'services.myAppointmentsDesc': 'Ver y gestionar citas',
    'services.evaluateSymptoms': 'Evaluar Síntomas',
    'services.evaluateSymptomsDesc': 'Análisis inteligente',
    'services.virtualQueue': 'Cola Virtual',
    'services.virtualQueueDesc': 'Check-in inteligente',
    'services.nearbyHospitals': 'Hospitales',
    'services.nearbyHospitalsDesc': 'Encuentra centros médicos',
    'services.myHistory': 'Mi Historial',
    'services.myHistoryDesc': 'Consultas y recetas',

    // Appointment booking
    'appointment.title': 'Solicitar Cita',
    'appointment.step1': 'Seleccionar Especialidad y Hospital',
    'appointment.step1Desc': 'Elige la especialidad médica y el hospital de tu preferencia',
    'appointment.step2': 'Seleccionar Médico',
    'appointment.step2Desc': 'Elige el médico de tu preferencia para la consulta',
    'appointment.step3': 'Fecha y Hora',
    'appointment.step3Desc': 'Selecciona cuándo deseas tu consulta médica',
    'appointment.specialty': 'Especialidad médica',
    'appointment.selectSpecialty': 'Seleccionar especialidad',
    'appointment.hospital': 'Hospital o centro médico',
    'appointment.selectDoctor': 'Seleccionar médico',
    'appointment.available': 'Disponible',
    'appointment.preferredDate': 'Fecha preferida',
    'appointment.preferredTime': 'Hora preferida',
    'appointment.selectTime': 'Seleccionar hora',
    'appointment.reason': 'Motivo de la consulta (opcional)',
    'appointment.reasonPlaceholder': 'Describe brevemente el motivo de tu consulta...',
    'appointment.continue': 'Continuar',
    'appointment.back': 'Atrás',
    'appointment.request': 'Solicitar Cita',
    'appointment.sending': 'Enviando...',
    'appointment.requested': '¡Cita Solicitada!',
    'appointment.requestedDesc': 'Tu solicitud ha sido enviada correctamente',
    'appointment.confirmationSMS': 'Recibirás una confirmación por SMS en los próximos minutos.',
    'appointment.backToHome': 'Volver al Inicio',
    'appointment.notifications': 'Recibirás notificaciones sobre el estado de tu cita',

    // Profile
    'profile.title': 'Mi Perfil',
    'profile.back': 'Volver',
    'profile.edit': 'Editar',
    'profile.save': 'Guardar',
    'profile.verified': 'Verificado',
    'profile.patient': 'Paciente SaludCerca',
    'profile.personalInfo': 'Información Personal',
    'profile.personalInfoDesc': 'Mantén actualizada tu información de contacto',
    'profile.medicalInfo': 'Información Médica',
    'profile.medicalInfoDesc': 'Información importante para tu atención médica',
    'profile.notifications': 'Notificaciones',
    'profile.notificationsDesc': 'Configura cómo quieres recibir notificaciones',
    'profile.security': 'Seguridad y Privacidad',
    'profile.fullName': 'Nombre completo',
    'profile.phone': 'Teléfono',
    'profile.email': 'Email',
    'profile.municipality': 'Municipio',
    'profile.birthDate': 'Fecha de nacimiento',
    'profile.allergies': 'Alergias',
    'profile.allergiesPlaceholder': 'Ej: Penicilina, mariscos, polen...',
    'profile.noAllergies': 'Sin alergias registradas',
    'profile.medicalHistory': 'Antecedentes médicos',
    'profile.medicalHistoryPlaceholder': 'Ej: Diabetes tipo 2, hipertensión...',
    'profile.noMedicalHistory': 'Sin antecedentes registrados',
    'profile.saveChanges': 'Guardar Cambios',
    'profile.saving': 'Guardando...',
    'profile.cancel': 'Cancelar',
    'profile.appointmentReminders': 'Recordatorios de citas',
    'profile.appointmentRemindersDesc': 'Recibe notificaciones antes de tus citas',
    'profile.medicalReminders': 'Recordatorios médicos',
    'profile.medicalRemindersDesc': 'Medicamentos y seguimientos',
    'profile.promotions': 'Promociones y ofertas',
    'profile.promotionsDesc': 'Descuentos en servicios médicos',
    'profile.emergencyAlerts': 'Alertas de emergencia',
    'profile.emergencyAlertsDesc': 'Notificaciones críticas de salud',
    'profile.changePassword': 'Cambiar contraseña',
    'profile.privacySettings': 'Configuración de privacidad',
    'profile.logout': 'Cerrar sesión',
    'profile.updated': 'Perfil actualizado correctamente',
    'profile.updateError': 'Error al actualizar el perfil',
    'profile.loggedOut': 'Sesión cerrada correctamente',
    'profile.theme': 'Tema de la aplicación',
    'profile.themeDesc': 'Elige entre modo claro u oscuro',
    'profile.language': 'Idioma',
    'profile.languageDesc': 'Selecciona tu idioma preferido',
    'profile.lightMode': 'Modo claro',
    'profile.darkMode': 'Modo oscuro',
    'profile.spanish': 'Español',
    'profile.english': 'English',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.accept': 'Aceptar',
    'common.close': 'Cerrar',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.finish': 'Finalizar',
    'common.comingSoon': 'Próximamente',
    'common.comingSoonDesc': 'Esta sección estará disponible muy pronto con nuevas funcionalidades.',

    // Placeholder views
    'placeholder.myAppointments.title': 'Mis Citas',
    'placeholder.myAppointments.desc': 'Aquí podrás ver, gestionar y reprogramar todas tus citas médicas.',
    'placeholder.nearbyHospitals.title': 'Hospitales Cercanos',
    'placeholder.nearbyHospitals.desc': 'Encuentra hospitales y centros médicos cerca de tu ubicación con navegación GPS.',
    'placeholder.medicalHistory.title': 'Mi Historial Médico',
    'placeholder.medicalHistory.desc': 'Consulta tu historial completo de citas, diagnósticos, recetas y exámenes médicos.',
    'placeholder.openHelp': 'Abrir Chat de Ayuda',

    // Specialties
    'specialty.generalMedicine': 'Medicina General',
    'specialty.pediatrics': 'Pediatría',
    'specialty.gynecology': 'Ginecología',
    'specialty.cardiology': 'Cardiología',
    'specialty.dermatology': 'Dermatología',
    'specialty.ophthalmology': 'Oftalmología',
  },
  
  en: {
    // App general
    'app.title': 'HealthNear',
    'app.subtitle': 'Your health, closer than ever',
    'app.tagline': 'Connecting your health with technology',
    'app.loading': 'Loading HealthNear...',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Sign Up',
    'auth.loginTitle': 'Sign In',
    'auth.loginDesc': 'Enter with your registered phone number',
    'auth.registerTitle': 'Create Account',
    'auth.registerDesc': 'Sign up to access all services',
    'auth.phone': 'Phone',
    'auth.password': 'Password',
    'auth.fullName': 'Full name',
    'auth.cedula': 'ID Number',
    'auth.email': 'Email',
    'auth.birthDate': 'Birth date',
    'auth.municipality': 'Municipality',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Create Account',
    'auth.loginDemo': 'Demo: Use +505 8888 9999 and password: 123456',
    'auth.loggingIn': 'Signing in...',
    'auth.registering': 'Creating account...',
    'auth.welcomeBack': 'Welcome back to HealthNear!',
    'auth.welcomeNew': 'Registration successful! Welcome to HealthNear',
    'auth.invalidCredentials': 'Invalid credentials. Try +505 8888 9999 and password: 123456',
    'auth.registerError': 'Registration error. Please try again.',
    'auth.secureData': 'Secure data',
    'auth.reliableHealth': 'Reliable health',
    'auth.hospitalNetwork': 'Hospital network',
    'auth.backToRoleSelection': 'Back to Role Selection',

    // Dashboard
    'dashboard.welcome': 'Welcome, {name}',
    'dashboard.hello': 'Hello, {name}',
    'dashboard.myProfile': 'My Profile',
    'dashboard.healthScore': 'Your Health Score',
    'dashboard.healthScoreDesc': 'Based on your recent activity',
    'dashboard.healthScoreGood': 'Excellent health condition',
    'dashboard.healthScoreKeepUp': 'Keep it up 💪',
    'dashboard.monthlyChange': '+5% vs previous month',
    'dashboard.nextAppointment': 'Next Appointment',
    'dashboard.reminders': 'Important Reminders',
    'dashboard.mainServices': 'Main Services',
    'dashboard.newFeatures': 'New features',
    'dashboard.appointmentsCompleted': 'Completed Appointments',
    'dashboard.generalHealth': 'General Health',
    'dashboard.pendingReminders': 'Reminders',
    'dashboard.thisMonth': 'this month',
    'dashboard.pending': 'Pending',
    'dashboard.previous': 'vs previous',
    'dashboard.needHelp': 'Need quick help?',
    'dashboard.helpDesc': 'Our virtual assistant is available 24/7',
    'dashboard.helpChat': 'Help Chat',

    // Services
    'services.requestAppointment': 'Request Appointment',
    'services.requestAppointmentDesc': 'Schedule your medical consultation',
    'services.myAppointments': 'My Appointments',
    'services.myAppointmentsDesc': 'View and manage appointments',
    'services.evaluateSymptoms': 'Evaluate Symptoms',
    'services.evaluateSymptomsDesc': 'Intelligent analysis',
    'services.virtualQueue': 'Virtual Queue',
    'services.virtualQueueDesc': 'Smart check-in',
    'services.nearbyHospitals': 'Hospitals',
    'services.nearbyHospitalsDesc': 'Find medical centers',
    'services.myHistory': 'My History',
    'services.myHistoryDesc': 'Consultations and prescriptions',

    // Appointment booking
    'appointment.title': 'Request Appointment',
    'appointment.step1': 'Select Specialty and Hospital',
    'appointment.step1Desc': 'Choose the medical specialty and your preferred hospital',
    'appointment.step2': 'Select Doctor',
    'appointment.step2Desc': 'Choose your preferred doctor for the consultation',
    'appointment.step3': 'Date and Time',
    'appointment.step3Desc': 'Select when you want your medical consultation',
    'appointment.specialty': 'Medical specialty',
    'appointment.selectSpecialty': 'Select specialty',
    'appointment.hospital': 'Hospital or medical center',
    'appointment.selectDoctor': 'Select doctor',
    'appointment.available': 'Available',
    'appointment.preferredDate': 'Preferred date',
    'appointment.preferredTime': 'Preferred time',
    'appointment.selectTime': 'Select time',
    'appointment.reason': 'Consultation reason (optional)',
    'appointment.reasonPlaceholder': 'Briefly describe the reason for your consultation...',
    'appointment.continue': 'Continue',
    'appointment.back': 'Back',
    'appointment.request': 'Request Appointment',
    'appointment.sending': 'Sending...',
    'appointment.requested': 'Appointment Requested!',
    'appointment.requestedDesc': 'Your request has been sent successfully',
    'appointment.confirmationSMS': 'You will receive an SMS confirmation in the next few minutes.',
    'appointment.backToHome': 'Back to Home',
    'appointment.notifications': 'You will receive notifications about your appointment status',

    // Profile
    'profile.title': 'My Profile',
    'profile.back': 'Back',
    'profile.edit': 'Edit',
    'profile.save': 'Save',
    'profile.verified': 'Verified',
    'profile.patient': 'HealthNear Patient',
    'profile.personalInfo': 'Personal Information',
    'profile.personalInfoDesc': 'Keep your contact information updated',
    'profile.medicalInfo': 'Medical Information',
    'profile.medicalInfoDesc': 'Important information for your medical care',
    'profile.notifications': 'Notifications',
    'profile.notificationsDesc': 'Configure how you want to receive notifications',
    'profile.security': 'Security and Privacy',
    'profile.fullName': 'Full name',
    'profile.phone': 'Phone',
    'profile.email': 'Email',
    'profile.municipality': 'Municipality',
    'profile.birthDate': 'Birth date',
    'profile.allergies': 'Allergies',
    'profile.allergiesPlaceholder': 'E.g.: Penicillin, seafood, pollen...',
    'profile.noAllergies': 'No registered allergies',
    'profile.medicalHistory': 'Medical history',
    'profile.medicalHistoryPlaceholder': 'E.g.: Type 2 diabetes, hypertension...',
    'profile.noMedicalHistory': 'No registered medical history',
    'profile.saveChanges': 'Save Changes',
    'profile.saving': 'Saving...',
    'profile.cancel': 'Cancel',
    'profile.appointmentReminders': 'Appointment reminders',
    'profile.appointmentRemindersDesc': 'Receive notifications before your appointments',
    'profile.medicalReminders': 'Medical reminders',
    'profile.medicalRemindersDesc': 'Medications and follow-ups',
    'profile.promotions': 'Promotions and offers',
    'profile.promotionsDesc': 'Discounts on medical services',
    'profile.emergencyAlerts': 'Emergency alerts',
    'profile.emergencyAlertsDesc': 'Critical health notifications',
    'profile.changePassword': 'Change password',
    'profile.privacySettings': 'Privacy settings',
    'profile.logout': 'Sign out',
    'profile.updated': 'Profile updated successfully',
    'profile.updateError': 'Error updating profile',
    'profile.loggedOut': 'Signed out successfully',
    'profile.theme': 'App theme',
    'profile.themeDesc': 'Choose between light or dark mode',
    'profile.language': 'Language',
    'profile.languageDesc': 'Select your preferred language',
    'profile.lightMode': 'Light mode',
    'profile.darkMode': 'Dark mode',
    'profile.spanish': 'Español',
    'profile.english': 'English',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.accept': 'Accept',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    'common.comingSoon': 'Coming Soon',
    'common.comingSoonDesc': 'This section will be available very soon with new functionalities.',

    // Placeholder views
    'placeholder.myAppointments.title': 'My Appointments',
    'placeholder.myAppointments.desc': 'Here you can view, manage and reschedule all your medical appointments.',
    'placeholder.nearbyHospitals.title': 'Nearby Hospitals',
    'placeholder.nearbyHospitals.desc': 'Find hospitals and medical centers near your location with GPS navigation.',
    'placeholder.medicalHistory.title': 'My Medical History',
    'placeholder.medicalHistory.desc': 'View your complete history of appointments, diagnoses, prescriptions and medical exams.',
    'placeholder.openHelp': 'Open Help Chat',

    // Specialties
    'specialty.generalMedicine': 'General Medicine',
    'specialty.pediatrics': 'Pediatrics',
    'specialty.gynecology': 'Gynecology',
    'specialty.cardiology': 'Cardiology',
    'specialty.dermatology': 'Dermatology',
    'specialty.ophthalmology': 'Ophthalmology',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('saludcerca_language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('saludcerca_language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[language][key] || key;
    
    if (params) {
      return Object.entries(params).reduce((text, [param, value]) => {
        return text.replace(`{${param}}`, value);
      }, translation);
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};