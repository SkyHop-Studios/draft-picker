import {Meteor} from "meteor/meteor";
import {methodBuilder} from '/imports/rpc/method-builder'
import {container} from '/imports/core/di/registry'
import {Context} from '/imports/core/utils/context/create-context'
import {z} from 'zod'
import {Tiers} from '/imports/core/domain/entities/players'
import {FranchiseSlugs} from '/imports/core/domain/entities/franchises'

const controller = (context: Context) => container.locate("application/services/controller/root-controller", context);

export const PlayerStatsSchema = z.object({
  playerId: z.string(),
  format: z.enum(["Pre-Season", "League Play", "Play-Offs"]),
  teamId: z.string(),
  tier: z.enum(["Elite", "Rival", "Prospect", "Master"]),
  season: z.enum(["season1", "season2", "season3"]),
  minutesPlayed: z.number(),
  gamesPlayed: z.number(),
  gameWins: z.number(),
  gameLosses: z.number(),
  winPercentage: z.number(),
  goals: z.number(),
  assists: z.number(),
  saves: z.number(),
  shots: z.number(),
  goalsConceded: z.number(),
  goalsConcededWhileLastDefender: z.number(),
  cleanSheets: z.number(),
  shootingPercentage: z.number(),
  demosInflicted: z.number(),
  boostPerMinute: z.number(),
  averageBoostAmount: z.number(),
  boostCollected: z.number(),
  zeroBoostTime: z.number(),
  fullBoostTime: z.number(),
  overfillBoost: z.number(),
  averageSpeed: z.number(),
  totalDistance: z.number(),
  timeSlow: z.number(),
  timeSuperSonic: z.number(),
  timeGround: z.number(),
  timeLowAir: z.number(),
  timeHighAir: z.number(),
  timeMostBack: z.number(),
  timeMostForward: z.number(),
  timeDefensiveHalf: z.number(),
  timeOffensiveHalf: z.number(),
  mvps: z.number(),
  hattricks: z.number(),
  playmakers: z.number(),
  saviours: z.number(),
  goalParticipation: z.number(),
});

export const KeeperPicksSchema = z.object({
  name: z.string(),
  role: z.string(),
  playerId: z.string(),
  tier: z.custom<Tiers>(),
  franchise: z.custom<FranchiseSlugs>(),
  cmv: z.number(),
  pickRound: z.number(),
})

// Optional: Infer the TypeScript type
export type PlayerStatsDoc = z.infer<typeof PlayerStatsSchema>;


const methods = {
  "draft.getDraft": methodBuilder({
    run: (context) => controller(context).draft.getDraftProgress()
  }),

  "draft.getFranchises": methodBuilder({
    run: (context) => controller(context).draft.getFranchises()
  }),

  "draft.getPickOrder": methodBuilder({
    run: (context) => controller(context).draft.getPickOrder()
  }),

  "draft.getPlayers": methodBuilder({
    run: (context) => controller(context).draft.getPlayers()
  }),

  "players.updateCMVAndTier": methodBuilder({
    input: z.array(z.object({
      name: z.string(),
      CMV: z.number(),
      playerId: z.string(),
      tier: z.custom<Tiers>()
    })),
    run: (input, context) => {
      controller(context).draft.updatePlayersCMV(input);
    }
  }),

  "players.uploadStats": methodBuilder({
    input: z.array(PlayerStatsSchema),
    run: (input, context) => {
      controller(context).draft.updatePlayerStats(input);
    }
  }),

  "players.uploadKeepers": methodBuilder({
    input: z.array(KeeperPicksSchema),
    run: (input, context) => {
      controller(context).draft.uploadKeepers(input);
    }
  }),

  "draft.defineDraftOrder": methodBuilder({
    input: z.object({
      master: z.array(z.custom<FranchiseSlugs>()),
      elite: z.array(z.custom<FranchiseSlugs>()),
      rival: z.array(z.custom<FranchiseSlugs>()),
      prospect: z.array(z.custom<FranchiseSlugs>())
    }),
    run: (input, context) => {
      controller(context).draft.defineDraftOrder(input);
    }
  }),

  "draft.updateCurrentTier": methodBuilder({
    input: z.object({
      tier: z.custom<Tiers>()
    }),
    run: ({ tier }, context) => {
      controller(context).draft.updateCurrentTier(tier);
    }
  }),

  "draft.getTrades": methodBuilder({
    run: (context) => {
      return controller(context).draft.getTrades();
    }
  }),

  "draft.logTrade": methodBuilder({
    input: z.object({
      franchiseOne: z.string(),
      franchiseTwo: z.string(),
      picksOfferedFranchiseOne: z.array(z.object({
        round: z.number(),
        tier: z.custom<Tiers>(),
        pick: z.number()
      })),
      picksOfferedFranchiseTwo: z.array(z.object({
        round: z.number(),
        tier: z.custom<Tiers>(),
        pick: z.number()
      }))
    }),
    run: (input, context) => {
      controller(context).draft.logTrade(input);
    }
  }),

  "draft.findPlayersByNameAndTier": methodBuilder({
    input: z.object({
      search: z.string().optional(),
      tier: z.custom<Tiers>()
    }),
    run: (values, context) => {
      return controller(context).draft.findPlayersByNameAndTier(values);
    }
  }),

  "draft.findPlayersByFranchiseAndTier": methodBuilder({
    input: z.object({
      franchiseName: z.string(),
      tier: z.custom<Tiers>()
    }),
    run: (values, context) => {
      return controller(context).draft.findPlayersByFranchiseAndTier(values);
    }
  }),

  "draft.updateSelectedPlayer": methodBuilder({
    input: z.object({
      playerId: z.string()
    }),
    run: ({ playerId }, context) => {
      controller(context).draft.updateSelectedPlayer(playerId);
    }
  }),

  "draft.toggleCurrentPlayerAsKeeperPick": methodBuilder({
    run: (context) => {
      controller(context).draft.toggleCurrentPlayerAsKeeperPick();
    }
  }),

  "draft.advancePick": methodBuilder({
    run: (context) => {
      controller(context).draft.advancePick();
    }
  }),

  "draft.getCurrentRoundPicks": methodBuilder({
    run: (context) => {
      return controller(context).draft.getCurrentRoundPicks();
    }
  }),

  "draft.getKeeperPicks": methodBuilder({
    run: (context) => {
      return controller(context).draft.getKeeperPicks();
    }
  }),

  "draft.getCurrentKeeperPicks": methodBuilder({
    run: (context) => {
      return controller(context).draft.getCurrentKeeperPicks();
    }
  }),

  "draft.getNextFranchisesPicking": methodBuilder({
    run: (context) => {
      return controller(context).draft.getNextFranchisesPicking();
    }
  }),

  "draft.getPreviousCurrentAndNextFranchise": methodBuilder({
    run: (context) => {
      return controller(context).draft.getPreviousCurrentAndNextFranchise();
    }
  }),

  "draft.createPickOrder": methodBuilder({
    input: z.object({
      tier: z.custom<Tiers>(),
      franchiseOrder: z.array(z.string())
    }),
    run: ({ tier, franchiseOrder }, context) => {
      controller(context).draft.createPickOrderForTierWithFranchiseOrder(tier, franchiseOrder);
    }
  })
}

export type DraftMethods = typeof methods;

Meteor.methods(methods)
