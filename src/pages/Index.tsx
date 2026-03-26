import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WorkshopGrid from "@/components/WorkshopGrid";
import ConversationalForm from "@/components/ConversationalForm";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WorkshopGrid />
        <section id="haandvaerket" className="px-6 py-32">
          <div className="mx-auto max-w-6xl border-t border-border" />
        </section>
        <ConversationalForm />
      </main>
      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-serif text-sm text-foreground/40">LANDSVIG</span>
          <span className="font-mono text-[11px] tracking-[0.15em] text-foreground/30">
            © 2026
          </span>
        </div>
      </footer>
    </>
  );
};

export default Index;
