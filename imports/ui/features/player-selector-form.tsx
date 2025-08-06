import React from 'react';
import {useMethodMutation, useMethodQuery} from '/imports/rpc/rpc-hooks'
import {Tiers} from '/imports/core/domain/entities/players'
import {Button} from '@/components/button'
import {ScrollArea} from '@/components/scroll-area'
import {useQueryClient} from 'react-query'
import {ActiveKeeperPicksForRound} from "@/features/keeper-picks-for-round";

export const PlayerSelectorForm = () => {
  const [search, setSearch] = React.useState("");
  const [selectedPlayer, setSelectedPlayer] = React.useState("");
  const [selectedPlayerId, setSelectedPlayerId] = React.useState("");
  const [tier, setTier] = React.useState<Tiers>("master");

  const { data: players } = useMethodQuery("draft.findPlayersByNameAndTier", { search, tier });
  const { data: pickOrder } = useMethodQuery("draft.getPickOrder");
  const { data: draft } = useMethodQuery("draft.getDraft");

  const queryClient = useQueryClient();
  const toggleKeeperPickMutation = useMethodMutation("draft.toggleCurrentPlayerAsKeeperPick", {
    onSuccess: () => {
      void queryClient.invalidateQueries();
    }
  })

  const submitPlayerSelectionMutation = useMethodMutation("draft.updateSelectedPlayer", {
    onSuccess: () => {
      void queryClient.resetQueries();
      setSelectedPlayer("");
      setSelectedPlayerId("");
    }
  });

  return <div>
    <div>
      Currently Browsing: <span className={`capitalize`}>{tier}</span>
    </div>

    <div>
      <ActiveKeeperPicksForRound />
    </div>

    <div className="flex gap-2">
      <ScrollArea className="h-[250px] w-[320px] pr-4">
        {players?.map(player => <div className="flex justify-between items-center mb-2" key={player._id}>
          {player.name}

          <div>
            <Button variant="defaultElite" onClick={() => {
              setSelectedPlayer(player.name);
              setSelectedPlayerId(player._id)
            }}>Add</Button>
          </div>
        </div>)}
      </ScrollArea>

      <div>
        <div className="flex gap-2 mb-5">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}/>
          <div className="flex gap-2">
            <Button
              onClick={() => setTier("master")}
              variant="defaultMaster">
              MASTER
            </Button>

            <Button
              onClick={() => setTier("elite")}
              variant="defaultElite">
              ELITE
            </Button>

            <Button
              onClick={() => setTier("rival")}
              variant="defaultRival">
              RIVAL
            </Button>

            <Button
              onClick={() => setTier("prospect")}
              variant="defaultProspect">
              PROSPECT
            </Button>
          </div>
        </div>

        <div>
          <div>
            Currently selected: {selectedPlayer === "" ? "none" : selectedPlayer}
          </div>
          <div>
            Is this a keeper pick: {draft && draft.selectedPlayerIsKeeperPick ? "Yes" : "No"}
          </div>

          <div className="flex justify-end gap-2 mb-4">
            <Button onClick={() => toggleKeeperPickMutation.mutate({})}>Mark as Keeper Pick</Button>
          </div>

          <div className="flex justify-between">
            <Button variant="destructive" onClick={() => {
              setSelectedPlayer("");
              setSelectedPlayerId("");
            }}>
              Clear Selection
            </Button>

            <Button
              disabled={selectedPlayerId === "" || ((pickOrder && draft) && !pickOrder.order[draft.currentTier].length)}
              onClick={() => submitPlayerSelectionMutation.mutateAsync({playerId: selectedPlayerId})}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>

  </div>
};
