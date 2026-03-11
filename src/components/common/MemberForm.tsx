import { useState } from 'react';

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  goals: string;
  service: string;
};

const initialState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  goals: '',
  service: 'Gym Fitness',
};

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  return /^[-+()0-9\s]{6,20}$/.test(phone);
}

export default function MemberForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function validate() {
    const err: Partial<FormState> = {};
    if (!form.fullName.trim()) err.fullName = 'Full name is required';
    if (!form.email.trim()) err.email = 'Email is required';
    else if (!validateEmail(form.email)) err.email = 'Enter a valid email';
    if (!form.phone.trim()) err.phone = 'Phone number is required';
    else if (!validatePhone(form.phone))
      err.phone = 'Enter a valid phone number';
    if (!form.service) err.service = 'Select a service';
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Mock save: persist to localStorage for now
      const stored = JSON.parse(localStorage.getItem('members') || '[]');
      stored.push({ id: Date.now(), ...form });
      localStorage.setItem('members', JSON.stringify(stored));
      setSuccess('Member registered successfully.');
      setForm(initialState);
      setErrors({});
    } catch (err) {
      setSuccess('Failed to save member.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="rounded p-2 bg-green-50 text-green-700">{success}</div>
      )}

      <div>
        <label className="block text-sm text-gray-600">Full Name*</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="mt-1 w-full rounded border-gray-200 p-2"
        />
        {errors.fullName && (
          <p className="text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Email Address*</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className="mt-1 w-full rounded border-gray-200 p-2"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Phone Number*</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          type="tel"
          className="mt-1 w-full rounded border-gray-200 p-2"
        />
        {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-600">Goals</label>
        <textarea
          name="goals"
          value={form.goals}
          onChange={handleChange}
          className="mt-1 w-full rounded border-gray-200 p-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Type of Service*</label>
        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className="mt-1 w-full rounded border-gray-200 p-2"
        >
          <option>Gym Fitness</option>
          <option>Nutrition</option>
        </select>
        {errors.service && (
          <p className="text-sm text-red-600">{errors.service}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {submitting ? 'Saving...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={() => setForm(initialState)}
          className="rounded border px-3 py-2"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
