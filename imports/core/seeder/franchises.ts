import {FranchisesDocument} from '/imports/core/domain/entities/franchises'

type NewFranchiseDocument = Omit<FranchisesDocument, "_id" | "createdAt" | "updatedAt">

export const FranchisesSeederData: NewFranchiseDocument[] = [
  {
    name: "Azura Gaming",
    logo: "azg.png",
    slug: "azg"
  },
  {
    name: "CosmiCo Esports",
    logo: "CosmiCo.png",
    slug: "CosmiCo"
  },
  {
    name: "Death Cloud Esports",
    logo: "Death Cloud Esports.png",
    slug: "dce"
  },
  {
    name: "GeneSix Esports",
    logo: "GeneSix.png",
    slug: "G6"
  },
  {
    name: "Monarch Realm",
    logo: "Monarch Realm.png",
    slug: "monarch"
  },
  {
    name: "Omnius Gaming",
    logo: "Omnius Gaming.png",
    slug: "omnius"
  },
  {
    name: "Ox Gaming",
    logo: "oxgaming.png",
    slug: "ox"
  },
  {
    name: "Unity Esports",
    logo: "unity.png",
    slug: "unity"
  },
  {
    name: "Shadow Esports",
    logo: "shadow.png",
    slug: "shadow"
  },
  {
    name: "White Rabbit Gaming",
    logo: "White Rabbit Gaming.png",
    slug: "wrg"
  }
]
