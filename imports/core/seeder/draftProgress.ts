import {DraftProgressDocument} from '/imports/core/domain/entities/draft-progress'

export const DraftProgressData = {
  _id: "draft",
  createdAt: new Date(),
  updatedAt: new Date(),

  currentPick: 1,
  currentTier: "master",
  round: 1,
  selectedPlayer: ""

} as DraftProgressDocument
