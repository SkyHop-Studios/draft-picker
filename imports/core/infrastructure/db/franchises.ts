import {Mongo} from 'meteor/mongo'
import {FranchisesDocument} from '/imports/core/domain/entities/franchises'

export const FranchisesCollection = new Mongo.Collection<FranchisesDocument>('franchises');
