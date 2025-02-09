import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AuthNavigationProps {
  links: {
    text: string;
    path: string;
    ariaLabel: string;
  }[];
  loading?: boolean;
}

const AuthNavigation: React.FC<AuthNavigationProps> = ({ links, loading }) => {
  const navigate = useNavigate();

  const handleKeyPress = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <div 
      className="text-center space-y-2"
      role="navigation"
      aria-label="Additional options"
    >
      {links.map((link, index) => (
        <div key={index}>
          <Button
            type="button"
            variant="link"
            onClick={() => navigate(link.path)}
            onKeyDown={(e) => handleKeyPress(e, link.path)}
            className="text-primary-600"
            disabled={loading}
            aria-label={link.ariaLabel}
          >
            {link.text}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AuthNavigation;
