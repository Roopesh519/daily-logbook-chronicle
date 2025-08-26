import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { TimePicker } from '@/components/ui/time-picker';
import { Clock, Plus, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface TimelineItem {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface DailyUpdate {
  date: string;
  timeline: TimelineItem[];
  summary: {
    pr: number;
    cardsMoved: string[];
    meetingHours: string;
    sbtHours: string;
    bugs: number;
  };
}

interface TimelineEntryProps {
  date: string;
  onSave: (update: DailyUpdate) => void;
  existingUpdate?: DailyUpdate;
}

export const TimelineEntry = ({ date, onSave, existingUpdate }: TimelineEntryProps) => {
  const { toast } = useToast();
  const [timeline, setTimeline] = useState<TimelineItem[]>(
    existingUpdate?.timeline || [{ id: '1', startTime: '', endTime: '', description: '' }]
  );
  const [summary, setSummary] = useState(
    existingUpdate?.summary || {
      pr: 0,
      cardsMoved: [],
      meetingHours: '',
      sbtHours: '',
      bugs: 0
    }
  );

  const addTimelineItem = () => {
    const newItem: TimelineItem = {
      id: Date.now().toString(),
      startTime: '',
      endTime: '',
      description: ''
    };
    setTimeline([...timeline, newItem]);
  };

  const updateTimelineItem = (id: string, field: keyof TimelineItem, value: string) => {
    setTimeline(timeline.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeTimelineItem = (id: string) => {
    setTimeline(timeline.filter(item => item.id !== id));
  };

  const handleSave = () => {
    const validTimeline = timeline.filter(item => 
      item.startTime && item.endTime && item.description
    );
    
    if (validTimeline.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one timeline entry",
        variant: "destructive"
      });
      return;
    }

    const update: DailyUpdate = {
      date,
      timeline: validTimeline,
      summary
    };

    onSave(update);
    toast({
      title: "Success",
      description: "Daily update saved successfully!",
      variant: "default"
    });
  };

  const copyToClipboard = () => {
    const timelineText = timeline
      .filter(item => item.startTime && item.endTime && item.description)
      .map(item => `${item.startTime} - ${item.endTime} - ${item.description}`)
      .join('\n');
    
    const summaryText = `
Update:
PR - ${summary.pr}
Cards moved: ${summary.cardsMoved.join(', ')}
Meeting: ${summary.meetingHours}
SBT: ${summary.sbtHours}
Bugs: ${summary.bugs}`;

    const fullText = timelineText + '\n' + summaryText;
    
    navigator.clipboard.writeText(fullText);
    toast({
      title: "Copied!",
      description: "Timeline and summary copied to clipboard",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Daily Timeline</h2>
            <p className="text-muted-foreground">{new Date(date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={copyToClipboard}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button 
            onClick={handleSave}
            className="gap-2 bg-gradient-primary text-white shadow-medium hover:shadow-strong transition-all duration-300"
          >
            Save Update
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-gradient-card shadow-soft">
        <h3 className="text-lg font-medium mb-4 text-foreground">Timeline Entries</h3>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={item.id} className="flex gap-3 items-start group">
              <div className="flex gap-2 min-w-0 flex-1">
                <TimePicker
                  value={item.startTime}
                  onChange={(value) => updateTimelineItem(item.id, 'startTime', value)}
                  placeholder="09:30"
                />
                <span className="text-muted-foreground self-center">-</span>
                <TimePicker
                  value={item.endTime}
                  onChange={(value) => updateTimelineItem(item.id, 'endTime', value)}
                  placeholder="10:00"
                />
                <Input
                  placeholder="What did you work on?"
                  value={item.description}
                  onChange={(e) => updateTimelineItem(item.id, 'description', e.target.value)}
                  className="flex-1"
                />
              </div>
              {timeline.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimelineItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          onClick={addTimelineItem}
          variant="outline"
          className="mt-4 w-full gap-2 hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Timeline Entry
        </Button>
      </Card>

      <Card className="p-6 bg-gradient-card shadow-soft">
        <h3 className="text-lg font-medium mb-4 text-foreground">Daily Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">PRs</label>
            <Input
              type="number"
              value={summary.pr}
              onChange={(e) => setSummary({...summary, pr: parseInt(e.target.value) || 0})}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Bugs</label>
            <Input
              type="number"
              value={summary.bugs}
              onChange={(e) => setSummary({...summary, bugs: parseInt(e.target.value) || 0})}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Meeting Hours</label>
            <Input
              placeholder="1h 45m"
              value={summary.meetingHours}
              onChange={(e) => setSummary({...summary, meetingHours: e.target.value})}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">SBT Hours</label>
            <Input
              placeholder="5h"
              value={summary.sbtHours}
              onChange={(e) => setSummary({...summary, sbtHours: e.target.value})}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Cards Moved</label>
            <Textarea
              placeholder="INDY-532, INDY-518, INDY-23, INDY-625, INDY-623"
              value={summary.cardsMoved.join(', ')}
              onChange={(e) => setSummary({
                ...summary, 
                cardsMoved: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              })}
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};