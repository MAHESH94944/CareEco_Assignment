import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Workers from "./pages/Workers";
import NewJob from "./pages/Jobs/NewJob";
import JobEdit from "./pages/Jobs/JobEdit";
import JobDetails from "./components/jobs/JobDetails";
import WorkerAssignment from "./components/workers/WorkerAssignment";
import Navbar from "./components/shared/Navbar";
import Sidebar from "./components/shared/Sidebar";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/new" element={<NewJob />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/jobs/:id/edit" element={<JobEdit />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/workers/assign" element={<WorkerAssignment />} />
            </Routes>
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
  );
};

export default App;
