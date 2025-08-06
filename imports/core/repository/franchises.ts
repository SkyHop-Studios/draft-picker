import {FranchisesDocument} from '/imports/core/domain/entities/franchises'
import {FranchisesCollection} from '/imports/core/infrastructure/db/franchises'
import {createBaseRepositoryService, IRepository} from '/imports/core/repository/base-repository'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {LocateFunction} from '/imports/core/di/registry'

export type IFranchisesRepository = IRepository<FranchisesDocument>

export function createFranchisesRepository(dateProvider: IDateProvider): IFranchisesRepository {
  const service = createBaseRepositoryService(FranchisesCollection, dateProvider);
  return {
    ...service
  }
}

export function registerFranchisesRepository(locate: LocateFunction): IFranchisesRepository {
  return createFranchisesRepository(
    locate("infrastructure/date-provider/default-date-provider")
  );
}
