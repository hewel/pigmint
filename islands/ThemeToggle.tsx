import { useEffect, useState } from "preact/hooks";

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
      type="button"
      onClick={toggleTheme}
      class="inline-flex p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-whalies-navy dark:text-gray-100 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === "light"
        ? <i class="ph-duotone ph-moon" style={{ fontSize: "20px" }}></i>
        : <i class="ph-duotone ph-sun" style={{ fontSize: "20px" }}></i>}
    </button>
  );
}
