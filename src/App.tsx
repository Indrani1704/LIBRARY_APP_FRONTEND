import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={router} />
    </>
  );
}