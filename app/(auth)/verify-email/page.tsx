"use client";

import { Box, CircularProgress, Typography, Paper, Button } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { verifyEmailRequest } from "@/services/authService";

const PRIMARY = "#A3E635";
const PRIMARY_DARK = "#365314";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const hasVerified = useRef(false);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;

    const verify = async () => {
      try {
        await verifyEmailRequest(token);
        setSuccess(true);
        setError(null);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "El enlace de verificación no es válido o ha expirado"
        );
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 420,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        {loading && (
          <>
            <CircularProgress sx={{ color: PRIMARY }} />
            <Typography mt={2}>Verificando tu correo…</Typography>
          </>
        )}

        {!loading && success && (
          <>
            <Typography
              variant="h5"
              fontWeight={700}
              color={PRIMARY_DARK}
              mb={1}
            >
              Correo verificado
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Tu cuenta ya está activa. Ahora puedes iniciar sesión.
            </Typography>
            <Button
              fullWidth
              sx={{
                backgroundColor: PRIMARY,
                color: PRIMARY_DARK,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#84cc16" },
              }}
              onClick={() => router.push("/login")}
            >
              Ir a iniciar sesión
            </Button>
          </>
        )}

        {!loading && error && !success && (
          <>
            <Typography variant="h6" fontWeight={700} color="error" mb={1}>
              Error de verificación
            </Typography>
            <Typography color="text.secondary" mb={3}>
              {error}
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.push("/login")}
            >
              Volver al login
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
