/**
 * --------------------------------------
 * GENERATED CODE - DO NOT MODIFY BY HAND
 * --------------------------------------
 */
import {registerDraftProgressRepository} from '/imports/core/repository/draft-progress'
import {registerFranchisesRepository} from '/imports/core/repository/franchises'
import {registerKeeperpicksRepository} from '/imports/core/repository/keeperPicks'
import {registerPickOrderRepository} from '/imports/core/repository/pick-order'
import {registerPlayersRepository} from '/imports/core/repository/players'
import {registerPlayerstatsRepository} from '/imports/core/repository/playerStats'
import {registerTradesRepository} from '/imports/core/repository/trades'
import {registerDraftControllerService} from '/imports/core/application/services/controller/draft-controller'
import {registerRootControllerService} from '/imports/core/application/services/controller/root-controller'
import {registerDateProvider} from '/imports/core/infrastructure/services/date-provider/default-date-provider'
import {registerPokeAPIClientService} from '/imports/core/infrastructure/services/pokeapi/pokeapi-client'
import {registerDraftProgressSeeder} from '/imports/core/seeder/seedDraftProgress'
import {registerFranchiseSeeder} from '/imports/core/seeder/seedFranchises'
import {registerPickOrderSeeder} from '/imports/core/seeder/seedPickOrder'
import {registerPlayerSeeder} from '/imports/core/seeder/seedPlayers'

import {createContainer, DIContainer} from '/imports/core/di/service-locator'
import {Context} from '/imports/core/utils/context/create-context'

type ServiceKeyRegistry = {
	"repository/draft-progress": ReturnType<typeof registerDraftProgressRepository>
	"repository/franchises": ReturnType<typeof registerFranchisesRepository>
	"repository/keeperPicks": ReturnType<typeof registerKeeperpicksRepository>
	"repository/pick-order": ReturnType<typeof registerPickOrderRepository>
	"repository/players": ReturnType<typeof registerPlayersRepository>
	"repository/playerStats": ReturnType<typeof registerPlayerstatsRepository>
	"repository/trades": ReturnType<typeof registerTradesRepository>
	"application/services/controller/draft-controller": ReturnType<typeof registerDraftControllerService>
	"application/services/controller/root-controller": ReturnType<typeof registerRootControllerService>
	"infrastructure/date-provider/default-date-provider": ReturnType<typeof registerDateProvider>
	"infrastructure/pokeapi/pokeapi-client": ReturnType<typeof registerPokeAPIClientService>
	"seeder/seedDraftProgress": ReturnType<typeof registerDraftProgressSeeder>
	"seeder/seedFranchises": ReturnType<typeof registerFranchiseSeeder>
	"seeder/seedPickOrder": ReturnType<typeof registerPickOrderSeeder>
	"seeder/seedPlayers": ReturnType<typeof registerPlayerSeeder>
}
export function register(container: DIContainer<ServiceKeyRegistry, Context>) {
	container.register("repository/draft-progress", registerDraftProgressRepository);
	container.register("repository/franchises", registerFranchisesRepository);
	container.register("repository/keeperPicks", registerKeeperpicksRepository);
	container.register("repository/pick-order", registerPickOrderRepository);
	container.register("repository/players", registerPlayersRepository);
	container.register("repository/playerStats", registerPlayerstatsRepository);
	container.register("repository/trades", registerTradesRepository);
	container.register("application/services/controller/draft-controller", registerDraftControllerService);
	container.register("application/services/controller/root-controller", registerRootControllerService);
	container.register("infrastructure/date-provider/default-date-provider", registerDateProvider);
	container.register("infrastructure/pokeapi/pokeapi-client", registerPokeAPIClientService);
	container.register("seeder/seedDraftProgress", registerDraftProgressSeeder);
	container.register("seeder/seedFranchises", registerFranchiseSeeder);
	container.register("seeder/seedPickOrder", registerPickOrderSeeder);
	container.register("seeder/seedPlayers", registerPlayerSeeder);
}

export const container = createContainer<ServiceKeyRegistry, Context>();
export type LocateFunction = typeof container.locate
register(container);
