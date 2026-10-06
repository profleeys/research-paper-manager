import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LayoutDashboard, FileText, PlusCircle, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-900 tracking-tight text-base sm:text-lg">
                Research Paper Manager
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" className={navLinkClasses}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/papers" end className={navLinkClasses}>
                <FileText className="w-4 h-4" />
                <span>Papers</span>
              </NavLink>

              <NavLink to="/papers/new" className={navLinkClasses}>
                <PlusCircle className="w-4 h-4" />
                <span>Add Paper</span>
              </NavLink>
            </nav>
          </div>

          {/* Right: User name & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium">
              <User className="w-4 h-4 text-indigo-600" />
              <span className="max-w-[120px] sm:max-w-[180px] truncate">{user?.name || 'Researcher'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2">
          <NavLink to="/dashboard" className={navLinkClasses}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/papers" end className={navLinkClasses}>
            <FileText className="w-4 h-4" />
            <span>Papers</span>
          </NavLink>

          <NavLink to="/papers/new" className={navLinkClasses}>
            <PlusCircle className="w-4 h-4" />
            <span>Add Paper</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

