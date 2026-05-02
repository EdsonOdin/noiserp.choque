import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, ChevronDown } from "lucide-react";
import { getAuthUser, logout } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoChoque from "@/assets/logo-choque.png";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/hierarquia", label: "Hierarquia" },
  { to: "/regras", label: "Regras" },
  { to: "/cronograma", label: "Cronograma" },
  { to: "/editais", label: "Editais" },
  { to: "/concurso", label: "Concurso" },
  { to: "/codigos", label: "Códigos" },
  { to: "/painel", label: "Painel" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = getAuthUser();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const currentLink = navLinks.find((l) => l.to === location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoChoque} alt="Logo Choque" className="h-10 w-10 object-contain" />
          <span className="font-heading text-lg tracking-wider uppercase text-foreground hidden sm:inline">
            Batalhão de Choque
          </span>
        </Link>

        {/* Desktop - Menu Dropdown */}
        <div className="hidden md:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium tracking-wide uppercase text-foreground bg-accent/50 hover:bg-accent transition-colors border border-border focus:outline-none">
              <Menu size={16} />
              Menu
              {currentLink && (
                <span className="text-muted-foreground normal-case font-normal">
                  / {currentLink.label}
                </span>
              )}
              <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background border-border">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.to} asChild>
                  <Link
                    to={link.to}
                    className={`w-full uppercase tracking-wide text-sm cursor-pointer ${
                      location.pathname === link.to
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <LogIn size={16} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium uppercase tracking-wide border-b border-border/50 ${
                location.pathname === link.to
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { handleLogout(); setOpen(false); }}
              className="w-full text-left px-6 py-3 text-sm font-medium uppercase tracking-wide text-muted-foreground"
            >
              Sair ({user.nome})
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm font-medium uppercase tracking-wide text-muted-foreground"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
