import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASING } from "./RevealText";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: "Kasper", href: "#kasper" },
    { label: "Værkstedet", href: "#vaerkstedet" },
    { label: "Håndværket", href: "#haandvaerket" },
    { label: "Priser", href: "#priser" },
    { label: "Journalen", href: "#journalen" },
    { label: "Kontakt", href: "#kontakt" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-border backdrop-blur-md"
      style={{ backgroundColor: "rgba(249, 248, 244, 0.8)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6 md:py-5">
        <a href="#" className="font-serif text-lg md:text-xl tracking-tight text-foreground">
          LANDSVIG
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-700 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-1"
          aria-label="Menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.6, ease: EASING }}
            className="block h-px w-5 bg-foreground origin-center"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="block h-px w-5 bg-foreground"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.6, ease: EASING }}
            className="block h-px w-5 bg-foreground origin-center"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASING }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="flex flex-col gap-6 px-4 py-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: EASING, delay: i * 0.1 }}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-700 hover:text-foreground"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
