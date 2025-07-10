import { useContext } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error404 from "./pages/Error404";
import Dashboard from "./pages/Dashboard";
import UserProfilePage from "./pages/UserProfilePage";
import OtherUserProfilePage from "./pages/OtherUserProfilePage";
import MyGroupsPage from "./pages/MyGroupsPage";
import GroupCreatePage from "./pages/GroupCreatePage";
import GroupChatPage from "./pages/GroupChatPage";
import CalendarPage from "./pages/CalendarPage";
import StartChatPage from "./pages/StartChatPage";
import AllMyGroupsPage from "./pages/AllMyGroupsPage";

// AppRoutes component
function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  // Wait for auth check
  if (loading) return null;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={user ? <UserProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile/:userId"
          element={user ? <OtherUserProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/groups"
          element={user ? <MyGroupsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/groups/create"
          element={user ? <GroupCreatePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/groups/:groupId"
          element={user ? <GroupChatPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/groups/:groupId/calendar"
          element={user ? <CalendarPage /> : <Navigate to="/login" replace />}
        />
        
        <Route
          path="/start-chat"
          element={user ? <StartChatPage /> : <Navigate to="/login" replace />}
        />
        
        <Route
          path="/my-groups"
          element={user ? <AllMyGroupsPage /> : <Navigate to="/login" replace />}
        />

        {/* 404 Route */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

// App component
export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
