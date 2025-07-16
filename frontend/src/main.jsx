
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";

// Performance monitoring
if (import.meta.env.MODE === "development") {
  // Add performance monitoring in development
  window.addEventListener("load", () => {
    const perfData = performance.getEntriesByType("navigation")[0];
    console.log(
      "Page load time:",
      perfData.loadEventEnd - perfData.loadEventStart,
      "ms"
    );
  });
}

createRoot(document.getElementById("root")).render(

    <HelmetProvider>
      <App />
    </HelmetProvider>

);
