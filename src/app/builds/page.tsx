import type { Metadata } from "next";
import BuildList from "@/components/BuildList";

export const metadata: Metadata = {
  title: "Builds — Oskar Tang",
  description: "Things I have built.",
};

export default function BuildsPage() {
  return (
    <main className="builds">
      <header className="builds-head">
        <p className="builds-eyebrow">Selected work</p>
        <h1 className="builds-title">Builds</h1>
        <p className="builds-sub">
          Products, tools, and experiments — shipped and in progress.
        </p>
      </header>

      <BuildList />
    </main>
  );
}
