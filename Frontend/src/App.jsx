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
import MessagesPage from "./pages/MessagesPage";
import DirectChatPage from "./pages/DirectChatPage";
import StartChatPage from "./pages/StartChatPage";
import ConversationsPage from "./pages/ConversationsPage";
import AllMyGroupsPage from "./pages/AllMyGroupsPage";


function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

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
          path="/messages"
          element={user ? <MessagesPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/conversations/:conversationId"
          element={user ? <DirectChatPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/start-chat"
          element={user ? <StartChatPage /> : <Navigate to="/login" replace />}
        />
        <Route path="/conversations" element={<ConversationsPage />} />

        <Route path="/my-groups" element={user ? <AllMyGroupsPage /> : <Navigate to="/login" replace />} />
        
        {/* Fallback */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
