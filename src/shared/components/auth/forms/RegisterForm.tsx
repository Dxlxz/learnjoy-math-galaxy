import React from 'react';
import { useToast } from "@/shared/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { registerFormSchema, type RegisterFormValues } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import EmailField from './fields/EmailField';
import PasswordField from './fields/PasswordField';
import RegisterButton from './fields/RegisterButton';
import { handleRegistration, handleResendVerification } from './validation/registerFormHandlers';

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [resendingEmail, setResendingEmail] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const handleResend = async (email: string) => {
    await handleResendVerification(email, setResendingEmail, toast);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    await handleRegistration(values, setLoading, toast, onSuccess, handleResend);
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
        aria-label="Registration form"
      >
        <div className="space-y-4">
          <EmailField form={form} disabled={loading} />
          
          <PasswordField
            form={form}
            name="password"
            label="Password"
            placeholder="Create a secure password"
            showStrengthMeter={true}
            disabled={loading}
          />

          <PasswordField
            form={form}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            disabled={loading}
          />
        </div>

        <RegisterButton loading={loading} />
      </form>
    </Form>
  );
};

export default RegisterForm;
