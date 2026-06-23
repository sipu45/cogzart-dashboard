import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": { title: "Dashboard", sub: "Overview of your puzzle inventory" },
  "/inventory": { title: "Inventory", sub: "Manage puzzle products" },
  "/orders": { title: "Orders", sub: "Track customer orders" },
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: "Dashboard", sub: "" };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-900">{page.title}</h1>
        <p className="text-sm text-gray-500 hidden sm:block">{page.sub}</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          System Online
        </span>
      </div>
    </header>
  );
}
