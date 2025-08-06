import * as path from 'path'
import * as fs from 'fs'
import {createFileWithDirs} from '../utils/create-file-with-dirs'
import {kebabToPascal} from '../utils/strings'

const args = process.argv.slice(2);

const formComponentPath = args[0];

const dirs = formComponentPath.split("/");
const serviceName = dirs.pop()!;

console.log(dirs, serviceName);


const filePath = path.join(
  process.cwd(),
  "/imports/ui/features",
  dirs.join("/"),
  serviceName + ".tsx"
);

if(fs.existsSync(filePath)) {
  throw new Error(`File already exists: ${filePath}`);
}

const contents =
  `import React from 'react'
import {z} from 'zod'
import {ComponentProps} from 'react'
import {Field, Formik, useFormikContext} from 'formik'
import {toFormikValidationSchema} from 'zod-formik-adapter'
import {InputGroup, InputGroupError, InputGroupLabel} from '@/components/input-group'
import {Input} from '@/components/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/select'
import _ from 'lodash'
import {Textarea} from '@/components/textarea'
import {CalendarSelectField} from '@/components/calendar-select-field'

const ${kebabToPascal(serviceName)}Schema = z.object({
  text: z.string(),
  description: z.string(),
  date: z.date(),
  type: z.enum(["Option 1", "Option 2"])
});

export type ${kebabToPascal(serviceName)}Values = z.infer<typeof ${kebabToPascal(serviceName)}Schema>

const _initialValues: ${kebabToPascal(serviceName)}Values = {
  text: "",
  description: "",
  date: new Date(),
  type: "Option 1"
}

export type ${kebabToPascal(serviceName)}ProviderProps = Omit<ComponentProps<typeof Formik<${kebabToPascal(serviceName)}Values>>, "initialValues"> & {
  initialValues?: Partial<${kebabToPascal(serviceName)}Values>
}

export const ${kebabToPascal(serviceName)}Provider = ({ initialValues, ...rest }: ${kebabToPascal(serviceName)}ProviderProps) => {
  return <Formik
    initialValues={{ ..._initialValues, ...initialValues }}
    validationSchema={toFormikValidationSchema(${kebabToPascal(serviceName)}Schema)}
    validateOnMount
    {...rest} />
}

export namespace Inputs {
  export const TextInput = () => {
    return <InputGroup>
      <InputGroupLabel>Text</InputGroupLabel>
      <Field as={Input} name={"text"} />
      <InputGroupError name={"text"} />
    </InputGroup>
  }

  export const Description = () =>
    <InputGroup>
      <InputGroupLabel>Description</InputGroupLabel>
      <Field as={Textarea} name={"description"} />
      <InputGroupError name={"description"} />
    </InputGroup>

  export const TypeSelect = () => {
    const { setFieldValue, setFieldTouched } = useFormikContext<${kebabToPascal(serviceName)}Values>();
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


`

createFileWithDirs(filePath, contents);


