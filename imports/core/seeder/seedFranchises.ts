import {FranchisesSeederData} from '/imports/core/seeder/franchises'
import {FranchisesCollection} from '/imports/core/infrastructure/db/franchises'

export type IFranchiseSeeder = {
  seed () : void
}

export function createFranchiseSeeder(): IFranchiseSeeder {

  return {

    seed: () => {

      for(const franchise of FranchisesSeederData) {

        const franchiseExists = FranchisesCollection.findOne({ "name": franchise.name });

        if(franchiseExists){
          continue;
        }

        FranchisesCollection.insert({
          ...franchise,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
  }
}

export function registerFranchiseSeeder() {
  return createFranchiseSeeder();
}
