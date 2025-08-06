import {Mongo} from 'meteor/mongo'
import {DraftProgressDocument} from '/imports/core/domain/entities/draft-progress'

export const DraftProgressCollection = new Mongo.Collection<DraftProgressDocument>('draftProgress');
