export function Space({ name, color, price, gridRow, gridCol, rotate = 0 }) {
    const isSideways = rotate === 90 || rotate === 270;

    return (
        <div
            className="border border-black p-0 md:p-0 text-xs flex flex-col items-center justify-center"
            style={{
                backgroundColor: "#f5f5dc",
                gridRow,
                gridColumn: gridCol,
                overflow: "hidden",
            }}
        >

                {/* Color Strip */}
                {color && (
                    <div
                        style={{
                            backgroundColor: color,
                            width: isSideways ? "100%" : "100%",
                            height: isSideways ? "30%" : "20%",
                        }}
                    />
                )}

                {/* Name */}
                <span className="text-[8px] text-center flex-1 flex items-center justify-center text-wrap px-1">
                    {name}
                </span>

                {/* Price */}
                {price && <span className="text-[8px] whitespace-nowrap">{`$${price}`}</span>}
            
        </div>
    );
}
