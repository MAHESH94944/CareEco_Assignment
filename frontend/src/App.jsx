import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/shared/Navbar";
import Sidebar from "./components/shared/Sidebar";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import ErrorBoundary from "./components/shared/ErrorBoundary";

// Lazy load components with optimized loading
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.default }))
);
const Jobs = lazy(() =>
  import("./pages/Jobs").then((module) => ({ default: module.default }))
);
const Workers = lazy(() =>
  import("./pages/Workers").then((module) => ({ default: module.default }))
);
const NewJob = lazy(() =>
  import("./pages/Jobs/NewJob").then((module) => ({ default: module.default }))
);
const JobEdit = lazy(() =>
  import("./pages/Jobs/JobEdit").then((module) => ({ default: module.default }))
);
const JobDetails = lazy(() =>
  import("./components/jobs/JobDetails").then((module) => ({ default: module.default }))
);
const WorkerAssignment = lazy(() =>
  import("./components/workers/WorkerAssignment").then((module) => ({ default: module.default }))
);

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-6">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/new" element={<NewJob />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />
                    <Route path="/jobs/:id/edit" element={<JobEdit />} />
                    <Route path="/workers" element={<Workers />} />
                    <Route path="/workers/assign" element={<WorkerAssignment />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
          </div>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
