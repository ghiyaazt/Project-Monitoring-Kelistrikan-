import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete?: (otp: string) => void;
  isDark?: boolean;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  isDark = false,
  disabled = false
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Check if OTP is complete and call onComplete
  useEffect(() => {
    if (value.every(digit => digit !== '') && onComplete) {
      onComplete(value.join(''));
    }
  }, [value, onComplete]);

  function handleChange(index: number, inputValue: string) {
    // Only allow numbers
    if (inputValue && !/^\d$/.test(inputValue)) return;

    const newOtp = [...value];
    newOtp[index] = inputValue;
    onChange(newOtp);

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current is empty, go back and clear previous
        const newOtp = [...value];
        newOtp[index - 1] = "";
        onChange(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (value[index]) {
        // Clear current
        const newOtp = [...value];
        newOtp[index] = "";
        onChange(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length).split("");
    
    if (pastedData.every(char => /^\d$/.test(char))) {
      const newOtp = [...value];
      pastedData.forEach((char, i) => {
        if (i < length) newOtp[i] = char;
      });
      onChange(newOtp);
      
      // Focus last filled input or last input
      const lastIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[lastIndex]?.focus();
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all ${
            isDark
              ? value[index]
                ? 'bg-slate-700 border-teal-500 text-white'
                : 'bg-slate-800 border-slate-600 text-white focus:border-teal-500'
              : value[index]
              ? 'bg-white border-teal-500 text-gray-900'
              : 'bg-white border-gray-300 text-gray-900 focus:border-teal-500'
          } focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
          }`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
