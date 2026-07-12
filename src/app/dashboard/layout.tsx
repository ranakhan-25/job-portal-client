import Sidebar from "@/services/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="lg:flex lg:min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
