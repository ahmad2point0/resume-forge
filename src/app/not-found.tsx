import Link from "next/link";

import { Button } from "@/global/components/ui/button";
import { Logo } from "@/global/components/shared";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo />
      <p className="text-6xl font-bold tracking-tight text-primary">404</p>
      <h1 className="text-lg font-semibold">This page doesn’t exist</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you’re looking for may have moved or never existed.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/resumes">My resumes</Link>
        </Button>
      </div>
    </div>
  );
}
