import { useState, useEffect } from 'react';

type Workout = {
  id: number;
  program_name: string;
  trainer_id?: number | null;
  exercises: string[]; // simple list
  assigned_member_id?: number | null;
  progress?: number; // 0-100
  logs?: { id: number; date: string; exercise: string; notes?: string }[];
};

export default function WorkoutForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Workout>;
  onSave: (w: Workout) => void;
  onCancel?: () => void;
}) {
  const [programName, setProgramName] = useState(initial?.program_name || '');
  const [trainerId, setTrainerId] = useState<number | ''>(
    initial?.trainer_id ?? '',
  );
  const [exercisesText, setExercisesText] = useState(
    (initial?.exercises || []).join('\n'),
  );
  const [progress, setProgress] = useState<number>(initial?.progress ?? 0);
  const [trainers, setTrainers] = useState<any[]>([]);

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem('trainers') || '[]');
    setTrainers(t || []);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const w: Workout = {
      id: initial?.id ?? Date.now(),
      program_name: programName.trim() || 'Unnamed Program',
      trainer_id: trainerId === '' ? undefined : Number(trainerId),
      exercises: exercisesText
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
      assigned_member_id: initial?.assigned_member_id ?? undefined,
      progress,
      logs: initial?.logs || [],
    };
    onSave(w);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600">Program Name</label>
        <input
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Trainer</label>
        <select
          value={trainerId}
          onChange={(e) => setTrainerId(Number(e.target.value) || '')}
          className="mt-1 w-full rounded border p-2"
        >
          <option value="">-- none --</option>
          {trainers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600">
          Exercises (one per line)
        </label>
        <textarea
          value={exercisesText}
          onChange={(e) => setExercisesText(e.target.value)}
          className="mt-1 w-full rounded border p-2"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Progress (%)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="mt-1 w-32 rounded border p-2"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Save Program
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border px-3 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
