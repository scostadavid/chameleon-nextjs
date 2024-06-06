import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { hash: string } }) {
  const { hash } = params;

  const supabase = createClient();

  // data, error
  const { data } = await supabase
    .from('shortened_urls')
    .select('url, clicks')
    .eq('hash', hash)
    .single();

  if (data) {
    // data, error
    await supabase
      .from('shortened_urls')
      .update({ clicks: data.clicks + 1 })
      .eq('hash', hash);

    return redirect(data.url);
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center">
      <div className="opacity-0 animate-in text-center">
        <h1 className="text-white">
          <Link href="/">
            Chameleon URL shortener
          </Link>
        </h1>
        <p>Page not found</p>
      </div>
    </div>
  );
}
