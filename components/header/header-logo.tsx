import Image from "next/image";
import Link from "next/link";

export function HeaderLogo() {
  return (
    <Link href="/" className="nav-logo">
      <Image width={36} height={36} src="/logo.svg" alt="logo" priority />
      <span className="nav-wordmark">
        SYNTAX<em>.stash</em>
      </span>
    </Link>
  );
}
