import {PickOrderDocument} from '/imports/core/domain/entities/pick-order'

export const PickOrderData = {
  _id: "pick_order",
  createdAt: new Date(),
  updatedAt: new Date(),

  order: {
    master: [

    ],
    elite: [

    ],
    rival: [

    ],
    prospect: [

    ]
  },

  chosenPlayers: {
    master: [

    ],
    elite: [

    ],
    rival: [

    ],
    prospect: [

    ]
  }

} as PickOrderDocument
