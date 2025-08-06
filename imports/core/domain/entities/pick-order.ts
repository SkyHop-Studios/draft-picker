import {PlayersDocument} from '/imports/core/domain/entities/players'

export type PickOrderDocument = {
  _id: "pick_order"
  createdAt: Date
  updatedAt: Date

  order: PickOrderList // Decide whether I want to hard code the 10 franchises and alter their order per round or if I want to store all the picks, probably the latter so we can handle trades
  chosenPlayers: {
    master: PlayersWithPick[]
    elite: PlayersWithPick[]
    rival: PlayersWithPick[]
    prospect: PlayersWithPick[]
  } // This will be an array of players, the length of this array will be the same as the length of the order array
}

export type PlayersWithPick = PlayersDocument & {
  pickNumber: number
  roundChosen: number
  franchiseLogo: string
}

export type PickOrderList = {
  master: string[]
  elite: string[]
  rival: string[]
  prospect: string[]
}
