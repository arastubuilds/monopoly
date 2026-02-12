import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center landscape-sm:hidden pt-3 px-4">
      <nav
        className="
          flex items-center justify-between
          w-full max-w-2xl
          bg-white/90 backdrop-blur-xl
          px-4 sm:px-6
          py-3 sm:py-4
          rounded-3xl
          shadow-card
          border-2 border-white/50
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="
              bg-monopoly-red text-white
              p-2 sm:p-2.5
              rounded-xl
              shadow-button
              border-b-4 border-monopoly-dark-red
              hover:translate-y-[-1px]
              hover:shadow-sm
              hover:border-b-2
              transition-all
              cursor-pointer
            "
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl fill-1">
              house
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-dark-blue">
            Monopoly
          </h2>
        </div>

        {/* Navigation Links (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#"
            className="text-sm font-bold text-text-main/70 hover:text-monopoly-green transition-colors uppercase tracking-wider"
          >
            Rules
          </Link>
          {/* <Link
            href="#"
            className="text-sm font-bold text-text-main/70 hover:text-monopoly-green transition-colors uppercase tracking-wider"
          >
            Leaderboard
          </Link>
          <Link
            href="#"
            className="text-sm font-bold text-text-main/70 hover:text-monopoly-green transition-colors uppercase tracking-wider"
          >
            Marketplace
          </Link> */}
        </div>

        {/* Auth / CTA */}
        <div className="flex gap-3 sm:gap-4 items-center">
          <Link
            href="#"
            className="hidden sm:inline text-sm font-bold text-text-main hover:text-monopoly-blue uppercase tracking-wider"
          >
            Log In
          </Link>

          <button
            className="
              bg-monopoly-blue text-white
              text-sm font-black
              px-4 sm:px-6
              py-2.5 sm:py-3
              rounded-xl
              shadow-button
              hover:translate-y-[1px]
              hover:shadow-button-hover
              hover:bg-monopoly-dark-blue
              border-b-4 border-monopoly-dark-blue
              transition-all
              uppercase tracking-wide
            "
          >
            Play Now
          </button>
        </div>
      </nav>
    </header>
  );
}
