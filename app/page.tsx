"use server";

import { Hero } from "@/components/hero";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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
