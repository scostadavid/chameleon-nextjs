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
  ? `https:${process.env.VERCEL_URL}`
  : "http:localhost:3000";


export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

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

  const Logout = () => {
    return (
      <form action={signOut} className="">
        <button className="flex flex-row gap-2 p-4 rounded-xl w-full hover:btn-active">
          <svg xmlns="http:www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span className="">
            Logout
          </span>
        </button>
      </form>
    );
  }


  return (
    <div className="max-w-[92rem] h-screen mx-auto lg:flex lg:px-32">
      <div className="drawer">


        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col">
    <div className="w-full navbar bg-base-300 lg:hidden">
        <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <svg xmlns="http:www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </label>
        </div>
    </div>

    <div className="flex flex-row">
        <aside className="hidden lg:sticky lg:self-start lg:top-0 lg:flex lg:flex-col lg:w-44">
            <div className="m-4">
              <Logo />
            </div>

            <div className="space-y-2 flex flex-col">
                <a className="flex flex-row gap-2 p-4 rounded-xl btn-active w-full" href="/schedule">
                    <svg xmlns="http:www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-calendar">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="">
                      Dashboard
                    </span>
                </a>

                {/* <a className="flex flex-row gap-2 p-4 rounded-xl w-full" href="/account">
                    <svg xmlns="http:www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="">
                        Minha Conta
                    </span>
                </a> */}

                <Logout />
            </div>
        </aside>

        {/* content */}
        <div className="flex flex-col pt-4 w-full">
          <div className="p-4 px-8">
            <AddUrlForm />
          </div>

         <div className="overflow-x-auto p-4 px-8">
           <Suspense fallback={<p>loading</p>}>
             <table className="table">
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
                       <Link href={'/' + hash} target="_blank" rel="noreferrer noopener">{hash}</Link>
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
        {/* close content */}
    </div>
</div>

<div className="drawer-side">
    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
    <div className="menu p-4 w-60 min-h-full bg-base-200">
        <aside className="">
            <div className="m-4">
              <Logo />
            </div>

            <div className="space-y-2 flex flex-col">
                <a className="flex flex-row gap-2 p-4 rounded-xl btn-active w-full" href="/schedule">
                    <svg xmlns="http:www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-calendar">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="">
                        Dashboard
                    </span>
                </a>
                {/*

                <a className="flex flex-row gap-2 p-4 rounded-xl w-full" href="/account">
                    <svg xmlns="http:www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="">
                        Minha Conta
                    </span>
                </a> */}

                <Logout/>
            </div>
        </aside>
    </div>
</div>




      </div>
    </div>
  );
   return (
     <div className="w-full h-screen flex flex-col md:items-center px-4">
         <Header/>
         <div className="h-16"></div>
         <AddUrlForm />


     </div>
   );
}
