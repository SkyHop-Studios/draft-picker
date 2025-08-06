import {Subscription} from 'meteor/meteor'
import {z, ZodType} from 'zod'
import {Context, createContext} from '/imports/core/utils/context/create-context'

type SubscriptionBuilderInput<TSchema extends ZodType, TReturn> = {
  input?: TSchema
  run:
    TSchema extends undefined
      ? (this: Subscription, context: Context) => TReturn
      : (this: Subscription, input: z.infer<TSchema>, context: Context) => TReturn
}

export function subscriptionBuilder<
  TSchema extends ZodType,
  TReturn
>({ input, run }: SubscriptionBuilderInput<TSchema, TReturn>) {
  return function(this: Subscription, rawInput: z.infer<TSchema>): TReturn {
    // const context = createContext({
    //   userId: this.userId,
    //   connectionId: this.connection?.id
    // });
    const context = createContext();

    if(!input) {
      return (run as (this: Subscription, context: Context) => TReturn).call(this, context);
    }

    const result = input.safeParse(rawInput);

    if(!result.success) {
      throw new Error("ValidationError");
    }

    return run.call(this, result.data, context);
  }
}
