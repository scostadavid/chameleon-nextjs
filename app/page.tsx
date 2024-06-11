"use server";

import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { Logo } from "@/components/logo"
import {AuthButton} from "@/components/AuthButton"

async function Header() {
  return (
    <div className="w-full">
      {/* <TrialExpired /> */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <Logo />
          <AuthButton />
        </div>
      </nav>
    </div>
  )
}


export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/home");
  }

  return (
    <main className="animate-in opacity-0 flex-grow flex flex-col items-center">
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
