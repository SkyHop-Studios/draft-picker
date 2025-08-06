import {KeeperpicksDocument} from '/imports/core/domain/entities/keeperPicks'
import {KeeperpicksCollection} from '/imports/core/infrastructure/db/keeperPicks'
import {createBaseRepositoryService, IRepository} from '/imports/core/repository/base-repository'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {LocateFunction} from '/imports/core/di/registry'

export type IKeeperpicksRepository = IRepository<KeeperpicksDocument>

export function createKeeperpicksRepository(_dateProvider: IDateProvider): IKeeperpicksRepository {
  const service = createBaseRepositoryService(KeeperpicksCollection, _dateProvider);
  return {
    ...service
  }
}

export function registerKeeperpicksRepository(locate: LocateFunction): IKeeperpicksRepository {
  return createKeeperpicksRepository(
    locate("infrastructure/date-provider/default-date-provider")
  );
}
