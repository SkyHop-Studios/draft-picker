declare module "meteor/mongo" {
  module Mongo {
    interface Collection<T, U> {
      _name: string
    }
  }
}
