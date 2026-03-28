import Link from "next/link";
import { ArrowRight, Building2, MapPinned, TrendingUp } from "lucide-react";
import { AssetFootprintChart } from "@/components/asset-footprint-chart";
import { PeerComparisonChart } from "@/components/peer-comparison-chart";
import { StudioShell } from "@/components/studio-shell";
import {
  getEntityOptions,
  getOverviewPayload,
} from "@/lib/server-data";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OverviewPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedEntity =
    typeof params.entity === "string" ? params.entity : undefined;
  const [options, overview] = await Promise.all([
    getEntityOptions(),
    getOverviewPayload(requestedEntity),
  ]);

  const cards = [
    {
      label: "Recurring revenue",
      value: `$${overview.entity.kpis.recurringRevenueBillions.toFixed(1)}B`,
      detail: "Twelve-month fixture estimate",
    },
    {
      label: "Tracked assets",
      value: `${overview.entity.kpis.trackedAssets}`,
      detail: "Included in the public demo footprint",
    },
    {
      label: "Controlled capacity",
      value: `${overview.entity.kpis.controlledCapacityGw.toFixed(1)} GW`,
      detail: "Across operating and in-build assets",
    },
    {
      label: "Transition score",
      value: `${overview.entity.kpis.transitionScore}`,
      detail: `${overview.entity.kpis.yoyIntensityChangePct}% YoY intensity change`,
    },
  ];

  return (
    <StudioShell
      currentPath="/overview"
      currentSlug={overview.entity.slug}
      options={options}
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Overview Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {overview.entity.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              {overview.entity.sector}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              {overview.entity.region}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              HQ {overview.entity.headquarters}
            </span>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
            {overview.entity.summary}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {overview.entity.highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.94))] p-7 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
            Focus
          </p>
          <p className="mt-3 text-lg leading-8 text-slate-200">
            {overview.entity.focus}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Owner concentration
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {overview.ownershipSummary.concentrationPct}%
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Portfolio intensity
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {overview.entity.kpis.portfolioIntensity.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={`/relationships?entity=${overview.entity.slug}`}
              className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View the relationship graph
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/scenarios?entity=${overview.entity.slug}`}
              className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Open the scenario explorer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {card.value}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {card.detail}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-sky-700" />
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Peer comparison
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                Transition score context across the small fixture universe.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <PeerComparisonChart data={overview.entity.peerComparison} />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-sky-700" />
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Asset footprint
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                Operating footprint aggregated by region from checked-in assets.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <AssetFootprintChart data={overview.footprint} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-sky-700" />
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Ownership snapshot
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                A quick read before opening the full graph.
              </p>
            </div>
          </div>
          <dl className="mt-6 grid gap-4">
            <SummaryRow
              label="Direct owners"
              value={overview.ownershipSummary.ownerCount.toString()}
            />
            <SummaryRow
              label="Controlled entities"
              value={overview.ownershipSummary.subsidiaryCount.toString()}
            />
            <SummaryRow
              label="Top-two concentration"
              value={`${overview.ownershipSummary.concentrationPct}%`}
            />
          </dl>
        </div>

        <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <h2 className="text-xl font-semibold text-slate-950">Tracked assets</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            The demo keeps a small but coherent fixture table instead of a full
            operational data room.
          </p>
          <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Technology</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {overview.assets.map((asset) => (
                  <tr key={asset.assetId}>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-950">{asset.name}</div>
                      <div className="text-sm text-slate-500">{asset.country}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{asset.region}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {asset.technology}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {asset.capacityMw.toLocaleString()} MW
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          asset.riskLevel === "High"
                            ? "bg-rose-100 text-rose-700"
                            : asset.riskLevel === "Moderate"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {asset.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </StudioShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
