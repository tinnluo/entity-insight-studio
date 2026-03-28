import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  GitBranch,
  Layers3,
  Radar,
  Sparkles,
} from "lucide-react";
import { DEFAULT_ENTITY_SLUG, getEntityBySlug } from "@/lib/server-data";

export const dynamic = "force-dynamic";

const featureCards = [
  {
    title: "Overview Dashboard",
    copy:
      "A compact operating brief with portfolio KPIs, benchmark context, and asset concentration patterns.",
    href: "/overview",
    icon: BarChart3,
  },
  {
    title: "Relationship Graph",
    copy:
      "A focused ownership and control view for tracing parent entities, subsidiaries, and capital concentration.",
    href: "/relationships",
    icon: GitBranch,
  },
  {
    title: "Scenario Explorer",
    copy:
      "A time-based model for comparing baseline performance, management plans, and benchmark pathways.",
    href: "/scenarios",
    icon: Radar,
  },
];

const architectureItems = [
  "App Router structure with thin read-only API routes backed by checked-in JSON fixtures.",
  "Reusable visualization modules for charts and relationship mapping, adapted from a larger internal app.",
  "A narrow product story: one coherent entity network, three strong flows, and no auth or platform complexity.",
];

export default async function HomePage() {
  const defaultEntity = await getEntityBySlug(DEFAULT_ENTITY_SLUG);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-10 md:px-10 md:py-14">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(17,24,39,0.08)] backdrop-blur">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            <Sparkles className="h-3.5 w-3.5" />
            Public Demo Studio
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            Explore entity metrics, ownership structure, and time-based insight
            from a small fixture-backed dataset.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Entity Insight Studio is a focused Next.js demo that shows how a
            larger analytics product can be reduced to a clean public story:
            strong dashboard composition, relationship mapping, and scenario
            modeling without internal services or operational baggage.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/overview?entity=${defaultEntity.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Open the Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/relationships?entity=${defaultEntity.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Jump to the Graph
              <GitBranch className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.94))] p-7 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3 text-sm font-medium text-sky-200">
            <Layers3 className="h-4 w-4" />
            Default Focus Entity
          </div>
          <h2 className="mt-4 text-2xl font-semibold">{defaultEntity.name}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {defaultEntity.summary}
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Revenue Base
              </dt>
              <dd className="mt-2 text-2xl font-semibold">
                ${defaultEntity.kpis.recurringRevenueBillions.toFixed(1)}B
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Controlled Capacity
              </dt>
              <dd className="mt-2 text-2xl font-semibold">
                {defaultEntity.kpis.controlledCapacityGw.toFixed(1)} GW
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Tracked Assets
              </dt>
              <dd className="mt-2 text-2xl font-semibold">
                {defaultEntity.kpis.trackedAssets}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Transition Score
              </dt>
              <dd className="mt-2 text-2xl font-semibold">
                {defaultEntity.kpis.transitionScore}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {featureCards.map(({ title, copy, href, icon: Icon }) => (
          <Link
            key={title}
            href={`${href}?entity=${defaultEntity.slug}`}
            className="group rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_72px_rgba(15,23,42,0.10)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-950">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-950">
              Open flow
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Architecture
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            A public-facing shell over fixture-backed analytics building blocks.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            The repo is intentionally narrow. It keeps the App Router, charting
            approach, and relationship rendering patterns from the source app,
            then rebuilds the framing and data layer for public use.
          </p>
        </div>
        <div className="grid gap-4">
          {architectureItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
