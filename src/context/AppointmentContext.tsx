import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  hospitalId: string;
  hospitalName: string;
  department: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  room?: string;
  createdAt: string;
  updatedAt: string;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface AppointmentContextType {
  appointments: Appointment[];
  patients: Patient[];
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status'], notes?: string) => Promise<void>;
  cancelAppointment: (appointmentId: string, reason: string) => Promise<void>;
  getAppointmentsByHospital: (hospitalId: string) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<string>;
  updatePatient: (patientId: string, updates: Partial<Patient>) => Promise<void>;
  getPatient: (patientId: string) => Patient | undefined;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}

// Mock data - In a real app, this would come from a database
const mockPatients: Patient[] = [
  {
    id: 'PAT001',
    name: 'María González Pérez',
    phone: '8765-4321',
    email: 'maria.gonzalez@email.com',
    age: 45,
    gender: 'Femenino',
    address: 'Barrio San José, Managua',
    bloodType: 'O+',
    allergies: ['Penicilina'],
    emergencyContact: {
      name: 'Carlos González',
      phone: '8765-4322',
      relation: 'Esposo'
    }
  },
  {
    id: 'PAT002',
    name: 'Roberto Vega Martinez',
    phone: '8912-3456',
    email: 'roberto.vega@email.com',
    age: 32,
    gender: 'Masculino',
    address: 'Colonia Centro América, Managua',
    bloodType: 'A+',
    emergencyContact: {
      name: 'Ana Vega',
      phone: '8912-3457',
      relation: 'Madre'
    }
  },
  {
    id: 'PAT003',
    name: 'Elena Rodríguez Silva',
    phone: '8654-7890',
    email: 'elena.rodriguez@email.com',
    age: 28,
    gender: 'Femenino',
    address: 'Reparto Schick, Managua',
    bloodType: 'B+',
    allergies: ['Mariscos'],
    emergencyContact: {
      name: 'Luis Rodríguez',
      phone: '8654-7891',
      relation: 'Padre'
    }
  }
];

const mockAppointments: Appointment[] = [
  {
    id: 'APT001',
    patientId: 'PAT001',
    patientName: 'María González Pérez',
    patientPhone: '8765-4321',
    patientAge: 45,
    hospitalId: '1',
    hospitalName: 'Hospital Metropolitano Vivian Pellas',
    department: 'Cardiología',
    doctorId: 'DOC001',
    doctorName: 'Dr. Carlos Mendoza',
    date: '2024-08-25',
    time: '09:00',
    duration: 30,
    type: 'Consulta General',
    status: 'confirmed',
    notes: 'Control rutinario diabetes',
    room: 'Consultorio 3',
    createdAt: '2024-08-20T10:00:00Z',
    updatedAt: '2024-08-20T10:00:00Z'
  },
  {
    id: 'APT002',
    patientId: 'PAT002',
    patientName: 'Roberto Vega Martinez',
    patientPhone: '8912-3456',
    patientAge: 32,
    hospitalId: '1',
    hospitalName: 'Hospital Metropolitano Vivian Pellas',
    department: 'Medicina Interna',
    doctorId: 'DOC002',
    doctorName: 'Dra. Ana Herrera',
    date: '2024-08-25',
    time: '10:30',
    duration: 45,
    type: 'Seguimiento Post-operatorio',
    status: 'pending',
    notes: 'Revisión después de apendicectomía',
    room: 'Consultorio 1',
    createdAt: '2024-08-20T11:00:00Z',
    updatedAt: '2024-08-20T11:00:00Z'
  },
  {
    id: 'APT003',
    patientId: 'PAT003',
    patientName: 'Elena Rodríguez Silva',
    patientPhone: '8654-7890',
    patientAge: 28,
    hospitalId: '2',
    hospitalName: 'Hospital Bautista',
    department: 'Pediatría',
    doctorId: 'DOC003',
    doctorName: 'Dr. Luis Morales',
    date: '2024-08-25',
    time: '14:00',
    duration: 30,
    type: 'Consulta Pediátrica',
    status: 'confirmed',
    notes: 'Vacunación infantil',
    room: 'Consultorio 5',
    createdAt: '2024-08-20T12:00:00Z',
    updatedAt: '2024-08-20T12:00:00Z'
  }
];

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `APT${String(appointments.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAppointments(prev => [...prev, newAppointment]);
    toast.success('Cita creada exitosamente');
    return newAppointment.id;
  };

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status'], notes?: string): Promise<void> => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === appointmentId 
        ? { 
            ...appointment, 
            status, 
            notes: notes || appointment.notes,
            updatedAt: new Date().toISOString()
          }
        : appointment
    ));

    const statusText = {
      pending: 'pendiente',
      confirmed: 'confirmada',
      completed: 'completada',
      cancelled: 'cancelada'
    }[status];

    toast.success(`Cita ${statusText} exitosamente`);
  };

  const cancelAppointment = async (appointmentId: string, reason: string): Promise<void> => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === appointmentId 
        ? { 
            ...appointment, 
            status: 'cancelled',
            notes: `Cancelada: ${reason}`,
            updatedAt: new Date().toISOString()
          }
        : appointment
    ));

    toast.success('Cita cancelada exitosamente');
  };

  const getAppointmentsByHospital = (hospitalId: string): Appointment[] => {
    return appointments.filter(appointment => appointment.hospitalId === hospitalId);
  };

  const getAppointmentsByPatient = (patientId: string): Appointment[] => {
    return appointments.filter(appointment => appointment.patientId === patientId);
  };

  const getAppointmentsByDoctor = (doctorId: string): Appointment[] => {
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  };

  const addPatient = async (patientData: Omit<Patient, 'id'>): Promise<string> => {
    const newPatient: Patient = {
      ...patientData,
      id: `PAT${String(patients.length + 1).padStart(3, '0')}`
    };

    setPatients(prev => [...prev, newPatient]);
    toast.success('Paciente registrado exitosamente');
    return newPatient.id;
  };

  const updatePatient = async (patientId: string, updates: Partial<Patient>): Promise<void> => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, ...updates }
        : patient
    ));

    toast.success('Información del paciente actualizada');
  };

  const getPatient = (patientId: string): Patient | undefined => {
    return patients.find(patient => patient.id === patientId);
  };

  const value: AppointmentContextType = {
    appointments,
    patients,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    getAppointmentsByHospital,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    addPatient,
    updatePatient,
    getPatient
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}