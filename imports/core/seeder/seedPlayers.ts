import {PlayersCollection} from '/imports/core/infrastructure/db/players'
import {PlayerSeederData} from '/imports/core/seeder/players'
import {PlayersDocument} from '/imports/core/domain/entities/players'

export type IPlayerSeeder = {
  seed () : void
  seedFromCSV (csvData: string) : void
}

export function createPlayerSeeder(): IPlayerSeeder {

  return {

    seed: () => {
      for(const player of PlayerSeederData) {

        const playerExists = PlayersCollection.findOne({ "name": player.name });

        if(playerExists){
          continue;
        }

        PlayersCollection.insert(player);
      }
    },

    seedFromCSV: (csvData: string) => {
      const players = csvData.split('\n').map((line) => {
        const [name, cmv, tier] = line.split(',');
        return { name, cmv: parseInt(cmv), tier };
      }) as PlayersDocument[];

      for(const player of players) {

        const playerExists = PlayersCollection.findOne({ "name": player.name });

        if(playerExists){
          continue;
        }

        PlayersCollection.insert(player);
      }
    },
  }
}

export function registerPlayerSeeder() {
  return createPlayerSeeder();
}
