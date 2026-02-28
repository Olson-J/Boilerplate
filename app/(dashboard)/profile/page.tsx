import { Card } from "@/components/ui/Card";
import { ProfilePageClient } from "@/components/auth/ProfilePageClient";
import { requireAuth } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Default avatar SVG as a data URL
const DEFAULT_AVATAR_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23cbd5e1'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%2394a3b8'/%3E%3Cpath d='M 20 80 Q 20 60 50 60 Q 80 60 80 80' fill='%2394a3b8'/%3E%3C/svg%3E`;

export default async function ProfilePage() {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  // Fetch profile from database
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, avatar_url")
    .eq("id", user.id)
    .single();

  const initialFullName = profile?.full_name || "";
  const initialBio = profile?.bio || "";
  const avatarUrl = profile?.avatar_url || DEFAULT_AVATAR_SVG;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Display current profile */}
        <Card>
          <div className="flex items-start gap-4">
            <img 
              src={avatarUrl} 
              alt="Profile avatar" 
              className="h-20 w-20 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-grow">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Your profile
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                {initialFullName || "User Profile"}
              </h1>
              <p className="text-slate-600 mt-1">
                <span className="font-medium">{user.email}</span>
              </p>
              {initialBio && (
                <p className="text-slate-600 mt-3 text-sm">{initialBio}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Update profile form */}
        <Card title="Update profile" description="Change your account details.">
          <ProfilePageClient initialFullName={initialFullName} initialBio={initialBio} />
        </Card>
      </div>
    </main>
  );
}
