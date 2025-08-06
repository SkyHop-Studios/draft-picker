import {LocateFunction} from '/imports/core/di/registry'
import {MainClient, Pokemon} from 'pokenode-ts'

export type IPokeAPIClientService = MainClient & {
  helpers: {
    searchPokemon: (search: string) => Promise<Pokemon[]>
  }
}

export function createPokeAPIClientService(): IPokeAPIClientService {
  const client = new MainClient();
  return {
    ...client,

    helpers: {
      searchPokemon: async (search) => {
        let list = await client.pokemon.listPokemons(0, 1000);
        const all = list.results;
        while (list.next) {
          list = await client.utility.getResourceByUrl(list.next);
          all.push(...list.results);
        }

        const filtered = all.filter((p) =>
          p.name.includes(search.toLowerCase().replace(/ /g, "-")));

        const detailed: Pokemon[] = [];
        for (const p of filtered) {
          detailed.push(await client.pokemon.getPokemonByName(p.name));
        }

        return detailed;
      }
    }
  } as IPokeAPIClientService;
}

export function registerPokeAPIClientService(_locate: LocateFunction): IPokeAPIClientService {
  return createPokeAPIClientService();
}
