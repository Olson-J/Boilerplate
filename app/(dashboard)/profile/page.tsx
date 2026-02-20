import { Card } from "@/components/ui/Card";
import { ProfilePageClient } from "@/components/auth/ProfilePageClient";
import { requireAuth } from "@/lib/auth/server";

export default async function ProfilePage() {
  const user = await requireAuth();
  const initialFullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <Card title="Your profile" description="Update your account details.">
          <ProfilePageClient initialFullName={initialFullName} />
        </Card>
      </div>
    </main>
  );
}
