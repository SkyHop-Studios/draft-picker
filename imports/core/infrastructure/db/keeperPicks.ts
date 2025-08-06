import {Mongo} from 'meteor/mongo'
import {KeeperpicksDocument} from '/imports/core/domain/entities/keeperPicks'

export const KeeperpicksCollection = new Mongo.Collection<KeeperpicksDocument>('keeperpicks');
