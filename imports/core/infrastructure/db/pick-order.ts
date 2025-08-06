import {Mongo} from 'meteor/mongo'
import {PickOrderDocument} from '/imports/core/domain/entities/pick-order'

export const PickOrderCollection = new Mongo.Collection<PickOrderDocument>('pickOrder');
