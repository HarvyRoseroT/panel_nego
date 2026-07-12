"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  BillingMode,
  getBillingMode,
  updateBillingMode,
} from "@/services/billingModeService";
import { useUser } from "@/contexts/UserContext";

interface BillingModeContextType {
  billingMode: BillingMode | null;
  loading: boolean;
  error: string | null;
  refreshBillingMode: () => Promise<BillingMode | null>;
  setFreeModeEnabled: (enabled: boolean) => Promise<BillingMode>;
}

const BillingModeContext = createContext<BillingModeContextType | null>(null);

export function BillingModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useUser();
  const [billingMode, setBillingMode] = useState<BillingMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBillingMode = useCallback(async () => {
    if (!token) {
      setBillingMode(null);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const mode = await getBillingMode();
      setBillingMode(mode);
      return mode;
    } catch {
      setError("No se pudo cargar el modo de facturacion");
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const setFreeModeEnabled = useCallback(async (enabled: boolean) => {
    const response = await updateBillingMode({
      free_mode_enabled: enabled,
    });

    setBillingMode(response.billing_mode);
    setError(null);
    return response.billing_mode;
  }, []);

  useEffect(() => {
    refreshBillingMode();
  }, [refreshBillingMode]);

  return (
    <BillingModeContext.Provider
      value={{
        billingMode,
        loading,
        error,
        refreshBillingMode,
        setFreeModeEnabled,
      }}
    >
      {children}
    </BillingModeContext.Provider>
  );
}

export function useBillingMode() {
  const ctx = useContext(BillingModeContext);
  if (!ctx) {
    throw new Error("useBillingMode must be used within BillingModeProvider");
  }
  return ctx;
}
