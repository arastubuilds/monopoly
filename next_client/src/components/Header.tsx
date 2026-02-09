import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6">
      <nav className="flex items-center justify-between w-full max-w-6xl bg-white/90 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-card border-2 border-white/50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-monopoly-red text-white p-2.5 rounded-xl shadow-button border-b-4 border-monopoly-dark-red hover:translate-y-px hover:shadow-sm hover:border-b-2 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-3xl fill-1">
              castle
            </span>
          </div>
          <h2 className="text-2xl font-serif font-black tracking-tight text-dark-blue">
            Capital City
          </h2>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#"
            className="text-sm font-bold text-text-main/70 hover:text-monopoly-green transition-colors uppercase tracking-wider"
          >
            Rules
          </Link>
          <Link
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
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4 items-center">
          <Link
            href="#"
            className="text-sm font-bold text-text-main hover:text-monopoly-blue uppercase tracking-wider"
          >
            Log In
          </Link>
          <button className="bg-monopoly-blue text-white text-sm font-black px-6 py-3 rounded-xl shadow-button hover:translate-y-[1px] hover:shadow-button-hover hover:bg-monopoly-dark-blue border-b-4 border-monopoly-dark-blue transition-all uppercase tracking-wide">
            Play Now
          </button>
        </div>
      </nav>
    </header>
  );
}
