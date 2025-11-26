import type { ComponentChildren } from "preact";

export interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children?: ComponentChildren;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  href,
  onClick,
  children,
  className = "",
  variant = "primary",
}: ButtonProps) {
  const baseStyles =
    "inline-block px-4 py-2 rounded-full border-2 border-whalies-navy font-cartoon font-bold transition-all hover:-translate-y-1 hover:shadow-cartoon-hover active:translate-y-0 active:shadow-none";

  const variants = {
    primary:
      "bg-whalies-DEFAULT text-whalies-navy shadow-cartoon hover:bg-whalies-dark hover:text-white",
    secondary:
      "bg-white dark:bg-gray-800 text-whalies-navy dark:text-gray-200 shadow-cartoon",
    ghost:
      "bg-transparent border-transparent shadow-none hover:shadow-none hover:bg-black/5 dark:hover:bg-white/10",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} class={combinedClassName}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} class={combinedClassName}>
      {children}
    </button>
  );
}
