import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: {
    default: "Nego",
    template: "%s | Nego",
  },
  description: "Plataforma de gestión digital Negocios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
