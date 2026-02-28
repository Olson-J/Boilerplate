import { Card } from "@/components/ui/Card";
import { ProfilePageClient } from "@/components/auth/ProfilePageClient";
import { requireAuth } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  // Fetch profile from database
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const initialFullName = profile?.full_name || "";
  const avatarUrl = profile?.avatar_url;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Display current profile */}
        <Card title="Your profile" description="Your current account details.">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <p className="text-slate-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <p className="text-slate-900">{initialFullName || "Not set"}</p>
            </div>
            {avatarUrl && (
              <div>
                <label className="text-sm font-medium text-slate-700">Avatar</label>
                <img src={avatarUrl} alt="Avatar" className="mt-2 h-20 w-20 rounded-full object-cover" />
              </div>
            )}
          </div>
        </Card>

        {/* Update profile form */}
        <Card title="Update profile" description="Change your account details.">
          <ProfilePageClient initialFullName={initialFullName} />
        </Card>
      </div>
    </main>
  );
}
