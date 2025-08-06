import React from 'react'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/popover'
import {Button} from '@/components/button'
import {cn} from '@/lib/utils'
import moment from 'moment'
import {CalendarIcon} from 'lucide-react'
import {Calendar} from '@/components/calendar'
import {FieldProps} from 'formik'

type Props = {
  disabledFunc?: (date: Date | undefined) => boolean
} & FieldProps

export const CalendarSelectField = ({ disabledFunc, field, form }: Props) => {
  return <Popover>
    <PopoverTrigger asChild>
      <Button
        type={"button"}
        name={field.name}
        onBlur={field.onBlur}
        className={cn(
          "w-full pl-3 text-left font-normal rounded bg-background text-foreground border border-input hover:bg-input"
        )}>
        {field.value
          ? moment(field.value).format("DD MMMM YYYY")
          : <span>Pick a date</span>
        }
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        defaultMonth={field.value ? field.value: new Date()}
        mode="single"
        onSelect={async (date) => {
          await form.setFieldValue(field.name, date);
          await form.setFieldTouched(field.name, true);
        }}
        disabled={(date) => date < new Date("1900-01-01") || !!disabledFunc?.(date)}
        initialFocus
      />
    </PopoverContent>
  </Popover>
};
