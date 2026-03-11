import PageMeta from '../components/common/PageMeta';
import { Link } from 'react-router';
import PublicHeader from '../layout/PublicHeader';
import BannerCarousel from '../components/common/BannerCarousel';

export default function PublicHome() {
  return (
    <>
      <PublicHeader />
      <PageMeta
        title="Welcome | Gym Management"
        description="Public landing page"
      />
      <div className="w-full">
        <BannerCarousel />
      </div>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-2xl p-8 text-center rounded-lg shadow-lg bg-white dark:bg-gray-900">
          <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
            Welcome to the Gym Management System
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Please sign in to access the admin dashboard and manage members,
            plans, and workouts.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/signin"
              className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
