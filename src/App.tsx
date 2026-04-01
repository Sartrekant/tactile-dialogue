import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const Projekter = lazy(() => import("./pages/Projekter.tsx"));
const Placeholder = lazy(() => import("./pages/Placeholder.tsx"));
const Ressourcer = lazy(() => import("./pages/Ressourcer.tsx"));
const RessourceDetail = lazy(() => import("./pages/RessourceDetail.tsx"));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ressourcer" element={<Ressourcer />} />
        <Route path="/ressourcer/:id" element={<RessourceDetail />} />
        <Route path="/projekter" element={<Projekter />} />
        <Route path="/vaerktoejer" element={<Placeholder title="Værktøjer" />} />
        <Route path="/faq" element={<Placeholder title="FAQ" />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
