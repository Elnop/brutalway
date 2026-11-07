import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useController, useForm } from 'react-hook-form';
import { SignupSchema } from './SignupSchemas.ts';

export function Signup() {
  const form = useForm({ resolver: zodResolver(SignupSchema) });
  const loose = useForm({ defaultValues: { email: '' } });
  const field = useController({ name: 'email', control: form.control, rules: { required: true } });
  return (
    <form>
      <input {...form.register('email')} />
      <input {...loose.register('name', { required: true })} />
      <Controller name="age" control={form.control} rules={{ min: 18 }} render={() => <span>{field.field.name}</span>} />
    </form>
  );
}
