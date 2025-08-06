import {PickOrderCollection} from '/imports/core/infrastructure/db/pick-order'
import {PickOrderData} from '/imports/core/seeder/pickOrder'

export type IPickOrderSeeder = {
  seed () : void
  clearPickOrder () : void
}

export function createPickOrderSeeder(): IPickOrderSeeder {

  return {
    seed: () => {
      if (PickOrderCollection.findOne()) {
        return;
      }
      PickOrderCollection.insert(PickOrderData);
    },
    clearPickOrder: () => {
      PickOrderCollection.remove({});
      PickOrderCollection.insert(PickOrderData);
    }
  }
}

export function registerPickOrderSeeder() {
  return createPickOrderSeeder();
}
