import {Mongo} from 'meteor/mongo'
import {PlayersDocument} from '/imports/core/domain/entities/players'

export const PlayersCollection = new Mongo.Collection<PlayersDocument>('players');
