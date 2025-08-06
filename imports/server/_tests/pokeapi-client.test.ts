import {createPokeAPIClientService} from '/imports/core/infrastructure/services/pokeapi/pokeapi-client'
import {expect} from 'chai'

describe("PokeAPI Client", function () {

  const client = createPokeAPIClientService();

  it("Should be able to retrieve Pikachu", async function () {
    const monster = await client.pokemon.getPokemonByName("pikachu");
    expect(monster).to.have.property("height").that.equals(4);
    expect(monster).to.have.property("types").that.has.length(1);
    expect(monster.types[0].type).to.have.property("name").that.equals("electric");
  });

  it("Should be able search", async function () {
    const search = "Walking Wake";
    const detailed = await client.helpers.searchPokemon(search);
    expect(detailed.length).to.equal(1);
  });

});
