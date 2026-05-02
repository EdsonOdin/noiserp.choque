import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "./components/Layout";
import Codigos from "./pages/Codigos";
import Home from "./pages/Home";
import Hierarquia from "./pages/Hierarquia";
import Regras from "./pages/Regras";
import Cronograma from "./pages/Cronograma";
import Editais from "./pages/Editais";
import Concurso from "./pages/Concurso";
import Login from "./pages/Login";
import Painel from "./pages/Painel";
import NotFound from "./pages/NotFound";

import { useEffect } from "react";
import { initializeStore } from "./lib/store";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    initializeStore();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/hierarquia" element={<Hierarquia />} />
            <Route path="/regras" element={<Regras />} />
            <Route path="/cronograma" element={<Cronograma />} />
            <Route path="/editais" element={<Editais />} />
            <Route path="/concurso" element={<Concurso />} />
            <Route path="/codigos" element={<Codigos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/painel" element={<Painel />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}