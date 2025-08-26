import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, Clock, FileText, GitPullRequest, Bug, Users, Calendar } from 'lucide-react';
import { DailyUpdate } from './TimelineEntry';
import { useToast } from '@/hooks/use-toast';

interface TimelineViewProps {
  update: DailyUpdate;
  onEdit: () => void;
}

export const TimelineView = ({ update, onEdit }: TimelineViewProps) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    const timelineText = update.timeline
      .map(item => `${item.startTime} - ${item.endTime} - ${item.description}`)
      .join('\n');
    
    const summaryText = `
Update:
PR - ${update.summary.pr}
Cards moved: ${update.summary.cardsMoved.join(', ')}
Meeting: ${update.summary.meetingHours}
SBT: ${update.summary.sbtHours}
Bugs: ${update.summary.bugs}`;

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
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Daily Update</h2>
            <p className="text-muted-foreground">{new Date(update.date).toLocaleDateString('en-US', { 
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
            onClick={onEdit}
            className="gap-2 bg-gradient-primary text-white shadow-medium hover:shadow-strong transition-all duration-300"
          >
            Edit
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-gradient-card shadow-soft">
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-foreground">
          <Clock className="w-5 h-5 text-primary" />
          Timeline
        </h3>
        
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-timeline-line"></div>
          
          <div className="space-y-4">
            {update.timeline.map((item, index) => (
              <div key={item.id} className="relative flex items-start gap-4 group">
                <div className="relative z-10 w-8 h-8 rounded-full bg-timeline-dot flex items-center justify-center shadow-soft">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-medium text-primary">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                  <p className="text-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card shadow-soft">
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-foreground">
          <FileText className="w-5 h-5 text-primary" />
          Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-xl bg-gradient-secondary">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <GitPullRequest className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{update.summary.pr}</div>
            <div className="text-sm text-muted-foreground">PRs</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-secondary">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
              <Bug className="w-5 h-5 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">{update.summary.bugs}</div>
            <div className="text-sm text-muted-foreground">Bugs</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-secondary">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div className="text-2xl font-bold text-foreground">{update.summary.meetingHours}</div>
            <div className="text-sm text-muted-foreground">Meeting</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-secondary">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{update.summary.sbtHours}</div>
            <div className="text-sm text-muted-foreground">SBT</div>
          </div>
        </div>
        
        {update.summary.cardsMoved.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-secondary">
            <h4 className="font-medium text-foreground mb-2">Cards Moved</h4>
            <div className="flex flex-wrap gap-2">
              {update.summary.cardsMoved.map((card, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-mono"
                >
                  {card}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};