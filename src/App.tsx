import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Explorar from "./pages/Explorar.tsx";
import Ofertas from "./pages/Ofertas.tsx";
import Carrinho from "./pages/Carrinho.tsx";
import Perfil from "./pages/Perfil.tsx";
import Produto from "./pages/Produto.tsx";
import NotFound from "./pages/NotFound.tsx";

import "./admin/admin.css";
import AdminDashboard from "./admin/pages/Dashboard.tsx";
import AdminProducts from "./admin/pages/Products.tsx";
import AdminCategories from "./admin/pages/Categories.tsx";
import AdminOffers from "./admin/pages/Offers.tsx";
import AdminOrders from "./admin/pages/Orders.tsx";
import AdminCustomers from "./admin/pages/Customers.tsx";
import AdminAppearance from "./admin/pages/Appearance.tsx";
import AdminSettings from "./admin/pages/Settings.tsx";
import AdminTeam from "./admin/pages/Team.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/produto/:id" element={<Produto />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/admin/produtos" element={<AdminProducts />} />
          <Route path="/admin/categorias" element={<AdminCategories />} />
          <Route path="/admin/ofertas" element={<AdminOffers />} />
          <Route path="/admin/clientes" element={<AdminCustomers />} />
          <Route path="/admin/aparencia" element={<AdminAppearance />} />
          <Route path="/admin/configuracoes" element={<AdminSettings />} />
          <Route path="/admin/equipe" element={<AdminTeam />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
