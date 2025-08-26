import { useState } from 'react';
import { TimelineEntry, DailyUpdate } from '@/components/TimelineEntry';
import { TimelineView } from '@/components/TimelineView';
import { DateList } from '@/components/DateList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type ViewMode = 'list' | 'entry' | 'view';

const Index = () => {
  const [updates, setUpdates] = useLocalStorage<DailyUpdate[]>('daily-updates', []);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingUpdate, setEditingUpdate] = useState<DailyUpdate | undefined>();

  const handleSave = (update: DailyUpdate) => {
    const existingIndex = updates.findIndex(u => u.date === update.date);
    if (existingIndex >= 0) {
      const newUpdates = [...updates];
      newUpdates[existingIndex] = update;
      setUpdates(newUpdates);
    } else {
      setUpdates([...updates, update]);
    }
    setViewMode('view');
    setSelectedDate(update.date);
    setEditingUpdate(undefined);
  };

  const handleNewEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setEditingUpdate(undefined);
    setViewMode('entry');
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    const update = updates.find(u => u.date === date);
    setEditingUpdate(update);
    setViewMode('view');
  };

  const handleEdit = () => {
    const update = updates.find(u => u.date === selectedDate);
    setEditingUpdate(update);
    setViewMode('entry');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedDate('');
    setEditingUpdate(undefined);
  };

  const selectedUpdate = updates.find(u => u.date === selectedDate);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {viewMode !== 'list' && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 gap-2 hover:bg-primary/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Timeline
          </Button>
        )}

        {viewMode === 'list' && (
          <DateList
            updates={updates}
            onSelectDate={handleSelectDate}
            onNewEntry={handleNewEntry}
          />
        )}

        {viewMode === 'entry' && (
          <TimelineEntry
            date={selectedDate}
            onSave={handleSave}
            existingUpdate={editingUpdate}
          />
        )}

        {viewMode === 'view' && selectedUpdate && (
          <TimelineView
            update={selectedUpdate}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
