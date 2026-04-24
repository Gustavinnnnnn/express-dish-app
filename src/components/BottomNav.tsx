import { NavLink } from "react-router-dom";
import { Home, Compass, Receipt, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { to: "/", label: "Início", icon: Home, end: true },
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/pedidos", label: "Pedidos", icon: Receipt },
  { to: "/carrinho", label: "Carrinho", icon: ShoppingBag, badge: true },
  { to: "/perfil", label: "Perfil", icon: User },
];

export const BottomNav = () => {
  const count = useCart((s) =>
    Object.values(s.items).reduce((sum, it) => sum + it.qty, 0)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom px-3 pt-2">
      <div className="mx-auto max-w-md glass rounded-3xl px-2 py-2 shadow-card">
        <ul className="flex items-center justify-between">
          {items.map(({ to, label, icon: Icon, end, badge }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.4 : 2} />
                      <AnimatePresence>
                        {badge && count > 0 && (
                          <motion.span
                            key="badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -right-2 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-glow"
                          >
                            {count}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <span>{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -top-1 h-1 w-1 rounded-full bg-primary"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
