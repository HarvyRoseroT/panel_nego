"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerRequest, isAuthenticated } from "@/services/authService";

const PRIMARY = "#A3E635";
const PRIMARY_DARK = "#365314";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const rules = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z\d]/.test(password),
  };

  const strength = Object.values(rules).filter(Boolean).length;
  const isStrong = strength === 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isStrong) {
      setError("La contraseña no cumple los requisitos de seguridad");
      return;
    }

    setLoading(true);

    try {
      const res = await registerRequest(name, email, password);
      setSuccess(res.message || "Revisa tu correo para verificar tu cuenta");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" px={2}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Paper elevation={6} sx={{ p: 4, width: 420, borderRadius: 3 }}>
          <Typography variant="h5" textAlign="center" fontWeight={700} color={PRIMARY_DARK}>
            Crear cuenta
          </Typography>

          <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
            Regístrate para comenzar
          </Typography>

          {success ? (
            <>
              <Typography color={PRIMARY_DARK} textAlign="center" fontWeight={600}>
                {success}
              </Typography>

              <Button
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontWeight: 600,
                  backgroundColor: PRIMARY,
                  color: PRIMARY_DARK,
                  "&:hover": { backgroundColor: "#84cc16" },
                }}
                onClick={() => router.push("/login")}
              >
                Ir a iniciar sesión
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Nombre"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Box mt={1.5}>
                <LinearProgress
                  variant="determinate"
                  value={(strength / 5) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#e5e7eb",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        strength <= 2 ? "#ef4444" :
                        strength === 3 ? "#f59e0b" :
                        strength === 4 ? "#84cc16" :
                        PRIMARY,
                    },
                  }}
                />

                <Box mt={1.5} display="grid" gap={0.5}>
                  <Rule ok={rules.length} text="Mínimo 8 caracteres" />
                  <Rule ok={rules.uppercase} text="Una letra mayúscula" />
                  <Rule ok={rules.lowercase} text="Una letra minúscula" />
                  <Rule ok={rules.number} text="Un número" />
                  <Rule ok={rules.symbol} text="Un símbolo" />
                </Box>
              </Box>

              {error && (
                <Typography color="error" mt={1.5} fontSize={14}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={loading || !isStrong}
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontWeight: 600,
                  backgroundColor: PRIMARY,
                  color: PRIMARY_DARK,
                  "&:hover": { backgroundColor: "#84cc16" },
                  "&:disabled": { opacity: 0.6 },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: PRIMARY_DARK }} />
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </form>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            ¿Ya tienes cuenta?
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => router.push("/login")}
            sx={{
              mt: 1.5,
              fontWeight: 600,
              borderColor: PRIMARY,
              color: PRIMARY_DARK,
              "&:hover": {
                borderColor: "#84cc16",
                backgroundColor: "rgba(132,204,22,0.08)",
              },
            }}
          >
            Iniciar sesión
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <Typography
      fontSize={13}
      color={ok ? "#166534" : "text.secondary"}
      fontWeight={ok ? 600 : 400}
    >
      {ok ? "✔︎" : "•"} {text}
    </Typography>
  );
}
