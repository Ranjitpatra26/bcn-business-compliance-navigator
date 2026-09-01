import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/common/SmoothScroll";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="min-h-screen relative z-10 flex flex-col items-center">
        {children}
      </main>
      <Footer />
    </SmoothScroll>
  );
}
