import {DraftProgressCollection} from '/imports/core/infrastructure/db/draft-progress'
import {DraftProgressData} from '/imports/core/seeder/draftProgress'

export type IDraftProgressSeeder = {
  seed () : void
  clearPickOrder () : void
}

export function createDraftProgressSeeder(): IDraftProgressSeeder {

  return {
    seed: () => {
      if (DraftProgressCollection.findOne()) {
        return;
      }
      DraftProgressCollection.insert(DraftProgressData);
    },
    clearPickOrder: () => {
      DraftProgressCollection.remove({});
      DraftProgressCollection.insert(DraftProgressData);
    }
  }
}

export function registerDraftProgressSeeder() {
  return createDraftProgressSeeder();
}
