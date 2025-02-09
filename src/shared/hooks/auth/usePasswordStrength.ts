import { useMemo } from 'react';

export type PasswordStrength = {
  score: number;
  feedback: string;
  color: string;
};

export const usePasswordStrength = (password: string): PasswordStrength => {
  return useMemo(() => {
    if (!password) {
      return { score: 0, feedback: "Password required", color: "bg-gray-200" };
    }

    let score = 0;
    let feedback = "";

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Feedback based on score
    switch (true) {
      case score <= 2:
        feedback = "Very weak - Use a longer password with mixed characters";
        return { score: 1, feedback, color: "bg-red-500" };
      case score <= 3:
        feedback = "Weak - Add numbers and special characters";
        return { score: 2, feedback, color: "bg-orange-500" };
      case score <= 4:
        feedback = "Medium - Add more variety of characters";
        return { score: 3, feedback, color: "bg-yellow-500" };
      case score <= 5:
        feedback = "Strong - Good password strength";
        return { score: 4, feedback, color: "bg-green-500" };
      default:
        feedback = "Very strong - Excellent password";
        return { score: 5, feedback, color: "bg-green-600" };
    }
  }, [password]);
};
