Landsvig Design System

The Tactile Algorithm

AI is not a cloud or a network. It is a raw material. We treat prompt engineering and automation as fine Danish carpentry — joinery, not disruption. We sell structure, time, and quiet.

This design system embodies Quiet Luxury: Scandinavian minimalism in the tradition of Norm Architects, Studio McGee, and Frama. Every surface, every transition, every word should feel like entering a well-built room — warm, considered, unhurried.

When building anything under the Landsvig name, apply this system completely. Do not invent new colors, fonts, or animation timings. The constraint is the craft.

1. Color

Three materials. No neon. No tech-blue. No pure black.

Name

HSL

Hex

Role

Bone White

43° 33% 97%

#f9f8f4

Backgrounds, primary surfaces

Dark Oak

210° 4% 18%

#2c2e30

Text, foreground, icons

Warm Grey Linen

36° 16% 87%

#e8e2d8

Secondary surfaces, borders, inputs

Error states use a muted red (0° 84% 60%, #ff5252). It is a functional color, not a palette member.

Hierarchy Through Opacity

Do not introduce new colors for hierarchy. Modulate Dark Oak opacity:

Opacity

Role

100%

Primary content — headlines, body text

70%

Secondary content — descriptions, subheadings

50%

Navigation, links, timestamps

40%

Labels, captions, form metadata

20%

Ornamental — entry numbers, divider marks

Principles

Text is always Dark Oak at varying opacity. Never a separate grey — always the same hue, dimmed.

Borders are always Warm Grey Linen, 1px. No thick borders, no colored borders.

Gradients are only used as overlays on images: background color fading to transparent. No gradient fills.

Glass effects: Bone White at 80% opacity with backdrop blur, for floating elements.

2. Typography

A grounded serif for authority and heritage. A precise monospace to signal the tools and code behind the craft.

Root Sizing: The base font size is 16px (1rem). All scale relationships are calculated relative to this root to ensure fluid scaling across devices.

Pairing & Fallbacks

Role

Principle

Reference font

CSS Fallback Stack

Headings

Grounded serif — high contrast, classical proportions

Playfair Display

'Playfair Display', Georgia, 'Times New Roman', serif

Body & UI

Precise monospace — even spacing, technical clarity

JetBrains Mono

'JetBrains Mono', 'Courier New', Courier, monospace

The role matters more than the specific family. On platforms where these fonts are unavailable, substitute any serif with classical proportions and any monospace with clean geometry. The pairing — warm authority over cool precision — is what defines the system.

Scale Relationships

Element

Size relative to body

Line height

Letter spacing

Hero heading

3–5× body

Tight (1.1)

Negative (-0.02em)

Section heading

2–3× body

Tight (1.1–1.25)

Negative (-0.02em)

Entry/card heading

1.5× body

Tight (1.15)

Negative (-0.02em)

Body text

1× (baseline)

Relaxed (1.8)

Slightly wide (0.025em)

Navigation, buttons

0.85× body, uppercase

Normal (1.5)

Wide (0.2em)

Tags, helper text

0.75× body, uppercase

Normal (1.4)

Wide (0.25em)

Principles

Hierarchy comes from size and opacity, not font weight. The monospace stays at regular weight throughout.

Labels and navigation are always uppercase monospace with wide letter spacing.

Headings breathe with tight line height. Body text breathes with relaxed line height. They create rhythm together.

Responsive heading sizes should scale fluidly using clamp() between a readable mobile minimum and a generous desktop maximum.

3. Texture & Imagery

The UI should feel analog. Not flat, not glossy — tactile.

Surface Treatment

Subtle grain textures on backgrounds — simulate paper, linen, or plaster.

Web Implementation: Use a highly compressed, low-opacity SVG noise overlay or CSS mix-blend-mode. Avoid heavy raster images that impact load times.

Soft shadows that mimic diffuse daylight, never hard drop-shadows or spotlights.

Generous negative space. Content should breathe like objects in a gallery, not fill the frame.

Photography

High-resolution, long-exposure photography.

Subjects: Macro shots of materials — wood grain, heavy paper, hands working, light falling on a brick wall. The human and the material, not the screen.

Color grading: Desaturated, warm, natural. Match the Bone White / Dark Oak tonal range.

Images load with a blur-up placeholder: background color that fades away as the image resolves.

Product Presentation

AI tools and digital products are presented as physical implements — digitale redskaber. They are not "platforms" or "solutions." Use 3D renders that resemble physical objects, or clean modular interfaces that feel like well-designed instruments. The user should feel they are picking up a tool, not logging into software.

Video

Cinematic. Desaturated. Behind-the-scenes craft footage: hands building, screens reflecting, light moving through a workspace. Never testimonials, never talking heads, never screen recordings with cursor trails.

Forbidden Imagery

Never use: robots, glowing brains, abstract neural networks, neon grids, stock photos of people pointing at screens, any "tech" or "AI" visual cliche. If it could appear on a SaaS landing page circa 2024, it does not belong here.

4. Voice & Vocabulary

Tone: "The Silent Authority." We speak like a builder explaining a blueprint. Short sentences. No superlatives. Let results speak for themselves.

Forbidden Words

Never use: disruption, revolution, synergy, algorithm, future-proof, AI-driven, next level, neural, cyber, magic, cutting-edge, innovative, leverage, scalable, game-changing, solution, platform, optimize, empower, seamless.

Required Vocabulary

Prefer: foundation, tool, structure, time, craft, tailored, quiet, overview, solid, relief, essential, built, considered, room, material, implement, workshop, handshake.

Syntax

Short, rhythmic sentences. One idea per sentence.

No exclamation marks. No superlatives. No rhetorical questions.

Instead of "We use advanced AI to optimize your workflow" — say "We build the tools that give you your afternoon back."

Instead of "Our innovative platform leverages cutting-edge technology" — say "Solid tools. Built with care."

Danish is the primary language (lang="da"). The voice carries across languages: the rhythm and restraint are the same in any tongue.

5. Spacing

Generous. Breathing. Built on a base grid.

The Grid & Breakpoints

All spacing uses multiples of a 4px base unit. Never arbitrary values (5px, 11px, 15px).

Mobile Breakpoint: < 768px

Tablet Breakpoint: 768px - 1024px

Desktop Breakpoint: > 1024px

Intent

Context

Principle

Between major sections

Very generous — the eye needs rest between ideas

Between entries in a list

Moderate — enough to distinguish, not so much they disconnect

Inside a container

Comfortable — content should not press against its walls

Between inline elements

Tight but not cramped — functional proximity

Page margins

Narrow on mobile, moderate on desktop — content earns the space

Principles

Vertical spacing between sections should feel like pauses between paragraphs in a well-set book — generous enough that each section registers as its own thought.

Max-width prevents long reading lines. Content should never stretch wider than comfortable reading measure (~65-75 characters).

Mobile and desktop share the same grid. Only the multipliers change.

6. Motion & Interaction

The interface should feel like a physical space. Smooth, weighted transitions. No pop-ups. No surprises.

Easing

All animations use one curve:

transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);


Snappy initiation, smooth deceleration. Like a drawer closing on quality runners.

Timing

Speed

Usage

Fast (0.2s–0.3s)

Hover effects, micro-interactions

Medium (0.5s–0.6s)

Navigation, menu transitions

Slow (0.8s–1.0s)

Content reveals, scroll-triggered entrances

Very slow (1.2s–1.8s)

Large-scale transitions, image loading

Stay in these clusters. Arbitrary durations (0.65s, 1.1s) break the rhythm.

Patterns

Text entering the viewport: slides up from below, slow timing.

Cards and images entering: fade in with a subtle scale (98% → 100%), slow timing.

Lists entering: each item fades and slides up, staggered — each item delayed slightly after the previous. Not faster than 0.08s apart, not slower than 0.15s.

Scroll-linked backgrounds: subtle scale increase as the section scrolls through the viewport.

Hover: subtle lift upward (1–2px) with a slow color transition. Never instant.

Loading states: gentle pulsing dots. Never spinners.

Constraints

Only animate opacity, scale, and translate. No rotate, skew, or blur.

Scroll-triggered animations fire once. They welcome the user; they do not perform on repeat.

No auto-playing animations. Respond to presence, not a timer.

Interaction Philosophy

Invisible UI: The interface should feel like a room you walk through, not a dashboard you operate. Reduce visible controls. Let content lead.

Anticipation of quiet: The design should sense what the user needs and present it without noise. Fewer choices, less friction, no "are you sure?" interruptions. The user came for structure and relief — give it to them immediately.

No pop-ups. No toast notifications. No bouncing elements. No attention-grabbing animations. No cookie banners that dominate the viewport.

Primary action on Enter. Line break on Shift+Enter. Dismiss on Escape. These are the only keyboard conventions.

7. Borders & Shadows

Borders

Color: Warm Grey Linen (#e8e2d8).

Width: 1px. Always.

Style: Solid only. No dashes, no double borders.

Radius: Nearly square — minimal rounding. Sharpness signals precision.

Inputs use bottom-border only. Focus state: thicker border in Dark Oak.

Lists use bottom-border between items as dividers.

When in doubt, use spacing and color instead of adding more borders.

Shadows

All shadows use Dark Oak (#2c2e30) at low opacity. They simulate diffuse daylight, not spotlights.

Level

Character

Usage

Implementation

Subtle

Barely visible

Micro-elevation, quiet depth

box-shadow: 0 4px 12px rgba(44, 46, 48, 0.08);

Small

Soft, wide spread

Floating navigation, popovers

box-shadow: 0 8px 24px rgba(44, 46, 48, 0.12);

Large

Prominent but diffuse

Emphasis on hover, elevated panels

box-shadow: 0 16px 40px rgba(44, 46, 48, 0.15);

Keep shadow opacity between 8% and 15%. Higher than that breaks the quiet.

8. Content Architecture (Re-imagined)

We do not build "platforms" with "features," "dashboards," and "blogs." We build digital environments. The navigation and structure of the site must reflect physical spaces or the fundamental steps of craft.

Choose one of the following architectural models for the website, depending on the scale of the product.

Model A: The Architectural Spaces

Best for a broader agency, consultancy, or multi-tool ecosystem. Sections are named and designed as distinct rooms within a masterfully built house. The user moves through doors, not dropdowns.

Metaphor

SaaS Equivalent

Presentation & Philosophy

The Foyer (Forhallen)

Landing Page / Home

A space to acclimatize. Generous negative space. Establishes the light and texture of the brand. No aggressive calls-to-action. We simply open the door.

The Instruments (Instrumenterne)

Products / Features

Not a "suite" or "tools," but instruments. Presented with the precision of a medical or architectural device. 3D orthographic views. Technical, calm, precise.

The Archive (Arkivet)

Case Studies / Blog

The collective memory of the firm. Quiet reading. Filtered by material or method, not by date. It feels like pulling a heavy, linen-bound ledger from a shelf.

The Drafting Room (Tegnestuen)

About / Process

Where the thinking happens. Blueprints, sketches, and the humans behind the work. Less polished, more tactile.

The Correspondence (Brevvekslingen)

Contact / Support

A deliberate exchange. No chatbots. No "submit a ticket." A beautiful, single-column form that feels like writing a letter on heavy-stock paper.

Model B: The Lifecycle of Craft

Best for a single, focused AI product or SaaS application.

Sections are named after the physical stages of building furniture. It demystifies AI by grounding it in physical labor.

Metaphor

SaaS Equivalent

Presentation & Philosophy

The Material (Råstoffet)

Data / AI Models / Inputs

Where the raw AI capability is presented. Unshaped, powerful, waiting for direction. Visualized through subtle, organic textures.

The Joinery (Samlingerne)

Integrations / Workflows

How things connect. Automation is treated as mortise and tenon joints—hidden, strong, perfectly fitted. Focus on the seamless transition between systems.

The Artifact (Værket)

The Output / Deliverables

The finished product of the AI. Presented cleanly, like a vase on a pedestal. It stands alone.

The Ledger (Protokollen)

Account / Settings

Trust and record-keeping. Billing and user management should feel like a ledger kept by an old, trusted bank. High-contrast monospace, perfectly aligned columns.

Structural Principles

URL Structure: URLs should reflect the architecture, keeping English clean or leaning into the Danish roots if the brand allows.
(e.g., landsvig.com/archive, not landsvig.com/blog)

Wayfinding: Navigation is not a sticky header following you around. It is a quiet index, available when needed, usually resting at the top or bottom of the frame like a gallery map.

Pacing: Transitioning between these sections should feel like walking from a sunlit room into a shaded corridor. Use the "Very Slow" (1.2s) transition timing to load new architectural spaces.

9. Accessibility & Forms

Dark Oak on Bone White exceeds WCAG AAA contrast (7:1 minimum).

Dark Oak on Warm Grey Linen exceeds WCAG AAA contrast.

Focus states are always visible: Dark Oak ring, offset from the element edge.

Text never goes below comfortable reading size. Labels may be small but compensate with wide letter spacing.

Form States: Disabled inputs use 40% text opacity with a dashed border. Error validation utilizes the muted red (#ff5252) exclusively for the input's bottom border and the corresponding error message below it.

Semantic structure. Descriptive labels on icon buttons. Full keyboard navigation.

Accessibility is not a feature — it is the foundation. A well-built room welcomes everyone.

10. Checklist

Before shipping, verify:

[ ] All colors from the three-material palette? No custom hex values invented?

[ ] Opacity hierarchy for text, not new greys?

[ ] Serif headings, monospace body? CSS fallbacks implemented?

[ ] All spacing on the base 4px grid? 1rem base size maintained?

[ ] Standard cubic-bezier(0.22, 1, 0.36, 1) easing curve on every animation?

[ ] Durations strictly within the defined timing clusters?

[ ] No forbidden words in any copy?

[ ] No forbidden imagery? Textures applied via lightweight CSS/SVG?

[ ] No pop-ups, toasts, or attention-grabbing elements?

[ ] Does the voice sound like a builder, not a marketer?

[ ] Would this feel at home next to a Norm Architects interior?

v3.0 — Updated for Web Architecture & Implementation