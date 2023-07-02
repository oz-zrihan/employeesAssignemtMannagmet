import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
// Services
import authService from "../../../Services/AuthService";
// Components
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import PageNotFound from "../PageNotFound/PageNotFound";
import EmployeePage from "../../EmployeeArea/EmployeePage/EmployeePage";
import AdminPage from "../../AdminArea/AdminPage/AdminPage";
// Redux
import { authStore } from "../../../Redux/AuthState";

function Routing (): JSX.Element
{
  // Token state -> hold user token on site load
  const [ token, setToken ] = useState<string>( "" );

  // Is Logged in state -> to hold if user is logged in
  const [ isLoggedIn, setIsLoggedIn ] = useState<boolean>( false );

  // Is Admin state -> to hold if user is admin
  const [ isAdmin, setIsAdmin ] = useState<boolean>( false );

  // Get user From redux
  useEffect( () =>
  {
    const unsubscribe = authStore.subscribe( () =>
    {
      setToken( authStore.getState().token );
      setIsLoggedIn( authService.verifyLoggedIn() );
      setIsAdmin( authService.isAdmin() );
    } );

    // Set initial values
    setToken( authStore.getState().token );
    setIsLoggedIn( authService.verifyLoggedIn() );
    setIsAdmin( authService.isAdmin() );

    // Unsubscribe from store when component unmounts
    return unsubscribe;
  }, [] );

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Navigate to="/admin_page" replace />
            ) : (
              <Navigate to="/employee_page" />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/admin_page"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <AdminPage />
            ) : (
              <Navigate to="/employee_page" />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/employee_page"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Navigate to="/admin_page" replace />
            ) : (
              <EmployeePage />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* ======== Auth Routes ======== */ }
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Navigate to="/admin_page" replace />
            ) : (
              <Navigate to="/employee_page" />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Register />
            ) : (
              <Navigate to="/employee_page" />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* ======== User Routes ======== */ }
      <Route
        path="/home"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Navigate to="/admin-page" replace />
            ) : (
              <EmployeePage />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ======== Admin Routes ======== */ }
      <Route
        path="/admin-page"
        element={
          isLoggedIn && isAdmin ? (
            <AdminPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* <Route
        path="/admin-reports"
        element={
          isLoggedIn && isAdmin ? (
            <AdminReports />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      /> */}

      {/* ======== 404 Routes ======== */ }
      <Route path="*" element={ <PageNotFound /> } />
    </Routes>
  );
}

export default Routing;
