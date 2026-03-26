import { motion } from "framer-motion";

const Navbar = () => {
  const links = [
    { label: "Værkstedet", href: "#vaerkstedet" },
    { label: "Håndværket", href: "#haandvaerket" },
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#" className="font-serif text-xl tracking-tight text-foreground">
          LANDSVIG
        </a>
        <div className="flex items-center gap-8">
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
      </div>
    </motion.nav>
  );
};

export default Navbar;
