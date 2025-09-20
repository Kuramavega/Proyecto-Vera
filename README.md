# SaludCerca - Aplicación para Pacientes

  Este repositorio contiene la versión de código del proyecto "SaludCerca - Aplicación para Pacientes".
  Abajo encontrarás una explicación completa y detallada de la conectividad del código: estructuras, puntos de entrada, cómo fluye la información entre componentes, contexts, servicios, hooks, y cómo construir/ejecutar la app.

  ## Resumen rápido

  - Lenguaje y stack: React + TypeScript con Vite (plugin React SWC).
  - Punto de entrada web: `index.html` -> `src/main.tsx` -> `src/App.tsx`.
  - Estado global y lógica compartida: `src/context/*` (p. ej. `AuthContext.tsx`, `AppointmentContext.tsx`, `GlobalStateContext.tsx`).
  - Comunicación con APIs y persistencia: `src/services/*` (`api.ts`, `apiConfig.ts`, `database.ts`, `chatAI.ts`, `medicalKnowledge.ts`).
  - Componentes UI y vistas: `src/components/*` (carpetas `admin`, `hospital-staff`, `ui`, y componentes raíz como `Dashboard.tsx`, `ViewRouter.tsx`).

  ## Estructura de alto nivel y responsabilidades

  - `index.html`: HTML estático que monta la app en `<div id="root"></div>` y carga `src/main.tsx`.
  - `src/main.tsx`: Inicializa React, proveedores globales (themes, i18n si aplica), y renderiza `App` dentro del root.
  - `src/App.tsx`: Componente raíz. Normalmente envuelve `ViewRouter` y providers (por ejemplo `AuthContext`, `ThemeContext`) y configura enrutamiento y layout global.
  - `src/ViewRouter.tsx`: Se encarga de decidir qué vistas mostrar según rutas y permisos. Aquí se integran rutas públicas y privadas (auth guard) y se enrutan a componentes en `src/components/`.

  ## Contextos (state compartido)

  Carpeta: `src/context/`

  Principales archivos y su rol (conectividad):

  - `AuthContext.tsx`: mantiene estado de autenticación (usuario, token, roles). Expuesta mediante un hook (p. ej. `useAuth`) que usan componentes como `Auth.tsx`, `RoleSelector.tsx`, `ViewRouter.tsx` y guardas de rutas. Cuando el usuario hace login, `AuthContext` invoca `services/api` para obtener credenciales y actualiza el estado; los consumidores reaccionan a esos cambios.
  - `AppointmentContext.tsx`: guarda la lista de citas, filtros y operaciones (crear, cancelar). Se sincroniza con `services/api` y `database.ts` si hay persistencia local.
  - `GlobalStateContext.tsx`: estado transversales (notificaciones, loading global, errores). Muchos componentes UI leen/escriben aquí para mostrar indicadores.
  - `LanguageContext.tsx` y `ThemeContext.tsx`: manejan la localización y tema. Componentes UI (`ui/*`) consultan estos contexts para renderizar el idioma y estilos adecuados.

  Conectividad: los contexts son proveedores que envuelven `App` en `main.tsx`. Los componentes llaman hooks (p. ej. `useContext(AuthContext)`) para leer estado o disparar acciones. Cuando un servicio (en `services/`) responde, los contexts actualizan su estado y se propagan re-renderizados.

  ## Servicios (API y lógica externa)

  Carpeta: `src/services/`

  - `apiConfig.ts`: contiene la configuración base para llamadas HTTP (baseURL, timeouts, interceptores). Idealmente exporta constantes o una instancia `fetch`/`axios` configurada.
  - `api.ts`: funciones de alto nivel para comunicación con el backend (ej. `login`, `getAppointments`, `createAppointment`). Los contexts y hooks llaman a `api.ts`.
  - `database.ts`: utilidades para persistencia local (IndexedDB o localStorage). Usado para cache o modo offline; sincroniza con `api.ts` cuando hay conexión.
  - `chatAI.ts`: integración con un servicio de IA para respuestas (chatbot). `Chatbot.tsx` consume `chatAI.ts` para enviar mensajes y obtener respuestas.
  - `medicalKnowledge.ts`: encapsula reglas de negocio, taxonomías médicas o mapeos que la app usa para preclasificar síntomas (`PreclasificarSintomas.tsx`).

  Conectividad: `components/*` → invocación de `hooks/*` o `services/api.ts` → `apiConfig.ts` para endpoint/baseURL → backend. Respuestas actualizan contexts o estado local.

  ## Hooks personalizados

  Carpeta: `src/hooks/`

  - `useDashboardData.ts`: agrupa llamadas necesarias para la vista `Dashboard.tsx` (carga indicadores, gráficos). Internamente llama a `services/api.ts` y a contexts.
  - `useHealthIndex.ts`: calcula/consume índices de salud desde `services/medicalKnowledge.ts` o `data/nicaraguaData.ts`.

  Conectividad: Los hooks sirven de capa entre UI y servicios/contexts. Permiten compartir lógica de carga y memoización entre vistas.

  ## Componentes principales y flujo de datos

  - `Auth.tsx`: formulario de login/registro. Llama a `api.login` y, si es exitoso, invoca `AuthContext` para setear el usuario y token.
  - `ViewRouter.tsx`: lee `AuthContext` para decidir rutas públicas/privadas. También consulta `RoleSelector.tsx` para mostrar dashboards según rol.
  - `Dashboard.tsx` / `ImprovedDashboard.tsx`: usan `useDashboardData.ts` y `useHealthIndex.ts` para obtener datos y renderizar `ui/chart.tsx`, `ui/card.tsx`.
  - `SolicitarCita.tsx` / `MisCitas.tsx`: usan `AppointmentContext` para leer y modificar citas. Llamadas a crear/cancelar pasan por `api.ts`.
  - `Chatbot.tsx`: interactúa con `chatAI.ts` y muestra conversación; puede integrarse con `medicalKnowledge.ts` para respuestas más completas.
  - Carpetas `admin/` y `hospital-staff/`: contienen vistas y CRUDs que consumen `api.ts` y `database.ts`, y aplican guards usando `AuthContext` y roles del usuario.

  Comunicación entre componentes:
  - Props: Para datos locales o UI, se pasan props hacia abajo.
  - Contexts: Para estado global (auth, citas, tema), se usan providers y hooks.
  - Eventos/Callbacks: Formularios y botones disparan acciones que llaman servicios y actualizan contexts.

  ## UI y sistema de diseño

  Carpeta: `src/components/ui/`

  Incluye componentes atómicos y patterns (botones, inputs, cards, dialogs, menús). Estos componentes son consumidos por las vistas principales (`Dashboard`, `SolicitarCita`, etc.).

  Conectividad: los componentes UI son puramente presentacionales y aceptan callbacks y props; en algunos casos leen `ThemeContext` o `LanguageContext` para adaptar su presentación.

  ## Datos estáticos y utilidades

  - `src/data/nicaraguaData.ts`: datos geográficos/demográficos que usa `UnidadesCercanas.tsx` y `InteractiveMap.tsx`.
  - `src/utils/validators.ts`: validaciones reutilizables para formularios.
  - `src/types/index.ts`: tipos TypeScript compartidos (User, Appointment, API responses) que conectan contractos entre front y servicios.

  ## Configuración de build y desarrollo

  - `vite.config.ts`: configuraciones de Vite (plugins, alias, `outDir: 'build'`, `server.port: 3000`). Aliases mapean paquetes y también el alias `'@'` a `./src` para imports absolutos.
  - Carpeta `build/`: salida de `npm run build` (archivos estáticos listos para producción).

  Comandos básicos:

  ```powershell
  npm install; npm run build # instalacion de las dependencias genreales para compilacion 
  npm install
  npm run dev   # modo desarrollo (Vite)
  npm run build # genera carpeta `build/` con los assets
  ``` 

  Nota sobre versiones: asegúrate de usar Node.js y npm compatibles con las dependencias; si aparecen errores por versión de Node o SWC, prueba Node 18+.

  ## Variables de entorno y endpoints API

  Archivo esperado: `src/services/apiConfig.ts` — aquí normalmente se define `BASE_URL` y se configuran interceptores para añadir headers `Authorization` con el token desde `AuthContext`.

  ## Flujo típico (caso de uso: solicitar una cita)

  1. Usuario completa formulario en `SolicitarCita.tsx`.
  2. Componente llama a `AppointmentContext` (o directamente a `api.createAppointment`).
  3. `api.createAppointment` envía POST a `BASE_URL/appointments` usando `apiConfig`.
  4. Backend responde con la cita creada. `AppointmentContext` actualiza su estado y emite notificaciones via `GlobalStateContext`.
  5. `MisCitas.tsx` (suscrito al contexto) se re-renderiza y muestra la nueva cita.

  ## Depuración y pruebas rápidas

  - Ver logs de red: en el navegador (DevTools > Network) para ver requests que hace `api.ts`.
  - Ver estado de contexts: agregar console.log temporales en `AuthContext` o `AppointmentContext` para ver actualizaciones.
  - Si ves errores tipo CORS o 401, revisa `apiConfig.ts` y la inyección del header `Authorization` desde `AuthContext`.

  ## Troubleshooting común

  - Error: `Cannot find module` o problemas con alias: revisa `vite.config.ts` y que las dependencias estén instaladas (ejecutar `npm install`).
  - Error: token no enviado: asegurar que `AuthContext` guarda el token y que `apiConfig` lo lee al construir headers.
  - Error en producción pero no en dev: revisar `build/` y `vite.config.ts` target; comprobar rutas relativas en `index.html` y `base` de Vite si sirve desde subruta.

  ## Propuestas de mejoras (siguientes pasos)

  1. Añadir un diagrama simple (Mermaid) en el README con el flujo entre `UI -> hooks -> services -> backend`.
  2. Implementar tests unitarios para hooks principales (`useDashboardData`, `useHealthIndex`) y para contexts.
  3. Añadir un `README.dev.md` con cómo consumir las APIs locales simuladas (mock server) para desarrollar sin backend.

  ## Resumen final

  Este README ha sido ampliado para describir cómo se conecta cada parte del proyecto: puntos de entrada (`index.html`, `src/main.tsx`), contexts (`src/context/*`) que mantienen estado compartido, servicios (`src/services/*`) que se comunican con backend y con persistencia local, hooks que orquestan llamadas y caching, y componentes que renderizan las vistas según el estado. Para cualquier cambio mayor (p. ej. cambiar la forma de autenticación o la API), modifica primero `src/services/apiConfig.ts` y los contexts que dependen del token (`AuthContext`).

  ## Diagrama de conectividad (Mermaid)

  El siguiente diagrama muestra, a alto nivel, cómo fluye la información entre las piezas principales de la aplicación:

  ```mermaid
  flowchart LR
    subgraph Web
      A[index.html] --> B[src/main.tsx]
      B --> C[src/App.tsx]
    end

    C --> D[Providers / Contexts]
    D --> E[ViewRouter]
    E --> F[Componentes (pages, admin, hospital-staff)]
    F --> G[Hooks personalizados (useDashboardData, useHealthIndex, ...)]
    G --> H[Servicios: src/services/*]

    subgraph Servicios
      H --> I[apiConfig.ts]
      H --> J[api.ts (ApiService)]
      H --> K[chatAI.ts | medicalKnowledge.ts | database.ts]
    end

    J --> L[Backend / REST API]
    I --> M[APIs externas: OpenAI, Infermedica, Claude, MedicalAPI]

    style A fill:#f9f,stroke:#333,stroke-width:1px
    style L fill:#eef,stroke:#333,stroke-width:1px
    style M fill:#efe,stroke:#333,stroke-width:1px
  ```

  ## Documentación: `src/services/apiConfig.ts`

  Resumen del contenido y cómo usarlo:

  - Interfaz `APIConfig`: describe qué APIs pueden conectarse (OpenAI, Infermedica, Claude, MedicalAPI) y sus credenciales/flags.
  - `defaultAPIConfig`: configuración por defecto (placeholders). En producción hay que reemplazar las claves por variables de entorno seguras.
  - `validateAPIConfig(config)`: valida si las APIs habilitadas tienen credenciales plausibles.
  - `getEnabledAPIs(config)`: devuelve una lista de nombres de APIs habilitadas y con credenciales.
  - `medicalPrompts`: conjunto de prompts y plantillas para consultas médicas (system prompt, análisis de síntomas, emergencia) ya preparados para enviar a modelos de lenguaje.
  - `rateLimits`: límites sugeridos para peticiones a cada proveedor.
  - `createAuthHeaders(apiType, config)`: función que crea los headers necesarios según el tipo de API (p. ej. Authorization Bearer, App-Id/App-Key para Infermedica, headers específicos para Claude).

  Buenas prácticas y ejemplos:

  - No codifiques claves en el repositorio. Usa variables de entorno (Vite: prefijo VITE_). Por ejemplo en `.env`:

  ```text
  VITE_OPENAI_KEY=sk_...
  VITE_INFERMEDICA_APP_ID=...
  VITE_INFERMEDICA_APP_KEY=...
  ```

  - Validar la configuración al iniciar el servicio de IA:

  ```ts
  import { defaultAPIConfig, validateAPIConfig } from './services/apiConfig'

  if (!validateAPIConfig(defaultAPIConfig)) {
    console.warn('Algunas APIs están habilitadas sin credenciales válidas. Revisa apiConfig.');
  }
  ```

  ## Documentación: `src/services/api.ts` (ApiService)

  Resumen del `ApiService` y ejemplos de uso:

  - Clase `ApiService` con `baseURL` configurable y método privado `request<T>(endpoint, options)` que centraliza fetch y manejo de errores.
  - Guarda token con `setToken(token)` para autenticación en llamadas posteriores.
  - Métodos expuestos (ejemplos): `login`, `register`, `refreshToken`, `getProfile`, `updateProfile`, `getCitas`, `createCita`, `updateCita`, `getHospitals`, `getDoctors`, `checkIn`, `getQueueStatus`, `getMedicalHistory`, `createMedicalNote`, `sendChatMessage`, `getSymptomAssessment`.

  Ejemplo de uso desde un contexto o hook:

  ```ts
  import { apiService } from './services/api'

  // 1) Al iniciar sesión, recibir token y configurarlo
  const resp = await apiService.login(telefono, password)
  apiService.setToken(resp.token)

  // 2) Obtener perfil del usuario autenticado
  const profile = await apiService.getProfile()

  // 3) Crear una cita
  const nueva = await apiService.createCita({ user_id: profile.id, hospital_id: '123', date: '2025-09-10T10:00:00' })

  // 4) Petición al servicio de IA para evaluar síntomas
  const analysis = await apiService.getSymptomAssessment({ symptoms: ['fiebre', 'dolor de cabeza'] })
  ```

  Consejos de integración:

  - Llama a `apiService.setToken(token)` desde `AuthContext` justo después del login para que todas las llamadas siguientes incluyan Authorization.
  - Maneja errores de red y 401 en `AuthContext` (por ejemplo forzar logout o intentar `refreshToken`).
  - Para tests, crea una instancia de `ApiService` con `baseURL` apuntando a un mock server.

  ## Ejemplo de patrón recomendado (AuthContext + ApiService)

  1. En `AuthContext` al hacer login:
     - llamar `apiService.login(...)`
     - si OK: `apiService.setToken(token)` y guardar credenciales en `AuthContext`
  2. Componentes usan hooks/contexts que llaman métodos de `apiService` (ej. `getCitas`, `createCita`).
  3. En caso de 401: el `request` de `ApiService` lanza error; el contexto debe interceptarlo e intentar `refreshToken` o redirigir al login.

## Interfaces y público objetivo

A continuación se presenta un mapeo detallado de las interfaces (componentes y vistas) dentro de `src/components` y a quién están dirigidas. Esto ayuda a entender responsabilidades, permisos y prioridades de UX/seguridad.

### Pacientes / Público general
- `Dashboard.tsx` / `ImprovedDashboard.tsx`: resumen de salud y accesos rápidos para pacientes.
- `SolicitarCita.tsx`: formulario para solicitar citas.
- `MisCitas.tsx`: lista y estado de las citas del usuario.
- `UnidadesCercanas.tsx`: búsqueda y lista de hospitales cercanos.
- `InteractiveMap.tsx`: mapa embebido para ubicar hospitales y obtener direcciones.
- `PreclasificarSintomas.tsx`: pre-evaluación de síntomas para triage inicial.
- `Chatbot.tsx`: asistente conversacional para dudas y guía básica.
- `HistorialMedico.tsx`: vista del historial médico para el paciente (lectura, con permisos para editar limitados).
- `HealthIndexView.tsx` / `HealthIndexCard.tsx`: indicadores de salud del usuario.

### Personal hospitalario
- `StaffDashboard.tsx`: panel operativo para personal (agenda, tareas).
- `PatientFlow.tsx`: monitoreo del flujo de pacientes (admisiones, triage, urgencias).
- `PatientRecords.tsx`: ficha clínica y notas (lectura/edición con permisos).
- `AppointmentManagement.tsx` (hospital-staff): gestión de citas diaria.
- `EnhancedAppointmentManagement.tsx`: herramientas avanzadas de programación.
- `AdminReports.tsx` (hospital-staff): reportes orientados a operaciones.

### Administradores del sistema
- `UniversalAdminDashboard.tsx`: visión global de la plataforma.
- `UserManagement.tsx`: gestión CRUD de usuarios y roles.
- `HospitalManagement.tsx`: administración de entidades hospitalarias.
- `DoctorManagement.tsx`: gestión de doctores y asignaciones.
- `SystemReports.tsx`: reportes del sistema, export y auditoría.
- `HospitalDetails.tsx`: edición avanzada de detalles institucionales.

### Módulos transversales / desarrolladores
- `src/components/ui/*`: componentes atómicos (botón, input, card, dialog, table, select, etc.). Público: desarrolladores/integradores; reutilizados por todas las vistas.
- `ViewRouter.tsx`: enrutador y guardas de ruta según rol; infraestructura para todas las audiencias.
- `LoadingScreen.tsx`, `ImageWithFallback.tsx`: utilitarios compartidos por la UI.
- `Code-component-*` (admin/hospital-staff): componentes generados o auxiliares; relevantes para mantenedores.

### Énfasis: a quién va dirigido cada grupo y por qué

- Pacientes / Público general: estas interfaces están diseñadas para usuarios no técnicos que buscan acceso rápido a información personal de salud y servicios (citas, localización de hospitales, autoevaluaciones). La prioridad de UX aquí es simplicidad, claridad y protección de datos personales (mostrar solo lo necesario, confirmar acciones que implican datos sensibles, y dar opciones claras de soporte o contacto). Los permisos deben limitar la edición de datos clínicos; la mayor parte del acceso debe ser lectura y acciones guiadas (p. ej. solicitar cita).

- Personal hospitalario: estas vistas proporcionan herramientas operacionales. Su público son usuarios con formación y permisos ampliados. Requisitos clave: eficiencia (acciones en un clic, listados y filtros rápidos), consistencia en los estados (check-in/check-out), y controles de auditoría (quién editó qué y cuándo). La seguridad es crítica: edición de fichas clínicas debe estar protegida por roles y registro de cambios.

- Administradores del sistema: paneles y herramientas para gestión global (usuarios, hospitales, roles, reportes). Público: equipo de operaciones/IT. Requieren visibilidad, capacidad de filtrado, exportación de datos y controles para cambiar configuraciones críticas. Debe existir separación clara entre datos operativos y datos clínicos sensibles; las acciones destructivas (borrar, cambiar roles) deben exigir confirmaciones adicionales y registro de auditoría.



