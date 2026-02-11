import { DashboardNav } from "@/components/nav/dashboard-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Dashboard Navigation */}
      <DashboardNav />

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
