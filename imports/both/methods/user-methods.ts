import {Meteor} from "meteor/meteor";
import {Accounts} from 'meteor/accounts-base'
import {methodBuilder} from '/imports/rpc/method-builder'
import {z} from 'zod'

const methods = {
  "users.createAccount": methodBuilder({
    input: z.object({
      username: z.string(),
      password: z.string()
    }),
    run: ({ password, username }) => {
      return Accounts.createUser({
        username,
        password
      });
    }
  })
}

export type UserMethods = typeof methods;

Meteor.methods(methods)
