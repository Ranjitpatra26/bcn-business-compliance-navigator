import { QrCode } from "lucide-react";
import Link from "next/link";
export function Footer() {
  const topLinkStyle = "text-white/60 hover:text-white transition-colors relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left";
  const bottomLinkStyle = "text-white/60 text-sm hover:text-white transition-colors relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left";

  return (
    <footer className="mt-20">
      <div className="bg-bcn-black text-white rounded-[2.5rem] p-12 md:p-16 max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 border-b border-white/20 pb-12">
          <div className="flex flex-wrap gap-8 text-lg">
            <Link href="/about" className={topLinkStyle}>About</Link>
            <Link href="/why-us" className={topLinkStyle}>Why Us</Link>
            <Link href="/contact" className={topLinkStyle}>Contacts</Link>
          </div>
          <div className="flex md:justify-end text-3xl md:text-5xl font-medium">
            hello@bcn.com
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div>
            <h4 className="font-semibold mb-2">Raleigh</h4>
            <p className="text-white/60 text-sm">125 N. Harrington Street</p>
            <p className="text-white/60 text-sm">Raleigh, NC 27603</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Charlotte</h4>
            <p className="text-white/60 text-sm">220 East Peterson Drive</p>
            <p className="text-white/60 text-sm">Charlotte, NC 28217</p>
          </div>
          <div className="flex flex-col gap-2 md:text-right">
            <span className="text-white/60 text-sm">LinkedIn</span>
            <span className="text-white/60 text-sm">Instagram</span>
            <span className="text-white/60 text-sm">Facebook</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/20 pt-8">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">BCN<sup className="text-2xl md:text-4xl">®</sup></h2>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className={bottomLinkStyle}>Privacy policy</Link>
            <Link href="/license" className={bottomLinkStyle}>License agreement</Link>
            <div className="bg-white rounded-xl p-2 hidden sm:block">
              <QrCode className="w-12 h-12 text-bcn-black" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
