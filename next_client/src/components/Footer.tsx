import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-blue text-white/90 py-12 relative overflow-hidden mt-auto">
      {/* Colored Top Border */}
      <div className="absolute top-0 left-0 w-full h-3 flex">
        <div className="h-full w-1/4 bg-monopoly-red"></div>
        <div className="h-full w-1/4 bg-monopoly-blue"></div>
        <div className="h-full w-1/4 bg-monopoly-yellow"></div>
        <div className="h-full w-1/4 bg-monopoly-green"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
        {/* Copyright */}
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <span className="material-symbols-outlined text-xl text-white">
              copyright
            </span>
          </div>
          <p className="text-sm text-white/60 font-medium">
            © 2024 Capital City Games.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm font-bold text-white/80">
          <Link
            href="#"
            className="hover:text-monopoly-yellow transition-colors hover:scale-105 transform inline-block"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="hover:text-monopoly-yellow transition-colors hover:scale-105 transform inline-block"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="hover:text-monopoly-yellow transition-colors hover:scale-105 transform inline-block"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
