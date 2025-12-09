import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, Sparkles, BookOpen } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white shadow-2xl p-6 hidden md:flex flex-col border-r border-gray-100">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Dashboard
          </h2>
        </div>
        <p className="text-sm text-gray-500 ml-13">Intelligent Learning Analytics</p>
      </div>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-semibold">Dashboard</span>
        </NavLink>

        <NavLink
          to="/analysis"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <BarChart3 className="w-5 h-5" />
          <span className="font-semibold">AI Analysis</span>
        </NavLink>

        <NavLink
          to="/guide"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold">User Guide</span>
        </NavLink>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
          <p className="text-sm font-semibold text-gray-800 mb-1">Need Help?</p>
          <p className="text-xs text-gray-600">Contact support for assistance</p>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">© 2025 AI System</p>
      </div>
    </aside>
  );
}