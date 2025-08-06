
export type PlayerstatsDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date

  playerID: number
  format: "Pre-Season" | "League Play" | "Play-Offs"
  teamID: string
  tier: "Elite" | "Rival" | "Prospect" | "Master"
  season: "season1" | "season2" | "season3"
  minutesPlayed: number
  gamesPlayed: number
  gameWins: number
  gameLosses: number
  winPercentage: number
  goals: number
  assists: number
  saves: number
  shots: number
  goalsConceded: number
  goalsConcededWhileLastDefender: number
  cleanSheets: number
  shootingPercentage: number
  demosInflicted: number
  boostPerMinute: number //389.5,
  averageBoostAmount: number //38.21,
  boostCollected: number // 4800,
  zeroBoostTime: number //160.72,
  fullBoostTime: number //64.29,
  overfillBoost: number //249,
  averageSpeed: number //1658, maxes at 2200
  totalDistance: number // 1137629,
  timeSlow: number //285.08,
  timeSuperSonic: number //154.94,
  timeGround: number // 406.07,
  timeLowAir: number //317.9,
  timeHighAir: number // 26.43,
  timeMostBack: number //247.9,
  timeMostForward: number //238.3,
  timeDefensiveHalf: number //492.96,
  timeOffensiveHalf: number //257.44,
  mvps: number //0,
  hattricks: number //0,
  playmakers: number //0,
  saviours: number //0,
  goalParticipation: number //0.25,
}
