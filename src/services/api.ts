// API Service - Base configuration for database connections
export class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(telefono: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ telefono, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(userData: any) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Appointments endpoints
  async getCitas(userId: string) {
    return this.request(`/appointments?user_id=${userId}`);
  }

  async createCita(citaData: any) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(citaData),
    });
  }

  async updateCita(citaId: string, data: any) {
    return this.request(`/appointments/${citaId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Hospitals endpoints
  async getHospitals(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/hospitals?${params}`);
  }

  async getDoctors(hospitalId?: string, especialidad?: string) {
    const params = new URLSearchParams({ 
      ...(hospitalId && { hospital_id: hospitalId }),
      ...(especialidad && { especialidad })
    });
    return this.request(`/doctors?${params}`);
  }

  // Queue endpoints
  async checkIn(appointmentId: string) {
    return this.request('/checkins', {
      method: 'POST',
      body: JSON.stringify({ appointment_id: appointmentId }),
    });
  }

  async getQueueStatus(hospitalId: string) {
    return this.request(`/queue?hospital_id=${hospitalId}`);
  }

  // Medical records endpoints
  async getMedicalHistory(userId: string) {
    return this.request(`/medical-history/${userId}`);
  }

  async createMedicalNote(noteData: any) {
    return this.request('/medical-notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  // Chat/AI endpoints
  async sendChatMessage(message: string, context?: any) {
    return this.request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async getSymptomAssessment(symptoms: any) {
    return this.request('/ai/assess-symptoms', {
      method: 'POST',
      body: JSON.stringify({ symptoms }),
    });
  }
}

export const apiService = new ApiService();