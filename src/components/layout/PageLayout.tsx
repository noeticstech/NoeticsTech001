import type { ReactNode } from "react";
import { ScrollProgress } from "@/components/bonus/ScrollProgress";
import { AnimatedGrid } from "@/components/effects/AnimatedGrid";
import { LightStreaks } from "@/components/effects/LightStreaks";
import { StarfieldBackground } from "@/components/effects/StarfieldBackground";
import { Navbar } from "./Navbar";

type PageLayoutProps = {
  children: ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-aurora)]" />
        <StarfieldBackground />
        <AnimatedGrid />
        <LightStreaks />
      </div>
      <Navbar />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
