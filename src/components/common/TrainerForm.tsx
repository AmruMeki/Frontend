import { useState } from 'react';

type Trainer = {
  id: number;
  name: string;
  phone?: string;
  specialization?: string;
  salary?: number;
};

export default function TrainerForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Partial<Trainer>;
  onCancel?: () => void;
  onSave: (t: Trainer) => void;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [spec, setSpec] = useState(initial?.specialization || '');
  const [salary, setSalary] = useState<number>(initial?.salary ?? 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (salary < 0) e.salary = 'Salary must be >= 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const trainer: Trainer = {
      id: initial?.id ?? Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      specialization: spec.trim(),
      salary: Number(salary),
    };
    onSave(trainer);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600">Name*</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border p-2"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Specialization</label>
        <input
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">
          Salary (USD/month)
        </label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="mt-1 w-full rounded border p-2"
        />
        {errors.salary && (
          <p className="text-sm text-red-600">{errors.salary}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Save
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
