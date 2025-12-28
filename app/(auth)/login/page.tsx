"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginRequest } from "@/services/authService";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useRedirectIfAuth } from "@/hooks/useRedirectIfAuth";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  useRedirectIfAuth();

  const { login } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: LoginForm) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginRequest(values.email, values.password);
      login(data.token, data.user);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Credenciales inválidas");
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
    >
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Iniciar sesión
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", { required: "Email requerido" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", { required: "Contraseña requerida" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Entrar"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
