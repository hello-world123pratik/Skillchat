import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [messageDropdownOpen, setMessageDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const groupDropdownRef = useRef();
  const messageDropdownRef = useRef();
  const profileDropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(e.target)) {
        setGroupDropdownOpen(false);
      }
      if (messageDropdownRef.current && !messageDropdownRef.current.contains(e.target)) {
        setMessageDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-yellow-100 backdrop-blur-md shadow-sm border-b border-yellow-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          SkillSync
        </Link>

        <button className="sm:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-800 hover:text-yellow-500 font-medium transition">
                Dashboard
              </Link>

              <div className="relative" ref={groupDropdownRef}>
                <button
                  onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                  className="flex items-center text-gray-800 hover:text-yellow-500 font-medium gap-1 transition"
                >
                  Groups <ChevronDown size={16} />
                </button>
                {groupDropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                    <Link to="/groups" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100">
                      My Groups
                    </Link>
                    <Link to="/groups/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100">
                      Create Group
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative" ref={messageDropdownRef}>
                <button
                  onClick={() => setMessageDropdownOpen(!messageDropdownOpen)}
                  className="flex items-center text-gray-800 hover:text-yellow-500 font-medium gap-1 transition"
                >
                  Messages <ChevronDown size={16} />
                </button>
                {messageDropdownOpen && (
                  <div className="absolute top-full mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                    <Link to="/start-chat" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100">
                      + Start Chat
                    </Link>
                    <Link to="/conversations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100">
                      My Conversations
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-gray-800 hover:text-yellow-500 transition"
                >
                  {user.profileImage && (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  )}
                  <span className="text-sm font-medium">Hi, {user.name?.split(" ")[0] || "User"}</span>
                  <ChevronDown size={16} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-yellow-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-800 hover:text-yellow-500 font-medium transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-yellow-400 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 bg-yellow-50 border-t pt-3 shadow-sm">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 hover:text-yellow-500">
                Dashboard
              </Link>
              <Link to="/groups" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 hover:text-yellow-500">
                My Groups
              </Link>
              <Link to="/groups/create" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 hover:text-yellow-500">
                Create Group
              </Link>
              <Link to="/start-chat" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 hover:text-yellow-500">
                + Start Chat
              </Link>
              <Link to="/conversations" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 hover:text-yellow-500">
                My Conversations
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 hover:text-yellow-500">
                My Profile
              </Link>
              <div className="flex items-center gap-2 mt-3">
                {user.profileImage && (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                )}
                <span className="text-sm text-gray-700">
                  Hi, {user.name?.split(" ")[0] || "User"}
                </span>
              </div>
              <button onClick={handleLogout} className="block text-left text-red-600 hover:text-yellow-600 mt-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 hover:text-yellow-500">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 hover:text-yellow-500">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
