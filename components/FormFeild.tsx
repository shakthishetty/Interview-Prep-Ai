import { Control, Controller, Path } from 'react-hook-form'
import { FormControl, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

interface FormFieldProps<T extends string> {
  name: Path<T>
  control: Control<any>
  placeholder?: string
  label: string
  type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = <T extends string>({name,placeholder,label,type,control}:FormFieldProps<T>) => {
  return (
      <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='label'>{label}</FormLabel>
              <FormControl>
                <Input placeholder={placeholder} {...field} type={type} className='input'/>
              </FormControl>
       
              <FormMessage />
            </FormItem>
          )}
        />
  )
}

export default FormField