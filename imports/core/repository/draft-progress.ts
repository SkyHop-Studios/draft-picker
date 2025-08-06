import {DraftProgressDocument} from '/imports/core/domain/entities/draft-progress'
import {DraftProgressCollection} from '/imports/core/infrastructure/db/draft-progress'
import {createBaseRepositoryService, IRepository} from '/imports/core/repository/base-repository'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {LocateFunction} from '/imports/core/di/registry'

export type IDraftProgressRepository = IRepository<DraftProgressDocument>

export function createDraftProgressRepository(dateProvider: IDateProvider): IDraftProgressRepository {
  const service = createBaseRepositoryService(DraftProgressCollection, dateProvider);
  return {
    ...service
  }
}

export function registerDraftProgressRepository(locate: LocateFunction): IDraftProgressRepository {
  return createDraftProgressRepository(
    locate("infrastructure/date-provider/default-date-provider")
  );
}
