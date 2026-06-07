/* eslint-disable react-refresh/only-export-components */

import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@presentation/components/layout/MainLayout";
import { Skeleton } from "@presentation/components/core/Skeleton";

const CatalogPage = lazy(() =>
  import("@presentation/screens/CatalogScreen").then((m) => ({
    default: m.CatalogScreen,
  }))
);

const ProjectsPage = lazy(() =>
  import("@presentation/screens/ProjectsScreen").then((m) => ({
    default: m.ProjectsScreen,
  }))
);

function PageLoader() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-14 w-full rounded-[1.5rem]" />
      <Skeleton className="h-72 w-full rounded-[1.5rem]" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/catalog" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <MainLayout>
        <Suspense fallback={<PageLoader />}>
          <CatalogPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/catalog",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/projects",
    element: (
      <MainLayout>
        <Suspense fallback={<PageLoader />}>
          <ProjectsPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "*",
    element: (
      <MainLayout>
        <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-500">
          <p className="text-6xl font-bold text-slate-200">404</p>
          <p className="text-lg">
            La ruta solicitada no existe en el catalogo.
          </p>
        </div>
      </MainLayout>
    ),
  },
]);
