type MoneyBillProps = {
    value: "$5" | "$10" | "$20" | "$50" | "$100" | "$500";
    className?: string;
  };
  
  const BILL_STYLES: Record<
    MoneyBillProps["value"],
    { bg: string; text: string; border: string }
  > = {
    "$5": {
      bg: "bg-rose-100",
      text: "text-rose-700",
      border: "border-rose-400",
    },
    "$10": {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-400",
    },
    "$20": {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-400",
    },
    "$50": {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-400",
    },
    "$100": {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-400",
    },
    "$500": {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-400",
    },
  };
  
  export default function MoneyBill({ value, className = "" }: MoneyBillProps) {
    const style = BILL_STYLES[value];
  
    return (
      <div
        className={`
          absolute inset-0
          ${style.bg}
          ${style.border}
          border-[0.35rem]
          rounded-md
          shadow-[0_8px_18px_rgba(0,0,0,0.15)]
          ${className}
        `}
      >
        {/* Inner frame */}
        <div
          className={`
            absolute inset-[0.35rem]
            border-2 border-dashed ${style.border}/50
          `}
        />
  
        {/* Center denomination */}
        <div
          className={`
            absolute inset-x-[18%] inset-y-[32%]
            border-2 ${style.border}
            flex items-center justify-center
            font-serif font-extrabold
            tracking-wide
            ${style.text}
            text-[clamp(0.9rem,2vw,1.4rem)]
          `}
        >
          {value}
        </div>
  
        {/* Corner values */}
        <span
          className={`absolute top-2 left-2 text-xs font-bold ${style.text}`}
        >
          {value}
        </span>
        <span
          className={`absolute bottom-2 right-2 text-xs font-bold ${style.text}`}
        >
          {value}
        </span>
  
        {/* Paper grain */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.05),transparent_60%)]
            pointer-events-none
          "
        />
  
        {/* Gloss highlight */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-br
            from-white/40 via-transparent to-transparent
            pointer-events-none
          "
        />
      </div>
    );
  }
  