"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  loginRequest,
  requestPasswordReset,
  resendVerificationEmailRequest,
} from "@/services/authService";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useRedirectIfAuth } from "@/hooks/useRedirectIfAuth";

interface LoginForm {
  email: string;
  password: string;
}

interface ResetForm {
  email: string;
}

const PRIMARY = "#A3E635";
const PRIMARY_DARK = "#365314";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notVerified, setNotVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useRedirectIfAuth();

  const { login } = useUser();
  const router = useRouter();

  const loginForm = useForm<LoginForm>();
  const resetForm = useForm<ResetForm>();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const onSubmitLogin = async (values: LoginForm) => {
    setLoading(true);
    setError(null);
    setNotVerified(false);
    setVerificationSent(false);

    try {
      const data = await loginRequest(values.email, values.password);
      login(data.token, data.user);
      router.replace("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.message;

      if (message === "Please verify your email before logging in") {
        setNotVerified(true);
        try {
          await resendVerificationEmailRequest(values.email);
          setVerificationSent(true);
        } catch {
          setVerificationSent(false);
        }
      } else {
        setError(message || "Credenciales inválidas");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmitReset = async (values: ResetForm) => {
    setLoading(true);
    setError(null);

    try {
      await requestPasswordReset(values.email);
      setSent(true);
    } catch {
      setError("No se pudo enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper elevation={8} sx={{ p: 4, width: 400, borderRadius: 3 }}>
          <Typography variant="h5" textAlign="center" fontWeight={700} color={PRIMARY_DARK}>
            {forgotMode ? "Restablecer contraseña" : "Bienvenido"}
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            {forgotMode
              ? "Te enviaremos un enlace para cambiar tu contraseña"
              : "Accede a tu panel de control"}
          </Typography>

          {notVerified && (
            <Typography
              textAlign="center"
              fontWeight={600}
              mb={2}
              color={PRIMARY_DARK}
            >
              {verificationSent
                ? "Te hemos enviado un correo de verificación. Revisa tu bandeja de entrada o Spam."
                : "Debes verificar tu correo antes de iniciar sesión"}
            </Typography>
          )}

          {!forgotMode && (
            <form onSubmit={loginForm.handleSubmit(onSubmitLogin)}>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                {...loginForm.register("email", { required: "Email requerido" })}
                error={!!loginForm.formState.errors.email}
                helperText={loginForm.formState.errors.email?.message}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: PRIMARY,
                  },
                }}
              />

              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                margin="normal"
                {...loginForm.register("password", {
                  required: "Contraseña requerida",
                })}
                error={!!loginForm.formState.errors.password}
                helperText={loginForm.formState.errors.password?.message}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: PRIMARY,
                  },
                }}
              />

              {error && (
                <Typography color="error" mt={1} fontSize={14}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontWeight: 600,
                  backgroundColor: PRIMARY,
                  color: PRIMARY_DARK,
                  "&:hover": { backgroundColor: "#84cc16" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: PRIMARY_DARK }} />
                ) : (
                  "Entrar"
                )}
              </Button>

              <Button
                fullWidth
                variant="text"
                sx={{ mt: 1.5, textTransform: "none" }}
                onClick={() => {
                  setForgotMode(true);
                  setError(null);
                  setSent(false);
                }}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </form>
          )}

          {forgotMode && (
            <>
              {!sent ? (
                <form onSubmit={resetForm.handleSubmit(onSubmitReset)}>
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    {...resetForm.register("email", {
                      required: "Email requerido",
                    })}
                    error={!!resetForm.formState.errors.email}
                    helperText={resetForm.formState.errors.email?.message}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                        borderColor: PRIMARY,
                      },
                    }}
                  />

                  {error && (
                    <Typography color="error" mt={1} fontSize={14}>
                      {error}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mt: 3,
                      py: 1.2,
                      fontWeight: 600,
                      backgroundColor: PRIMARY,
                      color: PRIMARY_DARK,
                      "&:hover": { backgroundColor: "#84cc16" },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: PRIMARY_DARK }} />
                    ) : (
                      "Enviar correo"
                    )}
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    sx={{ mt: 1.5, textTransform: "none" }}
                    onClick={() => {
                      setForgotMode(false);
                      setError(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </form>
              ) : (
                <>
                  <Typography
                    textAlign="center"
                    color={PRIMARY_DARK}
                    fontWeight={600}
                    mt={3}
                  >
                    Revisa tu correo para restablecer tu contraseña. Si no ves el correo, revisa tu carpeta de spam.
                  </Typography>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      mt: 3,
                      fontWeight: 600,
                      borderColor: PRIMARY,
                      color: PRIMARY_DARK,
                      "&:hover": {
                        borderColor: "#84cc16",
                        backgroundColor: "rgba(132,204,22,0.08)",
                      },
                    }}
                    onClick={() => {
                      setForgotMode(false);
                      setSent(false);
                      setError(null);
                    }}
                  >
                    Volver al login
                  </Button>
                </>
              )}
            </>
          )}

          {!forgotMode && (
            <>
              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" textAlign="center" color="text.secondary">
                ¿No tienes cuenta?
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push("/register")}
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
                Crear cuenta
              </Button>
            </>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}
