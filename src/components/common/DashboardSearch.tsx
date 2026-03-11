import { useState } from 'react';

export default function DashboardSearch() {
  const [q, setQ] = useState('');

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <label className="block text-sm text-gray-500 mb-2">
        Quick member search
      </label>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, phone or member ID"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button className="rounded-lg bg-blue-600 px-4 text-sm text-white">
          Search
        </button>
      </div>
    </div>
  );
}
