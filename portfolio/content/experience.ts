export type ExperienceEntry = {
  role: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
  tech: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "SDE-Backend",
    org: "Directi (Titan Email)",
    period: "Jul 2025 – Present",
    summary:
      "Own and scale Medusa, Titan's event-driven data platform ingesting events and entity updates from every service across the org, plus Mimir, the org's shared AI-toolchain repo.",
    highlights: [
      "Own Medusa in production — 50M+ events and 200K+ entity updates processed for all clients. Migrated core APIs and SQS consumers to JDK virtual threads, cutting P99 latency 65% and lifting SQS consumer throughput ~30% under peak load.",
      "Redesigned the third-party delivery layer (Pendo, MoEngage) from an SQS-only pipeline to concurrent, virtual-thread-backed HTTP dispatch — shifted 90% of traffic to HTTP with near-zero downtime under strict per-vendor rate limits, cutting SQS spend by $1.5K+/year.",
      "Redesigned the Athena-bound entity-snapshot ETL pipeline with an Iceberg/CDC pattern, cutting pipeline CPU usage 70%.",
      "Built the Athena-AI MCP integration bringing internal analytics data to AI agents, and rolled out Claude Code Actions org-wide — auth/token management, per-repo access control, embedded MCP servers.",
    ],
    tech: ["Java", "Spring Boot", "AWS (SQS, S3, Athena)", "Kafka", "Spark", "Airflow", "Loki/Grafana"],
  },
  {
    role: "SDE Intern → Full-time",
    org: "Directi (Titan Email)",
    period: "Jan 2025 – Jul 2025",
    summary:
      "Designed and built an org-wide GitHub Actions CI/CD platform (titan-github-actions) from zero, replacing an aging Jenkins setup.",
    highlights: [
      "Built self-hosted runners on EKS across staging/prod/prod-euc1, 8+ reusable workflows and ~20 composite actions, canary + blue-green deployment automation gated on Loki/VictoriaMetrics/CloudWatch health signals.",
      "Cut average pipeline time ~40% in the Jenkins → GitHub Actions cutover, and cut failed-deploy incidents 80% via observability-driven automated rollback.",
      "Adopted org-wide — mobile, frontend, and devops teams migrated onto the platform independently.",
      "Seeded the org's Claude Code Actions rollout (OAuth/token management, per-repo access, cross-workflow context) that later grew into Mimir.",
    ],
    tech: ["GitHub Actions", "Kubernetes", "Helm", "EKS", "Docker", "SonarQube"],
  },
];
