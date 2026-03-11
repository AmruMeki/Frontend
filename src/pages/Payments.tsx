import PageMeta from '../components/common/PageMeta';
import PaymentForm from '../components/common/PaymentForm';
import { useEffect, useState } from 'react';

type Payment = {
  id: number;
  member_id: number;
  amount: number;
  payment_date: string;
  due_date?: string;
  method: string;
  status: 'Paid' | 'Unpaid' | 'Late';
};

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem('payments') || '[]');
    setPayments(p || []);
    const m = JSON.parse(localStorage.getItem('members') || '[]');
    setMembers(m || []);
  }, []);

  function handleNew(p: Payment) {
    setPayments((s) => [p, ...s]);
  }

  // Unpaid members: members with membership_plan_id and no payment with payment_date >= membership_start_date
  const unpaid = members.filter((m) => {
    if (!m.membership_plan_id || !m.membership_start_date) return false;
    const hasPaid = payments.some(
      (pay) =>
        pay.member_id === m.id &&
        new Date(pay.payment_date) >= new Date(m.membership_start_date),
    );
    return !hasPaid;
  });

  // Reminders: payments whose due_date within next 7 days and not Paid
  const reminders = payments.filter(
    (p) =>
      p.due_date &&
      p.status !== 'Paid' &&
      (() => {
        const today = new Date();
        const dd = new Date(p.due_date as string);
        const diff = (dd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
      })(),
  );

  // Late payments
  const late = payments.filter((p) => p.status === 'Late');

  return (
    <>
      <PageMeta title="Payments" description="Record and track payments" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Record Payment</h3>
            <div className="mt-4">
              <PaymentForm onSave={handleNew} />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h4 className="font-semibold">Payment Reminders</h4>
            {reminders.length ? (
              <ul className="mt-2 space-y-2">
                {reminders.map((r) => (
                  <li key={r.id} className="text-sm">
                    Member #{r.member_id} • Due {r.due_date} • {r.method}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No upcoming due payments.
              </p>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-4">
            <h3 className="text-lg font-semibold">Unpaid Members</h3>
            {unpaid.length ? (
              <ul className="mt-3 space-y-2">
                {unpaid.map((m) => (
                  <li key={m.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {m.fullName || m.name || `#${m.id}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        Expires: {m.membership_expiry_date || 'N/A'}
                      </div>
                    </div>
                    <div className="text-sm text-red-600">Unpaid</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No unpaid members found.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Payment History</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2">Member</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Payment Date</th>
                    <th className="pb-2">Due Date</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y mt-2">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {(members.find((m) => m.id === p.member_id) || {})
                          .fullName || `#${p.member_id}`}
                      </td>
                      <td>${p.amount}</td>
                      <td>{p.method}</td>
                      <td>{p.payment_date}</td>
                      <td>{p.due_date || '-'}</td>
                      <td
                        className={`font-medium ${p.status === 'Late' ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h4 className="font-semibold">Late Payments</h4>
            {late.length ? (
              <ul className="mt-2 space-y-2">
                {late.map((l) => (
                  <li key={l.id} className="text-sm">
                    Member #{l.member_id} • Due {l.due_date} • ${l.amount}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No late payments.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
