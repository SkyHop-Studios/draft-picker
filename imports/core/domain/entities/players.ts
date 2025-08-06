
export type PlayersDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date

  name: string
  safeName: string
  tier: Tiers
  cmv: number

  franchiseId?: string
  statPlayerId?: string
}

export type Tiers = "master" | "elite" | "rival" | "prospect";
