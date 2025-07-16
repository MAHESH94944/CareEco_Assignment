import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/shared/Navbar";
import Sidebar from "./components/shared/Sidebar";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import ErrorBoundary from "./components/shared/ErrorBoundary";

// Lazy load components with proper error handling
const Dashboard = lazy(() =>
  import("./pages/Dashboard").catch(() => {
    console.error("Failed to load Dashboard component");
    return { default: () => <div>Error loading Dashboard</div> };
  })
);

const Jobs = lazy(() =>
  import("./pages/Jobs").catch(() => {
    console.error("Failed to load Jobs component");
    return { default: () => <div>Error loading Jobs</div> };
  })
);

const Workers = lazy(() =>
  import("./pages/Workers").catch(() => {
    console.error("Failed to load Workers component");
    return { default: () => <div>Error loading Workers</div> };
  })
);

const NewJob = lazy(() =>
  import("./pages/Jobs/NewJob").catch(() => {
    console.error("Failed to load NewJob component");
    return { default: () => <div>Error loading NewJob</div> };
  })
);

const JobEdit = lazy(() =>
  import("./pages/Jobs/JobEdit").catch(() => {
    console.error("Failed to load JobEdit component");
    return { default: () => <div>Error loading JobEdit</div> };
  })
);

const JobDetails = lazy(() =>
  import("./components/jobs/JobDetails").catch(() => {
    console.error("Failed to load JobDetails component");
    return { default: () => <div>Error loading JobDetails</div> };
  })
);

const WorkerAssignment = lazy(() =>
  import("./components/workers/WorkerAssignment").catch(() => {
    console.error("Failed to load WorkerAssignment component");
    return { default: () => <div>Error loading WorkerAssignment</div> };
  })
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
                    <Route
                      path="/workers/assign"
                      element={<WorkerAssignment />}
                    />
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
