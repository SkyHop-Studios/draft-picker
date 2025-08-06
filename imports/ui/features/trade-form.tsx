import React, {useCallback} from 'react'
import {z} from 'zod'
import {ComponentProps} from 'react'
import {Formik, useFormikContext} from 'formik'
import {toFormikValidationSchema} from 'zod-formik-adapter'
import {InputGroup, InputGroupError, InputGroupLabel} from '@/components/input-group'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/select'
import _ from 'lodash'
import {useMethodQuery} from '/imports/rpc/rpc-hooks'
import {Tiers} from '/imports/core/domain/entities/players'

const TradeFormSchema = z.object({
  franchiseOne: z.string(),
  franchiseTwo: z.string(),
  picksOfferedFranchiseOne: z.array(z.object({
    round: z.number(),
    tier: z.custom<Tiers>(),
    pick: z.number()
  })),
  picksOfferedFranchiseTwo: z.array(z.object({
    round: z.number(),
    tier: z.custom<Tiers>(),
    pick: z.number()
  }))
});

export type TradeFormValues = z.infer<typeof TradeFormSchema>

const _initialValues: TradeFormValues = {
  franchiseOne: "",
  franchiseTwo: "",
  picksOfferedFranchiseOne: [],
  picksOfferedFranchiseTwo: []
}

export type TradeFormProviderProps = Omit<ComponentProps<typeof Formik<TradeFormValues>>, "initialValues"> & {
  initialValues?: Partial<TradeFormValues>
}

export const TradeFormProvider = ({ initialValues, ...rest }: TradeFormProviderProps) => {
  return <Formik
    initialValues={{ ..._initialValues, ...initialValues }}
    validationSchema={toFormikValidationSchema(TradeFormSchema)}
    validateOnMount
    {...rest} />
}

export namespace Inputs {
  export const FranchiseSelectorOneInput = () => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<TradeFormValues>();

    const { data: franchises } = useMethodQuery("draft.getFranchises");

    const handleFranchiseSelect = useCallback(async (franchise: string) => {
      await setFieldValue("franchiseOne", franchise);
      await setFieldTouched("franchiseOne", true);
    }, [setFieldTouched, setFieldValue, values.franchiseOne]);

    return <InputGroup>
      <InputGroupLabel>Franchise Select</InputGroupLabel>

      <Select onValueChange={handleFranchiseSelect}>
        <SelectTrigger>
          <SelectValue placeholder={"Select Type"} />
        </SelectTrigger>
        <SelectContent>
          {_.map(franchises, (value) =>
            <SelectItem key={value._id} value={value.name} className="capitalize">{value.name}</SelectItem>
          )}
        </SelectContent>
      </Select>

      <InputGroupError name={"text"} />
    </InputGroup>
  }

  export const FranchiseSelectorTwoInput = () => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<TradeFormValues>();

    const { data: franchises } = useMethodQuery("draft.getFranchises");

    const handleFranchiseSelect = useCallback(async (franchise: string) => {
      await setFieldValue("franchiseOne", franchise);
      await setFieldTouched("franchiseOne", true);
    }, [setFieldTouched, setFieldValue, values.franchiseOne]);

    return <InputGroup>
      <InputGroupLabel>Franchise Select</InputGroupLabel>

      <Select onValueChange={handleFranchiseSelect}>
        <SelectTrigger>
          <SelectValue placeholder={"Select Type"} />
        </SelectTrigger>
        <SelectContent>
          {_.map(franchises, (value) =>
            <SelectItem key={value._id} value={value.name} className="capitalize">{value.name}</SelectItem>
          )}
        </SelectContent>
      </Select>

      <InputGroupError name={"text"} />
    </InputGroup>
  }

  export const TradeOfferOneInput = () => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<TradeFormValues>();

    const { data: franchisePicksByTier } = useMethodQuery("draft.getFranchisePicksByTier", { franchise: values.franchiseOne });

    const handleTradeOfferOne = useCallback(async (tradeOffer: string) => {

    }, [setFieldTouched, setFieldValue, values.picksOfferedFranchiseOne]);

    const disabled = values.franchiseOne === "";

    return <InputGroup>
      <InputGroupLabel>Picks Offered</InputGroupLabel>

      {_.map(picksOfferedFranchiseOne)}

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

      <Select onValueChange={handleTradeOfferOne}>
        <SelectTrigger>
          <SelectValue placeholder={"Select Type"} />
        </SelectTrigger>
        <SelectContent>
          {_.map(values.picksOfferedFranchiseOne, (value, index) =>
            <SelectItem key={index} value={value} className="capitalize">{value}</SelectItem>
          )}
        </SelectContent>
      </Select>

      <InputGroupError name={"text"} />
    </InputGroup>
  }
}


