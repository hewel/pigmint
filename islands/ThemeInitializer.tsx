import { useEffect } from "preact/hooks";

export default function ThemeInitializer() {
  useEffect(() => {
    const script = `
      (function() {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      })();
    `;
    const s = document.createElement("script");
    s.innerHTML = script;
    document.head.appendChild(s);
  }, []);

  return null; // This component doesn't render anything visible
}
