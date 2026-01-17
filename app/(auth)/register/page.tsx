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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
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
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: 400,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={700}
            color={PRIMARY_DARK}
          >
            Crear cuenta
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Regístrate para comenzar
          </Typography>

          {success ? (
            <>
              <Typography
                color={PRIMARY_DARK}
                textAlign="center"
                fontWeight={600}
              >
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
                  "&:hover": {
                    backgroundColor: "#84cc16",
                  },
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
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: PRIMARY,
                  },
                }}
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                  "&:hover": {
                    backgroundColor: "#84cc16",
                  },
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

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
          >
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
