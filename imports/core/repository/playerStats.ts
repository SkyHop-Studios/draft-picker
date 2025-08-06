import {PlayerstatsDocument} from '/imports/core/domain/entities/playerStats'
import {PlayerstatsCollection} from '/imports/core/infrastructure/db/playerStats'
import {createBaseRepositoryService, IRepository} from '/imports/core/repository/base-repository'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {LocateFunction} from '/imports/core/di/registry'

export type IPlayerstatsRepository = IRepository<PlayerstatsDocument> & {
  findAndSumAllPlayerStatsByPlayerId(playerId: string): { goals: number; assists: number; saves: number; demosInflicted: number; gamesPlayed: number, winPercentage: number; mvps: number }
}

export function createPlayerstatsRepository(_dateProvider: IDateProvider): IPlayerstatsRepository {
  const service = createBaseRepositoryService(PlayerstatsCollection, _dateProvider);
  return {
    ...service,
    findAndSumAllPlayerStatsByPlayerId(playerId) {
      const allStats = PlayerstatsCollection.find({playerId: playerId}).fetch();
      if (allStats.length === 0) {
        return {
          goals: 0,
          assists: 0,
          saves: 0,
          gamesPlayed: 0,
          demosInflicted: 0,
          winPercentage: 0,
          mvps: 0
        };
      }

      const totalStats = allStats.reduce((acc, stats) => {
        acc.goals += stats.goals || 0;
        acc.assists += stats.assists || 0;
        acc.saves += stats.saves || 0;
        acc.gamesPlayed += stats.gamesPlayed || 0;
        acc.winPercentage += stats.winPercentage || 0;
        acc.demosInflicted += stats.demosInflicted || 0;
        acc.mvps += stats.mvps || 0;
        return acc;
      }, {
        goals: 0,
        assists: 0,
        winPercentage: 0,
        gamesPlayed: 0,
        saves: 0,
        demosInflicted: 0,
        mvps: 0
      });

      return totalStats;
    }
  }
}

export function registerPlayerstatsRepository(locate: LocateFunction): IPlayerstatsRepository {
  return createPlayerstatsRepository(
    locate("infrastructure/date-provider/default-date-provider")
  );
}
