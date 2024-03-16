"use client";

import dynamic from "next/dynamic";

const BarChart = dynamic(
  () => import("./bar-chart").then((mod) => mod.BarChartStreamable),
  {
    ssr: false,
    loading: () => (
      <div className="bg-zinc-900 rounded-lg px-4 py-5 text-center text-xs">
        ロード中...
      </div>
    ),
  }
);

const LineChart = dynamic(
  () => import("./line-chart").then((mod) => mod.LineChartStreamable),
  {
    ssr: false,
    loading: () => (
      <div className="bg-zinc-900 rounded-lg px-4 py-5 text-center text-xs">
        ロード中...
      </div>
    ),
  }
);

const ScatterChart = dynamic(
  () => import("./scatter").then((mod) => mod.ScatterChartStreamable),
  {
    ssr: false,
    loading: () => (
      <div className="bg-zinc-900 rounded-lg px-4 py-5 text-center text-xs">
        ロード中...
      </div>
    ),
  }
);

const Table = dynamic(
  () => import("./table").then((mod) => mod.TableStreamable),
  {
    ssr: false,
    loading: () => (
      <div className="bg-zinc-900 rounded-lg px-4 py-5 text-center text-xs">
        ロード中...
      </div>
    ),
  }
);

export { BarChart, LineChart, ScatterChart, Table };
