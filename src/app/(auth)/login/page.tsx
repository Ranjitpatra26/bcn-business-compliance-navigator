"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Loader2, Eye, EyeOff, ArrowLeft, Zap } from "lucide-react";
import { LoginProductVisual } from "@/components/auth/LoginProductVisual";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const shouldReduceMotion = useReducedMotion();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    
    if (process.env.NEXT_PUBLIC_API_MODE === "mock" || process.env.NEXT_PUBLIC_API_MODE === "true") {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Successfully logged in! (Mock Mode)");
      localStorage.setItem("bcn_mock_auth", "true");
      // Reload the page to reset the AuthProvider mock state so it gives us a user
      window.location.href = "/";
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully logged in!");
      router.push("/");
      router.refresh();
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    if (process.env.NEXT_PUBLIC_API_MODE === "mock" || process.env.NEXT_PUBLIC_API_MODE === "true") {
      toast.success("Successfully logged in with Google! (Mock Mode)");
      localStorage.setItem("bcn_mock_auth", "true");
      window.location.href = "/";
      return;
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsGoogleLoading(false);

    if (error) {
      toast.error(error.message);
    }
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25, filter: shouldReduceMotion ? "none" : "blur(8px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : 0.15 + i * 0.12,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const leftColVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.65,
        delay: shouldReduceMotion ? 0 : 0.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-1 sm:py-4 lg:py-6 px-3 sm:px-6">
      {/* Premium Generated Atmospheric Background Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none" aria-hidden="true">
        <Image
          src="/images/auth/bcn_trust_bg.jpg"
          alt="BCN Enterprise Trust Architecture"
          fill
          priority
          quality={75}
          className="object-cover object-center opacity-85 sm:opacity-90"
          sizes="100vw"
        />
        {/* Soft directional gradient mask: keeps trust visual vivid on left, smooth contrast on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/60 to-white/90 backdrop-blur-[1px]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-bcn-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-bcn-yellow/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* Left Column: BCN Product & Visual Identity */}
        <motion.div
          variants={leftColVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center"
        >
          {/* Back to BCN Navigation Link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-bcn-black transition-colors mb-4 lg:mb-6 group w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-bcn-red transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to BCN</span>
          </Link>

          {/* Compliance Navigator Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-bcn-red/20 bg-bcn-red/5 text-bcn-red text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm w-fit">
            <Zap className="w-3.5 h-3.5 text-bcn-red" />
            <span>COMPLIANCE NAVIGATOR</span>
          </div>

          {/* Editorial Kinetic Typography Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[-0.03em] leading-[0.95] text-bcn-black mb-3 sm:mb-4">
            <motion.span
              custom={0}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="block font-sans font-extrabold"
            >
              COMPLIANCE,
            </motion.span>
            <motion.span
              custom={1}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="block font-sans font-light text-bcn-black/60 text-2xl sm:text-4xl lg:text-5xl xl:text-6xl my-1"
            >
              WITHOUT
            </motion.span>
            <motion.span
              custom={2}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="block font-serif italic text-bcn-red font-medium"
            >
              THE GUESSWORK.
            </motion.span>
          </h1>

          {/* Supporting Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-lg mb-6 leading-relaxed font-normal">
            Understand what applies to your business, why it applies, and what needs your attention next.
          </p>

          {/* Compact Illustrative Product Visualization */}
          <LoginProductVisual />
        </motion.div>

        {/* Right Column: Refined Login Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end w-full"
        >
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-[2.5rem] shadow-2xl shadow-black/8 border border-black/5 relative">
            {/* Header */}
            <div className="mb-6 sm:mb-7">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-bcn-black mb-2">Welcome back</h2>
              <p className="text-muted-foreground text-sm">Sign in to continue to your BCN workspace.</p>
            </div>

            {/* Google OAuth Button */}
            <div className="flex flex-col space-y-3 mb-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
                className="w-full rounded-2xl py-6 font-semibold flex items-center justify-center gap-3 border border-black/10 hover:border-black/20 hover:bg-black/[0.02] shadow-sm transition-all text-bcn-black active:scale-[0.99] cursor-pointer"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>Sign in with Google</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-white/95 px-3 text-muted-foreground font-semibold">Or continue with</span>
              </div>
            </div>

            {/* Email & Password Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="name@company.com" 
                          {...field} 
                          disabled={isLoading || isGoogleLoading}
                          autoComplete="email"
                          className="rounded-2xl border-black/10 bg-black/[0.01] px-4 py-3 h-12 text-sm focus-visible:ring-2 focus-visible:ring-bcn-red/20 focus-visible:border-bcn-red transition-all" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</FormLabel>
                        <Link 
                          href="/forgot-password" 
                          className="text-xs font-semibold text-bcn-red hover:underline underline-offset-2 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toast.info("Forgot password flow not yet configured.");
                          }}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isLoading || isGoogleLoading}
                            autoComplete="current-password"
                            className="rounded-2xl pr-11 border-black/10 bg-black/[0.01] px-4 py-3 h-12 text-sm focus-visible:ring-2 focus-visible:ring-bcn-red/20 focus-visible:border-bcn-red transition-all" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading || isGoogleLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-bcn-black focus:outline-none p-1 rounded-lg transition-colors cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            tabIndex={0}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full rounded-2xl bg-bcn-red hover:bg-bcn-red/90 text-white font-bold py-6 text-base shadow-lg shadow-bcn-red/20 hover:shadow-xl hover:shadow-bcn-red/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>

            {/* Create Account Link */}
            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              <Link href="/register" className="font-bold text-bcn-red hover:underline underline-offset-4 transition-colors">
                Create Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
