import { getYear, Social } from "../utils.ts";

interface FooterProps {
  social: Social[];
}

export default function Footer({ social }: FooterProps) {
  return (
    <footer class="bg-whalies-navy text-white py-12 mt-auto">
      <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-center md:text-left">
          <h2 class="font-cartoon text-2xl mb-2">PigMint Blog</h2>
          <p class="text-gray-400 text-sm max-w-xs">
            A colorful journey through web development and design. Built with
            Fresh and Tailwind CSS.
          </p>
        </div>
        <div class="flex gap-6">
          {social.map((item) => (
            <a
              href={item.url}
              class="hover:text-whalies-default transition-colors"
              title={item.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class={`ph-duotone ph-${item.icon}-logo text-2xl`}></i>
            </a>
          ))}
        </div>
      </div>
      <div class="flex justify-center items-center gap-0.5 text-center mt-8 pt-8 border-t border-white/10 text-gray-500 text-sm">
        <i class="ph-duotone ph-copyright"></i> {getYear()}{" "}
        PigMint. All rights reserved.
      </div>
    </footer>
  );
}
