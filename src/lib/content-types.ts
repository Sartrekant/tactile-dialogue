export type NavStyle = "topbar" | "floating" | "dots" | "siderail" | "overlay";
export type Availability = "open" | "busy";

export interface NavLink {
  label: string;
  to: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  tag: string;
}

export interface PricingItem {
  title: string;
  description: string;
  price: string;
  tag?: string;
}

export interface SiteContent {
  overview: {
    headline: string;
    tagline: string;
    bio: string[];
    details: Array<{ label: string; value: string }>;
    portraitUrl: string;
  };
  space: {
    headline: string;
    tagline: string;
    services: ServiceItem[];
  };
  tools: {
    headline: string;
    tagline: string;
    services: ServiceItem[];
  };
  advisory: {
    headline: string;
    paragraphs: string[];
  };
  conversation: {
    headline: string;
    tagline: string;
    email: string;
  };
  pricing: {
    headline: string;
    tagline: string;
    items: PricingItem[];
  };
  nav: {
    style: NavStyle;
    links: NavLink[];
  };
  settings: {
    availability: Availability;
    seoTitle: string;
    seoDescription: string;
    chatPrompt: string;
    social: {
      github: string;
      linkedin: string;
      twitter: string;
    };
  };
}

export const DEFAULTS: SiteContent = {
  overview: {
    headline: "Struktur og tid.",
    tagline: "Kasper Landsvig. Selvstændig konsulent for små og mellemstore virksomheder.",
    bio: [
      "Jeg bygger digitale redskaber og virtuelle rum. Mit arbejde handler om at fjerne støj og skabe overblik i hverdagen.",
      "Ingen store ord. Ingen unødig kompleksitet. Kun solidt håndværk med de rette materialer."
    ],
    details: [
      { label: "Fokus", value: "3D, Værktøjer & Teknologisk Rådgivning" },
      { label: "Tilgængelighed", value: "Åben for nye samtaler" },
      { label: "Sted", value: "Danmark" },
    ],
    portraitUrl: "",
  },
  space: {
    headline: "Rummet",
    tagline: "Fysiske og virtuelle rum, bygget med præcision.",
    services: [
      {
        title: "Virtual Reality",
        description: "Skabelse af virtuelle oplevelser. Formidler skala, dybde og interaktion uden forstyrrelser.",
        tag: "Oplevelser",
      },
      {
        title: "360° Virtuelle Ture",
        description: "Præcis digital repræsentation. Giver et fuldt overblik over fysiske lokationer.",
        tag: "Overblik",
      },
      {
        title: "3D-print",
        description: "Fra digital model til fysisk materiale. Et håndgribeligt resultat til hurtig iteration.",
        tag: "Materiale",
      },
    ],
  },
  tools: {
    headline: "Værktøjerne",
    tagline: "Solide digitale redskaber, skræddersyet til opgaven.",
    services: [
      {
        title: "Apps",
        description: "Fokuserede applikationer. Bygget til at fungere hver dag uden friktion for brugeren.",
        tag: "Software",
      },
      {
        title: "Hjemmesider",
        description: "Hurtig, tilgængelig formidling. Det essentielle indhold placeret på et solidt fundament.",
        tag: "Web",
      },
      {
        title: "Prototyper",
        description: "Vi bygger og tester idéer i praksis, før vi lægger det endelige fundament.",
        tag: "Udvikling",
      },
    ],
  },
  advisory: {
    headline: "Rådgivningen",
    paragraphs: [
      "Teknologisk rådgivning med begge ben på jorden. Det handler om at finde det rette værktøj til opgaven — ikke om at bruge teknologi for teknologiens skyld.",
      "Nysgerrig på AI, men ved ikke, hvor du skal starte? Giv mig et kald, og lad os tage en snak."
    ],
  },
  conversation: {
    headline: "Samtalen",
    tagline: "Har du et projekt i tankerne, eller har du brug for et overblik? Skriv til mig. Jeg svarer inden for 24 timer.",
    email: "kasper@landsvig.com",
  },
  pricing: {
    headline: "Priser",
    tagline: "Fleksible pakker tilpasset dit behov.",
    items: [
      {
        title: "Starter",
        description: "Perfekt til små projekter og råd",
        price: "Fra 5.000 kr",
      },
      {
        title: "Pro",
        description: "For mellemstore projekter",
        price: "Fra 15.000 kr",
      },
      {
        title: "Enterprise",
        description: "Større projekter og løbende samarbejde",
        price: "Tilbud efter aftale",
      },
    ],
  },
  nav: {
    style: "floating",
    links: [
      { label: "Rummet", to: "#rummet" },
      { label: "Værktøjerne", to: "#vaerktoejerne" },
      { label: "Rådgivningen", to: "#raadgivningen" },
      { label: "Kontakt", to: "#kontakt" },
    ],
  },
  settings: {
    availability: "open",
    seoTitle: "Kasper Landsvig — 3D, Web & Teknologisk Rådgivning",
    seoDescription: "Selvstændig konsulent. Solide digitale redskaber og virtuelle rum for små og mellemstore virksomheder.",
    chatPrompt:
      "Du er en AI-assistent på Kasper Landsvigs hjemmeside. Kasper er selvstændig konsulent i Danmark. Han hjælper SMV'er med 3D (VR, 360-ture, 3D-print), bygger digitale værktøjer (apps, hjemmesider, prototyper), og tilbyder jordnær teknologisk rådgivning og AI-sparring.\n\nHjælp besøgende med at forstå Kaspers ydelser. Tonen er rolig, professionel og direkte. Brug ikke hype-ord som 'innovativ', 'revolutionerende' eller 'cutting-edge'. Svar kortfattet og altid på dansk.",
    social: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  },
};