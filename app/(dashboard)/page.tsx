"use client";

import { Typography, Box, Button } from "@mui/material";
import { useUser } from "@/contexts/UserContext";

export default function DashboardPage() {
  const { user, logout } = useUser();

  return (
    <Box p={4}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography mt={2}>Usuario: {user?.email}</Typography>

      <Button variant="outlined" sx={{ mt: 2 }} onClick={logout}>
        Cerrar sesión
      </Button>
    </Box>
  );
}
