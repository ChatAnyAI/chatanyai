import { useTheme } from "next-themes";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" className="w-8 h-8 rounded-full opacity-50" disabled />; 
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full w-8 h-8 border-muted transition-all hover:scale-110 hover:border-primary flex items-center justify-center p-0 aspect-square  cursor-pointer"
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            <Sun 
              className={`absolute transition-all duration-300 
                ${theme === "light" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"} 
                text-yellow-500`} 
            />
            <Moon 
              className={`absolute transition-all duration-300 
                ${theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"} 
                text-slate-900 dark:text-slate-400`} 
            />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm font-medium">
          {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}