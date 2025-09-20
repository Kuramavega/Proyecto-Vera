// Funciones de validación para formularios
export const validators = {
  // Validar número de teléfono nicaragüense (8 dígitos)
  phone: (phone: string): { isValid: boolean; message: string } => {
    // Remover espacios, guiones y +505
    const cleanPhone = phone.replace(/[\s\-+]/g, '').replace(/^505/, '');
    
    if (cleanPhone.length !== 8) {
      return { isValid: false, message: 'El teléfono debe tener exactamente 8 dígitos' };
    }
    
    if (!/^\d{8}$/.test(cleanPhone)) {
      return { isValid: false, message: 'El teléfono solo debe contener números' };
    }
    
    // Verificar que comience con un dígito válido para Nicaragua (2, 5, 7, 8)
    const firstDigit = cleanPhone[0];
    if (!['2', '5', '7', '8'].includes(firstDigit)) {
      return { isValid: false, message: 'Número de teléfono no válido para Nicaragua' };
    }
    
    return { isValid: true, message: '' };
  },

  // Validar cédula nicaragüense (formato: XXX-XXXXXX-XXXXC)
  cedula: (cedula: string): { isValid: boolean; message: string } => {
    // Remover espacios
    const cleanCedula = cedula.trim();
    
    if (!cleanCedula) {
      return { isValid: false, message: 'La cédula es requerida' };
    }
    
    // Verificar formato básico: XXX-XXXXXX-XXXXC
    const cedulaRegex = /^\d{3}-\d{6}-\d{4}[A-Z]$/;
    if (!cedulaRegex.test(cleanCedula)) {
      return { isValid: false, message: 'Formato de cédula inválido. Use: 001-120890-0001C' };
    }
    
    const parts = cleanCedula.split('-');
    if (parts.length !== 3) {
      return { isValid: false, message: 'Formato de cédula inválido' };
    }
    
    // Verificar que la fecha de nacimiento en la cédula sea válida
    const birthDateStr = parts[1];
    const day = parseInt(birthDateStr.substring(0, 2));
    const month = parseInt(birthDateStr.substring(2, 4));
    const year = parseInt('19' + birthDateStr.substring(4, 6)); // Asumir 19XX para validación básica
    
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return { isValid: false, message: 'La fecha en la cédula no es válida' };
    }
    
    return { isValid: true, message: '' };
  },

  // Validar fecha de nacimiento
  birthDate: (date: string): { isValid: boolean; message: string } => {
    if (!date) {
      return { isValid: false, message: 'La fecha de nacimiento es requerida' };
    }
    
    const birthDate = new Date(date);
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthYear = birthDate.getFullYear();
    
    // No puede ser fecha futura
    if (birthDate > today) {
      return { isValid: false, message: 'No puedes nacer en el futuro' };
    }
    
    // No puede ser muy antigua (más de 120 años)
    if (currentYear - birthYear > 120) {
      return { isValid: false, message: 'Fecha de nacimiento no válida' };
    }
    
    // No puede ser del año actual (debe tener al menos 1 año)
    if (birthYear >= currentYear) {
      return { isValid: false, message: 'Debe tener al menos 1 año de edad' };
    }
    
    // Verificar que sea una fecha válida
    if (isNaN(birthDate.getTime())) {
      return { isValid: false, message: 'Fecha de nacimiento inválida' };
    }
    
    return { isValid: true, message: '' };
  },

  // Validar nombre (solo letras, espacios y acentos)
  name: (name: string): { isValid: boolean; message: string } => {
    const cleanName = name.trim();
    
    if (!cleanName) {
      return { isValid: false, message: 'El nombre es requerido' };
    }
    
    if (cleanName.length < 2) {
      return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
    }
    
    // Solo letras, espacios y acentos (español)
    const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
    if (!nameRegex.test(cleanName)) {
      return { isValid: false, message: 'El nombre solo puede contener letras y espacios' };
    }
    
    // No debe empezar o terminar con espacio
    if (cleanName !== cleanName.trim()) {
      return { isValid: false, message: 'El nombre no debe empezar o terminar con espacios' };
    }
    
    // No debe tener espacios dobles
    if (cleanName.includes('  ')) {
      return { isValid: false, message: 'El nombre no debe tener espacios dobles' };
    }
    
    return { isValid: true, message: '' };
  },

  // Validar email
  email: (email: string): { isValid: boolean; message: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, message: 'El email es requerido' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Email inválido' };
    }
    
    return { isValid: true, message: '' };
  },

  // Validar contraseña
  password: (password: string): { isValid: boolean; message: string } => {
    if (!password) {
      return { isValid: false, message: 'La contraseña es requerida' };
    }
    
    if (password.length < 6) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    
    return { isValid: true, message: '' };
  }
};

// Función para formatear teléfono nicaragüense
export const formatPhoneNumber = (phone: string): string => {
  // Remover todo excepto números
  const numbers = phone.replace(/\D/g, '');
  
  // Si empieza con 505, removerlo
  const cleanNumbers = numbers.startsWith('505') ? numbers.substring(3) : numbers;
  
  // Limitar a 8 dígitos
  const limitedNumbers = cleanNumbers.substring(0, 8);
  
  // Formatear como +505 XXXX XXXX
  if (limitedNumbers.length >= 4) {
    return `+505 ${limitedNumbers.substring(0, 4)} ${limitedNumbers.substring(4)}`;
  } else {
    return `+505 ${limitedNumbers}`;
  }
};

// Función para formatear cédula nicaragüense
export const formatCedula = (cedula: string): string => {
  // Remover todo excepto números y letras
  let clean = cedula.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  
  // Limitar longitud
  if (clean.length > 14) {
    clean = clean.substring(0, 14);
  }
  
  // Aplicar formato XXX-XXXXXX-XXXXC
  if (clean.length >= 3) {
    if (clean.length >= 9) {
      if (clean.length >= 13) {
        return `${clean.substring(0, 3)}-${clean.substring(3, 9)}-${clean.substring(9)}`;
      } else {
        return `${clean.substring(0, 3)}-${clean.substring(3, 9)}-${clean.substring(9)}`;
      }
    } else {
      return `${clean.substring(0, 3)}-${clean.substring(3)}`;
    }
  }
  
  return clean;
};