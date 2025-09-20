-- =====================================================
-- SALUDCERCA - BASE DE DATOS MYSQL COMPLETA
-- Sistema de Gestión Hospitalaria y Citas Médicas
-- =====================================================

-- Configuración inicial
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS saludcerca_db;
CREATE DATABASE saludcerca_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE saludcerca_db;

-- =====================================================
-- TABLAS DE CONFIGURACIÓN GEOGRÁFICA
-- =====================================================

-- Departamentos de Nicaragua
CREATE TABLE departamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Municipios de Nicaragua
CREATE TABLE municipios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    departamento_id INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_municipio_departamento (nombre, departamento_id)
);

-- =====================================================
-- SISTEMA DE HOSPITALES
-- =====================================================

-- Tipos de establecimientos de salud
CREATE TABLE tipos_establecimientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    nivel_complejidad ENUM('I', 'II', 'III', 'IV') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospitales y centros de salud
CREATE TABLE hospitales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    codigo_establecimiento VARCHAR(20) UNIQUE NOT NULL,
    tipo_id INT NOT NULL,
    municipio_id INT NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    capacidad_camas INT DEFAULT 0,
    nivel_complejidad ENUM('I', 'II', 'III', 'IV') NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO', 'MANTENIMIENTO') DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_id) REFERENCES tipos_establecimientos(id),
    FOREIGN KEY (municipio_id) REFERENCES municipios(id),
    INDEX idx_municipio (municipio_id),
    INDEX idx_estado (estado),
    INDEX idx_nivel (nivel_complejidad)
);

-- Especialidades médicas
CREATE TABLE especialidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    requiere_referencia BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departamentos hospitalarios
CREATE TABLE departamentos_hospitalarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT NOT NULL,
    especialidad_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    capacidad_pacientes INT DEFAULT 0,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitales(id) ON DELETE CASCADE,
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id),
    UNIQUE KEY unique_hospital_especialidad (hospital_id, especialidad_id)
);

-- =====================================================
-- SISTEMA DE USUARIOS
-- =====================================================

-- Tipos de documentos de identidad
CREATE TABLE tipos_documentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    formato VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios del sistema (pacientes y personal)
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_usuario ENUM('PACIENTE', 'PERSONAL', 'ADMIN') NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    tipo_documento_id INT NOT NULL,
    numero_documento VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero ENUM('M', 'F', 'O') NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE,
    municipio_id INT NOT NULL,
    direccion TEXT,
    password_hash VARCHAR(255) NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
    verificado BOOLEAN DEFAULT FALSE,
    ultimo_acceso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_documento_id) REFERENCES tipos_documentos(id),
    FOREIGN KEY (municipio_id) REFERENCES municipios(id),
    UNIQUE KEY unique_documento (tipo_documento_id, numero_documento),
    INDEX idx_telefono (telefono),
    INDEX idx_email (email),
    INDEX idx_tipo_usuario (tipo_usuario)
);

-- Información médica básica de pacientes
CREATE TABLE pacientes_info_medica (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_sangre ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NULL,
    peso DECIMAL(5,2) NULL,
    altura DECIMAL(3,2) NULL,
    alergias TEXT,
    medicamentos_actuales TEXT,
    enfermedades_cronicas TEXT,
    contacto_emergencia_nombre VARCHAR(100),
    contacto_emergencia_telefono VARCHAR(20),
    contacto_emergencia_relacion VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =====================================================
-- SISTEMA DE PERSONAL HOSPITALARIO
-- =====================================================

-- Roles del personal hospitalario
CREATE TABLE roles_personal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    nivel_acceso INT NOT NULL DEFAULT 1,
    permisos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal hospitalario
CREATE TABLE personal_hospitalario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    hospital_id INT NOT NULL,
    rol_id INT NOT NULL,
    departamento_id INT NULL,
    numero_licencia VARCHAR(50) NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    estado ENUM('ACTIVO', 'INACTIVO', 'LICENCIA', 'VACACIONES') DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitales(id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles_personal(id),
    FOREIGN KEY (departamento_id) REFERENCES departamentos_hospitalarios(id),
    UNIQUE KEY unique_usuario_hospital (usuario_id, hospital_id)
);

-- Médicos (extensión del personal hospitalario)
CREATE TABLE medicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personal_id INT NOT NULL,
    especialidad_principal_id INT NOT NULL,
    subespecialidades JSON,
    anos_experiencia INT DEFAULT 0,
    universidad_graduacion VARCHAR(200),
    ano_graduacion YEAR,
    certificaciones JSON,
    tarifa_consulta DECIMAL(10,2) DEFAULT 0.00,
    biografia TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (personal_id) REFERENCES personal_hospitalario(id) ON DELETE CASCADE,
    FOREIGN KEY (especialidad_principal_id) REFERENCES especialidades(id)
);

-- =====================================================
-- SISTEMA DE CITAS MÉDICAS
-- =====================================================

-- Estados de las citas
CREATE TABLE estados_citas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#000000',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipos de cita
CREATE TABLE tipos_citas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    duracion_minutos INT DEFAULT 30,
    requiere_referencia BOOLEAN DEFAULT FALSE,
    precio DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Horarios de atención de médicos
CREATE TABLE horarios_medicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medico_id INT NOT NULL,
    dia_semana ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    intervalo_citas INT DEFAULT 30,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_medico_dia (medico_id, dia_semana)
);

-- Citas médicas
CREATE TABLE citas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_cita VARCHAR(20) UNIQUE NOT NULL,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    hospital_id INT NOT NULL,
    tipo_cita_id INT NOT NULL,
    estado_id INT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo_consulta TEXT,
    notas_paciente TEXT,
    precio DECIMAL(10,2) DEFAULT 0.00,
    forma_pago ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'SEGURO') NULL,
    confirmada_por_paciente BOOLEAN DEFAULT FALSE,
    confirmada_por_medico BOOLEAN DEFAULT FALSE,
    fecha_confirmacion TIMESTAMP NULL,
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id),
    FOREIGN KEY (medico_id) REFERENCES medicos(id),
    FOREIGN KEY (hospital_id) REFERENCES hospitales(id),
    FOREIGN KEY (tipo_cita_id) REFERENCES tipos_citas(id),
    FOREIGN KEY (estado_id) REFERENCES estados_citas(id),
    INDEX idx_fecha_cita (fecha_cita),
    INDEX idx_paciente_fecha (paciente_id, fecha_cita),
    INDEX idx_medico_fecha (medico_id, fecha_cita),
    INDEX idx_hospital_fecha (hospital_id, fecha_cita)
);

-- Historial de cambios de citas
CREATE TABLE historial_citas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cita_id INT NOT NULL,
    estado_anterior_id INT NULL,
    estado_nuevo_id INT NOT NULL,
    usuario_cambio_id INT NOT NULL,
    motivo_cambio TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
    FOREIGN KEY (estado_anterior_id) REFERENCES estados_citas(id),
    FOREIGN KEY (estado_nuevo_id) REFERENCES estados_citas(id),
    FOREIGN KEY (usuario_cambio_id) REFERENCES usuarios(id)
);

-- =====================================================
-- SISTEMA DE HISTORIALES CLÍNICOS
-- =====================================================

-- Consultas médicas realizadas
CREATE TABLE consultas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cita_id INT NOT NULL,
    diagnostico_principal TEXT,
    diagnosticos_secundarios JSON,
    sintomas TEXT,
    examen_fisico TEXT,
    tratamiento TEXT,
    medicamentos_recetados JSON,
    examenes_solicitados JSON,
    observaciones TEXT,
    proximo_control DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE
);

-- Signos vitales
CREATE TABLE signos_vitales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    consulta_id INT NOT NULL,
    presion_sistolica INT NULL,
    presion_diastolica INT NULL,
    frecuencia_cardiaca INT NULL,
    frecuencia_respiratoria INT NULL,
    temperatura DECIMAL(4,2) NULL,
    peso DECIMAL(5,2) NULL,
    altura DECIMAL(3,2) NULL,
    saturacion_oxigeno INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE CASCADE
);

-- Medicamentos
CREATE TABLE medicamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    principio_activo VARCHAR(200),
    concentracion VARCHAR(100),
    forma_farmaceutica VARCHAR(100),
    laboratorio VARCHAR(200),
    codigo_barra VARCHAR(50) UNIQUE,
    requiere_receta BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescripciones médicas
CREATE TABLE prescripciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    consulta_id INT NOT NULL,
    medicamento_id INT NOT NULL,
    dosis VARCHAR(100) NOT NULL,
    frecuencia VARCHAR(100) NOT NULL,
    duracion VARCHAR(100) NOT NULL,
    instrucciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE CASCADE,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id)
);

-- =====================================================
-- SISTEMA DE COLA VIRTUAL
-- =====================================================

-- Cola virtual de espera
CREATE TABLE cola_virtual (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cita_id INT NOT NULL,
    numero_turno INT NOT NULL,
    estado ENUM('ESPERANDO', 'EN_ATENCION', 'ATENDIDO', 'NO_PRESENTO') DEFAULT 'ESPERANDO',
    hora_llegada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hora_llamada TIMESTAMP NULL,
    hora_atencion TIMESTAMP NULL,
    tiempo_espera_minutos INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cita_turno (cita_id)
);

-- =====================================================
-- SISTEMA DE NOTIFICACIONES
-- =====================================================

-- Tipos de notificaciones
CREATE TABLE tipos_notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    canal ENUM('EMAIL', 'SMS', 'PUSH', 'SISTEMA') NOT NULL,
    template TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notificaciones
CREATE TABLE notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    datos_adicionales JSON,
    leida BOOLEAN DEFAULT FALSE,
    enviada BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP NULL,
    error_envio TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_id) REFERENCES tipos_notificaciones(id),
    INDEX idx_usuario_leida (usuario_id, leida),
    INDEX idx_fecha_creacion (created_at)
);

-- =====================================================
-- SISTEMA DE REPORTES Y AUDITORÍA
-- =====================================================

-- Log de actividades del sistema
CREATE TABLE auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100),
    registro_id INT NULL,
    datos_anteriores JSON,
    datos_nuevos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_usuario_fecha (usuario_id, created_at),
    INDEX idx_tabla_registro (tabla_afectada, registro_id)
);

-- Métricas del sistema
CREATE TABLE metricas_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT NULL,
    fecha_metrica DATE NOT NULL,
    citas_programadas INT DEFAULT 0,
    citas_completadas INT DEFAULT 0,
    citas_canceladas INT DEFAULT 0,
    citas_no_show INT DEFAULT 0,
    tiempo_promedio_espera INT DEFAULT 0,
    satisfaccion_promedio DECIMAL(3,2) DEFAULT 0.00,
    usuarios_activos INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitales(id),
    UNIQUE KEY unique_hospital_fecha (hospital_id, fecha_metrica)
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar departamentos de Nicaragua
INSERT INTO departamentos (nombre, codigo) VALUES
('Boaco', 'BO'),
('Carazo', 'CA'),
('Chinandega', 'CH'),
('Chontales', 'CO'),
('Estelí', 'ES'),
('Granada', 'GR'),
('Jinotega', 'JI'),
('León', 'LE'),
('Madriz', 'MD'),
('Managua', 'MN'),
('Masaya', 'MS'),
('Matagalpa', 'MT'),
('Nueva Segovia', 'NS'),
('Río San Juan', 'SJ'),
('Rivas', 'RI'),
('RACCS', 'AS'),
('RACCN', 'AN');

-- Insertar algunos municipios principales
INSERT INTO municipios (nombre, departamento_id, codigo) VALUES
('Managua', 10, 'MN01'),
('Tipitapa', 10, 'MN02'),
('Ciudad Sandino', 10, 'MN03'),
('Masaya', 11, 'MS01'),
('Granada', 6, 'GR01'),
('León', 8, 'LE01'),
('Chinandega', 3, 'CH01'),
('Estelí', 5, 'ES01'),
('Matagalpa', 12, 'MT01'),
('Jinotega', 7, 'JI01');

-- Insertar tipos de documentos
INSERT INTO tipos_documentos (nombre, codigo, formato) VALUES
('Cédula de Identidad', 'CI', '000-000000-0000A'),
('Pasaporte', 'PP', 'A00000000'),
('Documento Extranjero', 'DE', 'VARIABLE');

-- Insertar tipos de establecimientos
INSERT INTO tipos_establecimientos (nombre, descripcion, nivel_complejidad) VALUES
('Hospital Nacional', 'Hospital público de alta complejidad', 'IV'),
('Hospital Regional', 'Hospital público regional', 'III'),
('Hospital Departamental', 'Hospital público departamental', 'II'),
('Hospital Privado', 'Hospital privado', 'III'),
('Centro de Salud', 'Centro de salud público', 'I'),
('Clínica Privada', 'Clínica especializada privada', 'II');

-- Insertar especialidades médicas
INSERT INTO especialidades (nombre, codigo, descripcion, requiere_referencia) VALUES
('Medicina General', 'MG', 'Atención médica general y preventiva', FALSE),
('Cardiología', 'CA', 'Especialidad del corazón y sistema cardiovascular', TRUE),
('Pediatría', 'PE', 'Atención médica infantil', FALSE),
('Ginecología', 'GI', 'Salud femenina y reproductiva', FALSE),
('Neurología', 'NE', 'Sistema nervioso y cerebro', TRUE),
('Traumatología', 'TR', 'Huesos, articulaciones y traumatismos', TRUE),
('Dermatología', 'DE', 'Enfermedades de la piel', TRUE),
('Oftalmología', 'OF', 'Enfermedades de los ojos', TRUE),
('Oncología', 'ON', 'Tratamiento del cáncer', TRUE),
('Medicina Interna', 'MI', 'Medicina interna del adulto', TRUE),
('Emergencias', 'EM', 'Atención de emergencias médicas', FALSE),
('Psiquiatría', 'PS', 'Salud mental', TRUE);

-- Insertar hospitales de Managua (datos reales)
INSERT INTO hospitales (nombre, codigo_establecimiento, tipo_id, municipio_id, direccion, telefono, nivel_complejidad, capacidad_camas, latitud, longitud) VALUES
('Hospital Metropolitano Vivian Pellas', 'HMVP001', 4, 1, 'Km 9.5 Carretera Masaya, Managua', '+505 2255-6900', 'IV', 200, 12.081389, -86.236111),
('Hospital Bautista', 'HB001', 4, 1, 'Barrio Largaespada, Managua', '+505 2249-7070', 'III', 150, 12.114722, -86.270833),
('Hospital Alemán Nicaragüense', 'HAN001', 4, 1, 'Pista Jean Paul Genie, Managua', '+505 2228-6171', 'III', 100, 12.089722, -86.275),
('Hospital Salud Integral', 'HSI001', 4, 1, 'Plaza El Sol, Managua', '+505 2255-8888', 'III', 80, 12.097222, -86.240833),
('Hospital Monte España', 'HME001', 4, 1, 'Km 11 Carretera Sur, Managua', '+505 2255-8300', 'III', 120, 12.075, -86.235556),
('Hospital Escuela Dr. Roberto Calderón', 'HERC001', 1, 1, 'Barrio Altagracia, Managua', '+505 2222-2200', 'IV', 400, 12.134167, -86.251389),
('Hospital Bertha Calderón Roque', 'HBCR001', 1, 1, 'Villa Libertad, Managua', '+505 2289-4700', 'III', 250, 12.115278, -86.290833),
('Hospital Fernando Vélez Paiz', 'HFVP001', 1, 1, 'Villa Venezuela, Managua', '+505 2248-9900', 'III', 200, 12.127778, -86.298611),
('Hospital Escuela César Amador Molina', 'HECAM001', 1, 1, 'Carretera Norte, Managua', '+505 2233-4455', 'III', 180, 12.166667, -86.283333),
('Hospital Enrique Bolaños', 'HEB001', 1, 1, 'Distrito VI, Managua', '+505 2244-5566', 'II', 100, 12.105556, -86.263889),
('Hospital Lenin Fonseca', 'HLF001', 1, 1, 'Barrio Ducualí, Managua', '+505 2222-6677', 'IV', 300, 12.126389, -86.263889),
('Hospital de la Mujer Bertha Calderón', 'HMBC001', 1, 1, 'Ciudad Sandino, Managua', '+505 2269-8800', 'III', 150, 12.158333, -86.341667),
('Hospital Infantil Manuel de Jesús Rivera', 'HIMJR001', 1, 1, 'Barrio Ducualí, Managua', '+505 2222-7788', 'IV', 200, 12.128056, -86.265278),
('Hospital Escuela Oscar Danilo Rosales', 'HEODR001', 1, 2, 'León Centro, León', '+505 2311-2200', 'IV', 350, 12.433333, -86.883333),
('Hospital San Juan de Dios', 'HSJD001', 1, 3, 'Granada Centro, Granada', '+505 2552-2778', 'III', 150, 11.933333, -85.95);

-- Insertar estados de citas
INSERT INTO estados_citas (nombre, descripcion, color) VALUES
('PROGRAMADA', 'Cita programada y confirmada', '#3B82F6'),
('CONFIRMADA', 'Cita confirmada por el paciente', '#10B981'),
('EN_CURSO', 'Paciente siendo atendido', '#F59E0B'),
('COMPLETADA', 'Cita completada exitosamente', '#22C55E'),
('CANCELADA', 'Cita cancelada', '#EF4444'),
('NO_SHOW', 'Paciente no se presentó', '#F97316'),
('REPROGRAMADA', 'Cita reprogramada', '#8B5CF6');

-- Insertar tipos de citas
INSERT INTO tipos_citas (nombre, descripcion, duracion_minutos, precio) VALUES
('Consulta General', 'Consulta médica general', 30, 200.00),
('Consulta Especializada', 'Consulta con médico especialista', 45, 350.00),
('Control Rutinario', 'Control médico de rutina', 20, 150.00),
('Emergencia', 'Atención de emergencia', 60, 500.00),
('Telemedicina', 'Consulta virtual por video', 30, 180.00);

-- Insertar roles del personal
INSERT INTO roles_personal (nombre, descripcion, nivel_acceso, permisos) VALUES
('Médico Especialista', 'Médico con especialidad certificada', 4, '{"consultas": true, "prescripciones": true, "historiales": true, "reportes": true}'),
('Médico General', 'Médico de medicina general', 3, '{"consultas": true, "prescripciones": true, "historiales": true}'),
('Enfermero/a', 'Personal de enfermería', 2, '{"signos_vitales": true, "medicamentos": true, "cola_virtual": true}'),
('Administrativo', 'Personal administrativo', 2, '{"citas": true, "pacientes": true, "reportes_basicos": true}'),
('Recepcionista', 'Personal de recepción', 1, '{"citas": true, "cola_virtual": true}'),
('Director Médico', 'Director del hospital', 5, '{"all": true}');

-- Insertar tipos de notificaciones
INSERT INTO tipos_notificaciones (nombre, descripcion, canal, template) VALUES
('CITA_CONFIRMADA', 'Confirmación de cita médica', 'SMS', 'Su cita ha sido confirmada para el {fecha} a las {hora} en {hospital}'),
('RECORDATORIO_CITA', 'Recordatorio de cita próxima', 'SMS', 'Recordatorio: Tiene cita mañana {fecha} a las {hora} en {hospital}'),
('CITA_CANCELADA', 'Notificación de cita cancelada', 'SMS', 'Su cita del {fecha} ha sido cancelada. Contacte al hospital para reprogramar'),
('TURNO_COLA', 'Notificación de turno en cola virtual', 'PUSH', 'Su turno #{turno} será atendido en aproximadamente {tiempo_estimado} minutos');

-- Configurar claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para mejorar rendimiento de consultas frecuentes
CREATE INDEX idx_citas_fecha_estado ON citas(fecha_cita, estado_id);
CREATE INDEX idx_usuarios_telefono_activo ON usuarios(telefono, estado);
CREATE INDEX idx_personal_hospital_activo ON personal_hospitalario(hospital_id, estado);
CREATE INDEX idx_horarios_activos ON horarios_medicos(activo, dia_semana);

-- =====================================================
-- TRIGGERS PARA AUDITORÍA Y LÓGICA DE NEGOCIO
-- =====================================================

DELIMITER $$

-- Trigger para auditoría de cambios en citas
CREATE TRIGGER audit_citas_update
    AFTER UPDATE ON citas
    FOR EACH ROW
BEGIN
    INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos)
    VALUES (NEW.paciente_id, 'UPDATE', 'citas', NEW.id, 
            JSON_OBJECT('estado_id', OLD.estado_id, 'fecha_cita', OLD.fecha_cita),
            JSON_OBJECT('estado_id', NEW.estado_id, 'fecha_cita', NEW.fecha_cita));
END$$

-- Trigger para generar código de cita automáticamente
CREATE TRIGGER generate_cita_code
    BEFORE INSERT ON citas
    FOR EACH ROW
BEGIN
    IF NEW.codigo_cita IS NULL OR NEW.codigo_cita = '' THEN
        SET NEW.codigo_cita = CONCAT('C', YEAR(CURDATE()), LPAD(MONTH(CURDATE()), 2, '0'), LPAD(DAY(CURDATE()), 2, '0'), LPAD(NEW.hospital_id, 3, '0'), LPAD((SELECT COALESCE(MAX(id), 0) + 1 FROM citas), 6, '0'));
    END IF;
END$$

-- Trigger para actualizar métricas automáticamente
CREATE TRIGGER update_metricas_citas
    AFTER UPDATE ON citas
    FOR EACH ROW
BEGIN
    IF OLD.estado_id != NEW.estado_id THEN
        INSERT INTO metricas_sistema (hospital_id, fecha_metrica, citas_completadas, citas_canceladas)
        VALUES (NEW.hospital_id, CURDATE(), 
                CASE WHEN NEW.estado_id = (SELECT id FROM estados_citas WHERE nombre = 'COMPLETADA') THEN 1 ELSE 0 END,
                CASE WHEN NEW.estado_id = (SELECT id FROM estados_citas WHERE nombre = 'CANCELADA') THEN 1 ELSE 0 END)
        ON DUPLICATE KEY UPDATE
            citas_completadas = citas_completadas + CASE WHEN NEW.estado_id = (SELECT id FROM estados_citas WHERE nombre = 'COMPLETADA') THEN 1 ELSE 0 END,
            citas_canceladas = citas_canceladas + CASE WHEN NEW.estado_id = (SELECT id FROM estados_citas WHERE nombre = 'CANCELADA') THEN 1 ELSE 0 END;
    END IF;
END$$

DELIMITER ;

-- =====================================================
-- VISTAS ÚTILES PARA EL SISTEMA
-- =====================================================

-- Vista para citas completas con información detallada
CREATE VIEW vista_citas_completas AS
SELECT 
    c.id,
    c.codigo_cita,
    c.fecha_cita,
    c.hora_inicio,
    c.hora_fin,
    CONCAT(p.nombres, ' ', p.apellidos) as paciente_nombre,
    p.telefono as paciente_telefono,
    CONCAT(mp.nombres, ' ', mp.apellidos) as medico_nombre,
    e.nombre as especialidad,
    h.nombre as hospital_nombre,
    ec.nombre as estado_cita,
    tc.nombre as tipo_cita,
    c.motivo_consulta,
    c.precio
FROM citas c
JOIN usuarios p ON c.paciente_id = p.id
JOIN medicos m ON c.medico_id = m.id
JOIN personal_hospitalario ph ON m.personal_id = ph.id
JOIN usuarios mp ON ph.usuario_id = mp.id
JOIN especialidades e ON m.especialidad_principal_id = e.id
JOIN hospitales h ON c.hospital_id = h.id
JOIN estados_citas ec ON c.estado_id = ec.id
JOIN tipos_citas tc ON c.tipo_cita_id = tc.id;

-- Vista para personal hospitalario completo
CREATE VIEW vista_personal_completo AS
SELECT 
    ph.id,
    CONCAT(u.nombres, ' ', u.apellidos) as nombre_completo,
    u.email,
    u.telefono,
    h.nombre as hospital_nombre,
    rp.nombre as rol,
    e.nombre as especialidad,
    ph.numero_licencia,
    ph.estado,
    ph.fecha_inicio
FROM personal_hospitalario ph
JOIN usuarios u ON ph.usuario_id = u.id
JOIN hospitales h ON ph.hospital_id = h.id
JOIN roles_personal rp ON ph.rol_id = rp.id
LEFT JOIN departamentos_hospitalarios dh ON ph.departamento_id = dh.id
LEFT JOIN especialidades e ON dh.especialidad_id = e.id;

-- Vista para estadísticas de hospitales
CREATE VIEW vista_estadisticas_hospitales AS
SELECT 
    h.id,
    h.nombre,
    h.municipio_id,
    COUNT(DISTINCT ph.id) as total_personal,
    COUNT(DISTINCT CASE WHEN rp.nombre LIKE '%Médico%' THEN ph.id END) as total_medicos,
    COUNT(DISTINCT c.id) as total_citas_mes,
    COUNT(DISTINCT CASE WHEN c.estado_id = (SELECT id FROM estados_citas WHERE nombre = 'COMPLETADA') THEN c.id END) as citas_completadas_mes
FROM hospitales h
LEFT JOIN personal_hospitalario ph ON h.id = ph.hospital_id AND ph.estado = 'ACTIVO'
LEFT JOIN roles_personal rp ON ph.rol_id = rp.id
LEFT JOIN citas c ON h.id = c.hospital_id AND c.fecha_cita >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY h.id, h.nombre, h.municipio_id;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =====================================================

DELIMITER $$

-- Procedimiento para obtener horarios disponibles de un médico
CREATE PROCEDURE GetHorariosDisponibles(
    IN p_medico_id INT,
    IN p_fecha DATE
)
BEGIN
    DECLARE v_dia_semana VARCHAR(20);
    
    SET v_dia_semana = CASE DAYOFWEEK(p_fecha)
        WHEN 1 THEN 'DOMINGO'
        WHEN 2 THEN 'LUNES'
        WHEN 3 THEN 'MARTES'
        WHEN 4 THEN 'MIERCOLES'
        WHEN 5 THEN 'JUEVES'
        WHEN 6 THEN 'VIERNES'
        WHEN 7 THEN 'SABADO'
    END;
    
    SELECT 
        hm.hora_inicio,
        hm.hora_fin,
        hm.intervalo_citas,
        COUNT(c.id) as citas_ocupadas
    FROM horarios_medicos hm
    LEFT JOIN citas c ON hm.medico_id = c.medico_id 
        AND c.fecha_cita = p_fecha
        AND c.estado_id NOT IN (SELECT id FROM estados_citas WHERE nombre IN ('CANCELADA', 'NO_SHOW'))
    WHERE hm.medico_id = p_medico_id 
        AND hm.dia_semana = v_dia_semana
        AND hm.activo = TRUE
    GROUP BY hm.id, hm.hora_inicio, hm.hora_fin, hm.intervalo_citas;
END$$

-- Procedimiento para obtener estadísticas de un hospital
CREATE PROCEDURE GetEstadisticasHospital(
    IN p_hospital_id INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT 
        COUNT(DISTINCT c.id) as total_citas,
        COUNT(DISTINCT CASE WHEN ec.nombre = 'COMPLETADA' THEN c.id END) as citas_completadas,
        COUNT(DISTINCT CASE WHEN ec.nombre = 'CANCELADA' THEN c.id END) as citas_canceladas,
        COUNT(DISTINCT CASE WHEN ec.nombre = 'NO_SHOW' THEN c.id END) as no_show,
        AVG(CASE WHEN ec.nombre = 'COMPLETADA' THEN c.precio ELSE NULL END) as precio_promedio,
        COUNT(DISTINCT c.paciente_id) as pacientes_unicos,
        COUNT(DISTINCT c.medico_id) as medicos_activos
    FROM citas c
    JOIN estados_citas ec ON c.estado_id = ec.id
    WHERE c.hospital_id = p_hospital_id
        AND c.fecha_cita BETWEEN p_fecha_inicio AND p_fecha_fin;
END$$

DELIMITER ;

-- =====================================================
-- FINALIZACIÓN
-- =====================================================

-- Mensaje de confirmación
SELECT 'Base de datos SaludCerca creada exitosamente' as resultado;
SELECT COUNT(*) as total_hospitales FROM hospitales;
SELECT COUNT(*) as total_especialidades FROM especialidades;
SELECT COUNT(*) as total_departamentos FROM departamentos;