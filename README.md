# 🧪 LabManager Clinic - Backend

Sistema Integral de Gestión de Laboratorio Clínico (LabManager Clinic)  
Backend construido con **Node.js + TypeScript + Express + Prisma**.

## 🚀 Descripción

LabManager Clinic centraliza y gestiona la información de pacientes, médicos y análisis clínicos.  
Incluye control de inventario, gestión de muestras biológicas, reportes en PDF y notificaciones.

Este repositorio contiene la API REST que servirá como backend para el sistema.

## 🛠️ Tecnologías

- **Node.js** + **TypeScript**
- **Express.js**
- **Prisma ORM** + PostgreSQL
- **Zod** (validación)
- **JWT** (autenticación)
- **Bcrypt** (hashing de contraseñas)
- **Helmet** + **CORS** (seguridad)
- **Multer** (uploads)
- **PDFKit** + **qrcode** (reportes y códigos QR)
- **Pino** (logging)
- **Biome** (formateo y linting)
- **Jest + Supertest** (testing)

## 📂 Estructura del proyecto

```
└── 📁src
    └── 📁config # Configuración global (DB, env, logger)
    └── 📁middlewares # Middlewares globales
    └── 📁modules # Módulos del dominio
        └── 📁analysis # Resultados de análisis
        └── 📁auth # Login, registro, roles
        └── 📁doctors # Gestión de médicos
        └── 📁equipments # Equipos biomédicos
        └── 📁inventory # Reactivos y consumibles
        └── 📁notifications # Notificaciones (email/WhatsApp)
        └── 📁patients # Gestión de pacientes
        └── 📁profiles # Perfil del paciente
        └── 📁protocols # Protocolos de análisis
        └── 📁reports # Reportes administrativos y clínicos
        └── 📁results # Resultados accesibles por pacientes
        └── 📁samples # Muestras biológicas
    └── 📁routes
        ├── index.ts
    └── 📁utils # Helpers (mailer, pdf, qr, etc.)
    ├── index.ts # Punto de entrada principal
    └── server.ts # Configuración del servidor Express
```

### ⚙️ Scripts disponibles

```bash
npm run dev       # Levanta el servidor en modo desarrollo
npm run build     # Compila TypeScript a JavaScript (carpeta dist)
npm run start     # Inicia el servidor en producción desde dist
npm run lint      # Revisa la calidad del código con Biome
npm run format    # Formatea el código automáticamente
npm run test      # Ejecuta los tests con Jest
npm run migrate   # Aplica migraciones de Prisma a la DB
npm run generate  # Genera el cliente de Prisma
npm run check     # Revisa linter + TypeScript sin emitir archivos
npm run prepare   # Genera cliente de Prisma automáticamente tras npm install

```

### 🔑 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/labmanager"
PORT=3000
JWT_SECRET="supersecretkey"

```

### 🛠️ Uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/tuusuario/labmanager-backend.git
cd labmanager-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# (Editar con tus credenciales de DB y JWT)

# 4. Ejecutar migraciones de Prisma
npm run migrate

# 5. Levantar servidor en modo desarrollo
npm run dev



Servidor disponible en:
👉 http://localhost:3000/api/v1

```

### 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

```