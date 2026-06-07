# frontend-web-react — Golden Path

React SPA boilerplate con **arquitectura hexagonal**, **Tailwind CSS puro** y **CRUD completo** como ejemplo de referencia. Diseñado para ser el golden path de aplicaciones frontend en el ecosistema Belcorp.

> Sibling de [`frontend-web`](../frontend-web) (Next.js SSR). Usa este template cuando no necesites SSR: dashboards, backoffice, portales internos.

---

## Índice

1. [Stack tecnológico](#stack-tecnológico)
2. [Arquitectura](#arquitectura)
3. [Estructura de carpetas](#estructura-de-carpetas)
4. [Primeros pasos](#primeros-pasos)
5. [Variables de entorno](#variables-de-entorno)
6. [Scripts disponibles](#scripts-disponibles)
7. [Cómo usar el template](#cómo-usar-el-template)
8. [Componentes disponibles](#componentes-disponibles)
9. [Testing](#testing)
10. [Storybook](#storybook)
11. [OpenAPI Code Generation](#openapi-code-generation)
12. [Docker](#docker)
13. [Convenciones de código](#convenciones-de-código)
14. [Decisiones de diseño](#decisiones-de-diseño)

---

## Stack tecnológico

### Runtime y build

| Herramienta    | Versión | Propósito                |
| -------------- | ------- | ------------------------ |
| **Node.js**    | 20 LTS  | Runtime mínimo requerido |
| **Vite**       | 8       | Build tool y dev server  |
| **React**      | 19      | UI library               |
| **TypeScript** | 6       | Tipado estático estricto |

### Dependencias de producción

| Librería                         | Propósito                                 |
| -------------------------------- | ----------------------------------------- |
| `react-router-dom` v7            | Routing SPA con lazy loading              |
| `@tanstack/react-query` v5       | Server state management y caché           |
| `@tanstack/react-query-devtools` | Inspección de queries en dev              |
| `zod` v4                         | Validación de entorno y formularios       |
| `tailwindcss` v4                 | Estilos utilitarios (sin config JS)       |
| `clsx` + `tailwind-merge`        | Composición segura de clases Tailwind     |
| `lucide-react`                   | Iconos SVG tree-shakeable                 |
| `pino`                           | Logging estructurado (espejo del backend) |

### Dependencias de desarrollo

| Herramienta                           | Propósito                                   |
| ------------------------------------- | ------------------------------------------- |
| `jest` + `ts-jest`                    | Test runner para unit e integración         |
| `@testing-library/react`              | Testing de componentes React                |
| `@playwright/test`                    | Tests end-to-end                            |
| `msw` v2                              | Mock Service Worker para tests y desarrollo |
| `storybook` + `@storybook/react-vite` | Catálogo visual de componentes              |
| `@hey-api/openapi-ts`                 | Generación de tipos desde OpenAPI spec      |
| `eslint` + `@typescript-eslint`       | Linting con reglas TypeScript estrictas     |
| `prettier`                            | Formateo consistente de código              |
| `husky` + `lint-staged`               | Git hooks pre-commit                        |
| `commitlint`                          | Validación de mensajes de commit            |

---

## Arquitectura

Este template implementa **Arquitectura Hexagonal** (Ports & Adapters), espejo del patrón usado en los backends del ecosistema.

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTATION                        │
│   pages · screens · components · hooks · providers      │
│                        │                                │
│              (solo importa de @application)             │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                    APPLICATION                          │
│      use cases · hooks (TanStack Query) · DTOs · DI     │
│                        │                                │
│      (orquesta domain, NO importa de infrastructure)    │
└──────────────┬─────────┴────────────────────────────────┘
               │                      │
┌──────────────▼───────┐  ┌───────────▼──────────────────┐
│       DOMAIN         │  │      INFRASTRUCTURE          │
│  entities · errors   │  │  fetch client · adapters     │
│  ports (interfaces)  │  │  env config · logger         │
│  (pure TypeScript)   │  │  (implementa los ports)      │
└──────────────────────┘  └──────────────────────────────┘
```

### Regla de dependencias

- `presentation` → solo importa de `@application`
- `application` → solo importa de `@domain`
- `infrastructure` → implementa puertos de `@domain`
- `domain` → no importa nada externo

### Patrón de inyección de dependencias

El ensamblaje de capas ocurre en un único punto: `src/application/ports-impl/container.ts`. Los use cases reciben sus dependencias (ports) en el constructor — sin frameworks de DI, solo TypeScript.

```
container.ts → new UseCase(new Repository(new HttpClient()))
```

---

## Estructura de carpetas

```
frontend-web-react/
├── src/
│   ├── domain/                    # Núcleo de negocio — sin dependencias externas
│   │   ├── entities/
│   │   │   └── sample.entity.ts   # Entidad con validación de negocio
│   │   ├── errors/
│   │   │   ├── domain-error.ts    # Clase base de errores
│   │   │   └── index.ts           # NotFoundError, ValidationError, NetworkError
│   │   └── ports/
│   │       ├── http-client-port.ts        # Interfaz del cliente HTTP
│   │       └── sample-repository-port.ts  # Interfaz del repositorio
│   │
│   ├── application/               # Orquestación — use cases y hooks
│   │   ├── dto/
│   │   │   └── sample-dto.ts      # CreateSampleDto, UpdateSampleDto
│   │   ├── hooks/
│   │   │   ├── query-keys.ts      # Namespaced query keys
│   │   │   └── use-samples.ts     # useSamples, useCreateSample, etc.
│   │   ├── ports-impl/
│   │   │   └── container.ts       # DI container — punto de ensamblaje
│   │   └── usecases/
│   │       ├── list-samples.usecase.ts
│   │       ├── get-sample-by-id.usecase.ts
│   │       ├── create-sample.usecase.ts
│   │       ├── update-sample.usecase.ts
│   │       └── delete-sample.usecase.ts
│   │
│   ├── infrastructure/            # Implementaciones técnicas
│   │   ├── api/
│   │   │   ├── fetch-http-client.ts       # Implementa HttpClientPort
│   │   │   └── generated/                 # Tipos OpenAPI (gitignored)
│   │   ├── adapters/
│   │   │   └── sample-api-repository.ts   # Implementa SampleRepositoryPort
│   │   ├── cache/                         # Listo para CachePort (ver docs)
│   │   ├── config/
│   │   │   └── env.ts             # Variables de entorno validadas con Zod
│   │   └── logging/
│   │       └── logger.ts          # Logger Pino con modo browser
│   │
│   ├── presentation/              # Capa React
│   │   ├── components/
│   │   │   ├── core/              # Primitivos: Button, Input, Card, Modal…
│   │   │   ├── composite/         # Compuestos: DataTable, SampleForm, ConfirmDialog
│   │   │   └── layout/            # MainLayout, Sidebar
│   │   ├── hooks/
│   │   │   └── use-form.ts        # Hook genérico de formularios
│   │   ├── providers/
│   │   │   └── QueryProvider.tsx  # TanStack Query + DevTools
│   │   ├── screens/
│   │   │   └── SamplesScreen.tsx  # Pantalla CRUD de samples
│   │   └── utils/
│   │       └── cn.ts              # Utilidad clsx + tailwind-merge
│   │
│   ├── router/
│   │   └── routes.tsx             # Rutas lazy-loaded con React Router v6
│   ├── app/
│   │   └── App.tsx                # Root: providers + router
│   ├── mocks/
│   │   ├── handlers.ts            # MSW handlers para CRUD de samples
│   │   └── browser.ts             # MSW browser setup
│   ├── styles/
│   │   └── global.css             # @import tailwindcss + design tokens (@theme)
│   └── main.tsx                   # Entry point
│
├── tests/
│   └── e2e/
│       └── samples.spec.ts        # Tests Playwright
│
├── .storybook/                    # Configuración Storybook
├── .husky/                        # Git hooks
├── Dockerfile                     # Multi-stage: deps → build → nginx
├── nginx.conf                     # SPA fallback + cache headers + gzip
├── docker-compose.local.yaml      # Frontend + backend placeholder
├── openapi-ts.config.ts           # Configuración codegen OpenAPI
├── jest.config.ts                 # Jest con ts-jest y path aliases
├── playwright.config.ts           # Playwright apuntando a :5173
├── commitlint.config.cjs          # Conventional commits
└── .env.example                   # Variables documentadas
```

---

## Primeros pasos

### Prerequisitos

- Node.js 20 LTS o superior
- Backend `api-service-nestjs-serverless` corriendo en `localhost:3001`

### Instalación

```bash
# 1. Clonar / copiar el template
cd frontend-web-react

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
cp .env.example .env.local
# .env.local ya viene configurado para desarrollo local (ver Variables de entorno)

# 4. Levantar el backend (en otra terminal)
cd ../api-service-nestjs-serverless
npm run start:dev   # → http://localhost:3001

# 5. Levantar el frontend
npm run dev         # → http://localhost:5173
```

---

## Variables de entorno

| Variable            | Descripción             | Valor local            | Valor producción             |
| ------------------- | ----------------------- | ---------------------- | ---------------------------- |
| `VITE_APP_NAME`     | Nombre de la aplicación | `"Frontend Web React"` | El nombre de tu app          |
| `VITE_API_BASE_URL` | URL base del backend    | `` (vacío)             | `https://api.tu-dominio.com` |

> **Importante — CORS en desarrollo**: `VITE_API_BASE_URL` debe estar **vacío** en local. Esto hace que las peticiones vayan a rutas relativas (`/samples`) que el proxy de Vite reenvía a `localhost:3001`, evitando CORS completamente. En producción, se establece la URL completa del backend.

```bash
# .env.local (desarrollo) — NO commitear
VITE_APP_NAME="Frontend Web React"
VITE_API_BASE_URL=          # vacío = usa proxy Vite

# .env.production (deploy)
VITE_APP_NAME="Mi App"
VITE_API_BASE_URL="https://api.mi-dominio.com"
```

Las variables son validadas con **Zod** en `src/infrastructure/config/env.ts` al iniciar la app. Si una variable requerida falta o tiene formato incorrecto, la app falla con un error descriptivo en lugar de comportarse de forma inesperada.

---

## Scripts disponibles

```bash
# Desarrollo
npm run dev              # Vite dev server en http://localhost:5173 con HMR

# Build
npm run build            # TypeScript check + Vite bundle en dist/
npm run preview          # Preview del build de producción en local

# Calidad de código
npm run typecheck        # Verificación TypeScript sin emitir archivos
npm run lint             # ESLint sobre todo el proyecto
npm run lint:fix         # ESLint con corrección automática
npm run format           # Prettier sobre todos los archivos
npm run format:check     # Verificar formato sin modificar

# Testing
npm run test             # Jest — unit e integración
npm run test:watch       # Jest en modo watch
npm run test:coverage    # Jest con reporte de cobertura
npm run test:e2e         # Playwright E2E (requiere dev server activo)

# Storybook
npm run storybook        # Storybook en http://localhost:6006
npm run build-storybook  # Build estático del Storybook

# OpenAPI
npm run openapi:generate # Genera tipos desde la spec del backend (requiere backend activo)
```

---

## Cómo usar el template

### Agregar un nuevo dominio (ej: `Product`)

Sigue el flujo de capas de adentro hacia afuera:

#### 1. Domain — entidad y puerto

```ts
// src/domain/entities/product.entity.ts
export class Product {
  static hydrate(props: ProductProps): Product { ... }
  static validate(input: CreateProductInput): void { ... }
}

// src/domain/ports/product-repository-port.ts
export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
}
```

#### 2. Application — use cases y hooks

```ts
// src/application/usecases/list-products.usecase.ts
export class ListProductsUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}
  async execute(): Promise<Product[]> {
    return this.repo.findAll();
  }
}

// src/application/hooks/use-products.ts
export function useProducts() {
  return useQuery({
    queryKey: productQueryKeys.all,
    queryFn: () => container.products.list.execute(),
  });
}
```

#### 3. Infrastructure — adaptador HTTP

```ts
// src/infrastructure/adapters/product-api-repository.ts
export class ProductApiRepository implements ProductRepositoryPort {
  constructor(private readonly httpClient: HttpClientPort) {}
  async findAll(): Promise<Product[]> {
    const response =
      await this.httpClient.get<ListProductsResponse>("/products");
    return response.products.map((p) => Product.hydrate(p));
  }
  // ...
}
```

#### 4. Registrar en el DI container

```ts
// src/application/ports-impl/container.ts
const productRepository = new ProductApiRepository(httpClient);

export const container = {
  // ...existente
  products: {
    list: new ListProductsUseCase(productRepository),
    create: new CreateProductUseCase(productRepository),
    // ...
  },
};
```

#### 5. Agregar proxy en Vite (si el backend tiene una ruta nueva)

```ts
// vite.config.ts — server.proxy
"/products": {
  target: "http://localhost:3001",
  changeOrigin: true,
  bypass(req) {
    if (req.headers["accept"]?.includes("text/html")) return "/index.html";
  },
},
```

#### 6. Presentation — screen y ruta

```tsx
// src/presentation/screens/ProductsScreen.tsx
export function ProductsScreen() {
  const { data: products = [], isLoading } = useProducts();
  return <DataTable columns={columns} data={products} loading={isLoading} ... />;
}

// src/router/routes.tsx — agregar ruta
{ path: "/products", element: <Suspense fallback={<PageLoader />}><ProductsPage /></Suspense> }
```

### Agregar un componente reutilizable

Los componentes core viven en `src/presentation/components/core/` y deben:

- Ser **presentacionales** — sin lógica de negocio ni llamadas HTTP
- Usar **solo clases Tailwind** — sin CSS inline ni librerías externas
- Exportar una **interfaz de props** tipada
- Incluir atributos **ARIA** para accesibilidad básica
- Tener su archivo de **stories** colocado junto al componente

```tsx
// src/presentation/components/core/Badge.tsx
export interface BadgeProps {
  variant?: "default" | "success" | "danger" | "warning" | "info";
  children: ReactNode;
}

export function Badge({ variant = "default", children }: BadgeProps) {
  return <span className={cn(variantStyles[variant], "...")}>{children}</span>;
}
```

---

## Componentes disponibles

### Core (primitivos)

| Componente                             | Props clave                        | Descripción                                |
| -------------------------------------- | ---------------------------------- | ------------------------------------------ |
| `Button`                               | `variant`, `size`, `loading`       | Botón con 5 variantes y estado de carga    |
| `Input`                                | `label`, `error`, `helperText`     | Campo de texto con validación              |
| `Card` / `CardHeader` / `CardContent`  | —                                  | Contenedor con borde y sombra              |
| `Modal`                                | `open`, `onClose`, `title`, `size` | Diálogo accesible con `<dialog>` nativo    |
| `Skeleton` / `SkeletonRow`             | `className`, `cols`                | Placeholder animado de carga               |
| `Toast` / `ToastProvider` / `useToast` | —                                  | Sistema de notificaciones sin dependencias |
| `Badge`                                | `variant`                          | Etiqueta de estado con colores semánticos  |

### Composite (compuestos)

| Componente      | Descripción                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `DataTable<T>`  | Tabla genérica con columnas configurables, skeleton loading y estado vacío |
| `SampleForm`    | Formulario create/edit con validación Zod client-side                      |
| `ConfirmDialog` | Modal de confirmación para acciones destructivas                           |

### Layout

| Componente   | Descripción                             |
| ------------ | --------------------------------------- |
| `MainLayout` | Layout principal con sidebar            |
| `Sidebar`    | Navegación lateral con `NavLink` activo |

### Hooks de presentación

| Hook         | Descripción                                            |
| ------------ | ------------------------------------------------------ |
| `useForm<T>` | Manejo genérico de estado de formulario con validación |
| `useToast`   | Disparar notificaciones desde cualquier componente     |

### Design tokens (Tailwind `@theme`)

Definidos en `src/styles/global.css`:

| Token            | Variable CSS                                |
| ---------------- | ------------------------------------------- |
| Color primario   | `--color-primary` (#2563eb)                 |
| Color peligro    | `--color-danger` (#dc2626)                  |
| Color éxito      | `--color-success` (#16a34a)                 |
| Color superficie | `--color-surface`, `--color-surface-subtle` |
| Borde            | `--color-border`, `--color-text-muted`      |
| Radio            | `--radius-sm/md/lg/xl`                      |
| Sombra           | `--shadow-card`                             |

---

## Testing

### Estrategia de testing

```
Unit tests      → domain/ y application/usecases/  (sin React, sin HTTP)
Component tests → presentation/components/          (React Testing Library)
E2E tests       → tests/e2e/                        (Playwright)
```

### Ejecutar tests

```bash
npm run test             # todos los unit + component tests
npm run test:coverage    # con reporte de cobertura (lcov + text)
npm run test:e2e         # E2E con Playwright (requiere npm run dev activo)
```

### Estructura de un test de use case

```ts
// src/application/usecases/__tests__/list-samples.usecase.test.ts
describe("ListSamplesUseCase", () => {
  it("ordena por createdAt descendente", async () => {
    const repo: SampleRepositoryPort = {
      findAll: jest.fn().mockResolvedValue([...]),
      // ...otros métodos mockeados
    };
    const result = await new ListSamplesUseCase(repo).execute();
    expect(result[0].id).toBe("el más reciente");
  });
});
```

### MSW — Mock Service Worker

Los handlers en `src/mocks/handlers.ts` mockean todos los endpoints de `/samples`. Se usan en tests de componentes para evitar llamadas HTTP reales.

Para activar MSW en desarrollo (útil si el backend no está disponible):

```ts
// src/main.tsx — descomentar en desarrollo
if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}
```

---

## Storybook

Catálogo visual de todos los componentes con sus variantes.

```bash
npm run storybook    # → http://localhost:6006
```

Cada componente core tiene su archivo `.stories.tsx` colocado junto a él:

```
src/presentation/components/core/
  Button.tsx
  Button.stories.tsx    ← stories del componente
  Input.tsx
  Input.stories.tsx
```

Para agregar una story a un nuevo componente:

```tsx
// MyComponent.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "Core/MyComponent",
  component: MyComponent,
};
export default meta;

export const Default: StoryObj<typeof MyComponent> = {
  args: {
    /* props por defecto */
  },
};
```

---

## OpenAPI Code Generation

Los tipos del backend se generan automáticamente desde la spec OpenAPI.

```bash
# Requiere el backend corriendo en localhost:3001
npm run openapi:generate
```

Los archivos generados se depositan en `src/infrastructure/api/generated/` (gitignored) y proveen tipos TypeScript de los endpoints, schemas de request/response, y un cliente HTTP tipado.

Configuración en `openapi-ts.config.ts`:

```ts
export default defineConfig({
  input: process.env.OPENAPI_SPEC_URL ?? "http://localhost:3001/openapi.json",
  output: "src/infrastructure/api/generated",
  plugins: ["@hey-api/client-fetch", "@hey-api/typescript"],
});
```

> Los tipos generados sirven como referencia. Los **adaptadores** en `src/infrastructure/adapters/` mapean esos tipos a las entidades del dominio, manteniendo la capa de dominio libre de dependencias del backend.

---

## Docker

### Build y ejecución

```bash
# Build de la imagen
docker build -t frontend-web-react .

# Ejecutar con URL del backend
docker run -p 8080:80 \
  -e VITE_API_BASE_URL=https://api.tu-dominio.com \
  frontend-web-react

# Con docker-compose (frontend + backend placeholder)
docker-compose -f docker-compose.local.yaml up
```

### Arquitectura del Dockerfile (multi-stage)

```
Stage 1 — deps    node:20-alpine  npm ci
Stage 2 — build   node:20-alpine  npm run build → dist/
Stage 3 — runner  nginx:alpine    COPY dist/ → /usr/share/nginx/html
```

El stage final es **Nginx Alpine** (~25MB) sirviendo archivos estáticos, sin runtime Node.js en producción.

### nginx.conf

- `try_files $uri $uri/ /index.html` — SPA fallback para React Router
- Cache de 1 año para assets estáticos (JS, CSS, imágenes)
- Headers de seguridad: `X-Frame-Options`, `X-Content-Type-Options`
- Compresión gzip habilitada

---

## Convenciones de código

### Nomenclatura

| Tipo                    | Convención                  | Ejemplo                |
| ----------------------- | --------------------------- | ---------------------- |
| Archivos de componentes | `PascalCase.tsx`            | `Button.tsx`           |
| Archivos de lógica      | `kebab-case.ts`             | `use-samples.ts`       |
| Clases de dominio       | `PascalCase` + sufijo       | `ListSamplesUseCase`   |
| Interfaces de puertos   | `PascalCase` + `Port`       | `SampleRepositoryPort` |
| Hooks React             | `camelCase` con `use`       | `useSamples`           |
| Variables de entorno    | `VITE_SCREAMING_SNAKE_CASE` | `VITE_API_BASE_URL`    |

### Commits (Conventional Commits)

```
feat: add product CRUD
fix: correct price validation in sample form
refactor: extract DataTable to composite layer
test: add unit tests for CreateProductUseCase
chore: update dependencies
```

Validado automáticamente por `commitlint` en el hook `commit-msg`.

### Pre-commit (lint-staged)

Al hacer `git commit`, automáticamente se ejecuta:

1. `eslint --fix` sobre archivos `.ts/.tsx` staged
2. `prettier --write` sobre todos los archivos staged

### Path aliases

| Alias               | Resuelve a             |
| ------------------- | ---------------------- |
| `@domain/*`         | `src/domain/*`         |
| `@application/*`    | `src/application/*`    |
| `@presentation/*`   | `src/presentation/*`   |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@styles/*`         | `src/styles/*`         |
| `@/*`               | `src/*`                |

---

## Decisiones de diseño

### ¿Por qué Vite y no Next.js?

Este template es para **CSR puro** (dashboards, backoffice, portales internos) donde el SEO no es crítico. Vite ofrece DX superior (HMR instantáneo), bundle más simple y deployment como archivos estáticos en Nginx/CDN. Para SSR o aplicaciones públicas, usar [`frontend-web`](../frontend-web) (Next.js).

### ¿Por qué Tailwind sin librerías de componentes externas?

Control total sobre el diseño sin estilos por defecto difíciles de overridear. Los componentes son simples, predecibles y el bundle de CSS es mínimo (solo las clases usadas). Los design tokens en `@theme` permiten cambiar la identidad visual desde un único punto.

### ¿Por qué TanStack Query y no Redux?

Para la mayoría de los frontends, el estado más complejo es el **server state** (datos del backend). TanStack Query lo maneja con caché, invalidación, retry y sincronización automática — sin reducers ni actions. Para estado UI complejo específico, usar `useState`/`useReducer` localmente.

### ¿Por qué DI manual sin framework?

El `container.ts` es suficiente para la mayoría de los casos y mantiene el código explícito y auditable. No hay magia — puedes seguir el flujo `hook → use case → repository → HTTP` con un solo `Cmd/Ctrl+Click`.

### ¿Por qué el proxy de Vite y no CORS en el backend?

En desarrollo, el proxy elimina la necesidad de configurar CORS en el backend. En producción, el backend ya está en el mismo dominio o con CORS configurado correctamente para el dominio de producción. La variable `VITE_API_BASE_URL` vacía activa el proxy; con valor URL activa el modo producción.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
