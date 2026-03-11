import PageMeta from '../components/common/PageMeta';
import MemberForm from '../components/common/MemberForm';

export default function Members() {
  return (
    <>
      <PageMeta title="Members | Admin" description="Member management" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold">Member Registration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Register new members quickly from here.
          </p>
          <div className="mt-4">
            <MemberForm />
          </div>
        </div>
      </div>
    </>
  );
}
