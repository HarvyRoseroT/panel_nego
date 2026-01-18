"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/theme/theme";
import { UserProvider } from "@/contexts/UserContext";
import { StripeProvider } from "@/contexts/StripeContext";

const cache = createCache({
  key: "mui",
  prepend: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <StripeProvider>{children}</StripeProvider>
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
