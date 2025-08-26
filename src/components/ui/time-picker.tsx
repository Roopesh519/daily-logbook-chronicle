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
  format?: '12h' | '24h';
}

export const TimePicker = ({ value, onChange, placeholder, className, format = '12h' }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [is12Hour, setIs12Hour] = useState(format === '12h');
  
  // Parse current time value
  const [hours, minutes] = value ? value.split(':') : ['', ''];
  
  // Convert 24h to 12h for display
  const get12HourDisplay = (hour24: string) => {
    if (!hour24) return '';
    const hour = parseInt(hour24);
    return hour === 0 ? '12' : hour > 12 ? (hour - 12).toString() : hour.toString();
  };
  
  // Get AM/PM for current time
  const getAmPm = (hour24: string) => {
    if (!hour24) return 'AM';
    const hour = parseInt(hour24);
    return hour >= 12 ? 'PM' : 'AM';
  };
  
  // Convert 12h to 24h
  const convert12To24 = (hour12: string, ampm: string) => {
    if (!hour12) return '00';
    let hour = parseInt(hour12);
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return hour.toString().padStart(2, '0');
  };
  
  const handleHourChange = (hour: string) => {
    let newHour = hour;
    if (is12Hour) {
      newHour = convert12To24(hour, getAmPm(hours));
    } else {
      newHour = hour.padStart(2, '0');
    }
    const newTime = `${newHour}:${minutes || '00'}`;
    onChange(newTime);
  };
  
  const handleMinuteChange = (minute: string) => {
    const newTime = `${hours || '09'}:${minute.padStart(2, '0')}`;
    onChange(newTime);
  };
  
  const handleAmPmChange = (ampm: string) => {
    if (!hours) return;
    const current12Hour = get12HourDisplay(hours);
    const newHour = convert12To24(current12Hour, ampm);
    const newTime = `${newHour}:${minutes || '00'}`;
    onChange(newTime);
  };
  
  const formatDisplayTime = (time: string) => {
    if (!time) return placeholder || 'Select time';
    const [h, m] = time.split(':');
    if (is12Hour) {
      const hour12 = get12HourDisplay(h);
      const ampm = getAmPm(h);
      return `${hour12}:${m} ${ampm}`;
    }
    return `${h}:${m}`;
  };
  
  // Generate hour options based on format
  const getHourOptions = () => {
    if (is12Hour) {
      return Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    } else {
      return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    }
  };
  
  // Generate minute options (00, 05, 10, 15, 30, 45)
  const minuteOptions = ['00','05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  
  // Get current display values
  const displayHour = is12Hour ? get12HourDisplay(hours) : hours;
  const displayAmPm = getAmPm(hours);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-28 justify-start text-left font-normal",
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
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Select Time</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIs12Hour(!is12Hour)}
              className="text-xs"
            >
              {is12Hour ? '12H' : '24H'}
            </Button>
          </div>
          
          {/* Time selectors */}
          <div className={cn("grid gap-3", is12Hour ? "grid-cols-3" : "grid-cols-2")}>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Hour</label>
              <Select value={displayHour} onValueChange={handleHourChange}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="h-40">
                  {getHourOptions().map((hour) => (
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
                <SelectContent className="h-40">
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {is12Hour && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">AM/PM</label>
                <Select value={displayAmPm} onValueChange={handleAmPmChange}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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