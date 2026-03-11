import PageMeta from '../components/common/PageMeta';
import PlanForm from '../components/common/PlanForm';
import { useEffect, useState } from 'react';

type Plan = {
  id: number;
  plan_name: string;
  duration_months: number;
  price: number;
};

type Member = {
  id: number;
  name?: string;
  membership_plan_id?: number | null;
  membership_start_date?: string | null;
  membership_expiry_date?: string | null;
};

const PLANS_KEY = 'plans';
const MEMBERS_KEY = 'members';

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [assignPlanId, setAssignPlanId] = useState<number | null>(null);
  const [assignMemberId, setAssignMemberId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(PLANS_KEY) || 'null');
    if (stored && Array.isArray(stored) && stored.length) {
      setPlans(stored);
    } else {
      // seed example plans
      const seed: Plan[] = [
        {
          id: Date.now(),
          plan_name: 'Basic Plan',
          duration_months: 1,
          price: 29,
        },
        {
          id: Date.now() + 1,
          plan_name: 'Premium Plan',
          duration_months: 3,
          price: 79,
        },
        {
          id: Date.now() + 2,
          plan_name: 'Annual Plan',
          duration_months: 12,
          price: 299,
        },
      ];
      localStorage.setItem(PLANS_KEY, JSON.stringify(seed));
      setPlans(seed);
    }

    const m = JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');
    setMembers(m);
  }, []);

  function savePlans(list: Plan[]) {
    setPlans(list);
    localStorage.setItem(PLANS_KEY, JSON.stringify(list));
  }

  function handleSave(plan: Plan) {
    const exists = plans.find((p) => p.id === plan.id);
    const list = exists
      ? plans.map((p) => (p.id === plan.id ? plan : p))
      : [plan, ...plans];
    savePlans(list);
    setEditing(null);
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this plan?')) return;
    const list = plans.filter((p) => p.id !== id);
    savePlans(list);
  }

  function handleAssign() {
    if (!assignPlanId || !assignMemberId)
      return alert('Select plan and member');
    const plan = plans.find((p) => p.id === assignPlanId);
    const memberIndex = members.findIndex((m) => m.id === assignMemberId);
    if (!plan || memberIndex === -1) return alert('Invalid data');

    const start = new Date(startDate);
    const expiry = addMonths(start, plan.duration_months);

    const updatedMembers = [...members];
    const member = { ...updatedMembers[memberIndex] } as any;
    member.membership_plan_id = plan.id;
    member.membership_start_date = start.toISOString().slice(0, 10);
    member.membership_expiry_date = expiry.toISOString().slice(0, 10);
    updatedMembers[memberIndex] = member;
    setMembers(updatedMembers);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(updatedMembers));
    alert('Plan assigned — expiration calculated.');
  }

  return (
    <>
      <PageMeta
        title="Membership Plans"
        description="Manage membership plans"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Create / Edit Plan</h3>
            <div className="mt-4">
              <PlanForm
                initial={editing || undefined}
                onCancel={() => setEditing(null)}
                onSave={handleSave}
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Existing Plans</h3>
            <div className="mt-4 space-y-3">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <div className="font-medium">{p.plan_name}</div>
                    <div className="text-sm text-gray-500">
                      {p.duration_months} month(s) • ${p.price}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="rounded border px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded border px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Assign Plan to Member</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm text-gray-600">
                  Select Plan
                </label>
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={assignPlanId ?? ''}
                  onChange={(e) =>
                    setAssignPlanId(Number(e.target.value) || null)
                  }
                >
                  <option value="">-- choose plan --</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.plan_name} ({p.duration_months}m)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  Select Member
                </label>
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={assignMemberId ?? ''}
                  onChange={(e) =>
                    setAssignMemberId(Number(e.target.value) || null)
                  }
                >
                  <option value="">-- choose member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {(m as any).fullName || (m as any).name || `#${m.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  Start Date
                </label>
                <input
                  type="date"
                  className="mt-1 w-full rounded border p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAssign}
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Assign Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
