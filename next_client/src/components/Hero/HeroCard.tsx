const avatarColors = {
  blue: "bg-blue-400",
  green: "bg-green-400",
  red: "bg-red-400",
  yellow: "bg-yellow-400",
};

export default function HeroCard() {
  return (
    <div
      className="
        
        relative z-10 glass-panel
        w-full max-w-3xl
        px-6 sm:px-8 lg:px-10
        py-8 sm:py-10 lg:py-12
        text-center
        flex flex-col justify-center
        overflow-hidden
        lg:h-[70svh]
        sm:h-[95svh]  
        
      "
    >
      {/* Gradient overlay */}
      {/* <div className="absolute inset-0 pointer-events-none" /> */}

      <div className="relative z-10 flex flex-col items-center ">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-monopoly-yellow text-dark-blue rounded-full shadow-button border-b-4 border-yellow-500 -rotate-2">
          <span className="material-symbols-outlined text-sm animate-spin-slow">
            star
          </span>
          <span className="text-[0.65rem] font-black uppercase tracking-widest">
            New Release
          </span>
        </div>

        {/* Heading */}
        <h1
          className="
            font-black tracking-tighter text-dark-blue
            text-[clamp(2.2rem,4.5vw,4.5rem)]
            leading-[0.95]
            mb-5
            max-w-[22ch]
          "
        >
          The Modern Way to
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-monopoly-green via-monopoly-blue to-monopoly-green animate-gradient">
            Play Together
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="
            text-text-main/80
            text-[clamp(1rem,1.8vw,1.35rem)]
            max-w-2xl
            mb-8
            font-medium
            leading-relaxed
          "
        >
          Own the City. Build Your Legacy. A reimagined classic bursting with
          life. Fast-paced, competitive, and endlessly fun.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <a href={`${process.env.NEXT_PUBLIC_APP_URL}/create`} className="btn-green px-6 py-3 text-[clamp(0.9rem,1.2vw,1.1rem)] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add_circle</span>
            Create Game
          </a>

          <a href={`${process.env.NEXT_PUBLIC_APP_URL}/join`} className="btn-outline px-6 py-3 text-[clamp(0.9rem,1.2vw,1.1rem)] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">qr_code</span>
            Join with Code
          </a>
        </div>

        {/* Social proof */}
        <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-inner">
          <div className="flex -space-x-2">
            {[
              { initials: "JD", color: "blue" },
              { initials: "AK", color: "green" },
              { initials: "ML", color: "red" },
              { initials: "+4", color: "yellow" },
            ].map((p, i) => (
              <div
                key={i}
                className={`w-8 h-8 ${avatarColors[p.color]} rounded-full border-2 border-white flex items-center justify-center text-[0.65rem] font-black text-white`}
              >
                {p.initials}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-monopoly-green animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-text-main">
              12,408 players rolling now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
