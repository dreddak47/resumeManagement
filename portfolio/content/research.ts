export type ResearchEntry = {
  title: string;
  org: string;
  period: string;
  description: string;
  link?: { label: string; href: string };
};

export const research: ResearchEntry[] = [
  {
    title: "Undergraduate Researcher — LLM-guided code generation",
    org: "MIDAS Lab, IIIT Delhi",
    period: "Aug 2024 – Dec 2024",
    description:
      "Analyzed 20+ papers on LLM code generation and explored using semantic knowledge graphs to guide generation and improve context retention while solving competitive-programming-style problems. Fine-tuned Qwen on 5K+ code-test pairs with AST-based and graph-alignment evaluation. The direction — agentic, context-guided code solving — predates and mirrors what later shipped as mainstream agentic coding tools.",
  },
  {
    title: "Cross-lingual Sentiment Analysis across Machine Translation",
    org: "NLP Coursework Paper, IIIT Delhi",
    period: "2024",
    description:
      "A course research paper studying how sentiment signal degrades or shifts under machine translation across languages, building on transformer-based sentiment models.",
  },
  {
    title: "Software Engineering Fellow — Robotic Motion Planning",
    org: "Launchpad.ai (remote fellowship)",
    period: "Jul 2024 – Sep 2024",
    description:
      "Cohort-based fellowship building a vision-guided robotic arm for sunscreen application. Implemented Deep RL (DQN, TD3) across a custom PyBullet simulation and 10+ motion-planning algorithms; served as Scrum Master for the team.",
    link: {
      label: "Team write-up (Medium)",
      href: "https://medium.com/@gauthamsathyan/automating-sunscreen-application-with-robotics-a-deep-dive-into-two-approaches-34304dbdd719",
    },
  },
  {
    title: "Graphics & Vision Summer School 2024 — Top-50 selection",
    org: "IIT Delhi",
    period: "2024",
    description:
      "Selected among the top 50 students nationally. Built a vision-based house-price estimation system combining textual features with property images, and explored SLAM-based approaches to depth estimation.",
  },
];

export const codingProfile = {
  platform: "Codeforces",
  handle: "dredd_ak47",
  note: "Strong DSA background built through years of competitive programming — currently rated Expert.",
};
