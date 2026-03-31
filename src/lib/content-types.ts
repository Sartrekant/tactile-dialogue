export type NavStyle = "topbar" | "floating" | "dots" | "siderail" | "overlay";
export type Availability = "open" | "busy";

export interface NavLink {
  label: string;
  href?: string;
  to?: string;
}

export interface WorkEntry {
  number: string;
  title: string;
  description: string;
  tag: string;
}

export interface JournalEntry {
  number: string;
  tag: string;
  title: string;
  excerpt: string;
}

export interface SiteContent {
  hero: {
    headline: string;
    tagline: string;
  };
  kasper: {
    bio: [string, string, string];
    details: Array<{ label: string; value: string }>;
    portraitUrl: string;
  };
  work: WorkEntry[];
  metoden: {
    headline: string;
    paragraphs: [string, string];
    backgroundUrl: string;
  };
  journal: JournalEntry[];
  contact: {
    headline: string;
    tagline: string;
    email: string;
    backgroundUrl: string;
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
  hero: {
    headline: "Jeg bygger systemer.\nOg værktøjer.\nOg idéer.",
    tagline:
      "Selvstændig AI-konsulent og digital værktøjsmager. Jeg hjælper virksomheder med at automatisere smartere — og bygger egne digitale produkter undervejs.",
  },
  kasper: {
    bio: [
      "Jeg er selvstændig AI-konsulent og digital værktøjsmager med base i Danmark. Jeg arbejder i skæringspunktet mellem sprogsmodeller, automatisering og brugbart produktdesign.",
      "Til daglig hjælper jeg virksomheder med at implementere AI der faktisk bruges — ikke dashboards der samler støv, men systemer der gør det tunge arbejde. Sideløbende bygger jeg egne digitale produkter og værktøjer.",
      "Ingen buzzwords. Ingen skabeloner. Kun præcist arbejde med de rette materialer.",
    ],
    details: [
      { label: "Fokus", value: "AI-konsultering & produktudvikling" },
      { label: "Stack", value: "Claude API · TypeScript · Vercel" },
      { label: "Tilgængelighed", value: "Åben for nye projekter" },
      { label: "Sted", value: "Danmark" },
    ],
    portraitUrl: "",
  },
  work: [
    {
      number: "01",
      title: "LANDSVIG Chat",
      description:
        "Streaming AI-assistent med brugerdefineret persona, kontekst og tone. Bygget på Claude Sonnet via Vercel Edge Functions.",
      tag: "AI-værktøj",
    },
    {
      number: "02",
      title: "Voice-to-Quote",
      description:
        "Dikter et tilbud på pladsen — AI strukturerer, formaterer og sender det som PDF. Fra tale til kundens indbakke på under 60 sekunder.",
      tag: "Automatisering",
    },
    {
      number: "03",
      title: "Snap-to-Bill",
      description:
        "Foto af arbejdsseddel → færdig faktura. Computer vision og LLM i kombination, ingen manuel dataindtastning.",
      tag: "Prototyping",
    },
    {
      number: "04",
      title: "Struktureret dataekstraktion",
      description:
        "Zod-validerede output fra ustrukturerede dokumenter. Fra PDF og email til clean JSON klar til systemintegration.",
      tag: "Konsulentprojekt",
    },
  ],
  metoden: {
    headline: "Metoden bag maskinen.",
    paragraphs: [
      "Jeg begynder altid med problemet — ikke teknologien. En god AI-løsning er usynlig: den bare virker, stille og pålideligt, uden at nogen skal lære et nyt system.",
      "Det kræver nysgerrighed, tålmodighed og vilje til at forstå domænet grundigt. Prompt engineering er ikke et trick — det er et håndværk.",
    ],
    backgroundUrl: "",
  },
  journal: [
    {
      number: "01",
      tag: "Metode",
      title: "Prompt engineering er ikke magi",
      excerpt:
        "Det er struktureret tænkning. Når du forstår, hvordan en sprogmodel læser kontekst, begynder du at skrive bedre — ikke mere.",
    },
    {
      number: "02",
      tag: "Produktudvikling",
      title: "Hvornår er en prototype god nok?",
      excerpt:
        "Jeg bygger tit ting, der fungerer perfekt — men aldrig bliver brugt. Om forskellen på at bygge og at løse.",
    },
    {
      number: "03",
      tag: "AI i praksis",
      title: "Structured outputs ændrede min arbejdsgang",
      excerpt:
        "Fra uforudsigelige tekstsvar til validerede datastrukturer. Zod + generateObject er det mest undervurderede par i AI-toolboxen.",
    },
  ],
  contact: {
    headline: "Lad os tage en snak.",
    tagline:
      "Har du et projekt du gerne vil drøfte, eller vil du bare høre mere om hvad jeg laver? Skriv til mig — jeg svarer inden for 24 timer.",
    email: "kasper@landsvig.com",
    backgroundUrl: "",
  },
  nav: {
    style: "topbar",
    links: [
      { label: "Kasper", href: "#kasper" },
      { label: "Metoden", href: "#metoden" },
      { label: "Journalen", href: "#journalen" },
      { label: "Kontakt", href: "#kontakt" },
      { label: "Værktøjer", to: "/tools" },
    ],
  },
  settings: {
    availability: "open",
    seoTitle: "Kasper Landsvig — AI-konsulent & digital værktøjsmager",
    seoDescription:
      "Selvstændig AI-konsulent og digital værktøjsmager med base i Danmark. Hjælper virksomheder med at implementere AI der faktisk bruges.",
    chatPrompt:
      "Du er en AI-assistent på Kasper Landsvigs personlige hjemmeside. Kasper er selvstændig AI-konsulent og digital værktøjsmager med base i Danmark. Han hjælper virksomheder med at implementere AI der faktisk bruges — og bygger egne digitale produkter sideløbende.\n\nHjælp besøgende med at forstå hvad Kasper laver, hvilke slags projekter han tager på, og hvad AI-konsultering kan betyde for dem. Vær kortfattet, konkret og imødekommende. Svar altid på dansk.",
    social: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  },
};
