import { useSignal } from "@preact/signals";
import { FunnelIcon } from "@phosphor-icons/react/dist/csr/Funnel";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { ListBulletsIcon } from "@phosphor-icons/react/dist/csr/ListBullets";
import { HashIcon } from "@phosphor-icons/react/dist/csr/Hash";

interface TagFilterProps {
  allTags: string[];
  selectedTag?: string;
}

export default function TagFilter({ allTags, selectedTag }: TagFilterProps) {
  const isOpen = useSignal(false);

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  return (
    <div class="w-full">
      {/* Mobile: Dropdown */}
      <div class="md:hidden relative">
        <button
          type="button"
          onClick={toggleDropdown}
          class="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-3 border-whalies-navy rounded-2xl font-cartoon font-bold text-whalies-navy dark:text-gray-200 shadow-cartoon transition-all active:translate-y-0.5 active:shadow-cartoon-hover"
        >
          <span class="flex items-center gap-2">
            <FunnelIcon weight="duotone" className="text-xl" />
            {selectedTag ? `#${selectedTag}` : "All Posts"}
          </span>
          <CaretDownIcon
            weight="bold"
            className={`text-lg transition-transform duration-200 ${
              isOpen.value ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen.value && (
          <div class="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-3 border-whalies-navy rounded-2xl shadow-cartoon overflow-hidden animate-fade-in">
            <div class="max-h-64 overflow-y-auto">
              <a
                href="/"
                class={`block px-4 py-3 font-cartoon font-bold transition-colors ${
                  !selectedTag
                    ? "bg-whalies-navy text-white"
                    : "text-whalies-navy dark:text-gray-200 hover:bg-pastel-blue/50"
                }`}
              >
                <ListBulletsIcon weight="duotone" className="mr-2" />
                All Posts
              </a>
              {allTags.map((tag) => (
                <a
                  key={tag}
                  href={`/?tag=${tag}`}
                  class={`block px-4 py-3 font-cartoon font-bold transition-colors ${
                    selectedTag === tag
                      ? "bg-whalies-navy text-white"
                      : "text-whalies-navy dark:text-gray-200 hover:bg-pastel-pink/50"
                  }`}
                >
                  <HashIcon weight="duotone" className="mr-2" />
                  {tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Backdrop */}
        {isOpen.value && (
          <div
            class="fixed inset-0 z-40"
            onClick={() => (isOpen.value = false)}
          />
        )}
      </div>

      {/* Desktop: Horizontal Tags */}
      <div class="hidden md:flex flex-wrap justify-center gap-3">
        <a
          href="/"
          class={`inline-block px-4 py-2 rounded-full border-2 border-whalies-navy text-sm font-cartoon font-black transition-all hover:-translate-y-1 ${
            !selectedTag
              ? "bg-whalies-navy text-white shadow-cartoon"
              : "bg-white dark:bg-gray-800 text-whalies-navy dark:text-gray-200 shadow-sm hover:shadow-cartoon"
          }`}
        >
          All
        </a>
        {allTags.map((tag) => (
          <a
            key={tag}
            href={`/?tag=${tag}`}
            class={`inline-block px-4 py-2 rounded-full border-2 border-whalies-navy text-sm font-cartoon font-black transition-all hover:-translate-y-1 ${
              selectedTag === tag
                ? "bg-whalies-navy text-white shadow-cartoon"
                : "bg-white dark:bg-gray-800 text-whalies-navy dark:text-gray-200 shadow-sm hover:shadow-cartoon"
            }`}
          >
            #{tag}
          </a>
        ))}
      </div>
    </div>
  );
}
