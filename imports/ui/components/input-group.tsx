import React, {PropsWithChildren} from 'react'
import {cn} from '@/lib/utils'
import {ErrorMessage} from 'formik'
import {ErrorMessageProps} from 'formik/dist/ErrorMessage'

type InputGroupProps = PropsWithChildren<{
  className?: string
}>

export const InputGroup = ({ className, children }: InputGroupProps) => {
  return <div className={cn("", className)}>
    {children}
  </div>
}

type InputGroupLabelProps = PropsWithChildren<{
  className?: string
}>

export const InputGroupLabel = ({ className, children }: InputGroupLabelProps) => {
  return <label className={cn("text-foreground text-sm block mb-2", className)}>
    {children}
  </label>
}

type InputGroupInputProps = ErrorMessageProps & {}
export const InputGroupError = ({ className, ...rest }: InputGroupInputProps) => {
  return <ErrorMessage {...rest} className={cn("leading-none text-red-400 italic", className)} component={"span"} />
}
