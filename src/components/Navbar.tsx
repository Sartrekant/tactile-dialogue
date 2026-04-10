import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { EASING } from "./RevealText";
import type { SiteContent, NavLink as NavLinkType } from "@/lib/content-types";
import { DEFAULTS } from "@/lib/content-types";

// ─── Shared link renderer ────────────────────────────────────────────────────

const NavLinkItem = ({
  item,
  onClick,
  className,
}: {
  item: NavLinkType;
  onClick?: () => void;
  className?: string;
}) => {
  const cls =
    className ??
    "font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-700 hover:text-foreground";

  // Hash links use <a> for native scroll, all others use <Link>
  if (item.to.startsWith("#")) {
    return (
      <a href={item.to} onClick={onClick} className={cls}>
        {item.label}
      </a>
    );
  }
  return (
    <Link to={item.to} onClick={onClick} className={cls}>
      {item.label}
    </Link>
  );
};

// ─── 1. Topbar (default) ─────────────────────────────────────────────────────

const NavTopbar = ({ links }: { links: NavLinkType[] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-40"
      style={{ backgroundColor: "rgba(249, 248, 244, 0.80)", backdropFilter: "blur(12px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6 md:py-4">
        <Link to="/" className="font-serif text-lg md:text-xl tracking-tight text-foreground">
          LANDSVIG
        </Link>

        {/* Menu trigger + dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors duration-500"
            aria-label={menuOpen ? "Luk menu" : "Åbn menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "Luk" : "Menu"}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASING }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  left: "auto",
                  overflow: "hidden",
                  backgroundColor: "rgba(249, 248, 244, 0.80)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid hsl(36 16% 87%)",
                  minWidth: 160,
                }}
              >
                {links.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASING, delay: i * 0.05 }}
                    className="border-b border-border last:border-b-0"
                  >
                    <NavLinkItem
                      item={link}
                      onClick={() => setMenuOpen(false)}
                      className="block px-5 py-3.5 text-right font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors duration-300"
                    />
                  </motion.div>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

// ─── 2. Floating pill ────────────────────────────────────────────────────────

const NavFloating = ({ links }: { links: NavLinkType[] }) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setHidden(y > lastY.current && y > 80);
    lastY.current = y;
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: hidden ? 20 : 0 }}
      transition={{ duration: 0.5, ease: EASING }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      style={{ opacity: hidden ? 0 : 1, pointerEvents: hidden ? "none" : "auto" }}
    >
      <div
        className="flex items-center gap-6 px-7 py-3.5 rounded-sm border border-border backdrop-blur-md shadow-[0_8px_24px_rgba(44,46,48,0.12)]"
        style={{ backgroundColor: "rgba(249, 248, 244, 0.88)" }}
      >
        {links.map((link) => (
          <NavLinkItem key={link.label} item={link} />
        ))}
      </div>
    </motion.nav>
  );
};

// ─── 3. Dot nav ──────────────────────────────────────────────────────────────

const NavDots = ({ links }: { links: NavLinkType[] }) => {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const hashLinks = links.filter((l) => l.to.startsWith("#"));
    if (hashLinks.length === 0) return;

    const observers: IntersectionObserver[] = [];

    hashLinks.forEach((link) => {
      const id = link.to.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(link.to);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [links]);

  return (
    <motion.nav
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4"
    >
      {links.map((link) => {
        const dest = link.to;
        const isActive = active === dest;
        const isHovered = hovered === link.label;
        const dotCls = "block w-2 h-2 rounded-sm transition-all duration-500";
        const dotStyle = {
          backgroundColor: isActive ? "rgba(44,46,48,0.9)" : "rgba(44,46,48,0.2)",
          transform: isActive ? "scale(1.4)" : "scale(1)",
        };

        return (
          <div
            key={link.label}
            className="relative flex items-center"
            onMouseEnter={() => setHovered(link.label)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-7 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/60 bg-background/90 border border-border px-2 py-1 rounded-sm"
                >
                  {link.label}
                </motion.span>
              )}
            </AnimatePresence>

            {link.to.startsWith("#") ? (
              <a href={link.to} className={dotCls} style={dotStyle} aria-label={link.label} />
            ) : (
              <Link to={link.to} className={dotCls} style={dotStyle} aria-label={link.label} />
            )}
          </div>
        );
      })}
    </motion.nav>
  );
};

// ─── 4. Side rail ────────────────────────────────────────────────────────────

const railLinkCls =
  "font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40 transition-colors duration-700 hover:text-foreground";
const railLinkStyle: React.CSSProperties = {
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  transform: "rotate(180deg)",
};

const NavSiderail = ({ links }: { links: NavLinkType[] }) => (
  <motion.nav
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-6"
  >
    {/* Vertical line above */}
    <div className="h-16 w-px bg-border" />

    <div className="flex flex-col gap-5">
      {links.map((link) =>
        link.to.startsWith("#") ? (
          <a key={link.label} href={link.to} className={railLinkCls} style={railLinkStyle}>
            {link.label}
          </a>
        ) : (
          <Link key={link.label} to={link.to} className={railLinkCls} style={railLinkStyle}>
            {link.label}
          </Link>
        )
      )}
    </div>

    {/* Vertical line below */}
    <div className="h-16 w-px bg-border" />
  </motion.nav>
);

// ─── 5. Full overlay ─────────────────────────────────────────────────────────

const NavOverlay = ({ links }: { links: NavLinkType[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onClick={() => setOpen(!open)}
        className="fixed top-6 right-6 z-50 flex flex-col gap-[5px] p-2"
        aria-label="Menu"
      >
        <motion.span
          animate={open ? { opacity: 0, y: 3 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASING }}
          className="block h-px w-6 bg-foreground"
        />
        <motion.span
          animate={open ? { scaleX: 0.6, opacity: 0.5 } : { scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: EASING }}
          className="block h-px w-6 bg-foreground"
        />
        <motion.span
          animate={open ? { opacity: 0, y: -3 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASING }}
          className="block h-px w-6 bg-foreground"
        />
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASING }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ backgroundColor: "rgba(249, 248, 244, 0.80)", backdropFilter: "blur(12px)" }}
          >
            <nav className="flex flex-col items-center gap-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: EASING, delay: i * 0.07 }}
                >
                  <NavLinkItem
                    item={link}
                    onClick={() => setOpen(false)}
                    className="font-serif text-[clamp(1.5rem,5vw,3rem)] text-foreground/70 transition-colors duration-500 hover:text-foreground"
                  />
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Router ──────────────────────────────────────────────────────────────────

interface NavbarProps {
  nav?: SiteContent["nav"];
}

const Navbar = ({ nav = DEFAULTS.nav }: NavbarProps) => {
  const { style, links } = nav;

  switch (style) {
    case "floating":
      return <NavFloating links={links} />;
    case "dots":
      return <NavDots links={links} />;
    case "siderail":
      return <NavSiderail links={links} />;
    case "overlay":
      return <NavOverlay links={links} />;
    default:
      return <NavTopbar links={links} />;
  }
};

export default Navbar;
