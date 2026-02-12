import Header from "@/components/Header";
import Hero from "@/components/Hero/Hero";
import Footer from "@/components/Footer";
import GameElements from "@/components/GameElements";

// export default function Home() {
//   return (
//     <>
//       {/* <GameElements /> */}
//       {/* <Header /> */}
//       <Hero />
//       {/* <Footer /> */}
//     </>
//   );
// }


export default function Home() {
  return (
    <main className="relative min-h-[100svh] flex items-center justify-center select-none md:translate-x-4 landscape-sm:translate-x-36 landscape-sm:translate-y-14 portrait:overflow-hidden">
      <Header />
      <Hero />
      
    </main>
  );
}
