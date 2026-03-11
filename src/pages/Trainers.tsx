import PageMeta from '../components/common/PageMeta';
import TrainerForm from '../components/common/TrainerForm';
import { useEffect, useState } from 'react';

type Trainer = {
  id: number;
  name: string;
  phone?: string;
  specialization?: string;
  salary?: number;
};

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [assignTrainerId, setAssignTrainerId] = useState<number | ''>('');
  const [assignMemberId, setAssignMemberId] = useState<number | ''>('');

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem('trainers') || '[]');
    setTrainers(t || []);
    const m = JSON.parse(localStorage.getItem('members') || '[]');
    setMembers(m || []);
  }, []);

  function save(list: Trainer[]) {
    setTrainers(list);
    localStorage.setItem('trainers', JSON.stringify(list));
  }

  function handleSave(t: Trainer) {
    const exists = trainers.find((x) => x.id === t.id);
    const list = exists
      ? trainers.map((x) => (x.id === t.id ? t : x))
      : [t, ...trainers];
    save(list);
    setEditing(null);
  }

  function handleDelete(id: number) {
    if (!confirm('Delete trainer?')) return;
    const list = trainers.filter((t) => t.id !== id);
    save(list);
  }

  function assign() {
    if (!assignTrainerId || !assignMemberId)
      return alert('Select trainer and member');
    const memberIndex = members.findIndex(
      (m) => m.id === Number(assignMemberId),
    );
    if (memberIndex === -1) return alert('Member not found');
    const updated = [...members];
    updated[memberIndex] = {
      ...updated[memberIndex],
      trainer_id: Number(assignTrainerId),
    };
    setMembers(updated);
    localStorage.setItem('members', JSON.stringify(updated));
    alert('Trainer assigned to member.');
  }

  return (
    <>
      <PageMeta title="Trainers" description="Manage trainers" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Add / Edit Trainer</h3>
            <div className="mt-4">
              <TrainerForm
                initial={editing || undefined}
                onCancel={() => setEditing(null)}
                onSave={handleSave}
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h4 className="font-semibold">Assign Trainer to Member</h4>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm text-gray-600">Trainer</label>
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={assignTrainerId}
                  onChange={(e) =>
                    setAssignTrainerId(Number(e.target.value) || '')
                  }
                >
                  <option value="">-- choose trainer --</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Member</label>
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={assignMemberId}
                  onChange={(e) =>
                    setAssignMemberId(Number(e.target.value) || '')
                  }
                >
                  <option value="">-- choose member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName || m.name || `#${m.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={assign}
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Trainers</h3>
            <div className="mt-4 space-y-3">
              {trainers.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-gray-500">
                      {t.specialization || '—'} • ${t.salary ?? 0}/mo
                    </div>
                    <div className="text-sm text-gray-500">
                      Assigned members:{' '}
                      {
                        (members.filter((m) => m.trainer_id === t.id) || [])
                          .length
                      }
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(t)}
                      className="rounded border px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="rounded border px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {trainers.length === 0 && (
                <p className="text-sm text-gray-500">No trainers yet.</p>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h4 className="font-semibold">Trainer Performance</h4>
            <div className="mt-3 space-y-2">
              {trainers.map((t) => {
                const assigned = members.filter(
                  (m) => m.trainer_id === t.id,
                ).length;
                return (
                  <div
                    key={`perf-${t.id}`}
                    className="flex items-center justify-between"
                  >
                    <div className="text-sm">{t.name}</div>
                    <div className="text-sm text-gray-600">
                      {assigned} members
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
