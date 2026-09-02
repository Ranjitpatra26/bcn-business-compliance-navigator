export default function ContactPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-32 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Contact Us</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        Get in touch with our team in Raleigh or Charlotte.
      </p>
      <a href="mailto:hello@bcn.com" className="text-3xl font-bold text-bcn-red hover:underline">
        hello@bcn.com
      </a>
    </main>
  );
}
