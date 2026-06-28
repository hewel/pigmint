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
  const outerStyles = "inline-block group/button rounded-full align-middle";
  const baseStyles =
    "inline-block px-4 py-2 rounded-full border-2 border-whalies-navy font-cartoon font-bold transition-[transform,box-shadow,background-color,color] group-hover/button:-translate-y-1 group-hover/button:shadow-cartoon-hover group-active/button:translate-y-0 group-active/button:shadow-none";

  const variants = {
    primary:
      "bg-whalies-default text-whalies-navy shadow-cartoon group-hover/button:bg-whalies-dark group-hover/button:text-white",
    secondary:
      "bg-white dark:bg-gray-800 text-whalies-navy dark:text-gray-200 shadow-cartoon",
    ghost:
      "bg-transparent border-transparent shadow-none group-hover/button:shadow-none group-hover/button:bg-black/5 dark:group-hover/button:bg-white/10",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} class={outerStyles}>
        <span class={combinedClassName}>{children}</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      class={`${outerStyles} border-0 bg-transparent p-0`}
    >
      <span class={combinedClassName}>{children}</span>
    </button>
  );
}
