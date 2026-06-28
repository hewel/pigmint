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
  const outerStyles = "inline-block group/tag rounded-full align-middle";
  const baseStyles =
    "inline-block px-3 py-1 rounded-full border-2 border-whalies-navy text-xs font-cartoon font-black text-whalies-navy transition-[transform,box-shadow,background-color,color]";
  const activeStyles =
    "bg-whalies-navy text-white shadow-cartoon group-hover/tag:-translate-y-1 group-hover/tag:shadow-cartoon-hover";
  const inactiveStyles =
    "bg-white dark:bg-gray-800 text-whalies-navy dark:text-gray-200 shadow-sm group-hover/tag:-translate-y-1 group-hover/tag:shadow-cartoon-hover";
  const cardStyles = "bg-white/50 border-whalies-navy group-hover/tag:bg-white";

  const variantStyles = active
    ? activeStyles
    : (href ? inactiveStyles : cardStyles);

  const combinedClassName = `${baseStyles} ${variantStyles} ${className}`;

  if (href) {
    return (
      <a href={href} class={outerStyles}>
        <span class={combinedClassName}>#{name}</span>
      </a>
    );
  }

  return (
    <span class={outerStyles}>
      <span class={combinedClassName}>#{name}</span>
    </span>
  );
}
