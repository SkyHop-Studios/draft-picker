import React, {useEffect, useState} from 'react';
import {useMethodQuery} from '/imports/rpc/rpc-hooks';
import {Tiers} from '/imports/core/domain/entities/players';
import _ from 'lodash';
import {cn} from '@/lib/utils'
import {borderForRoster, opaqueBackgroundPlayerPoolForTier} from '@/pages/streamer-page'

const BackgroundByTier = (tier: Tiers) => {
  switch (tier) {
    case "elite":
      return "/pool/Elite.png";
    case "rival":
      return "/pool/Rival.png";
    case "prospect":
      return "/pool/Prospect.png";
    case "master":
      return "/pool/Master.png";
    default:
      return "/pool/Elite.png";
  }
}

const PlayerStreamerPool = ({ tier }: { tier: Tiers }) => {
  const { isLoading, data: players } = useMethodQuery("draft.findPlayersByNameAndTier", { tier }, {
    refetchInterval: 1000,
  });

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [displayedPlayers, setDisplayedPlayers] = useState<string[]>([]);

  useEffect(() => {
    if (tier) {
      setDisplayedPlayers(_.map(players, "name"));
    }
  }, [tier]);

  useEffect(() => {
    if (players && displayedPlayers.length === 0) {
      // Update displayed players without causing a full re-render
      setDisplayedPlayers(_.map(players, "name"));
    }
  }, [isLoading]);

  useEffect(() => {
    const playersChosen = _.difference(displayedPlayers, _.map(players, "name"));
    setSelectedPlayers(playersChosen);
  }, [players]);

  return <div className={cn("text-white text-3xl py-2 bg-cover bg-no-repeat bg-center")} style={{ backgroundImage: `url(${BackgroundByTier(tier)})` }}>
    <div className="ticker">
      <div className="ticker__list">
        {/* Repeat the list twice to create the appearance of frequent repetition */}
        {[...displayedPlayers, ...displayedPlayers].map((player, index) => (
          <div key={index} className={cn("ticker__item", _.includes(selectedPlayers, player) && "opacity-50")}>
            {player}
          </div>
        ))}
      </div>
    </div>
  </div>
};

export default PlayerStreamerPool;

