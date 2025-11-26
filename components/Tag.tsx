interface TagProps {
  name: string;
  active?: boolean;
  href?: string;
  className?: string;
}

export default function Tag({
  name,
  active = false,
  href,
  className = "",
}: TagProps) {
  const baseStyles =
    "inline-block px-3 py-1 rounded-full border-2 border-whalies-navy text-xs font-cartoon font-black text-whalies-navy transition-all";
  const activeStyles =
    "bg-whalies-navy text-white shadow-cartoon hover:-translate-y-1 hover:shadow-cartoon-hover";
  const inactiveStyles =
    "bg-white dark:bg-gray-800 text-whalies-navy dark:text-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-cartoon-hover";
  const cardStyles = "bg-white/50 border-whalies-navy hover:bg-white";

  const variantStyles = active
    ? activeStyles
    : (href ? inactiveStyles : cardStyles);

  const combinedClassName = `${baseStyles} ${variantStyles} ${className}`;

  if (href) {
    return (
      <a href={href} class={combinedClassName}>
        #{name}
      </a>
    );
  }

  return (
    <span class={combinedClassName}>
      #{name}
    </span>
  );
}
