import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();

  console.error("ROUTE ERROR:", error);

  let message = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    message = error.data || error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white shadow p-6 rounded">
        <h1 className="text-xl font-bold text-red-500 mb-2">
          Error 
        </h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;