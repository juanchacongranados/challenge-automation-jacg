import { test, expect } from "../../fixtures/test.fixture";
import pokemonData from "../../test-data/pokemon.generated.json";

for (const pokemon of pokemonData) {
  for (const searchType of ["id", "name"] as const) {
    test(`GET Pokemon ${pokemon.name} by ${searchType}`, async ({
      request,
    }) => {
      const searchValue = searchType === "id" ? pokemon.id : pokemon.name;
      const startTime = Date.now();

      try {
        const response = await request.get(
          `https://pokeapi.co/api/v2/pokemon/${searchValue}`,
          { timeout: 10000 },
        );

        const responseTime = Date.now() - startTime;

        expect(response.status()).toBe(200);
        expect(responseTime).toBeLessThan(10000);

        const body = await response.json();

        expect(body.id).toBe(pokemon.id);
        expect(body.name).toBe(pokemon.name);

        const actualAbilities = body.abilities.map(
          (item: { ability: { name: string } }) => item.ability.name,
        );

        expect(actualAbilities.sort()).toEqual([...pokemon.abilities].sort());

        console.log(`Pokemon: ${pokemon.name}`);
        console.log(`Search type: ${searchType}`);
        console.log(`Response time: ${responseTime} ms`);
      } finally {
        console.log(`Finished at: ${new Date().toISOString()}`);
      }
    });
  }
}
