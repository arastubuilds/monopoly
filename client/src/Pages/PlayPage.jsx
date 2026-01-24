import { Suspense, useEffect } from 'react';

import { useGameStore } from '../store/gameStore.js';
import { useTokenStore } from '../store/useTokenStore.js';
import { registerPlayerEvents, unregisterPlayerEvents } from "../lib/socket";

import BuyPrompt from "../Components/BuyPrompt";
import Hand from "../Components/Hand";
import RightHand from "../Components/RightHand";
import PayRentPrompt from "../Components/PayRentPrompt";
import YourOwnPrompt from "../Components/YourOwnPrompt";
import OfferTrade from "../Components/OfferTrade";
import OwnedProp from "../Components/OwnedProp";
import OfferedTrade from "../Components/OfferedTrade";
// import SceneCanvas from '../Components/3D/SceneCanvas.jsx'
import { SceneCanvas } from '../Components/SceneCanvasLazy.js';
import RollDiceButton from '../Components/RollDiceButton.jsx';
import EndTurnButton from '../Components/EndTurnButton.jsx';
import HUD from '../Components/HUD.jsx';
import { Loader } from 'lucide-react';


function PlayPage() {


  const game = useGameStore((state) => state.game);
  const landedOn = useGameStore((state) => state.landedOn);
  const length = useGameStore((state) => state.numPlayers);
  
  
  const yourProperties = useGameStore((state) => state.yourProperties);
  const oPP = useGameStore((state) => state.oPP);
  const { roll, end, rolled, passed, viewing, tradingWith, offeredTrade, isYourTurn, isBuying, isPaying, isOwn, isViewing, isOffering, isOffered } = useGameStore();
  const isViewingOwnProps = useGameStore((state) => state.isViewingOwnProps);
  const isViewingOthersProps = useGameStore((state) => state.isViewingOthersProps);
  const handleClick = async() => {
    await roll(game?.code);
  }
  const handleEnd = async() => {
    await end(game?.code);
  }
  useEffect(() => {
    useTokenStore.getState().createTokens(length);
    // console.log( useTokenStore.getState().tokens );
    registerPlayerEvents();
    return () => unregisterPlayerEvents();
  }, []);

  return (
    <div
      className=''
      style={{
        backgroundImage: `url(/bg.jpg)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        zIndex: -1,
      }} >
      <Suspense fallback={<div className='h-full w-full flex justify-center items-center '><Loader className=''/></div>}>
        <SceneCanvas />
      </Suspense>
      <div className='top-0 left-0 flex justify-center w-full h-full z-50 lg:text-lg text-sm'>
        <HUD />
        <div className='w-full h-full'>
          {isViewingOwnProps && <Hand owned={yourProperties} />}
          {isViewingOthersProps && <RightHand players={oPP}/>}
        </div>
        {isYourTurn && (!rolled ? <RollDiceButton /> : <EndTurnButton />)}
        {isOffering && <OfferTrade recipient = {tradingWith}/>}
        {isOffered && <OfferedTrade tradeOffer={offeredTrade}/>}
        {isBuying && !passed && <BuyPrompt space={landedOn} />}
        {isPaying && <PayRentPrompt space={landedOn}/>}
        {isOwn && !passed && <YourOwnPrompt space={landedOn}/>}
        {isViewing && <OwnedProp space={viewing} />}
      </div>
    </div>
  )
}

export default PlayPage;