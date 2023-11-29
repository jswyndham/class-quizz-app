import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  Profile,
  Admin,
  AddClass,
  AllClasses,
  EditClass,
  Error,
  Stats,
  DashboardLayout,
  ClassLayout,
} from "./pages";

// PAGE LOADERS
import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { loader as allClassesLoader } from "./pages/AllClasses";
import { loader as editClassLoader } from "./pages/EditClass";
import { loader as adminLoader } from "./pages/Admin";
import { loader as classLoader } from "./pages/ClassLayout";

// PAGE ACTIONS
import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as addClassAction } from "./pages/AddClass";
import { action as editClassAction } from "./pages/EditClass";
import { action as deleteClassAction } from "./pages/DeleteClass";

// DEFAULT THEME
export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkMode") === "true";
  document.documentElement.classList.toggle("dark", isDarkTheme);

  return isDarkTheme;
};

checkDefaultTheme();

// ROUTES
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },

      {
        path: `login`,
        element: <Login />,
        action: loginAction,
      },

      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },

      {
        path: `dashboard`,
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <AllClasses />,
            loader: allClassesLoader,
          },
          {
            path: `add-class`,
            element: <AddClass />,
            // action: addClassAction,
          },
          {
            path: "classlayout/:id",
            element: <ClassLayout />,
            loader: classLoader,
          },

          {
            path: `edit-class/:id`,
            element: <EditClass />,
            loader: editClassLoader,
            action: editClassAction,
          },
          {
            path: `delete-class/:id`,
            action: deleteClassAction,
          },
          {
            path: `stats`,
            element: <Stats />,
          },

          {
            path: `profile`,
            element: <Profile />,
          },
          {
            path: `admin`,
            element: <Admin />,
            loader: adminLoader,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
