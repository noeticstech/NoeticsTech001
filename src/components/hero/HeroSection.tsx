"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/config/site";
import { heroSignals } from "@/config/sections";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TextType } from "@/components/ui/TextType";
import { Eyebrow } from "@/components/ui/typography";
import { HeroPlanet } from "./HeroPlanet";

const heroChips = ["AI factions", "Player economy", "Persistent world"] as const;

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const backdropY = useTransform(scrollYProgress, [0, 0.18], [0, 70]);
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.18], [0.65, 0.28]);

  return (
    <section id="hero" className="relative overflow-hidden pb-20 pt-32 md:pb-24 lg:pt-36">
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ y: backdropY, opacity: backdropOpacity }}>
        <Image
          fill
          alt=""
          className="object-cover object-center mix-blend-screen"
          priority
          sizes="100vw"
          src={siteConfig.images.hero}
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
      </motion.div>
      <Container className="relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[680px] space-y-8"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/24 px-4 py-2 backdrop-blur-md">
              <span className="size-2 rounded-full bg-primary shadow-neon" />
              <Eyebrow className="text-primary">{siteConfig.hero.eyebrow}</Eyebrow>
            </div>
            <div className="space-y-5">
              <TextType
                as="h1"
                className="font-display text-4xl leading-[0.94] tracking-[0.08em] text-glow sm:text-5xl lg:text-7xl"
                cursorBlinkDuration={0.65}
                cursorClassName="text-primary/80"
                cursorCharacter="_"
                deletingSpeed={22}
                initialDelay={180}
                loop
                pauseDuration={1200}
                text={siteConfig.hero.title}
                typingSpeed={110}
              />
              <p className="max-w-xl text-base leading-7 text-muted md:text-lg md:leading-8">
                {siteConfig.hero.subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href={siteConfig.hero.primaryCta.href}>
                  {siteConfig.hero.primaryCta.label}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={siteConfig.hero.secondaryCta.href}>
                  {siteConfig.hero.secondaryCta.label}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              {heroChips.map((chip) => (
                <span
                  key={chip}
                  className="metric-chip rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-white/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroPlanet />
          </motion.div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {heroSignals.map((signal, index) => (
            <motion.article
              key={signal.title}
              className="neon-card section-frame rounded-[28px] px-5 py-5"
              initial={{ opacity: 0, y: 24 }}
              transition={{
                duration: 0.55,
                delay: 0.14 + index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, amount: 0.4 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="card-index">0{index + 1}</span>
                <span className="font-display text-base uppercase tracking-[0.24em] text-primary">
                  {signal.value}
                </span>
              </div>
              <div className="space-y-3">
                <p className="font-display text-sm uppercase tracking-[0.16em] text-white">
                  {signal.title}
                </p>
                <p className="max-w-[18rem] text-sm leading-6 text-muted">{signal.detail}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
