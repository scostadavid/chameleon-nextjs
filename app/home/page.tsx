import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { Suspense } from "react";
import { AddUrlForm } from "@/components/add-url-form";

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

  const deleteUrl = async (formData: FormData) => {
    "use server";

    const hash = formData.get("hash") as string;

    const supabase = createClient();

    console.log('finding hash:', hash);

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
    <div className="w-full max-w-4xl pt-16 flex flex-col md:items-center w-full px-4" style={{height: "calc(100vh - 8rem)"}}>

        {/* <form action={submitUrl} className="items-center gap-4 mb-8">
          <input type="text" placeholder="name" name="name" className="input input-bordered w-full mb-4" required/>
          <input type="url" placeholder="url" name="url" className="input input-bordered w-full mb-4" required/>
          <SubmitButton className="btn btn-primary w-full">shorten</SubmitButton>
        </form> */}

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
