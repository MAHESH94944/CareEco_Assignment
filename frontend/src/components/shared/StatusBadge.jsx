const StatusBadge = ({ status, size = "sm" }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "idle":
      case "success":
      case "healthy":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          dot: "bg-green-500",
        };
      case "running":
      case "busy":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          dot: "bg-blue-500",
        };
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          dot: "bg-yellow-500",
        };
      case "failed":
      case "offline":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          dot: "bg-red-500",
        };
      case "warning":
        return {
          bg: "bg-orange-100",
          text: "text-orange-800",
          border: "border-orange-200",
          dot: "bg-orange-500",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          dot: "bg-gray-500",
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClass = size === "xs" ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center space-x-1 ${sizeClass} rounded-full font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${config.dot} ${
          status === "running" ? "animate-pulse" : ""
        }`}
      ></span>
      <span className="capitalize">{status}</span>
    </span>
  );
};


export default StatusBadge;
