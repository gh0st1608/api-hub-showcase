# 🌐 API Hub Frontend

Interfaz web moderna para el **API Hub**, un portal de documentación y exploración de APIs internas y externas, como **Telemedicine API**, **Claims API**, y otros microservicios.

Construido con **React + TailwindCSS + Vite**, ofrece un diseño limpio, modular y rápido para visualizar documentación técnica con **Redoc**.

---

## 🚀 Stack Tecnológico

- ⚛️ **React 19** – Librería principal de la UI.  
- 🎨 **Tailwind CSS 4** – Sistema de estilos utilitario.  
- ⚡ **Vite** – Empaquetador y servidor de desarrollo ultrarrápido.  
- 📘 **Redoc** – Renderizador de documentación OpenAPI (Swagger).  
- 🌈 **React Router DOM** – Enrutamiento dinámico de vistas.  

## 🎨 Estilos

Se usa TailwindCSS 4 con el plugin oficial de Vite.
Los estilos globales están en src/styles/index.css.
Estilos reutilizables con @apply se encuentran en src/styles/utilities.css.

## 📘 Documentación API

La documentación OpenAPI (Swagger) se carga mediante Redoc en las vistas de detalle (/api/:id).
<Redoc specUrl="https://api.tudominio.com/openapi.yaml" />

---

## 📂 Estructura del Proyecto
api-hub-showcase/
├── public/ # Archivos estáticos
├── src/
│ ├── components/ # Navbar, Card, Footer, etc.
│ ├── pages/ # Vistas principales (Home, ApiDetail, etc.)
│ ├── styles/ # Archivos de Tailwind y utilidades
│ │ ├── index.css # Base + imports
│ │ └── utilities.css # Estilos reutilizables con @apply
│ ├── App.jsx # Configuración principal de rutas
│ └── main.jsx # Punto de entrada React
├── tailwind.config.js # Configuración de Tailwind
├── vite.config.js # Configuración de Vite con plugin @tailwindcss/vite
├── package.json # Dependencias y scripts
└── README.md


## 🧑‍💻 Instalación y Ejecución

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/tuusuario/api-hub-showcase.git
cd api-hub-showcase
npm install
npm run dev
```

## 🧑‍💻 Servicio
El servidor estará disponible en:

👉 http://localhost:5173