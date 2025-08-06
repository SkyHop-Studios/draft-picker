import {FranchisesDocument} from '/imports/core/domain/entities/franchises'

type NewFranchiseDocument = Omit<FranchisesDocument, "_id" | "createdAt" | "updatedAt">

export const FranchisesSeederData: NewFranchiseDocument[] = [
  {
    name: "Azura Gaming",
    logo: "azg.png",
    slug: "azg",
    hexcode: "#7E00FF"
  },
  {
    name: "CosmiCo Esports",
    logo: "CosmiCo.png",
    slug: "CosmiCo",
    hexcode: "#7A00A3"
  },
  {
    name: "Death Cloud Esports",
    logo: "Death Cloud Esports.png",
    slug: "dce",
    hexcode: "#B155FF"
  },
  {
    name: "GeneSix Esports",
    logo: "GeneSix.png",
    slug: "G6",
    hexcode: "#75EF0C"
  },
  {
    name: "Monarch Realm",
    logo: "Monarch Realm.png",
    slug: "monarch",
    hexcode: "#FFC600"
  },
  {
    name: "Omnius Gaming",
    logo: "Omnius Gaming.png",
    slug: "omnius",
    hexcode: "#6CD10E"
  },
  {
    name: "Ox Gaming",
    logo: "oxgaming.png",
    slug: "ox",
    hexcode: "#AA9D8D"
  },
  {
    name: "Unity Esports",
    logo: "unity.png",
    slug: "unity",
    hexcode: "#21C2FF"
  },
  {
    name: "Shadow Esports",
    logo: "shadow.png",
    slug: "shadow",
    hexcode: "#000000"
  },
  {
    name: "White Rabbit Gaming",
    logo: "White Rabbit Gaming.png",
    slug: "wrg",
    hexcode: "#FFFFFF"
  }
]
