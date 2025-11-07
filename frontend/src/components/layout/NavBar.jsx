import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Settings, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import ConfirmDialog from "../common/ConfirmDialog";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const buttonClass =
    "relative px-4 py-2 rounded-lg text-md text-gray-600 font-medium flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-gray-100";

  const placeholderAvatar = "https://via.placeholder.com/32";

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link to="/" className="flex items-center">
            <h1 className="text-gray-900 text-xl lg:text-2xl font-bold tracking-tight">
              Monositi
            </h1>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/monositi" className={buttonClass}>
              Monositi
            </Link>
          </motion.div>
          {role === "service_provider" ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/create-service" className={buttonClass}>
                Create Service
              </Link>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/add-property" className={buttonClass}>
                Post Property
              </Link>
            </motion.div>
          )}

          {isAuthenticated && role && (
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </div>
          )}

          {isAuthenticated && role === "admin" && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/admin" className={buttonClass}>
                <Settings size={16} /> Admin
              </Link>
            </motion.div>
          )}

          {!isAuthenticated ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/auth" className={buttonClass}>
                Login
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/profile" className={buttonClass}>
                  <User size={16} /> Profile
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <button onClick={handleLogoutClick} className={buttonClass}>
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="flex flex-col items-center gap-3 py-4 px-4">
              <Link
                to="/monositi"
                className="w-full text-center py-2.5 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
                onClick={() => setMenuOpen(false)}
              >
                Monositi
              </Link>
              {role === "service_provider" ? (
                <Link
                  to="/create-service"
                  className="w-full text-center py-2.5 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
                  onClick={() => setMenuOpen(false)}
                >
                  Create Service
                </Link>
              ) : (
                <Link
                  to="/add-property"
                  className="w-full text-center py-2.5 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
                  onClick={() => setMenuOpen(false)}
                >
                  Post Property
                </Link>
              )}

              {isAuthenticated && role && (
                <div className="w-full text-center py-2.5 bg-blue-100 text-blue-800 font-medium rounded-lg">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
              )}

              {isAuthenticated && role === "admin" && (
                <Link
                  to="/admin"
                  className="w-full text-center py-2.5 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}

              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  className="w-full text-center py-2.5 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        icon={LogOut}
      />
    </motion.nav>
  );
};

export default Navbar;
