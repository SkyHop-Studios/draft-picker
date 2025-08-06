import {LocateFunction} from '/imports/core/di/registry'
import {IDraftControllerService} from '/imports/core/application/services/controller/draft-controller'

export type IRootControllerService = {
  draft: IDraftControllerService
}

type Dependencies = {
  draft: IDraftControllerService
}

export function createRootControllerService(
  {
    draft
  }: Dependencies): IRootControllerService {

  return {
    draft
  }
}

export function registerRootControllerService(locate: LocateFunction): IRootControllerService {
  return createRootControllerService({
    draft: locate("application/services/controller/draft-controller")
  });
}
