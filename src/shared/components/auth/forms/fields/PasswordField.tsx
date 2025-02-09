import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from '@/types/auth';
import PasswordStrengthMeter from '../PasswordStrengthMeter';

interface PasswordFieldProps {
  form: UseFormReturn<RegisterFormValues>;
  name: "password" | "confirmPassword";
  label: string;
  placeholder: string;
  showStrengthMeter?: boolean;
  disabled?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  showStrengthMeter = false,
  disabled
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="bg-white/50 pr-10"
                disabled={disabled}
                aria-required="true"
                aria-invalid={!!form.formState.errors[name]}
                aria-describedby={showStrengthMeter ? "password-requirements password-error" : undefined}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={(e) => {
                  field.onBlur();
                  if (!e.currentTarget.value) {
                    setIsPasswordFocused(false);
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </FormControl>
          {showStrengthMeter && (isPasswordFocused || field.value) && (
            <>
              <PasswordStrengthMeter password={field.value} />
              <FormDescription 
                id="password-requirements"
                className="text-sm text-muted-foreground"
              >
                Password must include: 8+ characters, uppercase & lowercase letters, number, and special character.
              </FormDescription>
            </>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
