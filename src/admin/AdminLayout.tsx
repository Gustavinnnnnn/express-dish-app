import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Tag,
  Users,
  Palette,
  Settings,
  UserCog,
  ExternalLink,
  Eye,
  Menu,
  X,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos" },
  { to: "/admin/produtos", icon: Package, label: "Produtos" },
  { to: "/admin/categorias", icon: FolderTree, label: "Categorias" },
  { to: "/admin/ofertas", icon: Tag, label: "Ofertas" },
  { to: "/admin/clientes", icon: Users, label: "Clientes" },
  { to: "/admin/pagamentos", icon: CreditCard, label: "Pagamentos" },
  { to: "/admin/aparencia", icon: Palette, label: "Aparência" },
  { to: "/admin/configuracoes", icon: Settings, label: "Configurações" },
  { to: "/admin/equipe", icon: UserCog, label: "Equipe" },
];

export const AdminLayout = ({ children, title }: { children: ReactNode; title?: string }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));

  return (
    <div className="admin-scope min-h-screen bg-admin-bg text-admin-fg">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-admin-sidebar text-admin-sidebar-fg transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-2 font-display font-bold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-admin-primary text-white">R</span>
            <span>Roxo Admin</span>
          </Link>
          <button className="lg:hidden text-white/60" onClick={() => setOpen(false)} aria-label="Fechar">
            <X className="size-5" />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-admin-primary text-white shadow-[0_4px_14px_-4px_hsl(var(--admin-primary)/0.6)]"
                    : "text-white/65 hover:bg-white/5 hover:text-white",
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-admin-border bg-admin-bg/80 px-4 backdrop-blur lg:px-8">
          <button className="lg:hidden text-admin-fg" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-admin-muted">Painel</p>
            <h1 className="truncate font-display text-lg font-semibold leading-tight">{title ?? current?.label ?? "Admin"}</h1>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex border-admin-border bg-white text-admin-fg hover:bg-admin-soft">
            <Link to="/" target="_blank"><Eye className="size-4" />Pré-visualizar</Link>
          </Button>
          <Button size="sm" asChild className="bg-admin-primary text-white hover:bg-admin-primary/90">
            <Link to="/" target="_blank"><ExternalLink className="size-4" />Ver loja</Link>
          </Button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-admin-primary text-sm font-semibold text-white">A</div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
