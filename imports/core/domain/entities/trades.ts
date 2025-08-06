import {Tiers} from '/imports/core/domain/entities/players'

export type TradesDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date

  franchiseOne: string
  franchiseTwo: string

  picksOfferedFranchiseOne: TradePicks[]
  picksOfferedFranchiseTwo: TradePicks[]
}

export type TradePicks = {
  round: number
  tier: Tiers
  pick: number
}
