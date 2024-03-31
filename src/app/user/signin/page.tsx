import { SignIn } from "@clerk/nextjs";

// Clerk SignIn Page
export default function SignInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </main>
  );
}
