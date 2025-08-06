import {TradesDocument} from '/imports/core/domain/entities/trades'
import {TradesCollection} from '/imports/core/infrastructure/db/trades'
import {createBaseRepositoryService, IRepository} from '/imports/core/repository/base-repository'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {LocateFunction} from '/imports/core/di/registry'

export type ITradesRepository = IRepository<TradesDocument>

export function createTradesRepository(_dateProvider: IDateProvider): ITradesRepository {
  const service = createBaseRepositoryService(TradesCollection);
  return {
    ...service
  }
}

export function registerTradesRepository(locate: LocateFunction): ITradesRepository {
  return createTradesRepository(
    locate("infrastructure/date-provider/default-date-provider")
  );
}
