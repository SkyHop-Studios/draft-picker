
export type FranchisesDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date

  name: string
  slug: FranchiseSlugs
  logo: string
  hexcode: string
}

export type FranchiseSlugs = "azg" | "CosmiCo" | "dce" | "G6" | "monarch" | "shadow" | "omnius" | "ox" | "unity" | "wrg"
export const FranchisesSlugs: Record<string, FranchiseSlugs> = {
  "Azura Gaming": "azg",
  "CosmiCo": "CosmiCo",
  "Death Cloud Esports": "dce",
  "GeneSix": "G6",
  "Monarch Realm": "monarch",
  "Shadow Esports": "shadow",
  "Omnius Gaming": "omnius",
  "Ox Gaming": "ox",
  "Unity Esports": "unity",
  "White Rabbit Gaming": "wrg"
}

export const FranchiseNamesFromSlugs: Record<FranchiseSlugs, string> = {
  "azg": "Azura Gaming",
  "CosmiCo": "CosmiCo",
  "dce": "Death Cloud Esports",
  "G6": "GeneSix",
  "monarch": "Monarch Realm",
  "shadow": "Shadow Esports",
  "omnius": "Omnius Gaming",
  "ox": "Ox Gaming",
  "unity": "Unity Esports",
  "wrg": "White Rabbit Gaming"
}
