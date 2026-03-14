"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { aboutCapabilities, aboutStats } from "@/config/sections";
import { SimulationStackCard } from "@/components/about/SimulationStackCard";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/container";

export function AboutSection() {
  return (
    <section id="about" className="relative py-[var(--space-section)]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.96fr_1.04fr]">
          <motion.div
            className="relative flex flex-col items-center lg:min-h-[500px]"
            initial={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="mt-28 flex w-full justify-center">
              <SimulationStackCard />
            </div>
            <div className="mt-2 max-w-[22rem] space-y-3 text-center lg:absolute lg:left-30 lg:top-[6.1rem] lg:mt-0 lg:text-left">
              <p className="font-display text-sm uppercase tracking-[0.16em] text-primary">
                World Simulation Core
              </p>
              <p className="text-sm leading-6 text-white/80">
                Persistent state. Adaptive AI. Live economies.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <SectionHeading
              description="A persistent VR world where society, trade, conflict, and discovery evolve in real time."
              eyebrow="The Vision"
              title="A New Kind of Reality"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {aboutCapabilities.map((item, index) => (
                <div
                  key={item}
                  className="neon-card section-frame rounded-[22px] px-4 py-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="card-index">0{index + 1}</span>
                    <CheckCircle2 className="size-4 text-primary" />
                  </div>
                  <p className="font-display text-sm uppercase tracking-[0.16em] text-white">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {aboutStats.map((stat, index) => (
                <motion.article
                  key={stat.label}
                  className="neon-card section-frame rounded-[26px] px-5 py-5"
                  initial={{ opacity: 0, y: 24 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="card-index">Metric 0{index + 1}</span>
                    <div className="h-px w-14 bg-gradient-to-r from-[rgba(78,207,255,0.8)] to-transparent" />
                  </div>
                  <p className="font-display text-4xl uppercase tracking-[0.18em] text-primary">
                    <AnimatedCounter suffix={stat.suffix} value={stat.value} />
                  </p>
                  <p className="mt-4 font-display text-sm uppercase tracking-[0.16em] text-white">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{stat.description}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
