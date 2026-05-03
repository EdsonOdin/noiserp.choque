import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, senha);

      // 🧭 só navega depois do login REAL
      navigate("/painel");

    } catch (err) {
      console.log("Erro login:", err);
      alert("Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Senha"
        type="password"
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        Entrar
      </button>
    </div>
  );
}
