import React, {useCallback} from 'react'
import {z} from 'zod'
import {ComponentProps} from 'react'
import {Formik, useFormikContext} from 'formik'
import {toFormikValidationSchema} from 'zod-formik-adapter'
import {InputGroup, InputGroupError, InputGroupLabel} from '@/components/input-group'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/select'
import _ from 'lodash'
import {useMethodQuery} from '/imports/rpc/rpc-hooks'

const PickOrderFormSchema = z.object({
  tier: z.enum(["master", "elite", "rival", "prospect"]),
  order: z.array(z.string()),
});

export type PickOrderFormValues = z.infer<typeof PickOrderFormSchema>

const _initialValues: PickOrderFormValues = {
  tier: "master",
  order: [],
}

export type PickOrderFormProviderProps = Omit<ComponentProps<typeof Formik<PickOrderFormValues>>, "initialValues"> & {
  initialValues?: Partial<PickOrderFormValues>
}

export const PickOrderFormProvider = ({ initialValues, ...rest }: PickOrderFormProviderProps) => {
  return <Formik
    initialValues={{ ..._initialValues, ...initialValues }}
    validationSchema={toFormikValidationSchema(PickOrderFormSchema)}
    validateOnMount
    {...rest} />
}

export namespace Inputs {
  export const FranchiseInput = () => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<PickOrderFormValues>();
    const { data: franchises } = useMethodQuery("draft.getFranchises");

    const handleFranchiseSelect = useCallback(async (franchise: string) => {
      await setFieldValue("order", [...values.order, franchise]);
      await setFieldTouched("order", true);
    }, [setFieldTouched, setFieldValue, values.order]);


    const franchisesStillToPick = _.difference(_.map(franchises, franchise => franchise.name), values.order);

    return <InputGroup>
      <InputGroupLabel>Franchise Select</InputGroupLabel>
      <div className="mb-2">
        {_.map(values.order, (franchise, index) => <div className="flex gap-2" key={franchise}>
          <span>{index + 1}.</span>
          <span>{franchise}</span>
        </div>)}
      </div>

      <Select onValueChange={handleFranchiseSelect}>
        <SelectTrigger>
          <SelectValue placeholder={"Select Type"} />
        </SelectTrigger>
        <SelectContent>
          {_.map(franchisesStillToPick, (value) =>
            <SelectItem key={value} value={value} className="capitalize">{value}</SelectItem>
          )}
        </SelectContent>
      </Select>

      <InputGroupError name={"text"} />
    </InputGroup>
  }

  export const TierSelect = () => {
    const { setFieldValue, setFieldTouched } = useFormikContext<PickOrderFormValues>();

    return <InputGroup>
      <InputGroupLabel>Tier Select</InputGroupLabel>

      <Select onValueChange={async (v) => {
        await setFieldValue("tier", v);
        await setFieldTouched("tier", true);
      }}>
        <SelectTrigger>
          <SelectValue placeholder={"Select Type"} />
        </SelectTrigger>
        <SelectContent>
          {_.map(["master", "elite", "rival", "prospect"], (value) =>
            <SelectItem key={value} value={value} className="capitalize">{value}</SelectItem>
          )}
        </SelectContent>
      </Select>

      <InputGroupError name={"tier"} />
    </InputGroup>
  }
}


