import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/admin/check").then((res) => {
      if (res.ok) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        navigate("/admin");
      } else {
        const data = await res.json();
        setError(data.error ?? "Forkert adgangskode");
      }
    } catch {
      setError("Noget gik galt. Prøv igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-serif text-2xl text-foreground mb-10 text-center">
          LANDSVIG
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-8 text-center">
          Admin
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">
              Adgangskode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full border-b border-border bg-transparent pb-3 font-mono text-foreground outline-none transition-all duration-500 placeholder:text-foreground/20 focus:border-b-2 focus:border-foreground"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-[11px]" style={{ color: "hsl(0 84% 60%)" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-foreground py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-background rounded-sm transition-all duration-300 disabled:opacity-40 disabled:border disabled:border-dashed disabled:border-foreground/40"
          >
            {loading ? "Logger ind..." : "Log ind"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
