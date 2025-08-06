import React from 'react';
import {useMethodQuery} from '/imports/rpc/rpc-hooks'
import _ from "lodash";
import {cn} from '@/lib/utils'
import PlayerStreamerPool from '@/features/player-streamer-pool'
import {Tiers} from '/imports/core/domain/entities/players'
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;

export const textForTier = {
  master: "text-master",
  elite: "text-elite",
  rival: "text-rival",
  prospect: "text-prospect"
}

export const circleForTier = {
  master: "master-circle.png",
  elite: "elite-circle.png",
  rival: "rival-circle.png",
  prospect: "prospect-circle.png"
}

export const borderForRoster = {
  master: "border-master",
  elite: "border-elite",
  rival: "border-rival",
  prospect: "border-prospect"
}

export const bannerToUse = {
  master: "/Banner_Master.png",
  elite: "/banner_elite.png",
  rival: "/Banner_Rival.png",
  prospect: "/Banner_Prospect.png"
}

export const colorForRoster = {
  master: "bg-master",
  elite: "bg-elite",
  rival: "bg-rival",
  prospect: "bg-prospect"
}

export const opaqueBackgroundForTier = {
  master: "bg-[rgba(110,209,255,0.5)]",
  elite: "bg-[rgba(44,204,111,0.4)]",
  rival: "bg-[rgba(241,196,13,0.3)]",
  prospect: "bg-[rgba(224,101,100,0.5)]"
}

export const opaqueBackgroundPlayerPoolForTier = {
  master: "bg-[rgba(110,209,255,0.5)]",
  elite: "bg-[rgba(44,204,111,0.4)]",
  rival: "bg-[rgba(241,196,13,0.4)]",
  prospect: "bg-[rgba(224,101,100,0.5)]"
}

export const LogoPoolForTier = {
  master: "master-logo.png",
  elite: "elite-logo.png",
  rival: "rival-logo.png",
  prospect: "prospect-logo.png"
}

const StreamerPage = () => {
  const { isLoading: loading, data: draft } = useMethodQuery("draft.getDraft", {}, {
    refetchInterval: 1000
  });
  const { data: pickOrder } = useMethodQuery("draft.getPickOrder");


  if (loading) return <div>Loading...</div>;
  if (!draft) return <div>No draft data</div>;

  return <div className="h-screen relative">
    <div className="relative z-50 h-[380px] pt-[22px]">
      {/*<div className="background-image h-[220px] w-[220px] ml-[36px]" style={{backgroundImage: "url(/RSC_SSA.png)"}}/>*/}
      <div className="w-[220px] ml-[36px] mt-[40px] relative text-center">
        <img className="w-[180px] h-auto mx-auto" src={LogoPoolForTier[draft.currentTier]} alt="tier"/>

        {draft && <img className="absolute left-[32px] bottom-[22px] w-[156px]" src={bannerToUse[draft.currentTier]} alt="#"/>}
      </div>
    </div>

    <PicksThisRound currentTier={draft.currentTier} currentRound={draft.round}/>

    <div className="absolute top-[212px] left-[330px] z-50 flex items-start gap-6">
      <div className="w-[220px]" style={{marginTop: -94, marginLeft: -10, transform: "rotate(-17deg) scale(1.9)"}}>
        {/*<img src="/crown.png" alt="crown"/>*/}
      </div>

      <div className="flex gap-5 items-center">
        <div className="bg-center bg-cover bg-no-repeat h-[135px] w-[270px]" style={{backgroundImage: `url(/round-pick-bg.svg)`}}>
          <div className="flex flex-col items-center justify-start pt-1 text-white">
            <div className="text-4xl leading-none font-bold">ROUND {draft.round}</div>

            <div className="text-2xl leading-none font-bold">PICK {draft.currentPick}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      className={cn("absolute top-[210px] left-[400px] w-[850px] h-[680px] bg-[rgba(0,0,0,0.65)] border-2", borderForRoster[draft.currentTier])}
      style={{clipPath: "polygon(0 10%, 10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%)"}}>

      <div className="grid grid-cols-3 gap-6 pt-[120px] pb-[100px] px-[40px]">
        <div className="text-white text-center col-span-2 pt-[30px] w-[400px] mx-auto">
          <div className="text-4xl uppercase font-bold">
            <ActiveFranchiseName/>
          </div>

          <div className={"flex flex-col text-4xl uppercase font-bold"}>
            <div className="text-2xl my-2">Select</div>

            <div className="text-[40px]">
              {draft.selectedPlayer ?
                <SelectedPlayerCard keeperPick={draft.selectedPlayerIsKeeperPick} />
                : <span className="text-[#da151e]">...</span>
              }
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-[40px]">
          <div
            className={cn("bg-no-repeat bg-cover bg-center grow shrink-0 h-[520px] w-[270px]")} style={{ backgroundImage: `url(/RosterBackground.svg)` }}>
            {(draft && pickOrder) && <RosterPicks
              tier={draft.currentTier}
              franchiseName={pickOrder.order[draft.currentTier][draft.currentPick - 1]}
            />}
          </div>
        </div>

        <div className="relative">
          <div className="pt-[50px] text-center">
            {/*{draft*/}
            {/*  ? <img className="absolute w-[160px] top-[193px] left-[40px] h-auto mx-auto mb-4" src={bannerToUse[draft.currentTier]} alt="tier"/>*/}
            {/*  : <img className="absolute w-[160px] top-[193px] left-[40px] h-auto mx-auto mb-4" src={bannerToUse["master"]} alt="tier"/>*/}
            {/*}*/}

            {/*<img className="w-[180px] h-auto mx-auto" src={LogoPoolForTier[draft.currentTier]} alt="tier"/>*/}
          </div>
        </div>
      </div>
    </div>

    <div className="absolute bottom-[98px] left-[490px]">
      {pickOrder && <NextFranchisesPicking/>}
    </div>

    <div className="fixed bottom-0 left-0 right-0 text-[#56b2bf]">
      <div className={cn("absolute left-0 bottom-0 top-0 h-[55px] w-[229px] font-bold text-4xl z-50 bg-center bg-no-repeat bg-contain uppercase inline-flex justify-center items-center text-white")} style={{ backgroundImage: `url(/pool/Pool2.png)` }}>

      </div>
      {draft && <PlayerStreamerPool tier={draft.currentTier}/>}
    </div>
  </div>
};

export default StreamerPage;

const classes = "border-white/20 rounded-lg bg-white/[0.13] p-2";

const SelectedPlayerCard = ({ keeperPick = false }: { keeperPick: boolean }) => {
  const { data: playerStats } = useMethodQuery("draft.getSelectedPlayerStats", {}, {
    refetchInterval: 1000
  });

  if (!playerStats) return null;

  const noPreviousStats = playerStats.gamesPlayed === 0;

  return <>
    <div>
      <div className="text-[#da151e] max-w-[480px] truncate">{playerStats.name}</div>

      <div className="text-xl font-semibold">{playerStats.cmv} CMV</div>

      <div className="text-2xl my-2">
        <span>{keeperPick ? "KEEPER PICK" : ""}</span>
      </div>

      <div className="bg-white/20 p-1.5 text-white text-xl">
        PREVIOUS STATS
      </div>
    </div>

    {noPreviousStats && <div className="flex justify-center items-center h-[250px] text-white text-2xl">
      NO PREVIOUS STATS
    </div>}
    {!noPreviousStats && <div className="relative mt-4 border-white">
      <div>
        <div className="grid grid-cols-2 gap-2 uppercase text-lg">
          <div className={cn(classes, "flex gap-2 pl-4 items-center")}>
            <img className="w-8 h-auto text-white" src="/icons/goal.svg" alt=""/> {playerStats.goals} Goals
          </div>

          <div className={cn(classes, "flex gap-2 pl-4 items-center")}>
            <img className="w-8 h-auto" src="/icons/assist.svg" alt=""/> {playerStats.assists} Assists
          </div>

          <div className={cn(classes, "flex gap-2 pl-4 items-center")}>
            <img className="w-8 h-auto" src="/icons/demo.svg" alt=""/> {playerStats.demosInflicted} Demos
          </div>

          <div className={cn(classes, "flex gap-2 pl-4 items-center")}>
            <img className="w-8 h-auto" src="/icons/savior.svg" alt=""/> {playerStats.saves} Saves
          </div>

          <div className={cn(classes, "flex gap-2 pl-4 items-center")}>
            <img className="w-8 h-auto" src="/icons/mvp.svg"
                 alt=""/> {((playerStats?.winPercentage || 0)).toFixed(2)} W%
          </div>

          <div className={cn(classes, "flex gap-2 pl-4 items-center")}>
            <img className="w-8 h-auto" src="/icons/game.svg" alt=""/> {playerStats.gamesPlayed} Games
          </div>
        </div>
      </div>
    </div>}
  </>
}

const RosterPicks = ({franchiseName, tier}: { franchiseName: string, tier: Tiers }) => {
  const {data, isLoading} = useMethodQuery("draft.findPlayersByFranchiseAndTier", {
    franchiseName,
    tier
  }, {enabled: !!franchiseName && !!tier, refetchInterval: 1000});

  if (isLoading) {
    return null;
  }

  if (!data) return null;

  const franchiseLogo = data.franchise?.logo || "";

  return <div className="flex flex-col gap-0.5">
    <div className="flex justify-center pt-4">
      <img className={cn("max-w-[80px] max-h-[80px]", data.franchise?.slug === "wrg" && "max-h-[60px]")} src={`/logos/${franchiseLogo}`} alt=""/>
    </div>

    <div className="text-center text-2xl uppercase text-white">
      {data.franchise?.name}
    </div>

    <div className="text-center text-4xl uppercase font-bold" style={{ color: data.franchise?.hexcode || "#ffffff" }}>
      ROSTER
    </div>

    {_.map(data.players, (player, index) => {
      return <span className="text-white font-bold text-xl pl-2 truncate">
        {index + 1}. {player.name}
      </span>
    })}
  </div>
}

const PicksThisRound = ({currentTier, currentRound}: { currentTier: Tiers, currentRound: number }) => {
  const { data: players } = useMethodQuery("draft.getCurrentRoundPicks", {}, {
    refetchInterval: 1000
  })

  return <div className={cn("px-4 py-8 border-t-2 border-b-2 border-r-2 rounded-r-[10px] w-[300px] h-[680px] absolute left-0 top-[210px]", borderForRoster[currentTier], opaqueBackgroundForTier[currentTier])}>
    <div className="flex flex-col">
      <p className="text-3xl text-white text-center font-bold mb-8 uppercase">
        Round {currentRound}
      </p>

      {_.map(players, (player) => {
        return <div key={player._id} className="text-white text-3xl flex gap-2 items-center mb-2">
          <div className="w-12 text-center shrink-0">
            <img className={cn((player.franchiseLogo === "Omnius Gaming.png" || player.franchiseLogo === "White Rabbit Gaming.png") && "w-8 mx-auto", player.franchiseLogo === "oxgaming.png" && "w-14 mx-auto")} src={`/logos/${player.franchiseLogo}`} alt=""/>
          </div>
          <span className="truncate text-2xl">{player.name}</span>
        </div>
      })}
    </div>
  </div>
}

const ActiveFranchiseLogo = () => {
  const { data: currentFranchise } = useMethodQuery("draft.getNextFranchisesPicking", {}, {
    refetchInterval: 1000
  });

  const franchise = currentFranchise?.[0];

  if (franchise) {
    return <img className="w-[130px] h-auto" src={"/logos/" + franchise.logo} alt="logo"/>
  }

  return <img className="w-[120px] h-auto" src={"/logos/bro.png"} alt="logo"/>
}

const ActiveFranchiseName = () => {
  const {data: currentFranchise} = useMethodQuery("draft.getNextFranchisesPicking", {}, {
    refetchInterval: 1000
  });

  const franchise = currentFranchise?.[0];

  if (franchise) {
    return <span>{franchise.name}</span>
  }

  return <span>BRO</span>
}

const NextFranchisesPicking = () => {
  const { data: nextFranchises } = useMethodQuery("draft.getPreviousCurrentAndNextFranchise", {}, {
    refetchInterval: 1000
  })

  const franchiseListClasses = "bg-center bg-contain bg-no-repeat flex items-center justify-center h-[150px] aspect-square";

  if (!nextFranchises) return null;

  const previousFranchiseIsWRG = nextFranchises?.previousFranchise?.slug === "wrg" || nextFranchises?.previousFranchise?.slug === "omnius";
  const currentFranchiseIsWRG = nextFranchises?.currentFranchise?.slug === "wrg" || nextFranchises?.currentFranchise?.slug === "omnius";
  const nextFranchiseIsWRG = nextFranchises?.nextFranchise?.slug === "wrg" || nextFranchises?.nextFranchise?.slug === "omnius";

  return <div className="flex gap-4 justify-center items-end">
    {nextFranchises.previousFranchise ?
      <div>
        <div className="text-center text-xl text-white uppercase mb-1">
          Previous
        </div>
        <div className={cn(franchiseListClasses, "grayscale h-[110px]")}
             style={{backgroundImage: "url(/Stats-Hex.svg)"}}>
          {!previousFranchiseIsWRG && <img className="w-[100px] h-auto" src={"/logos/" + nextFranchises.previousFranchise.logo} alt="logo"/>}
          {previousFranchiseIsWRG  && <img className="w-[60px] h-auto" src={"/logos/" + nextFranchises.previousFranchise.logo} alt="logo"/>}
        </div>
      </div>
      :
      <div>
        <div className="text-center text-xl text-white uppercase mb-1">
          Previous
        </div>
        <div className={cn(franchiseListClasses, "grayscale h-[110px]")}
             style={{backgroundImage: "url(/Stats-Hex.svg)"}}>
          <div className="w-[100px]"></div>
        </div>
      </div>
    }

    {nextFranchises.currentFranchise ?
      <div>
        <div className="text-center text-xl text-white uppercase mb-1">
          Current
        </div>
        <div className={cn(franchiseListClasses)}
             style={{backgroundImage: "url(/Stats-Hex.svg)"}}>
          {!currentFranchiseIsWRG && <img className="w-[90px] mr-[5px] h-auto" src={"/logos/" + nextFranchises.currentFranchise.logo} alt="logo"/>}
          {currentFranchiseIsWRG && <img className="w-[50px] mr-[5px] h-auto" src={"/logos/" + nextFranchises.currentFranchise.logo} alt="logo"/>}
        </div>
      </div>
      :
      <div>
        <div className="text-center text-xl text-white uppercase mb-1">
          Current
        </div>
        <div className={cn(franchiseListClasses, "grayscale")}
             style={{backgroundImage: "url(/Stats-Hex.svg)"}}>
          <div className="w-[100px]"></div>
        </div>
      </div>
    }

    {nextFranchises.nextFranchise ?
      <div>
        <div className="text-center text-xl text-white uppercase mb-1">
          Next
        </div>
        <div className={cn(franchiseListClasses, "grayscale h-[110px]")}
             style={{backgroundImage: "url(/Stats-Hex.svg)"}}>
          {!nextFranchiseIsWRG && <img className="w-[100px] h-auto" src={"/logos/" + nextFranchises.nextFranchise.logo} alt="logo"/>}
          {nextFranchiseIsWRG && <img className="w-[60px] h-auto" src={"/logos/" + nextFranchises.nextFranchise.logo} alt="logo"/>}
        </div>
      </div>
      :
      <div>
        <div className="text-center text-xl text-white uppercase mb-1">
          Next
        </div>
        <div className={cn(franchiseListClasses, "grayscale h-[110px]")}
             style={{backgroundImage: "url(/Stats-Hex.svg)"}}>
          <div className="w-[100px]"></div>
        </div>
      </div>
    }
  </div>
}
