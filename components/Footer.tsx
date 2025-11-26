export default function Footer() {
  return (
    <footer class="bg-whalies-navy text-white py-12 mt-auto">
      <div class="max-w-screen-lg mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-center md:text-left">
          <h2 class="font-cartoon text-2xl mb-2">PigMint Blog</h2>
          <p class="text-gray-400 text-sm max-w-xs">
            A colorful journey through web development and design. Built with
            Fresh and Tailwind CSS.
          </p>
        </div>
        <div class="flex gap-6">
          <a href="#" class="hover:text-whalies-DEFAULT transition-colors">
            <i class="ph-duotone ph-github-logo text-2xl"></i>
          </a>
          <a href="#" class="hover:text-whalies-DEFAULT transition-colors">
            <i class="ph-duotone ph-twitter-logo text-2xl"></i>
          </a>
          <a href="#" class="hover:text-whalies-DEFAULT transition-colors">
            <i class="ph-duotone ph-discord-logo text-2xl"></i>
          </a>
        </div>
      </div>
      <div class="text-center mt-8 pt-8 border-t border-white/10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} PigMint. All rights reserved.
      </div>
    </footer>
  );
}
