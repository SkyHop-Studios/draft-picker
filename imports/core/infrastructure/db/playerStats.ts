import {Mongo} from 'meteor/mongo'
import {PlayerstatsDocument} from '/imports/core/domain/entities/playerStats'

export const PlayerstatsCollection = new Mongo.Collection<PlayerstatsDocument>('playerstats');
