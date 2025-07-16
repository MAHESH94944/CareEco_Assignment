import { Link, useLocation } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2v-2zM8 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2"
        />
      </svg>
    ),
  },
  {
    name: "Workers",
    href: "/workers",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    ),
  },
  {
    name: "Assignment",
    href: "/workers/assign",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform translate-x-0 transition-transform duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Job Scheduler</h2>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  isActive
                    ? "bg-gray-800 text-white border-l-4 border-blue-500 shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md"
                }`}
              >
                <span
                  className={`mr-3 transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">System Status</p>
            <p className="text-xs text-green-400">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
