import { useEffect } from "preact/hooks";

export default function ThemeInitializer() {
  useEffect(() => {
    // Safe theme initialization without innerHTML
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return null; // This component doesn't render anything visible
}
