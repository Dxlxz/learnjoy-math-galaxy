
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from '@/types/auth';

interface EmailFieldProps {
  form: UseFormReturn<RegisterFormValues>;
  disabled?: boolean;
}

const EmailField: React.FC<EmailFieldProps> = ({ form, disabled }) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email Address</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="email"
              placeholder="Enter your email address"
              className="bg-white/50"
              disabled={disabled}
              aria-required="true"
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={form.formState.errors.email ? "email-error" : undefined}
            />
          </FormControl>
          <FormMessage id="email-error" />
        </FormItem>
      )}
    />
  );
};

export default EmailField;
