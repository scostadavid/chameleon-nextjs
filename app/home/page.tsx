import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { AddUrlForm } from "@/components/add-url-form";

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


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";


export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // todo: reta final
  // [x] api de redirect + hash => prioridade?
  // [x] lading page mais básica do mundo
  // [x] corrigir o cadastro do profile public.users
  // [x] deletar links
  // [] configurar confirmação por email
  // [] criar uma trava de cadastros pelo supabase
  // [] subir (fim da v1)
  // [] atualizar link do meu site

  const deleteUrl = async (formData: FormData) => {
    "use server";

    const hash = formData.get("hash") as string;

    const supabase = createClient();

    const { error } = await supabase
        .from("shortened_urls")
        .delete()
        .eq('hash', hash);

    if (error) {
      return redirect("/home?message=Could not delete the url");
    }

    return redirect("/home?message=URL deleted successfully");
  }

  const { data } = await supabase.from("shortened_urls").select("*");

  return (
    <div className="w-full h-screen flex flex-col md:items-center px-4">
        <Header/>
        <div className="h-16"></div>
        <AddUrlForm />

        <div className="overflow-x-auto">
          <Suspense fallback={<p>loading</p>}>
            <table className="table">
              {/* head */}
              <thead className="bg-gray">
                <tr>
                  <th>clicks</th>
                  <th>title</th>
                  <th>url</th>
                  <th>short url</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map(({title, url, hash, clicks}, i) => (
                  <tr className="bg-base-200">
                    <th>{clicks}</th>
                    <td>{title}</td>
                    <td>
                      <Link href={url} target="_blank" rel="noreferrer noopener">{url}</Link>
                    </td>
                    <td>
                      <Link href={defaultUrl + '/' + hash} target="_blank" rel="noreferrer noopener">{hash}</Link>
                    </td>
                    <td>
                      <form action={deleteUrl}>
                        <input type="hidden" name="hash" value={hash} />
                        <button className="btn">delete</button>
                        {/* todo: edit action */}
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Suspense>
        </div>
    </div>
  );
}
