"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/services/authService";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rules = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const score = Object.values(rules).filter(Boolean).length;

  const strength = useMemo(() => {
    if (score <= 2) return { label: "Débil", color: "bg-red-500" };
    if (score === 3) return { label: "Media", color: "bg-yellow-400" };
    if (score === 4) return { label: "Buena", color: "bg-lime-500" };
    return { label: "Fuerte", color: "bg-green-600" };
  }, [score]);

  const missing = useMemo(() => {
    const list: string[] = [];
    if (!rules.length) list.push("mínimo 8 caracteres");
    if (!rules.uppercase) list.push("una mayúscula");
    if (!rules.lowercase) list.push("una minúscula");
    if (!rules.number) list.push("un número");
    if (!rules.symbol) list.push("un símbolo");
    return list;
  }, [rules]);

  const validPassword = score === 5 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Token inválido o expirado");
      return;
    }

    if (!validPassword) {
      setError("La contraseña no cumple los requisitos");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "No se pudo restablecer la contraseña"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Contraseña actualizada
          </h1>

          <p className="text-sm text-gray-600">
            Tu contraseña fue cambiada correctamente.
            Ya puedes iniciar sesión.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="w-full mt-4 px-4 py-2 rounded-lg bg-[#3fa10a] text-white text-sm"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Restablecer contraseña
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Crea una contraseña segura
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#3fa10a]/40"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Seguridad</span>
              <span className="font-medium text-gray-700">
                {strength.label}
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded transition-all ${strength.color}`}
                style={{ width: `${(score / 5) * 100}%` }}
              />
            </div>
          </div>

          {missing.length > 0 && (
            <div className="text-xs text-gray-600 space-y-1">
              <p>Debe contener al menos:</p>
              <ul className="list-disc list-inside">
                {missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#3fa10a]/40"
            />
          </div>

          {password &&
            confirmPassword &&
            password !== confirmPassword && (
              <p className="text-xs text-red-600">
                Las contraseñas no coinciden
              </p>
            )}

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !validPassword}
            className="w-full mt-2 px-4 py-2 rounded-lg bg-[#3fa10a] text-white text-sm disabled:opacity-50"
          >
            {loading ? "Actualizando…" : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
