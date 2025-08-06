import type {UserMethods} from '/imports/both/methods/user-methods'
import type {DraftMethods} from '/imports/server/methods/draft-methods'
import {DraftPublications} from '/imports/server/publications/draft-publication'

export type AppMethods =
  & UserMethods
  & DraftMethods

export type AppPublications =
  DraftPublications
