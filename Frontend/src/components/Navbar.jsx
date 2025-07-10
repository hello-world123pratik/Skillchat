import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const groupDropdownRef = useRef();
  const profileDropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(e.target)) {
        setGroupDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const getCacheBustedImage = (url) => {
    if (!url) return "";
    let fixedUrl = url;
    if (url.includes("https://localhost")) {
      fixedUrl = url.replace("https://localhost", "http://localhost");
    }
    return `${fixedUrl}?v=${Date.now()}`;
  };

  return (
    <nav className="bg-yellow-100 shadow-sm border-b border-yellow-200 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-yellow-700 tracking-tight">
          SkillSync
        </Link>

        {/* Hamburger */}
        <button
          className="sm:hidden text-yellow-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-yellow-800 hover:text-yellow-600 font-medium transition">
                Dashboard
              </Link>

              {/* Groups Dropdown */}
              <div className="relative" ref={groupDropdownRef}>
                <button
                  onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                  className="flex items-center text-yellow-800 hover:text-yellow-600 font-medium gap-1 transition"
                >
                  Groups <ChevronDown size={16} />
                </button>
                {groupDropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                    <Link to="/my-groups" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100">My Groups</Link>
                    <Link to="/groups" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100">All Groups</Link>
                    <Link to="/groups/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100">Create Group</Link>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-yellow-800 hover:text-yellow-600 transition"
                >
                  {user.profileImage ? (
                    <img
                      src={getCacheBustedImage(user.profileImage)}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0) || "U"}
                    </div>
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
              <Link to="/login" className="text-yellow-800 hover:text-yellow-600 font-medium transition">Login</Link>
              <Link
                to="/register"
                className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-yellow-500 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 bg-yellow-50 border-t border-yellow-200 pt-3 shadow-sm">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-yellow-800 hover:text-yellow-600">
                Dashboard
              </Link>
              <Link to="/my-groups" onClick={() => setMobileMenuOpen(false)} className="block text-yellow-800 hover:text-yellow-600">
                My Groups
              </Link>
              <Link to="/groups" onClick={() => setMobileMenuOpen(false)} className="block text-yellow-800 hover:text-yellow-600">
                All Groups
              </Link>
              <Link to="/groups/create" onClick={() => setMobileMenuOpen(false)} className="block text-yellow-800 hover:text-yellow-600">
                Create Group
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-yellow-800 hover:text-yellow-600">
                My Profile
              </Link>
              <div className="flex items-center gap-2 mt-3">
                {user.profileImage ? (
                  <img
                    src={getCacheBustedImage(user.profileImage)}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-sm text-yellow-800">
                  Hi, {user.name?.split(" ")[0] || "User"}
                </span>
              </div>
              <button onClick={handleLogout} className="block text-left text-red-600 hover:text-red-700 mt-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-yellow-800 hover:text-yellow-600">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-yellow-800 hover:text-yellow-600">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
