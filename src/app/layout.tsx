import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from 'react-router-dom'
import { useUserValidate } from '@/hooks/user-validate'
import { ThemeProvider } from 'next-themes'

export default function RootLayout() {
  useUserValidate();

  return (
    <ThemeProvider
      defaultTheme="system"
      attribute="class"
      enableSystem
    >
        <Outlet />
        <Toaster />
    </ThemeProvider>
  );
}
