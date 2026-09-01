import { Link2 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 group max-w-fit">
          <div className="w-10 h-10 rounded-full bg-bcn-red flex items-center justify-center text-white shadow-sm transform group-hover:scale-105 transition-all">
            <Link2 className="w-6 h-6 transform rotate-45" />
          </div>
          <span className="text-2xl font-bold tracking-tight">BCN</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
