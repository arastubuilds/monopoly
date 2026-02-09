import MoneyBill from "../MoneyBill";

export default function HeroEdgeDecor() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* TOP RIGHT – Currency */}
      <div className="absolute -top-[24%] -right-[4%] rotate-[28deg]">
        <MoneyStack />
      </div>

      {/* BOTTOM LEFT – Currency */}
      <div className="absolute -bottom-[14%] left-[-4%] rotate-[-36deg]">
        <MoneyStack variant="fan" />
      </div>

      {/* TOP LEFT – Property Deed */}
      <div className="absolute top-[-20%] left-[-4%] rotate-[6deg]">
        <PropertyDeedStack color="blue" variant="fan"/>
      </div>

      {/* BOTTOM RIGHT – Property Deed (background) */}
      <div className="absolute -bottom-[23%] -right-[1%] rotate-[6deg] opacity-70">
        <PropertyDeedStack color="red" variant="stack" />
      </div>
    </div>
  );
}

/* ------------------ */
/* Helper Components  */
/* ------------------ */

function MoneyStack({ variant = "stack" }: { variant?: "fan" | "stack" }) {
    return (
      <div
        className="
          relative
          w-[clamp(12rem,22vw,16rem)]
          h-[clamp(6rem,12vw,8rem)]
        "
      >
        {variant === "fan" ? (
          <>
            {/* LEFT BILL */}
            <MoneyBill
              value="$500"
              className="
                -rotate-[12deg]
                z-20
                translate-x-[-28%]
                translate-y-[-32%]
              "
            />
  
            {/* CENTER BILL (ANCHOR) */}
            <MoneyBill
              value="$100"
              className="
                z-10
                translate-x-[-30%]
              "
            />
  
            {/* RIGHT BILL */}
            <MoneyBill
              value="$50"
              className="
                rotate-[12deg]
                translate-x-[-36%]
                translate-y-[32%]
              "
            />
          </>
        ) : (
          <>
            {/* STACKED */}
            <MoneyBill
              value="$100"
              className="translate-y-[28%]"
            />
            <MoneyBill
              value="$500"
              className="z-10 translate-y-[14%]"
            />
            <MoneyBill
              value="$50"
              className="z-20"
            />
          </>
        )}
      </div>
    );
  }
  
  
  

  type PropertyDeedCardProps = {
    color?: "red" | "blue" | "green" | "yellow" | "purple";
    className?: string;
  };
  
  const DEED_COLORS: Record<
    NonNullable<PropertyDeedCardProps["color"]>,
    { bar: string; border: string; stamp: string }
  > = {
    red: {
      bar: "bg-monopoly-red",
      border: "border-red-300",
      stamp: "border-red-600 text-red-600",
    },
    blue: {
      bar: "bg-blue-600",
      border: "border-blue-300",
      stamp: "border-blue-600 text-blue-600",
    },
    green: {
      bar: "bg-monopoly-green",
      border: "border-green-300",
      stamp: "border-green-600 text-green-600",
    },
    yellow: {
      bar: "bg-yellow-400",
      border: "border-yellow-300",
      stamp: "border-yellow-600 text-yellow-600",
    },
    purple: {
      bar: "bg-purple-600",
      border: "border-purple-300",
      stamp: "border-purple-600 text-purple-600",
    },
  };
  
  export function PropertyDeedCard({
    color = "red",
    className = "",
  }: PropertyDeedCardProps) {
    const styles = DEED_COLORS[color];
  
    return (
      <div
        className={`
          absolute
          w-[clamp(9rem,9vw,7.5rem)]
          aspect-[1/1.5]
          bg-[#fffdf8]
          border-2 ${styles.border}
          shadow-[0_6px_14px_rgba(0,0,0,0.18)]
          font-serif
          overflow-hidden
          ${className}
        `}
      >
        {/* Color Bar */}
        <div className={`h-[14%] ${styles.bar}`} />
  
        {/* Title */}
        <div className="px-2 pt-1 text-center text-[0.6rem] font-bold tracking-wide">
          PROPERTY DEED
        </div>
  
        {/* Divider */}
        <div className="mx-2 my-1 h-px bg-gray-400" />
  
        {/* Body */}
        <div className="px-2 space-y-1">
          <div className="h-1 w-[90%] bg-gray-300 rounded" />
          <div className="h-1 w-[75%] bg-gray-300 rounded" />
          <div className="h-1 w-[80%] bg-gray-300 rounded" />
  
          <div className="mt-2 space-y-1">
            <div className="h-1 w-[65%] bg-gray-300 rounded" />
            <div className="h-1 w-[55%] bg-gray-300 rounded" />
          </div>
        </div>
  
        {/* Stamp */}
        <div
          className={`
            absolute bottom-2 right-2
            w-7 h-7
            rounded-full
            border-2 ${styles.stamp}
            text-[7px]
            font-bold
            flex items-center justify-center
            rotate-[-12deg]
          `}
        >
          OFFICIAL
        </div>
  
        {/* Paper Grain */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.05),transparent_70%)]
            pointer-events-none
          "
        />
      </div>
    );
  }
  
  export function PropertyDeedStack({
    variant = "fan",
    color = "red",
  }: {
    variant?: "fan" | "stack";
    color?: PropertyDeedCardProps["color"];
  }) {
    return (
      <div
        className="
          relative
            w-[clamp(8rem,12vw,10rem)]
            h-[clamp(20rem,20vw,16rem)]
        "
      >
        {variant === "fan" ? (
          <>
            {/* LEFT */}
            <PropertyDeedCard
              color={color}
              className="
                -rotate-[10deg]
                z-20
                translate-x-[-38%]
                translate-y-[-2%]
              "
            />
  
            {/* CENTER */}
            <PropertyDeedCard
              color={color}
              className="
                z-10
                translate-x-[-12%]
              "
            />
  
            {/* RIGHT */}
            <PropertyDeedCard
              color={color}
              className="
                rotate-[16deg]
                translate-x-[24%]
                translate-y-[10%]
              "
            />
          </>
        ) : (
          <>
            {/* STACK */}
            <PropertyDeedCard
              color={color}
              className="translate-y-[18%]"
            />
            <PropertyDeedCard
              color={color}
              className="z-10 translate-y-[9%]"
            />
            <PropertyDeedCard
              color={color}
              className="z-20"
            />
          </>
        )}
      </div>
    );
  }
    