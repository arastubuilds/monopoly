import { MonopolyBoard } from "./Board.jsx";
import boardData from "../lib/data.js"

const Background = () => {
    return (
    <div className="absolute w-full h-screen flex justify-center items-center bg-[#f5f5dc] overflow-hidden z-10">
        <div className="absolute inset-0 opacity-40 pointer-events-none flex justify-center items-center z-20">
            <MonopolyBoard boardData={boardData}/>
        </div>
    </div>
    );
};
export default Background;