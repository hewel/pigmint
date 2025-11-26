import { useEffect, useState } from "preact/hooks";
import Moon from "npm:@phosphor-icons/react/dist/csr/Moon.es";
import Sun from "npm:@phosphor-icons/react/dist/csr/Sun.es";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check local storage or system preference to set initial state correctly
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    // Toggle based on current state
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      class="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 border-2 border-whalies-navy shadow-cartoon hover:shadow-none hover:translate-y-1 transition-all"
      aria-label="Toggle Dark Mode"
    >
      {theme === "light"
        ? <Moon size={24} weight="duotone" />
        : <Sun size={24} weight="duotone" />}
    </button>
  );
}
