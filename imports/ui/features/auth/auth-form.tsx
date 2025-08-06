import React, {ComponentProps} from 'react';
import {z} from 'zod'
import {Field, Formik} from 'formik'
import {toFormikValidationSchema} from 'zod-formik-adapter'
import {InputGroup, InputGroupError, InputGroupLabel} from '@/components/input-group'
import {Input} from '@/components/input'

const AuthFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type AuthFormValues = z.infer<typeof AuthFormSchema>

const _initialValues: AuthFormValues = {
  username: "",
  password: ""
}

type AuthFormProviderProps = Omit<ComponentProps<typeof Formik<AuthFormValues>>, "initialValues"> & {
  initialValues?: Partial<AuthFormValues>
}

export const AuthFormProvider = ({ initialValues, ...rest }: AuthFormProviderProps) => {
  return <Formik
    initialValues={{ ..._initialValues, ...initialValues }}
    validationSchema={toFormikValidationSchema(AuthFormSchema)}
    validateOnMount
    {...rest}
  />
}

export namespace Inputs {
  export const Username = () =>
    <InputGroup>
      <InputGroupLabel>Username</InputGroupLabel>
      <Field as={Input} name={"username"} />
      <InputGroupError name={"username"} />
    </InputGroup>

  export const Password = () =>
    <InputGroup>
      <InputGroupLabel>Password</InputGroupLabel>
      <Field as={Input} type={"password"} name={"password"} />
      <InputGroupError name={"password"} />
    </InputGroup>
}
