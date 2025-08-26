import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const TimePicker = ({ value, onChange, placeholder, className }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse current time value
  const [hours, minutes] = value ? value.split(':') : ['', ''];
  
  const handleHourChange = (hour: string) => {
    const newTime = `${hour.padStart(2, '0')}:${minutes || '00'}`;
    onChange(newTime);
  };
  
  const handleMinuteChange = (minute: string) => {
    const newTime = `${hours || '09'}:${minute.padStart(2, '0')}`;
    onChange(newTime);
  };
  
  const formatDisplayTime = (time: string) => {
    if (!time) return placeholder || 'Select time';
    const [h, m] = time.split(':');
    return `${h}:${m}`;
  };
  
  // Generate hour options (00-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  
  // Generate minute options (00, 15, 30, 45)
  const minuteOptions = ['00', '15', '30', '45'];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-24 justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayTime(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium text-center">Select Time</div>
          
          {/* Clock-style visual representation */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-border bg-background"></div>
            
            {/* Hour markers */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30) - 90; // 30 degrees per hour, start at 12
              const radian = (angle * Math.PI) / 180;
              const x = 50 + 35 * Math.cos(radian);
              const y = 50 + 35 * Math.sin(radian);
              const hour = i === 0 ? 12 : i;
              
              return (
                <div
                  key={i}
                  className="absolute w-6 h-6 flex items-center justify-center text-xs font-medium transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {hour}
                </div>
              );
            })}
            
            {/* Clock hands visualization */}
            {hours && (
              <div
                className="absolute w-0.5 bg-primary origin-bottom transform -translate-x-1/2"
                style={{
                  height: '25%',
                  left: '50%',
                  top: '25%',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${((parseInt(hours) % 12) * 30) - 90}deg)`
                }}
              />
            )}
            
            {/* Center dot */}
            <div className="absolute w-2 h-2 bg-primary rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Time selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Hour</label>
              <Select value={hours} onValueChange={handleHourChange}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="h-40">
                  {hourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Minute</label>
              <Select value={minutes} onValueChange={handleMinuteChange}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};