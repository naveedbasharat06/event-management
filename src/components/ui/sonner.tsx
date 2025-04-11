"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          // Normal toast styles
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",

          // Error toast styles
          "--error-bg": "hsl(0 72.2% 50.6%)",
          "--error-text": "hsl(0 0% 98%)",
          "--error-border": "hsl(0 72.2% 50.6%)",

          // Success toast styles (optional)
          "--success-bg": "hsl(142.1 76.2% 36.3%)",
          "--success-text": "hsl(0 0% 98%)",
          "--success-border": "hsl(142.1 76.2% 36.3%)",

          // Warning toast styles (optional)
          "--warning-bg": "hsl(38 92% 50%)",
          "--warning-text": "hsl(0 0% 98%)",
          "--warning-border": "hsl(38 92% 50%)",

          // Info toast styles (optional)
          "--info-bg": "hsl(221.2 83.2% 53.3%)",
          "--info-text": "hsl(0 0% 98%)",
          "--info-border": "hsl(221.2 83.2% 53.3%)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
