import React from 'react';
import {Dialog, DialogContent, DialogTrigger} from '@/components/dialog'
import {Button} from '@/components/button'
import {PickOrderFormProvider, Inputs} from '@/features/pick-order-form'
import {useMethodMutation} from '/imports/rpc/rpc-hooks'
import {useQueryClient} from 'react-query'

export const CreateTradeDialog = () => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const createPickOrderMutation = useMethodMutation("draft.logTrade", {
    onSuccess: () => {
      setOpen(false);
      void queryClient.invalidateQueries(["draft.getPickOrder", "draft.getDraft"]);
    }
  });

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button>Create Trade</Button>
    </DialogTrigger>

    <DialogContent>
      <div>
        <PickOrderFormProvider onSubmit={(values) => createPickOrderMutation.mutateAsync({ tier: values.tier, franchiseOrder: values.order })}>
          {({ submitForm, values }) => {
            return <div>
              <div>
                <h1>Create Pick Order</h1>
              </div>

              <div className="flex flex-col gap-4">
                <Inputs.TierSelect />
                <Inputs.FranchiseInput />
              </div>

              <div className="pt-4">
                <Button disabled={!values.tier || values.order.length !== 10} className="w-full" onClick={submitForm}>Submit</Button>
              </div>
            </div>
          }}
        </PickOrderFormProvider>
      </div>
    </DialogContent>
  </Dialog>
};
