import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, FileText } from 'lucide-react';
import { DailyUpdate } from './TimelineEntry';

interface DateListProps {
  updates: DailyUpdate[];
  onSelectDate: (date: string) => void;
  onNewEntry: () => void;
}

export const DateList = ({ updates, onSelectDate, onNewEntry }: DateListProps) => {
  const sortedUpdates = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Daily Updates</h2>
            <p className="text-muted-foreground">Track your daily activities and progress</p>
          </div>
        </div>
        <Button 
          onClick={onNewEntry}
          className="gap-2 bg-gradient-primary text-white shadow-medium hover:shadow-strong transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>

      {sortedUpdates.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-card shadow-soft">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">No updates yet</h3>
          <p className="text-muted-foreground mb-6">Start tracking your daily activities by creating your first entry.</p>
          <Button 
            onClick={onNewEntry}
            className="gap-2 bg-gradient-primary text-white shadow-medium hover:shadow-strong transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Create First Entry
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedUpdates.map((update) => (
            <Card 
              key={update.date} 
              className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectDate(update.date)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {new Date(update.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {update.timeline.length} entries
                      </span>
                      <span>PR: {update.summary.pr}</span>
                      <span>Bugs: {update.summary.bugs}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-muted-foreground">Click to view</span>
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">→</span>
                  </div>
                </div>
              </div>
              
              {update.timeline.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Latest: {update.timeline[0].startTime} - {update.timeline[0].endTime} • {update.timeline[0].description}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};