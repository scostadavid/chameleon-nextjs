export function Footer() {
  return (
    <footer className="w-full border-t border-t-foreground/10 flex justify-center text-center text-xs h-16 items-center">
      <p>
        &copy;{" "}
        <a
          href="https://scostadavid.github.io"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          scostadavid
        </a>
      </p>
    </footer>
  )
}