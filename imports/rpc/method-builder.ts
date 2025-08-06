import {Meteor} from 'meteor/meteor'
import {z, ZodType} from 'zod'
import {Context, createContext} from '/imports/core/utils/context/create-context'

type MethodFactoryInput<TSchema extends ZodType, TReturn> = {
  input?: TSchema
  run:
    TSchema extends undefined
      ? (this: Meteor.MethodThisType, context: Context) => TReturn
      : (this: Meteor.MethodThisType, input: z.infer<TSchema>, context: Context) => TReturn
}

export function methodBuilder<
  TSchema extends ZodType,
  TReturn
>({ input, run }: MethodFactoryInput<TSchema, TReturn>) {
  return async function(this: Meteor.MethodThisType, rawInput: z.infer<TSchema>): Promise<TReturn> {
    // const context = createContext({
    //   userId: this.userId,
    //   connectionId: this.connection?.id
    // });
    const context = createContext();

    try {
      if(!input) {
        return (run as (this: Meteor.MethodThisType, context: Context) => TReturn).call(this, context);
      }

      const result = input.parse(rawInput);

      return await run.call(this, result, context);
    } catch (error) {

      if(error instanceof Error) {
        throw new Meteor.Error(error.name, error.message);
      }

      throw error;
    }
  }
}
