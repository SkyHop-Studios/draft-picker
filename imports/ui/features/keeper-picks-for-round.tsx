import React from 'react';
import {useMethodQuery} from "/imports/rpc/rpc-hooks";
import {FranchiseNamesFromSlugs, FranchiseSlugs} from "/imports/core/domain/entities/franchises";
import {cn} from "@/lib/utils";

export const ActiveKeeperPicksForRound = () => {
  const { data: keepers } = useMethodQuery("draft.getCurrentKeeperPicks", {}, {
    refetchInterval: 1000,
  });

  console.log("Keeper Picks", keepers);

  return <div>
    Keeper Picks for Round:
    <div className="flex flex-col gap-2 p-4 border border-black mb-2">
      {keepers?.map(keeper => (
        <div key={keeper._id} className={cn("flex justify-between items-center relative", keeper.currentlyChoosing && "animate-pulse text-yellow-500 text-lg")}>
          {keeper.hasPassed && <div className="absolute left-4 right-4 top-0 bottom-0 flex items-center">
            <div className="w-full h-[2px] bg-black" />
          </div>}
          <span className="capitalize">{keeper.tier}</span>
          <span>{FranchiseNamesFromSlugs[keeper.franchise as FranchiseSlugs]}</span>
          <span>{keeper.cmv}</span>
          <span>{keeper.name}</span>
          <span>Round: {keeper.pickRound}</span>
        </div>
      ))}
    </div>
  </div>
}
