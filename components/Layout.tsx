import { ComponentChildren } from "preact";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import { config } from "../utils.ts";
import type { GitHubStats } from "../lib/github.ts";

interface LayoutProps {
  children: ComponentChildren;
  showBackButton?: boolean;
  githubStats?: GitHubStats | null;
}

export default function Layout({ children, showBackButton, githubStats }: LayoutProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <Navbar showBackButton={showBackButton} />
      <main class="grow pt-24">
        {children}
      </main>
      <Footer social={config.social} githubStats={githubStats} />
    </div>
  );
}
