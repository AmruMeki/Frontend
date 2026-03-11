import PageMeta from '../components/common/PageMeta';
import { useEffect, useState } from 'react';

type Member = { id: number; fullName?: string; name?: string };

type AttendanceRecord = {
  date: string; // YYYY-MM-DD
  records: { member_id: number; status: 'present' | 'absent' }[];
};

const ATT_KEY = 'attendance';
const MEMBERS_KEY = 'members';

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function Attendance() {
  const [date, setDate] = useState<string>(formatDate(new Date()));
  const [members, setMembers] = useState<Member[]>([]);
  const [records, setRecords] = useState<Record<number, 'present' | 'absent'>>(
    {},
  );
  const [history, setHistory] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const m = JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');
    setMembers(m || []);
    const h = JSON.parse(localStorage.getItem(ATT_KEY) || '[]');
    setHistory(h || []);
  }, []);

  useEffect(() => {
    // load records for selected date
    const h: AttendanceRecord[] =
      JSON.parse(localStorage.getItem(ATT_KEY) || '[]') || [];
    const rec = h.find((r) => r.date === date);
    const map: Record<number, 'present' | 'absent'> = {};
    if (rec) {
      rec.records.forEach((r) => (map[r.member_id] = r.status));
    }
    // default absent
    members.forEach((m) => {
      if (!map[m.id]) map[m.id] = 'absent';
    });
    setRecords(map);
  }, [date, members]);

  function toggle(memberId: number) {
    setRecords((s) => ({
      ...s,
      [memberId]: s[memberId] === 'present' ? 'absent' : 'present',
    }));
  }

  function save() {
    const out: AttendanceRecord[] =
      JSON.parse(localStorage.getItem(ATT_KEY) || '[]') || [];
    const rec: AttendanceRecord = {
      date,
      records: members.map((m) => ({
        member_id: m.id,
        status: records[m.id] || 'absent',
      })),
    };
    const others = out.filter((o) => o.date !== date);
    const merged = [rec, ...others].sort((a, b) => (a.date < b.date ? 1 : -1));
    localStorage.setItem(ATT_KEY, JSON.stringify(merged));
    setHistory(merged);
    alert('Attendance saved for ' + date);
  }

  return (
    <>
      <PageMeta title="Attendance" description="Track member attendance" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Mark Attendance</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm text-gray-600">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 rounded border p-2"
                />
              </div>
              <div className="text-right">
                <button
                  onClick={save}
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Save Attendance
                </button>
              </div>
            </div>

            <div className="mt-4">
              <ul className="space-y-2">
                {members.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between rounded border p-3"
                  >
                    <div>{m.fullName || m.name || `#${m.id}`}</div>
                    <div>
                      <button
                        onClick={() => toggle(m.id)}
                        className={`px-3 py-1 rounded ${records[m.id] === 'present' ? 'bg-green-600 text-white' : 'border'}`}
                      >
                        {records[m.id] === 'present' ? 'Present' : 'Absent'}
                      </button>
                    </div>
                  </li>
                ))}
                {members.length === 0 && (
                  <li className="text-sm text-gray-500">
                    No members found. Add members at /members
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Attendance History</h3>
            <div className="mt-4 space-y-3">
              {history.length === 0 && (
                <p className="text-sm text-gray-500">
                  No attendance records yet.
                </p>
              )}
              {history.map((h) => (
                <div key={h.date} className="rounded border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{h.date}</div>
                    <div className="text-sm text-gray-500">
                      {h.records.filter((r) => r.status === 'present').length}{' '}
                      present
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
