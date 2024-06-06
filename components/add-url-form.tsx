"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { Suspense } from "react";


export async function AddUrlForm() {
  const submitUrl = async (formData: FormData) => {
    "use server";

    const url = formData.get("url") as string;
    const name = formData.get("name") as string;

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if(!user) return;


    const {error} = await supabase.from("shortened_urls").insert([
      {
        title: name,
        url: url,
        hash: Math.random().toString(36).slice(7),
        clicks: 0,
        user_id: user.id
      }
    ]);

    if (error) {
      return redirect("/home?message=Could not shorten the url");
    }

    return redirect("/home?message=Url shortened successfully");
  };

  return (
    <form action={submitUrl} className="items-center gap-4 mb-8">
      <input type="text" placeholder="name" name="name" className="input input-bordered w-full mb-4" required/>
      <input type="url" placeholder="url" name="url" className="input input-bordered w-full mb-4" required/>
      <SubmitButton className="btn btn-primary w-full">shorten</SubmitButton>
    </form>
  );
}
