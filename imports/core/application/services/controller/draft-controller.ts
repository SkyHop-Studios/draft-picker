import {LocateFunction} from '/imports/core/di/registry';
import {DraftProgressDocument} from '/imports/core/domain/entities/draft-progress';
import {IDraftProgressRepository} from '/imports/core/repository/draft-progress';
import {FranchisesDocument, FranchiseSlugs} from '/imports/core/domain/entities/franchises';
import {IFranchisesRepository} from '/imports/core/repository/franchises';
import {IPickOrderRepository} from '/imports/core/repository/pick-order';
import {IPlayersRepository} from '/imports/core/repository/players';
import {PickOrderDocument, PlayersWithPick} from '/imports/core/domain/entities/pick-order';
import {PlayersDocument, Tiers} from '/imports/core/domain/entities/players';
import {Mongo} from 'meteor/mongo';
import {ITradesRepository} from '/imports/core/repository/trades'
import {TradePicks, TradesDocument} from '/imports/core/domain/entities/trades'
import {IPlayerstatsRepository} from "/imports/core/repository/playerStats";
import {NewDocument} from "/imports/core/repository/base-repository";
import {PlayerstatsDocument} from "/imports/core/domain/entities/playerStats";
import {KeeperpicksDocument} from "/imports/core/domain/entities/keeperPicks";
import {IKeeperpicksRepository} from "/imports/core/repository/keeperPicks";

type KeeperPicksWithCurrentlyChoosing = KeeperpicksDocument & {
  currentlyChoosing: boolean;
  hasPassed: boolean;
}

type PlayersWithStats = PlayersDocument & {
  goals?: number;
  assists?: number;
  saves?: number;
  demosInflicted?: number;
  winPercentage?: number;
  mvps?: number;
}

type PlayersDocumentWithFranchiseInformation = {
  players: PlayersWithStats[]
  franchise: FranchisesDocument | null;
}

export type IDraftControllerService = {
  getDraftProgress: () => DraftProgressDocument;
  getFranchises: () => FranchisesDocument[];
  getPickOrder: () => PickOrderDocument;
  getPlayers: () => PlayersDocument[];
  getTrades: () => TradesDocument[];
  findPlayersByNameAndTier: ({ search, tier }: { search?: string, tier: Tiers }) => PlayersDocument[];
  findPlayersByFranchiseAndTier: ({ franchiseName, tier }: { franchiseName: string, tier: Tiers }) => PlayersDocumentWithFranchiseInformation;
  getCurrentRoundPicks: () => PlayersWithPick[];
  getKeeperPicks: () => KeeperpicksDocument[];
  getCurrentKeeperPicks: () => KeeperPicksWithCurrentlyChoosing[];

  toggleCurrentPlayerAsKeeperPick: () => void;

  getNextFranchisesPicking: () => FranchisesDocument[];
  getPreviousCurrentAndNextFranchise: () => {
    previousFranchise: FranchisesDocument | undefined;
    currentFranchise: FranchisesDocument;
    nextFranchise: FranchisesDocument | undefined;
  };

  updatePlayersCMV: (playerData: { name: string; CMV: number; playerId: string; tier: Tiers }[]) => void;
  updatePlayerStats: (playerData: NewDocument<PlayerstatsDocument>[]) => void;
  uploadKeepers: (keeperData: NewDocument<KeeperpicksDocument>[]) => void;

  defineDraftOrder: (draftData: DraftSeedDataInput) => void;

  updateCurrentTier: (tier: Tiers) => void;
  updateSelectedPlayer: (playerId: string) => void;

  logTrade: (tradeInput: TradeInput) => string;

  advancePick: () => void;
  createPickOrderForTierWithFranchiseOrder: (tier: Tiers, franchiseOrder: string[]) => void;
};

type DraftSeedDataInput = {
  master: FranchiseSlugs[]
  elite: FranchiseSlugs[]
  rival: FranchiseSlugs[]
  prospect: FranchiseSlugs[]
}

type TradeInput = {
  franchiseOne: string
  franchiseTwo: string

  picksOfferedFranchiseOne: TradePicks[]
  picksOfferedFranchiseTwo: TradePicks[]
}

type Dependencies = {
  draftProgressRepository: IDraftProgressRepository;
  franchisesRepository: IFranchisesRepository;
  pickOrderRepository: IPickOrderRepository;
  playersRepository: IPlayersRepository;
  tradesRepository: ITradesRepository;
  playerStatsRepository: IPlayerstatsRepository
  keeperPicksRepository: IKeeperpicksRepository
};

export function createDraftControllerService(
  {
    draftProgressRepository,
    franchisesRepository,
    pickOrderRepository,
    playersRepository,
    tradesRepository,
    playerStatsRepository,
    keeperPicksRepository
  }: Dependencies): IDraftControllerService {

  // Sanitize the player name by replacing dots with underscores
  const sanitizePlayerName = (name: string): string => {
    if (name.includes('.')) {
      console.warn(`Player name "${name}" contains a dot. Replacing dots with underscores.`);
      return name.replace(/\./g, '_');
    }
    return name;
  };

  const buildPickOrder = (iterations: number, franchiseOrder: string[]) => {
    const pickOrder = [];
    let reverse = false;

    for (let i = 0; i < iterations; i++) {
      const currentFranchiseOrder = reverse ? franchiseOrder.slice().reverse() : franchiseOrder;
      const franchise = currentFranchiseOrder[i % 10];
      pickOrder.push(franchise);


      if (i % 10 === 9) {
        reverse = !reverse;
      }
    }

    return pickOrder;
  }

  return {
    getDraftProgress: () => draftProgressRepository.getByIdOrThrow('draft'),
    getPickOrder: () => pickOrderRepository.getByIdOrThrow('pick_order'),
    getPlayers: () => playersRepository._list({}).results,
    getFranchises: () => franchisesRepository._list({}).results,

    getTrades: () => tradesRepository._list({}).results,

    getKeeperPicks: () => {
      return keeperPicksRepository._list({}).results;
    },

    getCurrentKeeperPicks: () => {
      const keeperPicks = keeperPicksRepository._list({}).results;
      const draftProgress = draftProgressRepository.getByIdOrThrow('draft');
      const pickOrder = pickOrderRepository.getByIdOrThrow('pick_order');
      const currentTier = draftProgress.currentTier;
      const currentRound = draftProgress.round;
      const currentFranchise = pickOrder.order[currentTier][draftProgress.currentPick - 1];
      const currentRoundKeeperPicks = keeperPicks.filter(keeper => keeper.tier === currentTier && keeper.pickRound === currentRound);

      return currentRoundKeeperPicks.map((pick) => {
        const currentPickOrder = pickOrderRepository.getByIdOrThrow('pick_order')
        const hasPassed = currentPickOrder.chosenPlayers[currentTier].some(chosen => chosen.statPlayerId === pick.playerId);
        return ({
          ...pick,
          currentlyChoosing: pick.franchise === currentFranchise,
          hasPassed
        })
      })
    },

    toggleCurrentPlayerAsKeeperPick: () => {
      draftProgressRepository.set('draft', { selectedPlayerIsKeeperPick: !draftProgressRepository.getByIdOrThrow('draft').selectedPlayerIsKeeperPick });
    },

    logTrade: (tradeInput) => {
      const { franchiseOne, franchiseTwo, picksOfferedFranchiseOne, picksOfferedFranchiseTwo } = tradeInput;

      // Fetch the current pick orders
      const pickOrder = pickOrderRepository.getByIdOrThrow('pick_order');

      // Helper function to swap picks between franchises
      const swapPicks = (picksOffered: TradePicks[], _fromFranchise: string, toFranchise: string) => {
        picksOffered.forEach(pick => {
          const { tier, round, pick: pickNumber } = pick;

          // Franchise Pick Order for Tier
          const franchiseList = pickOrder.order[tier];

          // Find the index of the pick in the order list for that round
          const indexOfPick = (round - 1) * 10 + pickNumber - 1;

          if (indexOfPick !== -1) {
            // Replace the franchise with the other franchise
            franchiseList[indexOfPick] = toFranchise;
            pickOrderRepository.set("pick_order", {
              order: {
                ...pickOrder.order,
                [tier]: franchiseList
              }
            });
          }
        });
      };

      // Swap picks offered by franchiseOne and franchiseTwo
      swapPicks(picksOfferedFranchiseOne, franchiseOne, franchiseTwo);
      swapPicks(picksOfferedFranchiseTwo, franchiseTwo, franchiseOne);

      // Save the updated pick order
      pickOrderRepository.set("pick_order", pickOrder);

      // Create a transaction record for the trade
      const tradeTransaction = {
        createdAt: new Date(),
        updatedAt: new Date(),
        franchiseOne: tradeInput.franchiseOne,
        franchiseTwo: tradeInput.franchiseTwo,
        picksOfferedFranchiseOne: tradeInput.picksOfferedFranchiseOne,
        picksOfferedFranchiseTwo: tradeInput.picksOfferedFranchiseTwo
      };

      return tradesRepository.create(tradeTransaction);
    },

    getNextFranchisesPicking: () => {
      const pickOrder = pickOrderRepository.getByIdOrThrow('pick_order');
      const draftProgress = draftProgressRepository.getByIdOrThrow('draft');
      const currentTier = draftProgress.currentTier;
      const currentPick = draftProgress.currentPick-1;
      const franchiseOrder = pickOrder.order[currentTier];
      const nextFranchises = franchiseOrder.slice(currentPick, currentPick + 10);
      const franchises = franchisesRepository._list({ slug: { $in: nextFranchises } }).results;

      // Sort the franchises based on the order in nextFranchises
      const sortedFranchises = nextFranchises.map(name =>
        franchises.find(franchise => franchise.slug === name)
      ) as FranchisesDocument[];

      return sortedFranchises;
    },

    getPreviousCurrentAndNextFranchise: () => {
      const pickOrder = pickOrderRepository.getByIdOrThrow('pick_order');
      const draftProgress = draftProgressRepository.getByIdOrThrow('draft');
      const currentTier = draftProgress.currentTier;
      const currentPick = draftProgress.currentPick-1;
      const franchiseOrder = pickOrder.order[currentTier];
      let previousFranchiseSlug;
      let currentFranchiseSlug;
      let nextFranchiseSlug;

      if (currentPick !== 0) {
        previousFranchiseSlug = franchiseOrder[currentPick - 1];
      }

      if (currentPick !== franchiseOrder.length) {
        nextFranchiseSlug = franchiseOrder[currentPick + 1];
      }

      currentFranchiseSlug = franchiseOrder[currentPick];

      const previousFranchiseDoc = franchisesRepository.findOne({ slug: previousFranchiseSlug });
      const currentFranchiseDoc = franchisesRepository.findOne({ slug: currentFranchiseSlug });
      const nextFranchiseDoc = franchisesRepository.findOne({ slug: nextFranchiseSlug });

      return {
        previousFranchise: previousFranchiseSlug ? previousFranchiseDoc: undefined,
        currentFranchise: currentFranchiseDoc,
        nextFranchise: nextFranchiseSlug ? nextFranchiseDoc: undefined
      }
    },

    findPlayersByNameAndTier: ({ search, tier = "master" }) => {
      const selector: Mongo.Selector<PlayersDocument> = { tier };

      if (search) {
        selector.name = { $regex: search, $options: "i" };
      }

      // Also make sure the player doesn't have a franchiseId set

      selector.franchiseId = { $exists: false };

      return playersRepository._list(selector).results;
    },

    getCurrentRoundPicks: () => {
      const draft = draftProgressRepository.findOne({});
      if (!draft) {
        throw new Error("Draft progress not found.");
      }

      const pickOrder = pickOrderRepository.findOne({});
      if (!pickOrder) {
        throw new Error("Pick order not found.");
      }

      const currentRound = draft.round;
      const currentTier = draft.currentTier;
      const picks = pickOrder.chosenPlayers[currentTier];
      return picks.filter(pick => pick.roundChosen === currentRound);
    },

    findPlayersByFranchiseAndTier: ({ franchiseName, tier = "master" }) => {
      const selector: Mongo.Selector<PlayersDocument> = { tier };
      const franchise = franchisesRepository.findOne({ slug: franchiseName });

      if (!franchiseName || !franchise) {
        return {
          players: [],
          franchise: null
        };
      }

      selector.franchiseId = franchise._id;

      const players = playersRepository._list(selector).results;
      const playersWithPlayerStats = players.map(player => {
        const playerStats = playerStatsRepository.findAndSumAllPlayerStatsByPlayerId(player.statPlayerId || "");

        return {
          ...player,
          goals: playerStats?.goals,
          assists: playerStats?.assists,
          saves: playerStats?.saves,
          demosInflicted: playerStats?.demosInflicted,
          winPercentage: playerStats?.winPercentage,
          mvps: playerStats?.mvps,
        }}
      );

      return {
        players: playersWithPlayerStats,
        franchise
      };
    },

    createPickOrderForTierWithFranchiseOrder: (tier: Tiers, franchiseOrder: string[]) => {
      const pickOrderStatus = pickOrderRepository.getById('pick_order');
      if (!pickOrderStatus) {
        pickOrderRepository.createNewPickOrder();
      }
      const safePickOrderStatus = pickOrderRepository.getByIdOrThrow('pick_order');

      if (tier === "master") {
        const playersInTier = playersRepository._list({ tier: "master" }).count
        const pickOrder = buildPickOrder(playersInTier, franchiseOrder);

        pickOrderRepository.set("pick_order", {
          order: {
            ...safePickOrderStatus.order,
            master: pickOrder
          }
        })
      }

      if (tier === "elite") {
        const playersInTier = playersRepository._list({ tier: "elite" }).count
        const pickOrder = buildPickOrder(playersInTier, franchiseOrder);

        pickOrderRepository.set("pick_order", {
          order: {
            ...safePickOrderStatus.order,
            elite: pickOrder
          }
        })
      }

      if (tier === "rival") {
        const playersInTier = playersRepository._list({ tier: "rival" }).count
        const pickOrder = buildPickOrder(playersInTier, franchiseOrder);

        pickOrderRepository.set("pick_order", {
          order: {
            ...pickOrderStatus.order,
            rival: pickOrder
          }
        })
      }

      if (tier === "prospect") {
        const playersInTier = playersRepository._list({ tier: "prospect" }).count
        const pickOrder = buildPickOrder(playersInTier, franchiseOrder);

        pickOrderRepository.set("pick_order", {
          order: {
            ...pickOrderStatus.order,
            prospect: pickOrder
          }
        })
      }
    },

    updatePlayersCMV: (playerData) => {
      for (const player of playerData) {
        const sanitizedPlayerName = sanitizePlayerName(player.name);
        const playerExists = playersRepository.findOne({ safeName: sanitizedPlayerName });

        if (!playerExists) {
          playersRepository.create({
            name: player.name,
            safeName: sanitizedPlayerName,
            statPlayerId: player.playerId,
            cmv: player.CMV,
            tier: player.tier,
          });
        } else {
          playersRepository.set(playerExists._id, {
            cmv: player.CMV,
            statPlayerId: player.playerId,
            tier: player.tier,
          });
        }
      }
    },

    updatePlayerStats: (playerstats) => {
      for (const player of playerstats) {
        const statsDocExists = playerStatsRepository.findOne({ playerId: player.playerId, tier: player.tier, season: player.season, format: player.format });

        if (!statsDocExists) {
          playerStatsRepository.create({
            ...player
          });
        } else {
          playerStatsRepository.set(statsDocExists._id, {
            ...player
          });
        }
      }
    },

    uploadKeepers: (keeperData) => {
      for (const keeper of keeperData) {
        const keeperDocExists = keeperPicksRepository.findOne({ playerId: keeper.playerId, tier: keeper.tier });

        if (!keeperDocExists) {
          keeperPicksRepository.create({
            ...keeper
          });
        } else {
          keeperPicksRepository.set(keeperDocExists._id, {
            ...keeper
          });
        }
      }
    },

    defineDraftOrder: (draftData: DraftSeedDataInput) => {
      if (!pickOrderRepository.findOne({ _id: "pick_order" })) {
        pickOrderRepository.createNewPickOrder();
      } else {
        // If the pick order already exists, we overwrite it with the new draft data
        pickOrderRepository.set("pick_order", {
          order: {
            master: [],
            elite: [],
            rival: [],
            prospect: []
          },
          chosenPlayers: {
            master: [],
            elite: [],
            rival: [],
            prospect: []
          }
        });
      }

      for (const [tier, franchiseOrder] of Object.entries(draftData)) {
        const franchiseSlugOrder = franchiseOrder;

        if (!franchiseSlugOrder) {
          throw new Error(`Franchise order for tier "${tier}" not found.`);
        }

        // Why do we retrieve the order every time to overwrite it? Seems strange.
        pickOrderRepository.set("pick_order", {
          order: {
            ...pickOrderRepository.getByIdOrThrow('pick_order').order,
            [tier]: franchiseSlugOrder
          }
        });
      }
    },

    updateCurrentTier: (tier) => {
      draftProgressRepository.set('draft', { currentTier: tier });
      draftProgressRepository.set('draft', { selectedPlayer: "" });
      draftProgressRepository.set('draft', { selectedPlayerCMV: 0 });
      draftProgressRepository.set('draft', { currentPick: 1 });
      draftProgressRepository.set('draft', { round: 1 });
    },

    updateSelectedPlayer: (playerId) => {
      const player = playersRepository.getByIdOrThrow(playerId);
      draftProgressRepository.set('draft', { selectedPlayer: player.name });
      draftProgressRepository.set('draft', { selectedPlayerCMV: player.cmv });
    },

    advancePick: () => {
      const draftProgress = draftProgressRepository.getByIdOrThrow('draft');
      const player = playersRepository.findOne({ name: draftProgress.selectedPlayer });
      const franchiseName = pickOrderRepository.getByIdOrThrow('pick_order').order[draftProgress.currentTier][draftProgress.currentPick - 1];
      const franchise = franchisesRepository.findOne({ slug: franchiseName });
      const chosenPlayers = pickOrderRepository.getByIdOrThrow('pick_order').chosenPlayers;
      const currentTier = draftProgress.currentTier;

      if (!player || !franchise) {
        throw new Error(`Player "${draftProgress.selectedPlayer}" not found or franchise "${franchiseName}" not found.`);
      }

      pickOrderRepository.set('pick_order', {
        chosenPlayers: {
          ...chosenPlayers,
          [currentTier]: [
            ...chosenPlayers[currentTier],
            {
              ...player,
              franchiseId: franchise._id,
              franchiseLogo: franchise.logo,
              pickChosen: draftProgress.currentPick,
              roundChosen: draftProgress.round,
            }
          ]
        }
      });

      playersRepository.set(player._id, { franchiseId: franchise._id });
      draftProgressRepository.set('draft', { selectedPlayer: "" });
      draftProgressRepository.set('draft', { selectedPlayerIsKeeperPick: false });
      draftProgressRepository.set('draft', { currentPick: draftProgress.currentPick + 1 });
      // If the current pick is a multiple of 10, increment the round as all franchises have picked
      if (draftProgress.currentPick % 10 === 0) {
        draftProgressRepository.set('draft', { round: draftProgress.round + 1 });
      }
    }
  };
}

export function registerDraftControllerService(locate: LocateFunction): IDraftControllerService {
  return createDraftControllerService({
    draftProgressRepository: locate('repository/draft-progress'),
    franchisesRepository: locate('repository/franchises'),
    pickOrderRepository: locate('repository/pick-order'),
    playersRepository: locate('repository/players'),
    tradesRepository: locate('repository/trades'),
    playerStatsRepository: locate('repository/playerStats'),
    keeperPicksRepository: locate('repository/keeperPicks')
  });
}
