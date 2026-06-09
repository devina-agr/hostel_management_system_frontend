import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import SignUp from "./pages/StudentSignUp/SignUp";
import Login from "./pages/StudentLogin/Login";
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import WardenDashboard from "./pages/WardenDashboard/WardenDashboard.jsx";
import PreferenceForm from "./pages/PreferenceForm/PreferenceForm.jsx";
import Profile from "./pages/Info.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Landing />
            </DefaultLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <DefaultLayout>
              <SignUp />
            </DefaultLayout>
          }
        />

        <Route
          path="/login"
          element={
            <DefaultLayout>
              <Login />
            </DefaultLayout>
          }
        />

        <Route
          path="/Login"
          element={
            <DefaultLayout>
              <Login />
            </DefaultLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AuthLayout>
              <StudentDashboard />
            </AuthLayout>
          }
        />

        <Route
          path="/StudentDashboard"
          element={
            <AuthLayout>
             
                <StudentDashboard/>
             
            </AuthLayout>
          }
        />
        <Route
          path="/WardenDashboard"
          element={
            <AuthLayout>
              <WardenDashboard/>
            </AuthLayout>
          }
          />

        <Route
          path="/profile"
          element={
            <AuthLayout>
              <Profile />
            </AuthLayout>
          }
        />

        <Route
          path="/preferences"
          element={
            <AuthLayout>
              <PreferenceForm />
            </AuthLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
