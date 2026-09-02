"use client";

import { Link } from "lucide-react";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ShareItem {
  icon: React.ElementType;
  label: string;
}

interface SocialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  items?: ShareItem[];
  onShare?: (index: number, item: ShareItem) => void;
  className?: string;
}

const DEFAULT_SHARE_ITEMS: ShareItem[] = [
  { icon: FaXTwitter, label: "Share on X" },
  { icon: FaWhatsapp, label: "Share on WhatsApp" },
  { icon: FaLinkedin, label: "Share on LinkedIn" },
  { icon: Link, label: "Copy link" },
];

export default function SocialButton({
  label = "Share",
  items = DEFAULT_SHARE_ITEMS,
  onShare,
  className,
  ...props
}: SocialButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleShare = (index: number) => {
    setActiveIndex(index);
    const item = items[index];
    
    if (onShare) {
      onShare(index, item);
    } else {
      const url = typeof window !== "undefined" ? window.location.href : "https://bcn.com";
      const text = "Check out BCN - Business Compliance Navigator";
      
      if (item.label.includes("X")) {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
      } else if (item.label.includes("WhatsApp")) {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, "_blank");
      } else if (item.label.includes("LinkedIn")) {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
      } else if (item.label.includes("Copy")) {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    }
    
    setTimeout(() => setActiveIndex(null), 300);
  };

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <motion.div
        animate={{
          opacity: isVisible ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
      >
        <Button
          className={cn(
            "relative w-40",
            "bg-white",
            "hover:bg-gray-200",
            "text-black",
            "transition-colors duration-200"
          )}
          {...props}
        >
          <span className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            {label}
          </span>
        </Button>
      </motion.div>

      <motion.div
        animate={{
          width: isVisible ? 160 : 0,
        }}
        className="absolute top-0 left-0 flex h-10 overflow-hidden"
        transition={{
          duration: 0.3,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {items.map((button, i) => (
          <motion.button
            animate={{
              opacity: isVisible ? 1 : 0,
              x: isVisible ? 0 : -20,
            }}
            aria-label={button.label}
            className={cn(
              "h-10",
              "w-10 flex-shrink-0",
              "flex items-center justify-center",
              "bg-white/10",
              "text-white",
              i === 0 && "rounded-l-md",
              i === items.length - 1 && "rounded-r-md",
              "border-white/10 border-r last:border-r-0",
              "hover:bg-white/20",
              "outline-none",
              "relative overflow-hidden",
              "transition-colors duration-200"
            )}
            key={`share-${button.label}`}
            onClick={() => handleShare(i)}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1],
              delay: isVisible ? i * 0.05 : 0,
            }}
            type="button"
          >
            <motion.div
              animate={{
                scale: activeIndex === i ? 0.85 : 1,
              }}
              className="relative z-10"
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <button.icon className="h-4 w-4" />
            </motion.div>
            <motion.div
              animate={{
                opacity: activeIndex === i ? 0.15 : 0,
              }}
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
