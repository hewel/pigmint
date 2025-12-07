import { useEffect, useState } from "preact/hooks";
import { MoonIcon } from "@phosphor-icons/react/dist/csr/Moon";
import { SunIcon } from "@phosphor-icons/react/dist/csr/Sun";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check local storage or system preference to set initial state correctly
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches)
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
      type="button"
      onClick={toggleTheme}
      class="inline-flex p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-whalies-navy dark:text-gray-100 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === "light"
        ? <MoonIcon weight="duotone" size={20} />
        : <SunIcon weight="duotone" size={20} />}
    </button>
  );
}
