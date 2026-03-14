"use client";

import { cn } from "@/lib/utils";
import { TextType } from "@/components/ui/TextType";
import { Eyebrow, SectionLead } from "@/components/ui/typography";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <TextType
        as="h2"
        className="font-display text-3xl uppercase tracking-[0.14em] text-white sm:text-4xl lg:text-[3.2rem]"
        cursorBlinkDuration={0.65}
        cursorCharacter="_"
        cursorClassName="text-primary/80"
        initialDelay={80}
        loop={false}
        retriggerOnVisible
        startOnVisible
        text={title}
        typingSpeed={96}
      />
      <SectionLead>{description}</SectionLead>
      <div className={cn("glow-divider max-w-40", align === "center" && "mx-auto")} />
    </div>
  );
}
