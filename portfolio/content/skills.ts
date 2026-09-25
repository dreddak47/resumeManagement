export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "Java", "TypeScript / JavaScript", "SQL", "C++", "Go", "Bash"],
  },
  {
    label: "AI / ML",
    items: [
      "LLMs & Agentic AI",
      "RAG",
      "MCP",
      "Reinforcement Learning",
      "PyTorch",
      "LangChain / LangGraph",
      "Fine-tuning",
    ],
  },
  {
    label: "Backend & Web",
    items: ["Spring Boot", "FastAPI", "Fastify", "Node.js", "React", "Next.js"],
  },
  {
    label: "Data & Infra",
    items: [
      "AWS (S3, SQS, Lambda, EC2)",
      "Kubernetes",
      "Docker",
      "Kafka",
      "Spark",
      "Airflow",
      "Athena / Iceberg",
      "GitHub Actions",
      "Loki / Grafana",
    ],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MySQL", "Supabase", "Redis", "SQLite (+ sqlite-vec)"],
  },
];
