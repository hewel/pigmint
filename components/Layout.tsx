import { ComponentChildren } from "preact";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

interface LayoutProps {
  children: ComponentChildren;
  showBackButton?: boolean;
}

export default function Layout({ children, showBackButton }: LayoutProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <Navbar showBackButton={showBackButton} />
      <main class="flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
