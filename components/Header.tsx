"use server";

import { Logo } from "./logo"
import { TrialExpired } from "./trial-expired"
import {AuthButton} from "./AuthButton"

export default async function Header() {
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