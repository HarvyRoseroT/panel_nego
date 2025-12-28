"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/theme";
import { UserProvider } from "@/contexts/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}
