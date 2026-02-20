import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/server";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
