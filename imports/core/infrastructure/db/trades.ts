import {Mongo} from 'meteor/mongo'
import {TradesDocument} from '/imports/core/domain/entities/trades'

export const TradesCollection = new Mongo.Collection<TradesDocument>('trades');
