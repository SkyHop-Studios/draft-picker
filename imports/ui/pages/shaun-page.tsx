import React from 'react';
import {ContentPane, ContentPaneTitle} from '@/components/content-pane'
import {Button} from '@/components/button'
import {useMethodMutation, useMethodQuery} from '/imports/rpc/rpc-hooks'
import {PlayerUploaderFrom} from '@/features/player-uploader-from'
import {Check, X} from 'lucide-react'
import {useQueryClient} from 'react-query'
import {PlayerSelectorForm} from '@/features/player-selector-form'
import {CreatePickOrderDialog} from '@/features/create-pick-order-dialog'
import _ from 'lodash'
import {CreateTradeDialog} from '@/features/create-trade-dialog'
import {PickOrderFrom} from '@/features/pick-order-uploader-from'
import {PlayerStatsUploaderForm} from "@/features/player-stats-data-uploader";
import {KeeperUploaderFrom} from "@/features/keeper-picks-uploader";

const ShaunPage = () => {
  const { data: draftProgress, refetch } = useMethodQuery("draft.getDraft");
  const { data: pickOrder } = useMethodQuery("draft.getPickOrder");
  const { data: franchises } = useMethodQuery("draft.getFranchises");

  const queryClient = useQueryClient();
  const updateTierMutation = useMethodMutation("draft.updateCurrentTier", {
    onSuccess: () => {
      queryClient.invalidateQueries(["draft.getDraft", "draft.progress"]);
      void queryClient.invalidateQueries();
      refetch();
    }
  });

  const clearSelectedPlayerMutation = useMethodMutation("draft.advancePick", {
    onSuccess: () => {
      refetch();
      void queryClient.invalidateQueries();
    }
  });

  const masterPickOrderComplete = !!(pickOrder && pickOrder.order.master.length > 0);
  const elitePickOrderComplete = !!(pickOrder && pickOrder.order.elite.length > 0);
  const rivalPickOrderComplete = !!(pickOrder && pickOrder.order.rival.length > 0);
  const prospectPickOrderComplete = !!(pickOrder && pickOrder.order.prospect.length > 0);

  const canCreatePickOrder = (!masterPickOrderComplete || !elitePickOrderComplete || !rivalPickOrderComplete || !prospectPickOrderComplete);

  return <div className="px-6 py-6 background-image h-screen overflow-scroll no-scrollbar" style={{ backgroundImage: "url(/RSC-SSA-1920x1080.jpg)" }}>
    <div className="mb-6 text-white">
      <h1 className="text-4xl font-bold">Welcome Draft Manager</h1>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <ContentPane>
        <ContentPaneTitle>Uploads</ContentPaneTitle>

        <div className="grid grid-cols-2 gap-6">
          <div>
            Players

            <PlayerUploaderFrom/>
          </div>

          <div>
            Pick Order
            <PickOrderFrom/>
          </div>

          <div>
            Keeper Picks

            <KeeperUploaderFrom/>
          </div>

          <div>
            Player Stats

            <PlayerStatsUploaderForm/>
          </div>
        </div>
      </ContentPane>

      <ContentPane>
        <ContentPaneTitle>Tier Selector</ContentPaneTitle>
        <div className="mb-4 text-xl font-bold">
          !NB: This will reset the draft round and pick number! Only use it when you are ready to start a new tier pick!
        </div>
        <>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              {draftProgress?.currentTier === "master"
                ? <Check className="text-green-500"/>
                : <X className="text-red-500"/>
              }

              <Button
                className="grow"
                onClick={() => updateTierMutation.mutateAsync({tier: "master"})}
                variant="defaultMaster">
                MASTER
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              {draftProgress?.currentTier === "elite"
                ? <Check className="text-green-500"/>
                : <X className="text-red-500"/>
              }

              <Button
                className="grow"
                onClick={() => updateTierMutation.mutateAsync({tier: "elite"})}
                variant="defaultElite">
                ELITE
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              {draftProgress?.currentTier === "rival"
                ? <Check className="text-green-500"/>
                : <X className="text-red-500"/>
              }

              <Button
                className="grow"
                onClick={() => updateTierMutation.mutateAsync({tier: "rival"})}
                variant="defaultRival">
                RIVAL
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              {draftProgress?.currentTier === "prospect"
                ? <Check className="text-green-500"/>
                : <X className="text-red-500"/>
              }

              <Button
                className="grow"
                onClick={() => updateTierMutation.mutateAsync({tier: "prospect"})}
                variant="defaultProspect">
                PROSPECT
              </Button>
            </div>
          </div>
        </>
      </ContentPane>

      <ContentPane className="col-span-2">
        <ContentPaneTitle>Player Selector</ContentPaneTitle>

        <div className="grid grid-cols-2 gap-6">
          <PlayerSelectorForm />

          <div>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div>
                  Master Complete: {masterPickOrderComplete ? <Check className="text-green-500"/> : <X className="text-red-500"/>}
                </div>
                <div>
                  Elite Complete: {elitePickOrderComplete ? <Check className="text-green-500"/> : <X className="text-red-500"/>}
                </div>
                <div>
                  Rival Complete: {rivalPickOrderComplete ? <Check className="text-green-500"/> : <X className="text-red-500"/>}
                </div>
                <div>
                  Prospect Complete: {prospectPickOrderComplete ? <Check className="text-green-500"/> : <X className="text-red-500"/>}
                </div>
              </div>

              {canCreatePickOrder && <div>
                <CreatePickOrderDialog/>
              </div>}
            </div>

            <div>
              <div>
                Current Pick: {draftProgress?.currentPick}
              </div>
              <div>
                Current Tier: <span className="capitalize">{draftProgress?.currentTier}</span>
              </div>
              <div>
                Current Franchise Picking: {(pickOrder && draftProgress && franchises) && _.find(franchises, ({ slug }) => slug === pickOrder.order[draftProgress.currentTier][draftProgress.currentPick-1])?.name}
              </div>
              <div>
                Current Player being Picked: {draftProgress?.selectedPlayer}
              </div>
            </div>

            <div className="flex justify-end">
              <Button disabled={draftProgress && draftProgress.selectedPlayer === ""} onClick={() => clearSelectedPlayerMutation.mutateAsync({})}>
                Next Pick
              </Button>
            </div>
          </div>

        </div>

      </ContentPane>

      <ContentPane className="col-span-2">
        <ContentPaneTitle>
          <span>Trades</span>

          <CreateTradeDialog />
        </ContentPaneTitle>

        {/*<div className="flex flex-col gap-4">*/}
        {/*  {_.map(trades, (trade) => {*/}
        {/*    return <div>*/}
        {/*      <div className="flex justify-between items-center">*/}
        {/*        <div>*/}
        {/*          {trade.franchiseOne} trades*/}
        {/*          <div>*/}
        {/*            {_.map(trade.picksOfferedFranchiseOne, (pick) => {*/}
        {/*              return <div>*/}
        {/*                Tier: {pick.tier} round: {pick.round} pick: {pick.pick}*/}
        {/*              </div>*/}
        {/*            })}*/}
        {/*          </div>*/}
        {/*        </div>*/}

        {/*        TO*/}

        {/*        <div>*/}
        {/*          {trade.franchiseTwo}*/}
        {/*          <div>*/}
        {/*            {_.map(trade.picksOfferedFranchiseTwo, (pick) => {*/}
        {/*              return <div>*/}
        {/*                Tier: {pick.tier} round: {pick.round} pick: {pick.pick}*/}
        {/*              </div>*/}
        {/*            })}*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  })}*/}
        {/*</div>*/}
      </ContentPane>
    </div>
  </div>
};

export default ShaunPage;
