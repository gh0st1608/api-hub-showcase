import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "@presentation/providers/QueryProvider";
import { ToastProvider } from "@presentation/components/core/Toast";
import { router } from "@/router/routes";

export function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryProvider>
  );
}
