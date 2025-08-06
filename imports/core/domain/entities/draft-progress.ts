import {Tiers} from '/imports/core/domain/entities/players'

export type DraftProgressDocument = {
  _id: "draft"
  createdAt: Date
  updatedAt: Date

  currentTier: Tiers

  currentPick: number
  round: number

  selectedPlayer: string
  selectedPlayerCMV: number
  selectedPlayerIsKeeperPick: boolean
}
