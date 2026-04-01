# 🌿 SRPHS — Frontend

> Interfaz web del Sistema de Recomendación para Hábitos Saludables

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://srphs-frontend-9hwt65qw1-robinsonsteven232-7270s-projects.vercel.app)

**App en producción:** https://srphs-frontend-9hwt65qw1-robinsonsteven232-7270s-projects.vercel.app

---

## 👥 Desarrolladores

| Nombre | Rol |
|---|---|
| **Juan Pablo Caballero** | FullStack · Cloud · AI · Database |
| **Robinson Núñez** | Collaborator & Frontend Partner· AI · Database |

---

## 📑 Contenido

1. [Descripción](#-descripción)
2. [Vistas y funcionalidades](#-vistas-y-funcionalidades)
3. [Stack tecnológico](#-stack-tecnológico)
4. [Instalación local](#-instalación-local)
5. [Variables de entorno](#-variables-de-entorno)
6. [Estructura del proyecto](#-estructura-del-proyecto)

---

## 📝 Descripción

Interfaz web construida con **React + TypeScript + Vite** que permite a los usuarios:

- Registrarse e iniciar sesión con **email/contraseña** o **Google OAuth2**
- Completar su perfil de salud con 17 variables de hábitos de vida
- Recibir un **diagnóstico de riesgo de obesidad** generado por IA
- Ver **recomendaciones personalizadas** según su objetivo (perder / mantener / ganar peso)
- Registrar el **cumplimiento diario** de cada recomendación (0% → 100%)
- Llevar un **tracker de hidratación** diaria (8 vasos)
- Consultar el **historial de evaluaciones** con evolución de BMI

---

---

## 📄 Documentación del proyecto

| Documento | Descripción |
|---|---|
| [📘 Informe técnico](docs/Proyecto_SRPHS_CaballeroJuan_NuñezRobinson.pdf) | Sistema de recomendación personalizada de hábitos saludables — Documento académico del proyecto de IA |

---


## 🖥️ Vistas y funcionalidades

### Login / Registro
- Autenticación con email y contraseña
- Autenticación con Google (One Tap / OAuth2)
- Fondo animado con íconos de salud flotantes y línea de ritmo cardíaco

### Perfil
- Formulario completo con 17 variables de salud
- Selector de objetivo personal: **Perder peso · Mantenerme · Ganar músculo**
- Medidor de BMI en tiempo real con escala visual (WHO 2020)
- Vista previa del perfil del usuario
- Botón para generar análisis IA

### Dashboard
- Diagnóstico IA actual y objetivo del usuario
- Gráfica de evolución de BMI (Recharts)
- Indicador de **adherencia ponderada** al plan de salud
- Lista de recomendaciones con selector de cumplimiento por niveles (0% / 25% / 50% / 75% / 100%)

### Historial
- Listado de todas las evaluaciones con fecha y hora
- Badge de categoría BMI (Bajo peso / Normal / Sobrepeso / Obesidad)
- Indicador de tendencia (↑ sube / ↓ baja / estable)
- Recomendaciones generadas en cada evaluación

### Water Tracker (header)
- 8 vasos diarios con toggle visual
- Persiste en `localStorage` con reset automático al cambiar de día

### Sistema de notificaciones
- Toasts globales (`success`, `error`, `warning`, `info`) sin prop drilling
- Accesibles desde cualquier componente con `toast.success('mensaje')`

---

## 🧰 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| HTTP | Axios |
| Gráficas | Recharts |
| Iconos | Lucide React |
| Auth Google | @react-oauth/google + jwt-decode |
| Deploy | Vercel (Hobby) |

---

## ⚡ Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Robinson677/SRPHS_FRONTEND.git
cd SRPHS_FRONTEND

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Levantar el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`.

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://srphs-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=tu_google_oauth_client_id
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend (Render) |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google Cloud Console (OAuth2) |

> **Importante:** El archivo `.env` está en `.gitignore` y no se versiona. Para desarrollo local copia los valores del equipo o usa tus propias credenciales de Google Cloud Console.

---

## 📂 Estructura del proyecto

```
SRPHS_FRONTEND/
└── src/
    ├── Proyecto_SRPHS_CaballeroJuan_NuñezRobinson.pdf
├── public/
└── src/
    ├── components/
    │   ├── Login.tsx           # Pantalla de inicio de sesión
    │   ├── Register.tsx        # Pantalla de registro
    │   ├── Dashboard.tsx       # Layout principal con navegación
    │   ├── ProfileView.tsx     # Formulario de perfil + medidor BMI
    │   ├── AnalyticsView.tsx   # Dashboard con métricas y recomendaciones
    │   ├── HistoryView.tsx     # Historial de evaluaciones
    │   ├── WaterTracker.tsx    # Tracker de hidratación diaria
    │   ├── FormComponents.tsx  # InputField y SelectField reutilizables
    │   ├── Toast.ts            # Sistema de notificaciones global
    │   └── NotFound.tsx        # Página 404
    ├── services/
    │   └── api.ts              # Cliente Axios + servicios de salud y auth
    ├── App.tsx                 # Router principal + Google OAuth Provider
    └── main.tsx                # Punto de entrada
```

---

## 📌 Notas de despliegue

- El frontend está desplegado en **Vercel** (Hobby plan) con auto-deploy en cada push a `main`.
- El backend en Render puede tardar ~50 segundos en responder tras inactividad — es normal en el free tier.
- Para que Google OAuth funcione en producción, la URL de Vercel debe estar registrada en **Google Cloud Console** → Authorized JavaScript origins y Authorized redirect URIs.
