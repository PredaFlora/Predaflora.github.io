declare global {
  interface Window {
    sgpowcaptcha?: { PoWSolver: new () => { start: (challenge: string) => Promise<unknown> } };
  }
}

let loader: Promise<void> | null = null;

function loadSolver(): Promise<void> {
  if (window.sgpowcaptcha) return Promise.resolve();
  loader ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/sgcaptcha/solver.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loader = null;
      reject(new Error("Could not load the captcha solver"));
    };
    document.head.appendChild(script);
  });
  return loader;
}

export async function sendInquiry(data: { name: string; email: string; message: string }) {
  await loadSolver();
  if (!window.sgpowcaptcha) throw new Error("Captcha solver unavailable");
  const solver = new window.sgpowcaptcha.PoWSolver();
  const challenge = await (await fetch("/sgcaptcha/challenge")).text();
  const sol = await solver.start(challenge);

  const form = new FormData();
  form.append("name", data.name);
  form.append("email", data.email);
  form.append("message", data.message);
  form.append("sol", String(sol));

  const res = await fetch("/sgcaptcha/contact", { method: "POST", body: form });
  if (!res.ok) throw new Error(`Inquiry failed with status ${res.status}`);
}
