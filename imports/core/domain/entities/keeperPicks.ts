import {Tiers} from "/imports/core/domain/entities/players"

export type KeeperpicksDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date

  playerId: string
  tier: Tiers
  franchise: string
  cmv: number
  pickRound: number
  name: string
  role: string
}
