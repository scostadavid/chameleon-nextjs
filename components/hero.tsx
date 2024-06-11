import Link from "next/link";
import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";

// hero
export function Hero() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center p-4" style={{height: "calc(100vh - 8rem)"}}>
      <h1 className="text-5xl font-bold lg:text-7xl mx-auto max-w-xl text-center">
        Campaign <span className="text-orange-500">Management</span> Made <span className=" text-blue-500">Easy</span>
      </h1>
      <p className="text-center">
        Simplify your marketing campaigns links management with a simple solution
      </p>
      <Link href="/login" className="btn btn-primary">Get started</Link>
    </div>
  );
}
