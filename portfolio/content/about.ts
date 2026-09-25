export const identity = {
  name: "Aekansh Kathunia",
  tagline: "Developer · AI/ML, Computer Vision, NLP · Codeforces Expert",
  location: "India",
  email: "aekansh047@gmail.com",
  github: "https://github.com/dreddak47",
  linkedin: "https://www.linkedin.com/in/dreddak47",
  codeforces: "https://codeforces.com/profile/dredd_ak47",
};

// LinkedIn-voice narrative — full paragraphs, used on the About section.
// Keep this playful/curious/idea-driven, not resume-speak.
export const aboutParagraphs = [
  "I'm a developer with a fervent passion for technology. I thrive on exploring the intricacies of cutting-edge innovation — diving deep into AI/ML, Computer Vision, and NLP, with a strong foundation in GenAI, cybersecurity, and backend development. My journey is driven by an insatiable curiosity and a love for coding, where I find joy in solving complex problems and bringing ideas to life.",
  "The best thing about me is probably my ideas. I get them constantly — and the closer AI gets to how I build, the more of them I can actually chase down instead of just having them. That's the real shift for me: not that AI writes code, but that it lets one person's idea throughput turn into a real project pipeline.",
  "Under the hood: I studied Electronics and Communication Engineering at IIIT Delhi, own production data platforms at Directi (Titan Email) day to day, and I'm a Codeforces Expert who never really stopped treating problems like competitive-programming puzzles — including the ones nobody assigned me.",
];

export const interestsNote =
  "I also spend a good amount of personal time on projects shaped by things I care about outside of work — mindfulness and spiritual practice among them. A couple of the projects below grew directly out of that: applying real retrieval/RAG engineering to ancient text study, and audio ML to a personal chanting practice. More on that further down.";

// Content for the scroll-driven "vibe coding" section right under the hero —
// short, punchy beats, not paragraphs. `proof` is an optional real-project
// chip that backs up the claim being made at that beat.
export type VibeBeat = {
  text: string;
  proof?: string;
};

export const vibeBeats: VibeBeat[] = [
  { text: "I vibe code." },
  { text: "AI scaffolds a working idea in a weekend now. Honestly? Everyone's doing that." },
  { text: "Most ideas stop right there — a demo, a screenshot, a tab you forget about." },
  { text: "Mine don't." },
  { text: "I take the fast, AI-shipped version and ask what it'd take to make it real." },
  { text: "Real meaning: it survives a crash.", proof: "Collab-Docs — 0 chars lost after a hard kill" },
  { text: "Real meaning: it catches its own hallucinations.", proof: "Vedaspace — citation-verified RAG over sacred texts" },
  { text: "Real meaning: the numbers are measured, not vibes.", proof: "RL Minesweeper Lab — 77% win rate, 95% CI checked" },
  { text: "Ideas are cheap. I have a constant supply of them." },
  { text: "What's rare is the part after the idea — and that's the part AI didn't replace." },
  { text: "It just raised my throughput on it." },
];
