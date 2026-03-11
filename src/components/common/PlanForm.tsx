import { useState } from 'react';

type Plan = {
  id: number;
  plan_name: string;
  duration_months: number;
  price: number;
};

export default function PlanForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Partial<Plan>;
  onCancel?: () => void;
  onSave: (plan: Plan) => void;
}) {
  const [planName, setPlanName] = useState(initial?.plan_name || '');
  const [duration, setDuration] = useState(initial?.duration_months ?? 1);
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!planName.trim()) e.planName = 'Plan name required';
    if (!duration || duration <= 0) e.duration = 'Duration must be > 0';
    if (price < 0) e.price = 'Price must be >= 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const plan: Plan = {
      id: initial?.id ?? Date.now(),
      plan_name: planName,
      duration_months: Number(duration),
      price: Number(price),
    };
    onSave(plan);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600">Plan Name*</label>
        <input
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          className="mt-1 w-full rounded border p-2"
        />
        {errors.planName && (
          <p className="text-sm text-red-600">{errors.planName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600">
            Duration (months)*
          </label>
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 w-full rounded border p-2"
          />
          {errors.duration && (
            <p className="text-sm text-red-600">{errors.duration}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-600">Price (USD)*</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 w-full rounded border p-2"
          />
          {errors.price && (
            <p className="text-sm text-red-600">{errors.price}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Save Plan
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
