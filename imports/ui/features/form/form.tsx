import React, {ComponentProps} from 'react';
import {z} from 'zod'
import {Field, Formik, useFormikContext} from 'formik'
import {toFormikValidationSchema} from 'zod-formik-adapter'
import {InputGroup, InputGroupError, InputGroupLabel} from '@/components/input-group'
import {Input} from '@/components/input'
import {Textarea} from '@/components/textarea'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/select'
import {CalendarSelectField} from '@/components/calendar-select-field'
import _ from 'lodash'

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  type: z.enum(["Option 1", "Option 2"]),
});

export type FormValues = z.infer<typeof FormSchema>

const _initialValues: FormValues = {
  title: "",
  description: "",
  date: new Date(),
  type: "Option 1"
}

type FormProviderProps = Omit<ComponentProps<typeof Formik<FormValues>>, "initialValues"> & {
  initialValues?: Partial<FormValues>
}

export const FormProvider = ({ initialValues, ...rest }: FormProviderProps) => {
  return <Formik
    initialValues={{ ..._initialValues, ...initialValues }}
    validationSchema={toFormikValidationSchema(FormSchema)}
    validateOnMount
    {...rest}
  />
}

export namespace Inputs {
  export const Title = () =>
    <InputGroup>
      <InputGroupLabel>Title</InputGroupLabel>
      <Field as={Input} name={"title"} />
      <InputGroupError name={"title"} />
    </InputGroup>

  export const Description = () =>
    <InputGroup>
      <InputGroupLabel>Description</InputGroupLabel>
      <Field as={Textarea} name={"description"} />
      <InputGroupError name={"description"} />
    </InputGroup>

  export const Type = () => {
    const { setFieldValue, setFieldTouched } = useFormikContext<FormValues>();
    return <InputGroup>
      <InputGroupLabel>Type</InputGroupLabel>

      <Select onValueChange={async (v) => {
        await setFieldValue("type", v);
        await setFieldTouched("type", true);
      }}>
        <SelectTrigger>
          <SelectValue placeholder={"Select Type"} />
        </SelectTrigger>
        <SelectContent>
          {_.map(["Option 1", "Option 2"], (value) =>
            <SelectItem key={value} value={value}>{value}</SelectItem>
          )}
        </SelectContent>
      </Select>

      <InputGroupError name={"type"} />
    </InputGroup>
  }

  export const DateSelectInput = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return <InputGroup>
      <InputGroupLabel>Check in*</InputGroupLabel>
      <Field
        component={CalendarSelectField}
        disabledFunc={(date: Date) => !!date && date <= yesterday}
        name={"date"}
      />
      <InputGroupError name={"date"} />
    </InputGroup>
  }
}