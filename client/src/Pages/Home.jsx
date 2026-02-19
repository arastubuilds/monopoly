import { useEffect } from "react";
// import { Link } from "react-router-dom";

const Home = () => {
    useEffect(() => {
        window.location.replace("http://localhost:3000");
    },[]);
    // return (

    //         <div className="relative z-10 text-center h-screen flex flex-col justify-center items-center">
    //             <div className="bg-white shadow-lg rounded-2xl p-6 w-1/2 border-4 border-red-600">
    //                 <h1 className="lg:text-5xl text-3xl font-bold text-red-600 font-mono mb-2">
    //                     MONOPOLY
    //                 </h1>
    //                 <p className="text-lg italic text-gray-600 mb-6">
    //                     Fast Dealing Property Trading Game
    //                 </p>
    //                 <div className="flex flex-col justify-center items-center md:flex-row md:space-x-4 space-y-4 md:space-y-0">
    //                     <Link to="/create" className="w-48">
    //                         <button className="cursor-pointer w-full h-14 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-all">
    //                             Create Game
    //                         </button>
    //                     </Link>
    //                     <Link to="/join" className="w-48">
    //                         <button className="cursor-pointer w-full h-14 bg-white text-red-600 border-4 border-red-600 rounded-lg font-bold text-lg hover:bg-red-600 hover:text-white transition-all">
    //                             Join Game
    //                         </button>
    //                     </Link>
    //                     <Link to="/load" className="w-48">
    //                         <button className="cursor-pointer w-full h-14 bg-white text-red-600 border-4 border-red-600 rounded-lg font-bold text-lg hover:bg-red-600 hover:text-white transition-all">
    //                             Load Game
    //                         </button>
    //                     </Link>
    //                 </div>
    //             </div>
    //         </div>
    // );
    return <></>
};

export default Home;
