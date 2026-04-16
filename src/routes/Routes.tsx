import { createBrowserRouter } from "react-router-dom";

// Layouts
import UserWrapper from "../layout/user/UserWrapper";
import AdminLayout from "../components/admin/AdminLayout";

// Pages
import AuthPage from "../pages/Login";
import Home from "../pages/Home";
import AllBooks from "../pages/AllBooks";
import BookDetails from "../pages/BookDetails";
import AuthorProfile from "../pages/AuthorProfile";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";
import ReviewPage from "../pages/ReviewPage";
import UserPage from "../pages/UserPage";
import Orders from "../pages/Orders"; 

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import Books from "../pages/admin/Books";
import AuthorsPage from "../pages/admin/AuthorsPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import PublishersPage from "../pages/admin/PublishersPage";

import AdminProtected from "../components/protected/AdminProtected";
import ProtectedRoute from "../components/ProtectedRoute";
import ErrorPage from "../components/ErrorPage";
import AdminSupport from "../pages/admin/AdminSupport";
import AdminSupportList from "../pages/admin/AdminSupportList";
import Support from "../pages/Support";
import Reports from "../pages/Reports";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthPage />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/",
    element: <UserWrapper />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      { path: "books", element: <AllBooks /> },

      { path: "book/:id", element: <BookDetails /> }, 

      { path: "author/:id", element: <AuthorProfile /> },

      { path: "wishlist", element: <WishlistPage /> },

      { path: "cart", element: <CartPage /> },

      { path: "review/:id", element: <ReviewPage /> },

      { path:"/report", element : <Reports/>},
       {path:"/support", element:<Support/>},
  {path:"/admin/support/:userId" ,element:<AdminSupport />} ,
   {path:"/admin/support" ,element:<AdminSupportList />} ,

      // USER PROFILE
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },

      // ORDERS PAGE (NEW )
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
    ],
  },

  //  ADMIN ROUTES
  {
    path: "/admin",
    element: <AdminProtected />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "books", element: <Books /> },
          { path: "authors", element: <AuthorsPage /> },
          { path: "categories", element: <CategoriesPage /> },
          { path: "publishers", element: <PublishersPage /> },
        ],
      },
    ],
  },
]);

export default router;