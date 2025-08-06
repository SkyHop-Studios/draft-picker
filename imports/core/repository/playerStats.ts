import {PlayerstatsDocument} from '/imports/core/domain/entities/playerStats'
import {PlayerstatsCollection} from '/imports/core/infrastructure/db/playerStats'
import {createBaseRepositoryService, IRepository} from '/imports/core/repository/base-repository'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {LocateFunction} from '/imports/core/di/registry'

export type IPlayerstatsRepository = IRepository<PlayerstatsDocument>

export function createPlayerstatsRepository(_dateProvider: IDateProvider): IPlayerstatsRepository {
  const service = createBaseRepositoryService(PlayerstatsCollection, _dateProvider);
  return {
    ...service
  }
}

export function registerPlayerstatsRepository(locate: LocateFunction): IPlayerstatsRepository {
  return createPlayerstatsRepository(
    locate("infrastructure/date-provider/default-date-provider")
  );
}
