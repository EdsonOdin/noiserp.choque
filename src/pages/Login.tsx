import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logoChoque from "@/assets/logo-choque.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 🔥 apenas libera interface (não precisa mais de store)
    setReady(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !senha) {
      toast({
        title: "Preencha email e senha",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // 🔐 LOGIN COM FIREBASE
      await signInWithEmailAndPassword(auth, email, senha);

      toast({
        title: "Acesso autorizado",
        description: "Bem-vindo ao sistema",
      });

      navigate("/painel");

    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        toast({
          title: "Usuário não autorizado",
          variant: "destructive",
        });
      } else if (error.code === "auth/wrong-password") {
        toast({
          title: "Senha incorreta",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 shadow-lg">
        
        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logoChoque}
            alt="Logo Choque"
            className="h-16 w-16 mb-3 object-contain"
          />
          <h1 className="font-heading text-2xl uppercase tracking-widest text-foreground flex items-center gap-2">
            <Shield size={20} /> Acesso Restrito
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
            Batalhão de Choque
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="uppercase text-xs tracking-wider">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              disabled={loading || !ready}
            />
          </div>

          <div>
            <Label htmlFor="senha" className="uppercase text-xs tracking-wider">
              Senha
            </Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              disabled={loading || !ready}
            />
          </div>

          <Button
            type="submit"
            className="w-full uppercase tracking-wider"
            disabled={loading || !ready}
          >
            {loading ? "Entrando..." : ready ? "Entrar" : "Carregando..."}
          </Button>
        </form>
      </div>
    </div>
  );
}
