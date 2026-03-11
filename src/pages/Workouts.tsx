import PageMeta from '../components/common/PageMeta';
import WorkoutForm from '../components/common/WorkoutForm';
import { useEffect, useState } from 'react';

type Workout = {
  id: number;
  program_name: string;
  trainer_id?: number | null;
  exercises: string[];
  assigned_member_id?: number | null;
  progress?: number;
  logs?: { id: number; date: string; exercise: string; notes?: string }[];
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [editing, setEditing] = useState<Workout | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [exerciseName, setExerciseName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const w = JSON.parse(localStorage.getItem('workouts') || '[]');
    setWorkouts(w || []);
    const m = JSON.parse(localStorage.getItem('members') || '[]');
    setMembers(m || []);
  }, []);

  function save(list: Workout[]) {
    setWorkouts(list);
    localStorage.setItem('workouts', JSON.stringify(list));
  }

  function handleSave(w: Workout) {
    const exists = workouts.find((x) => x.id === w.id);
    const list = exists
      ? workouts.map((x) => (x.id === w.id ? w : x))
      : [w, ...workouts];
    save(list);
    setEditing(null);
  }

  function handleDelete(id: number) {
    if (!confirm('Delete program?')) return;
    const list = workouts.filter((w) => w.id !== id);
    save(list);
  }

  function assignProgramToMember(programId: number, memberId: number) {
    const list = workouts.map((w) =>
      w.id === programId ? { ...w, assigned_member_id: memberId } : w,
    );
    save(list);
    alert('Program assigned to member.');
  }

  function logExercise() {
    if (!selectedWorkout) return alert('Select a program to log');
    if (!exerciseName.trim()) return alert('Enter exercise name');
    const list = workouts.map((w) => {
      if (w.id !== selectedWorkout) return w;
      const logs = w.logs ? [...w.logs] : [];
      logs.unshift({
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        exercise: exerciseName.trim(),
        notes: notes.trim() || undefined,
      });
      return { ...w, logs };
    });
    save(list);
    setExerciseName('');
    setNotes('');
  }

  return (
    <>
      <PageMeta title="Workouts" description="Manage workout programs" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Create / Edit Program</h3>
            <div className="mt-4">
              <WorkoutForm
                initial={editing || undefined}
                onSave={handleSave}
                onCancel={() => setEditing(null)}
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h4 className="font-semibold">Assign Program</h4>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm text-gray-600">Program</label>
                <select
                  className="mt-1 w-full rounded border p-2"
                  onChange={(e) =>
                    setSelectedWorkout(Number(e.target.value) || null)
                  }
                  value={selectedWorkout ?? ''}
                >
                  <option value="">-- choose program --</option>
                  {workouts.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.program_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Member</label>
                <select
                  className="mt-1 w-full rounded border p-2"
                  onChange={(e) => {
                    if (!selectedWorkout) return;
                    const mid = Number(e.target.value);
                    assignProgramToMember(selectedWorkout, mid);
                  }}
                >
                  <option value="">-- choose member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName || m.name || `#${m.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-4">
            <h3 className="text-lg font-semibold">Programs</h3>
            <div className="mt-4 space-y-3">
              {workouts.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <div className="font-medium">{w.program_name}</div>
                    <div className="text-sm text-gray-500">
                      Assigned to:{' '}
                      {(w.assigned_member_id &&
                        (
                          members.find((m) => m.id === w.assigned_member_id) ||
                          {}
                        ).fullName) ||
                        '—'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Exercises: {w.exercises.length}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(w)}
                      className="rounded border px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="rounded border px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {workouts.length === 0 && (
                <p className="text-sm text-gray-500">No programs yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-4">
            <h3 className="text-lg font-semibold">Log Exercise</h3>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm text-gray-600">Program</label>
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={selectedWorkout ?? ''}
                  onChange={(e) =>
                    setSelectedWorkout(Number(e.target.value) || null)
                  }
                >
                  <option value="">-- choose program --</option>
                  {workouts.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.program_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Exercise</label>
                <input
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="mt-1 w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Notes</label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded border p-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={logExercise}
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Log Exercise
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Training History</h3>
            <div className="mt-4 space-y-4">
              {workouts.map((w) => (
                <div key={`hist-${w.id}`}>
                  <div className="font-medium">{w.program_name}</div>
                  <div className="text-sm text-gray-500">Logs:</div>
                  <ul className="mt-2 ml-4 list-disc text-sm">
                    {(w.logs || []).slice(0, 10).map((log) => (
                      <li key={log.id}>
                        {log.date} — {log.exercise}
                        {log.notes ? ` — ${log.notes}` : ''}
                      </li>
                    ))}
                    {(!w.logs || w.logs.length === 0) && (
                      <li className="text-sm text-gray-500">No logs yet.</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
