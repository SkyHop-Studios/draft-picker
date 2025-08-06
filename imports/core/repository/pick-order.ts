import {PickOrderDocument} from '/imports/core/domain/entities/pick-order'
import {PickOrderCollection} from '/imports/core/infrastructure/db/pick-order'
import {createBaseRepositoryService, IRepository} from '/imports/core/repository/base-repository'
import {IDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {LocateFunction} from '/imports/core/di/registry'

export type IPickOrderRepository = IRepository<PickOrderDocument> & {
  createNewPickOrder: () => string
}

export function createPickOrderRepository(dateProvider: IDateProvider): IPickOrderRepository {
  const service = createBaseRepositoryService(PickOrderCollection, dateProvider);
  return {
    ...service,
    createNewPickOrder: () => {
      if (PickOrderCollection.findOne()) {
        return "Pick order already exists";
      }
      return PickOrderCollection.insert({
        _id: "pick_order",
        createdAt: dateProvider(),
        updatedAt: dateProvider(),
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
  }
}

export function registerPickOrderRepository(locate: LocateFunction): IPickOrderRepository {
  return createPickOrderRepository(
    locate("infrastructure/date-provider/default-date-provider")
  );
}
