import { SignUp } from "@clerk/nextjs";

// Clerk SignUp Page
export default function SignUpPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </main>
  );
}
