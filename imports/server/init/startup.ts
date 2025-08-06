import {Mongo} from 'meteor/mongo'
import {UserCollection} from '/imports/core/infrastructure/db/user/user'
import {FranchisesCollection} from '/imports/core/infrastructure/db/franchises'
import {container} from '/imports/core/di/registry'
import { Meteor } from 'meteor/meteor'

const Collections = [
  UserCollection,
  FranchisesCollection
]

export const emptyCollection = (collection: Mongo.Collection<any>) => {
  collection.remove({});
}

const emptyAllCollections = () => {
  for(const collection of Collections) {
    // @ts-ignore - FilesCollection and Mongo.Collection don't have the same methods, but we only use find and remove
    emptyCollection(collection);
  }
}

const seed = () => {
  const seedFranchises = container.locate("seeder/seedFranchises");
  seedFranchises.seed();

  const seedPickOrder = container.locate("seeder/seedPickOrder");
  seedPickOrder.seed();

  const seedDraftProgress = container.locate("seeder/seedDraftProgress");
  seedDraftProgress.seed();
}

Meteor.methods({
  "clearDB": () => {
    emptyAllCollections();
  },
  "seed": () => {
    seed();
  },
})
