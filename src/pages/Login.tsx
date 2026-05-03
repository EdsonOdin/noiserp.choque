import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";

import { auth, db } from "@/lib/firebase";

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
      // 🔐 LOGIN NO FIREBASE AUTH
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      const uid = userCredential.user.uid;

      // 📦 BUSCAR DADOS DO USUÁRIO NO DATABASE
      const snapshot = await get(ref(db, "usuarios/" + uid));

      if (!snapshot.exists()) {
        throw new Error("Usuário sem dados no sistema");
      }

      const userData = snapshot.val();

      // 🚫 BLOQUEIO POR STATUS
      if (userData.status !== "Ativo") {
        toast({
          title: "Acesso bloqueado",
          description: `Status: ${userData.status}`,
          variant: "destructive",
        });
        return;
      }

      // 💾 SALVAR SESSÃO LOCAL
      const userSession = {
        uid,
        ...userData,
      };

      localStorage.setItem("user", JSON.stringify(userSession));

      // 🧠 LOG TÁTICO (debug)
      console.log("Usuário logado:", userSession);

      toast({
        title: "Acesso autorizado",
        description: `Bem-vindo, ${userData.nome}`,
      });

      // 🚀 ENTRA NO PAINEL
      navigate("/painel");

    } catch (error: any) {
      console.error("Erro login:", error);

      if (error.code === "auth/user-not-found") {
        toast({
          title: "Usuário não encontrado",
          variant: "destructive",
        });
      } else if (error.code === "auth/wrong-password") {
        toast({
          title: "Senha incorreta",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro no login",
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
            <Label className="uppercase text-xs tracking-wider">
              Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label className="uppercase text-xs tracking-wider">
              Senha
            </Label>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full uppercase tracking-wider"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

        </form>
      </div>
    </div>
  );
}
