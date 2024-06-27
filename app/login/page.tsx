import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { Logo } from "@/components/logo";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/home");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          username,
        },
      },
    });

    if (error) {
      console.log({error});
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="relative flex flex-col justify-center h-screen overflow-hidden">
      <Link
        href="/"
        className="btn mb-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <div className="w-full p-6 m-auto rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-lg">
        <Logo />
        <form className="space-y-4">
          <div>
              <label className="label">
                  <span className="text-base label-text">Email</span>
              </label>
              <input type="text"  name="email"
          placeholder="you@example.com"
          required className="w-full input input-bordered" />
          </div>
          <div>
              <label className="label">
                  <span className="text-base label-text">Username</span>
              </label>
              <input type="text" name="username"
          placeholder="johndoe"
          required className="w-full input input-bordered" />
          </div>
          <div>
              <label className="label">
                  <span className="text-base label-text">Password</span>
              </label>
              <input type="password"
          name="password"
          placeholder="••••••••"
          required className="w-full input input-bordered" />
          </div>
          {/* <a href="#" className="text-xs text-gray-600 hover:underline hover:text-blue-600">Forget Password?</a> */}

          <SubmitButton
            formAction={signIn}
            className="btn-primary btn btn-block"
            pendingText="Signing In..."
          >
            Login
          </SubmitButton>
          <SubmitButton
            formAction={signUp}
            className="btn-neutral btn btn-block"
            pendingText="Signing Up..."
          >
            Sign Up
          </SubmitButton>
        </form>
        {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
      </div>
    </div>
  );
}
