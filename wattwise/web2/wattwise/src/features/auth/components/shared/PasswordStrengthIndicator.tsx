import React from 'react';

interface PasswordCheck {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordCheck: PasswordCheck;
  isDark?: boolean;
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 6 || password.length > 10) {
    errors.push("Password harus 6-10 karakter");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Minimal 1 huruf besar");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Minimal 1 huruf kecil");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Minimal 1 angka");
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~]/.test(password)) {
    errors.push("Minimal 1 tanda baca");
  }
  
  return { isValid: errors.length === 0, errors };
}

export function getPasswordCheck(password: string): PasswordCheck {
  return {
    length: password.length >= 6 && password.length <= 10,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~]/.test(password),
  };
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  passwordCheck,
  isDark = false
}) => {
  const passwordStrength = Object.values(passwordCheck).filter(Boolean).length;
  
  const getStrengthColor = () => {
    if (passwordStrength === 0) return isDark ? 'bg-slate-700' : 'bg-gray-300';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Lemah';
    if (passwordStrength <= 4) return 'Sedang';
    return 'Kuat';
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < passwordStrength ? getStrengthColor() : isDark ? 'bg-slate-700' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      {/* Strength Text */}
      {passwordStrength > 0 && (
        <p className={`text-xs font-medium ${
          passwordStrength <= 2 ? 'text-red-500' :
          passwordStrength <= 4 ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          Kekuatan Password: {getStrengthText()}
        </p>
      )}

      {/* Requirements List */}
      <div className={`text-xs space-y-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
        <div className="flex items-center gap-1.5">
          <svg className={`w-3 h-3 ${passwordCheck.length ? 'text-green-500' : isDark ? 'text-slate-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>6-10 karakter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className={`w-3 h-3 ${passwordCheck.uppercase ? 'text-green-500' : isDark ? 'text-slate-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>1 huruf besar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className={`w-3 h-3 ${passwordCheck.lowercase ? 'text-green-500' : isDark ? 'text-slate-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>1 huruf kecil</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className={`w-3 h-3 ${passwordCheck.number ? 'text-green-500' : isDark ? 'text-slate-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>1 angka</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className={`w-3 h-3 ${passwordCheck.special ? 'text-green-500' : isDark ? 'text-slate-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>1 tanda baca (!@#$%^&*...)</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
