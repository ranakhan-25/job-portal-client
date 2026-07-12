const DashboardPage = () => {
  return (
    <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Use the sidebar links to access your dashboard tools, manage
            campaigns, review contributions, and update your settings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Current role
            </p>
            <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
              User
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quick actions
            </p>
            <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
              Open sidebar
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Settings
            </p>
            <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
              Update profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
