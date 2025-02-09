
import React from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface RegisterButtonProps {
  loading: boolean;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ loading }) => {
  return (
    <Button
      type="submit"
      className="w-full bg-primary-600 hover:bg-primary-700"
      disabled={loading}
      aria-label={loading ? "Creating account..." : "Continue"}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" aria-hidden="true" />
          <span>Creating Account...</span>
        </div>
      ) : (
        "Continue"
      )}
    </Button>
  );
};

export default RegisterButton;
