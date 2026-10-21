import { useState, type FormEvent } from "react";
import Wordmark from "../Wordmark";

export default function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await onLogin(String(data.get("email")), String(data.get("password")));
    } catch (err) {
      console.error(err);
      setError("That email and password combination didn't work.");
    } finally {
      setBusy(false);
    }
  };

  const input = "mt-1 w-full border border-line bg-night px-4 py-3 text-bone focus:border-amber focus:outline-none";

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <Wordmark className="text-4xl" />
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fog">Seller login</p>
      <form onSubmit={submit} className="mt-8 space-y-5 border border-line/60 bg-moss/40 p-6">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Email</span>
          <input name="email" type="email" required autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} className={input} />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Password</span>
          <input name="password" type="password" required autoComplete="current-password" className={input} />
        </label>
        {error && <p className="text-sm text-fang" role="alert">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-bone py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-xs text-fog">Use your site admin email and password.</p>
    </section>
  );
}
