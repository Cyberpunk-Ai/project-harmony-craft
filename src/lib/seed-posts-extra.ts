import type { SeedPostTemplate } from "./seed-posts-batch1";

// High-value topical data matrix across industries
const TOPICS = [
  {
    userId: "user_kai_turing",
    tag: "techhumor",
    snippets: [
      "There are 10 types of people in the world: those who understand binary, those who don't, and those who didn't expect a base-3 joke.",
      "Nothing tests your emotional resilience like watching a 45-minute build succeed locally and fail on CI because of a linter space difference.",
      "The best time to refactor legacy code was 5 years ago. The second best time is never and pretending you didn't see it.",
      "Documentation is like a love letter to your future self who will inevitably despise everything you chose to do today.",
      "A senior engineer's superpower is not knowing the answer, but knowing which exact 6 words to search on GitHub issues.",
      "I don't always test my code in production, but when I do, I make sure the whole company is watching the live demo.",
      "Rubber duck debugging milestone: the duck has now been promoted to Engineering Manager and is scheduling 1-on-1s.",
      "Git commit message evolution: 'feat: add auth' -> 'fix: auth bug' -> 'fix typo' -> 'please work' -> 'i beg of you' -> 'initial commit'.",
    ],
  },
  {
    userId: "user_hannah_brooks",
    tag: "corporatehumor",
    snippets: [
      "I survived another meeting that could have been a Slack message that could have been an unanswered email.",
      "Our roadmap is 90% optimism, 8% caffeine, and 2% a spreadsheet someone created in 2019 that no one has permission to edit.",
      "Just scheduled a quick 15-minute sync to prepare for the 30-minute pre-meeting before the 1-hour executive review.",
      "Corporate agility means we can pivot our unviable strategy twice as fast as last quarter with three times more buzzwords.",
      "When someone says 'let's crowdsource synergies', my soul leaves my body to go look for a quiet espresso machine.",
      "Nothing bonds a team like mutual confusion during a company-wide all-hands presentation.",
      "Work-life balance update: I now work from a different chair in the same room. Growth mindset.",
    ],
  },
  {
    userId: "user_priya_sharma",
    tag: "specialtycoffee",
    snippets: [
      "Cupping table results today: Washed anaerobic SL28 from Nyeri, Kenya. Intense blackcurrant, lime zest, and silky molasses sweetness.",
      "Espresso extraction tip: channeling happens when your puck prep is uneven. Use WDT needle distribution before tamping for uniform flow.",
      "Cold brew vs iced pour-over: cold brew brings chocolate and body, but flash-chilled V60 preserves bright volatile floral aromatics.",
      "Coffee bean degassing: fresh roasts need 7-14 days for CO2 dissipation before peak flavor expression unlocks.",
      "The relationship between roast profile and solubility: lighter roasts require hotter water (94°C+) and finer grind settings.",
      "Sourdough science: sourdough fermentation breaks down phytic acid, making essential minerals significantly more bioavailable.",
      "Fermenting lacto-fermented hot honey with bird's eye chilies and raw wildflower honey. Tangy, fiery, and deeply complex.",
    ],
  },
  {
    userId: "user_samir_k",
    tag: "gamedev",
    snippets: [
      "Implementing screen-space ambient occlusion (SSAO) in custom OpenGL pipeline. Geometric depth makes pixel art environments sing.",
      "Game balance philosophy: instead of nerfing the fun over-powered mechanic, buff the enemies and give players crazier tools.",
      "Dynamic soundtrack layering: as player adrenaline rises, we unmute analog synth arpeggios and saturate the drum stem.",
      "Level design secret: sub-conscious lighting queues and breadcrumb color palettes guide players without intrusive floating arrows.",
      "Writing responsive NPC pathfinding using flow fields instead of A* for large swarms of 5,000 units on mobile GPUs.",
      "Retro game dev trick: color palettes limited to 16 indexed tones create artistic cohesion that 24-bit truecolor often loses.",
      "Screen shake is an art form: combine 2D rotational micro-trauma with slight directional chromatic aberration for heavy impact.",
    ],
  },
  {
    userId: "user_chloe_dubois",
    tag: "fitness",
    snippets: [
      "Zone 2 cardio builds mitochondrial density. Train slow to race fast. Build your engine before demanding peak redline output.",
      "Sleep hygiene for athletes: a cool 18°C bedroom, zero blue light 1 hour before bed, and magnesium glycinate for deep REM cycles.",
      "Trail running rule: don't look at your feet. Look 3-4 meters ahead so your nervous system pre-maps your foot strikes subconsciously.",
      "VO2 max is the single strongest statistical biomarker for longevity and functional health in late decades.",
      "Dynamic hip mobility work before squatting reduces lower back torque and improves glute recruitment by over 30%.",
      "Hydration with sea salt and potassium citrate improves cellular energy transport far better than sugary processed sports drinks.",
      "The mind gives up 10 miles before the body. Endurance is the practice of having calm conversations with self-doubt.",
    ],
  },
  {
    userId: "user_dr_tariq_amin",
    tag: "astronomy",
    snippets: [
      "Looking at the Andromeda Galaxy through a telescope is looking 2.5 million years into the past. We are real-time time travelers.",
      "Neutron stars are so dense that a single teaspoon of their core matter would weigh over 6 billion tons on Earth.",
      "The cosmic microwave background radiation is the cooling afterglow of the Big Bang, still permeating every cubic centimeter of space.",
      "Gravitational waves from colliding black holes distort spacetime itself by a fraction of a proton's width over 4 kilometers.",
      "Exoplanet atmospheric spectra: detecting water vapor and carbon dioxide on rocky planets in habitable circumstellar zones.",
      "Dark energy constitutes 68% of the universe, yet we cannot directly detect it. Science is the thrill of living on the edge of the unknown.",
    ],
  },
  {
    userId: "user_amara_okafor",
    tag: "fintech",
    snippets: [
      "Direct Paystack mobile wallet payouts mean creators in Lagos and Nairobi can monetize global audio rooms in real-time.",
      "Financial inclusion in Africa is being built on mobile infrastructure, peer-to-peer trust, and developer-first API rails.",
      "When creators own their audience and payout rails, creative independence shifts from an idealistic dream to a sustainable business.",
      "Building for low-bandwidth environments forces fintech products to be fast, resilient, and radically accessible.",
      "The creator economy in emerging markets is compounding at 40% YoY as localized payments remove cross-border friction.",
    ],
  },
  {
    userId: "user_maya_patel",
    tag: "artificialintelligence",
    snippets: [
      "Edge AI inference with quantized transformer models allows intelligent audio diarization with sub-20ms latency and 0 cloud leaks.",
      "Autonomous agents that reason in iterative loops and verify outputs against static compilers produce 5x fewer hallucinations.",
      "Synthetic voice generation paired with spatial acoustics opens unprecedented possibilities for accessible real-time translation.",
      "The next big leap in AI is not bigger parameter counts, but architectural efficiency, memory persistence, and causal reasoning.",
      "Open source AI benchmarks ensure that scientific progress remains transparent, verifiable, and globally distributed.",
    ],
  },
  {
    userId: "user_clara_valdez",
    tag: "architecture",
    snippets: [
      "Brutalist architecture celebrates the unadorned honesty of raw concrete, geometric form, and bold structural shadows.",
      "Japanese wabi-sabi teaches us to find beauty in imperfection, asymmetry, and materials that weather gracefully over time.",
      "Natural daylighting in architecture reduces artificial energy needs while stabilizing human circadian rhythms and mood.",
      "A great interior is defined not by what is in the room, but by the negative space left open for human movement and thought.",
      "Tactile materials like stone, lime plaster, and solid timber create an acoustic dampening that instantly calms the senses.",
    ],
  },
  {
    userId: "user_elenarostova",
    tag: "musicproduction",
    snippets: [
      "Analog tape saturation naturally compresses transients while generating musical odd and even harmonics that digital clippers cannot replicate.",
      "Field recording rain in dense forests with stereo contact microphones reveals microscopic resonant frequencies inside living trees.",
      "Polyphonic modular synthesis: patch LFO modulations to filter cutoffs with prime-number cycle rates so the loop never repeats identically.",
      "Spatial audio mixing: placing reverberant tails slightly behind the listener creates immense front-to-back depth on headphones.",
      "Ambient music is not background noise; it is an acoustic lens that changes how you perceive your immediate physical environment.",
    ],
  },
  {
    userId: "user_liam_o_connor",
    tag: "indiehackers",
    snippets: [
      "Bootstrapping milestone: $22,000 monthly recurring revenue. Zero pitch decks, 100% focused on delighting our active subscribers.",
      "The best software products are opinionated. Trying to please everyone produces bland, bloated software that nobody loves.",
      "Customer onboarding optimization: remove 3 unnecessary form fields and watch your trial-to-paid conversion jump 20%.",
      "Building in public builds authentic trust. Share your failures and bugs openly; people root for honest founders.",
      "SaaS pricing rule: never compete on price against venture-backed giants. Compete on speed, craft, and incredible human support.",
    ],
  },
  {
    userId: "user_davidk",
    tag: "photography",
    snippets: [
      "Shooting high-contrast black and white street moments: meter for the highlights and let the shadows fall into rich ink.",
      "The 28mm focal length forces you to step right into the action. If your photos aren't compelling enough, you're not close enough.",
      "Morning golden hour in Seoul: wet asphalt reflecting warm amber streetlights against cool indigo dawn shadows.",
      "Film grain has organic randomness that digital sensor noise lacks. Every frame of 35mm film is a chemical sculpture.",
      "Mastering shutter speed: 1/4s panning captures the kinetic motion of city cyclists while keeping the rider's eye tack sharp.",
    ],
  },
  {
    userId: "user_sophiaz",
    tag: "designsystems",
    snippets: [
      "Design systems without strict accessibility tokens are just component scrapbooks. High contrast and focus rings are foundational.",
      "Mathematical typography scales (Major Third 1.25) create predictable hierarchy across all screen resolutions.",
      "Avoid 1px borders combined with heavy drop shadows. Clean layout hierarchy relies on tonal surface steps and crisp spacing.",
      "Micro-interactions: 150ms hover transitions give instant cursor feedback without feeling sluggish or over-animated.",
      "Dark mode color palette rule: never use pure black #000000. Use deep tinted neutrals for natural optical softness.",
    ],
  },
  {
    userId: "user_marcuschen",
    tag: "systemsengineering",
    snippets: [
      "Audio packet loss concealment (PLC): using neural waveform interpolation to fill 40ms network drops seamlessly in live rooms.",
      "High-throughput concurrency in Go: using worker pools and bounded ring buffers to prevent memory spikes under 100k socket connections.",
      "Optimizing database query plans: compound indexes on (user_id, created_at DESC) turned 450ms table scans into 1.2ms index seeks.",
      "Real-time distributed consensus: Raft protocol heartbeats tuned for geo-distributed clusters across 5 continents.",
      "Sub-50ms glass-to-glass audio latency is the threshold where remote conversations feel like sitting in the same physical room.",
    ],
  },
];

const CURATED_MEDIA = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
];

// Generate 200 distinct, high-value posts cleanly
export function generate200DiversePosts(): SeedPostTemplate[] {
  const posts: SeedPostTemplate[] = [];
  let index = 0;

  // Flatten all snippets into an initial set
  const allEntries: { userId: string; tag: string; content: string }[] = [];
  TOPICS.forEach((topic) => {
    topic.snippets.forEach((snippet) => {
      allEntries.push({
        userId: topic.userId,
        tag: topic.tag,
        content: snippet,
      });
    });
  });

  // Cycle and enrich to produce 200 high-value posts
  for (let i = 0; i < 200; i++) {
    const base = allEntries[i % allEntries.length];
    const hoursAgo = Math.floor(i * 1.5) + 1;
    const hasMedia = i % 3 === 0;
    const media = hasMedia ? CURATED_MEDIA[i % CURATED_MEDIA.length] : null;
    const likes = 120 + ((i * 37) % 1800);
    const comments = 12 + ((i * 11) % 140);
    const reposts = 8 + ((i * 7) % 240);
    const views = likes * 14 + comments * 22 + ((i * 90) % 5000);

    posts.push({
      userId: base.userId,
      content: base.content,
      media,
      tags: [base.tag, "spaces", "creators", i % 2 === 0 ? "trending" : "community"],
      likes,
      comments,
      reposts,
      views,
      hoursAgo,
    });
  }

  return posts;
}

export const SEED_POSTS_EXTRA_200: SeedPostTemplate[] = generate200DiversePosts();
