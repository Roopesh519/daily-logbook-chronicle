import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const TimePicker = ({ value, onChange, placeholder, className }: TimePickerProps) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      type="time"
      value={value}
      onChange={handleTimeChange}
      placeholder={placeholder}
      className={cn("w-20", className)}
    />
  );
};