"use client";

import Image from "next/image";
import { BrainCircuit, Coins, Cpu, Network } from "lucide-react";
import { motion } from "framer-motion";
import { services } from "@/config/sections";
import { siteConfig } from "@/config/site";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { FeatureGrid } from "@/components/ui/grid";
import { MagicRings } from "@/components/effects/MagicRings";
import { SectionHeading } from "@/components/shared/SectionHeading";

const serviceIcons = {
  cpu: Cpu,
  network: Network,
  brain: BrainCircuit,
  coins: Coins,
} as const;

export function ServicesSection() {
  return (
    <section id="technology" className="relative py-[var(--space-section)]">
      <div aria-hidden="true" className="absolute inset-0 opacity-55">
        <Image
          fill
          alt=""
          className="object-cover object-center"
          sizes="100vw"
          src={siteConfig.images.services}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,23,0.8)_0%,rgba(3,8,23,0.64)_36%,rgba(3,8,23,0.95)_100%)]" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 z-[1] overflow-hidden opacity-60">
        <MagicRings
          attenuation={8.5}
          baseRadius={0.18}
          blur={6}
          color="#8d4dff"
          colorTwo="#42fcff"
          fadeIn={0.6}
          fadeOut={0.42}
          lineThickness={1.7}
          noiseAmount={0.03}
          opacity={0.9}
          parallax={0.04}
          radiusStep={0.07}
          ringCount={6}
          ringGap={1.38}
          rotation={14}
          scaleRate={0.075}
          speed={0.72}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(3,8,23,0.08)_0%,rgba(3,8,23,0.28)_56%,rgba(3,8,23,0.58)_100%)]" />
      </div>
      <Container className="relative z-10">
        <SectionHeading
          align="center"
          description="Engine, network, AI, and economy systems built as one modular universe stack."
          eyebrow="Services"
          title="Game Technology"
        />
        <FeatureGrid className="mt-12">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon];

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -12 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="neon-card group h-full rounded-[32px]">
                  <div className="card-grid absolute inset-0 opacity-30" />
                  <CardHeader className="relative gap-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="card-index">0{index + 1}</span>
                      <span className="metric-chip rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white/70">
                        {service.tag}
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="icon-shell flex size-14 items-center justify-center rounded-[22px] text-primary">
                        <motion.div
                          animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.04, 1] }}
                          transition={{
                            duration: 6 + index,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <Icon className="size-6" />
                        </motion.div>
                      </div>
                      <div className="space-y-4">
                        <CardTitle className="max-w-[14ch] leading-snug">
                          {service.title}
                        </CardTitle>
                        <div className="h-px w-16 bg-gradient-to-r from-[rgba(78,207,255,0.8)] to-transparent" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative pt-0">
                    <CardDescription className="max-w-xs">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </FeatureGrid>
      </Container>
    </section>
  );
}
