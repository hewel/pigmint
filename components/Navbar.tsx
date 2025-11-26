import { ComponentChildren } from "preact";
import ThemeToggle from "../islands/ThemeToggle.tsx";

interface NavbarProps {
  showBackButton?: boolean;
}

export default function Navbar({ showBackButton }: NavbarProps) {
  return (
    <nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-2 border-whalies-navy rounded-full shadow-cartoon">
      {showBackButton
        ? (
          <a
            href="/"
            class="flex items-center gap-2 font-cartoon font-bold text-xl text-whalies-navy dark:text-gray-100 hover:text-whalies-DEFAULT transition-colors"
          >
            <i class="ph-duotone ph-arrow-left"></i>
            <span class="hidden sm:inline">Back</span>
          </a>
        )
        : (
          <a
            href="/"
            class="font-cartoon font-bold text-xl text-whalies-navy dark:text-gray-100 hover:text-whalies-DEFAULT transition-colors"
          >
            PigMint
          </a>
        )}
      <div class="w-px h-6 bg-whalies-navy/20 dark:bg-white/20"></div>
      <div class="flex items-center gap-4 font-bold text-sm">
        <a
          href="#posts"
          class="text-whalies-navy dark:text-gray-200 hover:text-whalies-DEFAULT transition-colors"
        >
          Posts
        </a>
        <a
          href="/about"
          class="text-whalies-navy dark:text-gray-200 hover:text-whalies-DEFAULT transition-colors"
        >
          About
        </a>
      </div>
      <div class="w-px h-6 bg-whalies-navy/20 dark:bg-white/20"></div>
      <ThemeToggle />
    </nav>
  );
}
