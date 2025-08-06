import {PlayersDocument} from '/imports/core/domain/entities/players'
import {PlayersCollection} from '/imports/core/infrastructure/db/players'
import {createBaseRepositoryService, IRepository} from '/imports/core/repository/base-repository'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {LocateFunction} from '/imports/core/di/registry'

export type IPlayersRepository = IRepository<PlayersDocument>

export function createPlayersRepository(dateProvider: IDateProvider): IPlayersRepository {
  const service = createBaseRepositoryService(PlayersCollection, dateProvider);
  return {
    ...service
  }
}

export function registerPlayersRepository(locate: LocateFunction): IPlayersRepository {
  return createPlayersRepository(
    locate("infrastructure/date-provider/default-date-provider")
  );
}
