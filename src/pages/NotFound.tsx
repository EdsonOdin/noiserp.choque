import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <Shield size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h1 className="font-heading text-5xl text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Área restrita ou página não encontrada</p>
        <Link
          to="/"
          className="px-6 py-3 bg-accent hover:bg-accent/80 text-foreground font-heading uppercase tracking-wider text-sm rounded-md transition-colors border border-border"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
