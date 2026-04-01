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

export interface RessourceEntry {
  id: string;
  type: "article" | "audio" | "video";
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  featured: boolean;
  content?: string;
  audioUrl?: string;
  videoId?: string;
  coverUrl?: string;
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
  ressourcer: RessourceEntry[];
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
      { label: "Projekter", to: "/projekter" },
      { label: "Værktøjer", to: "/vaerktoejer" },
      { label: "FAQ", to: "/faq" },
      { label: "Ressourcer", to: "/ressourcer" },
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
  ressourcer: [
    {
      id: "prompt-engineering-er-ikke-magi",
      type: "article",
      title: "Prompt engineering er ikke magi",
      excerpt:
        "Det er struktureret tænkning. Når du forstår, hvordan en sprogmodel læser kontekst, begynder du at skrive bedre — ikke mere.",
      tag: "Metode",
      date: "2026-01-15",
      featured: true,
      content:
        "# Prompt engineering er ikke magi\n\nDet er struktureret tænkning. Når du forstår, hvordan en sprogmodel læser kontekst, begynder du at skrive bedre — ikke mere.\n\nDer er en udbredt forestilling om, at at arbejde med sprogmodeller kræver en slags hemmelig viden. At de rigtige ord åbner en luge til maskinen. Det gør de ikke. Sprogmodeller er mønstre — og mønstre reagerer forudsigeligt på struktur.\n\n## Kontekst er alt\n\nEn sprogmodel \"læser\" ikke din besked som et menneske ville. Den beregner sandsynligheder baseret på, hvad der statistisk følger efter din input. Det betyder, at jo mere præcist du beskriver opgaven, dens begrænsninger og det forventede output, jo mere forudsigeligt bliver resultatet.\n\nTre ting afgør kvaliteten af en prompt:\n\n1. **Rollen** — hvem eller hvad er modellen i denne samtale?\n2. **Konteksten** — hvad ved den, som er relevant?\n3. **Formatet** — hvad skal output se ud?\n\nLad mig vise forskellen med et konkret eksempel.\n\n## Svag prompt\n\n> \"Skriv en email til min kunde om, at projektet er forsinket.\"\n\nResultatet vil være generisk. Modellen kender ikke kunden, tonen, forholdet eller årsagen til forsinkelsen. Den gætter.\n\n## Stærk prompt\n\n> \"Du er projektleder hos et dansk designbureau. Kunden er en mellemstor virksomhed inden for finans. Projektet — et nyt intranet — er forsinket med to uger grundet sygdom i teamet. Skriv en kortfattet, professionel email på dansk, der forklarer situationen direkte uden undskyldninger, foreslår en ny tidsplan, og bekræfter næste møde.\"\n\nNu har modellen noget at arbejde med. Resultatet vil være brugbart.\n\n## Det handler ikke om ord\n\nPrompt engineering er ikke en liste af magiske formuleringer. Det er en disciplin i at reducere tvetydighed. Hver gang du fjerner et fortolkningsrum fra modellen, øger du sandsynligheden for det output, du faktisk har brug for.\n\nDet kræver, at du selv ved, hvad du vil have. Og det er præcis det, der gør det svært — og værdifuldt.\n\n## Håndværket\n\nJeg har brugt hundredvis af timer på at skrive, teste og forfine prompts til konkrete forretningsopgaver. Det, jeg har lært, er dette:\n\nDen bedste prompt er ikke den korteste. Den er den, der efterlader mindst mulig tvivl.\n\nSkriv som om du forklarer opgaven til et intelligent menneske, der aldrig har mødt din branche. Vær præcis om formål, format og begrænsninger. Test. Juster. Gentag.\n\nDet er ikke magi. Det er håndværk.",
    },
    {
      id: "hvornaar-er-en-prototype-god-nok",
      type: "article",
      title: "Hvornår er en prototype god nok?",
      excerpt:
        "Jeg bygger tit ting, der fungerer perfekt — men aldrig bliver brugt. Om forskellen på at bygge og at løse.",
      tag: "Produktudvikling",
      date: "2026-01-22",
      featured: false,
      content:
        "# Hvornår er en prototype god nok?\n\nJeg bygger tit ting, der fungerer perfekt — men aldrig bliver brugt. Om forskellen på at bygge og at løse.\n\nDer er en særlig form for tilfredshed i at se et system virke. Koden kører. Logikken holder. Kanterne er polerede. Og så sker der ingenting. Ingen bruger det. Ingen efterspørger det. Det bare... er.\n\nJeg er faldet i den grøft mere end én gang.\n\n## Problemet med perfekt\n\nNår en prototype fungerer teknisk, er det fristende at fortsætte. Rydde op i koden. Tilføje edge cases. Gøre UI'et pænere. Men der er et tidspunkt, hvor hvert ekstra timers arbejde på prototypen er tid, du ikke bruger på at finde ud af, om problemet overhovedet er værd at løse.\n\nEn prototype er et spørgsmål, ikke et svar. Det eneste rigtige svar på spørgsmålet er: *vil nogen faktisk bruge dette?*\n\nDet finder du ikke ud af ved at bygge videre.\n\n## Minimum nødvendigt for at lære\n\nJeg er begyndt at stille mig selv dette spørgsmål, inden jeg går i gang:\n\n> \"Hvad er det mindste, jeg kan bygge, der viser mig, om dette virker i praksis?\"\n\nIkke det mindste der er brugbart for alle. Det mindste der giver mig et svar på det specifikke spørgsmål, jeg har om løsningen.\n\nSome gange er svaret en mockup. Nogle gange er det en manuel proces pakket ind i en simpel formular. Og nogle gange er det faktisk kode — men kun den del, der tester antagelsen.\n\n## Et konkret eksempel\n\nJeg byggede engang et system til automatisk kategorisering af indgående emails for en kunde. Tre ugers arbejde. Teknisk solid. Testede godt.\n\nKunden brugte det i to uger, så stoppede de. Problemet viste sig at være, at den person, der håndterede emails, faktisk *ville* læse dem selv — hun brugte den tid til at danne relationer med kunderne. Automatisering var ikke løsningen på hendes problem. Hastighedsforbedringen var irrelevant.\n\nJeg burde have brugt to timer på at tale med hende, inden jeg brugte tre uger på at bygge systemet.\n\n## Hvornår er prototypen god nok?\n\nPrototypen er god nok, når den kan besvare det spørgsmål, du stillede, da du begyndte at bygge den.\n\nIkke før. Og sjældent meget efter.\n\nDet kræver, at du kan formulere spørgsmålet præcist. Det er sværere end at bygge prototypen. Men det er det, der afgør, om de tre uger var spildt.",
    },
    {
      id: "structured-outputs-aendrede-min-arbejdsgang",
      type: "article",
      title: "Structured outputs ændrede min arbejdsgang",
      excerpt:
        "Fra uforudsigelige tekstsvar til validerede datastrukturer. Zod + generateObject er det mest undervurderede par i AI-toolboxen.",
      tag: "AI i praksis",
      date: "2026-01-29",
      featured: false,
      content:
        "# Structured outputs ændrede min arbejdsgang\n\nFra uforudsigelige tekstsvar til validerede datastrukturer. Zod + generateObject er det mest undervurderede par i AI-toolboxen.\n\nI lang tid brugte jeg sprogmodeller som tekstgeneratorer. Send en besked, få tekst tilbage, parse det manuelt, håb det passer. Det fungerede — til et punkt. Det punkt var, da jeg begyndte at bygge systemer, der skulle integrere AI-output med anden kode.\n\n## Problemet med fri tekst\n\nForestil dig, at du beder en model om at klassificere en email som enten *\"lead\"*, *\"support\"* eller *\"spam\"* — og returnere en confidence score. Modellen svarer:\n\n> \"Denne email ser ud til at være et lead med høj sandsynlighed, måske 0.87.\"\n\nNu skal du parse den sætning. Hvad hvis modellen en anden dag skriver \"høj\" uden tal? Eller returnerer 87% i stedet for 0.87? Fri tekst er uforudsigelig. Og uforudsigelig output er ubrugelig i et system.\n\n## Structured outputs\n\nVercel AI SDK's `generateObject` kombineret med et Zod-schema løser dette fundamentalt.\n\n```typescript\nimport { generateObject } from \"ai\";\nimport { anthropic } from \"@ai-sdk/anthropic\";\nimport { z } from \"zod\";\n\nconst result = await generateObject({\n  model: anthropic(\"claude-sonnet-4-6\"),\n  schema: z.object({\n    category: z.enum([\"lead\", \"support\", \"spam\"]),\n    confidence: z.number().min(0).max(1),\n    summary: z.string().max(200),\n  }),\n  prompt: `Klassificer denne email: ${emailContent}`,\n});\n\n// result.object er nu fuldt typet og valideret\nconst { category, confidence, summary } = result.object;\n```\n\nModellen tvinges til at returnere præcis det format, du har defineret. Zod validerer det. TypeScript ved, hvad du har med at gøre. Ingen parsing. Ingen overraskelser.\n\n## Hvad det åbnede op for\n\nStructured outputs ændrede ikke bare min fejlrate — det ændrede, hvad jeg overhovedet troede var muligt at bygge.\n\nPludselig kunne jeg bruge AI som et pålideligt trin i en pipeline. Ekstraher data fra ustrukturerede dokumenter og gem dem direkte i en database. Score leads og send dem videre til et CRM. Analysere supporttiketter og route dem automatisk.\n\nAlle disse ting *kræver* pålidelig output. Fri tekst er ikke pålidelig nok til produktion.\n\n## Zod er nøglen\n\nDet, der gør kombinationen kraftfuld, er ikke bare, at modellen returnerer JSON. Det er, at Zod-schemaet fungerer som en kontrakt — både for modellen (den ved, hvad den skal producere) og for din kode (den ved, hvad den modtager).\n\nDu kan bygge komplekse, nestede strukturer. Arrays af objekter. Optionelle felter med defaults. Diskriminerede unions. Alt det, Zod kan beskrive, kan modellen producere.\n\n## Et råd\n\nNæste gang du finder dig selv i at parse et tekstsvar fra en sprogmodel — stop. Definer i stedet en Zod-schema for det output, du faktisk har brug for. Det tager ti minutter. Det sparer dig for timer med fejlretning og skrøbelig parsing-kode.\n\nStructured outputs er ikke en avanceret feature. Det bør være standarden.",
    },
    {
      id: "ai-audio-oversigt-placeholder",
      type: "audio",
      title: "AI i praksis — lydoversigt",
      excerpt: "En introduktion til hvordan AI kan bruges i hverdagen for selvstændige og små virksomheder.",
      tag: "Podcast",
      date: "2026-02-05",
      featured: false,
      audioUrl: "",
    },
    {
      id: "ai-video-demo-placeholder",
      type: "video",
      title: "Demo: Structured outputs i aktion",
      excerpt: "En gennemgang af hvordan generateObject og Zod fungerer i et rigtigt projekt.",
      tag: "Video",
      date: "2026-02-12",
      featured: false,
      videoId: "",
    },
  ],
};
