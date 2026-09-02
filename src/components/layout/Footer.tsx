import { QrCode } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import SocialButton from "@/components/ui/social-button";
export function Footer() {
  const topLinkStyle = "text-white/60 hover:text-white transition-colors relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left";
  const bottomLinkStyle = "text-white/60 text-sm hover:text-white transition-colors relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left";
  const socialLinkStyle = "text-white/60 text-sm hover:text-white transition-colors relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left flex items-center gap-2 w-fit";

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-20 items-center">
          <div>
            <h4 className="font-semibold mb-2">Ranjit Patra</h4>
            <p className="text-white/60 text-sm">Bandra Kurla Complex</p>
            <p className="text-white/60 text-sm">Mumbai, MH 400051</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Manthan Patil</h4>
            <p className="text-white/60 text-sm">Andheri East</p>
            <p className="text-white/60 text-sm">Mumbai, MH 400059</p>
          </div>
          <div className="flex justify-start md:justify-end md:pr-12">
            <SocialButton />
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={socialLinkStyle}>
              <FaLinkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={socialLinkStyle}>
              <FaInstagram className="w-4 h-4" />
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={socialLinkStyle}>
              <FaFacebook className="w-4 h-4" />
              Facebook
            </a>
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
