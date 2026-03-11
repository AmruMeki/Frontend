import { useState, useEffect } from 'react';

type Payment = {
  id: number;
  member_id: number;
  amount: number;
  payment_date: string; // YYYY-MM-DD
  due_date?: string; // YYYY-MM-DD
  method: string; // Cash, Card, Online
  status: 'Paid' | 'Unpaid' | 'Late';
};

export default function PaymentForm({
  onSave,
}: {
  onSave: (p: Payment) => void;
}) {
  const [members, setMembers] = useState<any[]>([]);
  const [memberId, setMemberId] = useState<number | ''>('');
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>('Cash');
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    const m = JSON.parse(localStorage.getItem('members') || '[]');
    setMembers(m || []);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!memberId) return alert('Select member');
    const pd = new Date(paymentDate);
    const dd = dueDate ? new Date(dueDate) : null;
    let status: Payment['status'] = 'Paid';
    if (dd && pd > dd) status = 'Late';
    const payment: Payment = {
      id: Date.now(),
      member_id: Number(memberId),
      amount: Number(amount),
      payment_date: paymentDate,
      due_date: dueDate || undefined,
      method,
      status,
    };
    const stored = JSON.parse(localStorage.getItem('payments') || '[]');
    stored.unshift(payment);
    localStorage.setItem('payments', JSON.stringify(stored));
    onSave(payment);
    setAmount(0);
    setMemberId('');
    setDueDate('');
    setMethod('Cash');
    setPaymentDate(new Date().toISOString().slice(0, 10));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600">Member</label>
        <select
          value={memberId}
          onChange={(e) => setMemberId(Number(e.target.value) || '')}
          className="mt-1 w-full rounded border p-2"
        >
          <option value="">-- choose member --</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.fullName || m.name || `#${m.id}`}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          >
            <option>Cash</option>
            <option>Card</option>
            <option>Online</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Payment Date</label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">
            Due Date (optional)
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Record Payment
        </button>
      </div>
    </form>
  );
}
