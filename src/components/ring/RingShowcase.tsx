"use client";

import dynamic from "next/dynamic";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { ringConfig } from "@/config/ring";
import { clamp, cn } from "@/lib/utils";
import type { RingInteractionState } from "./ring.types";

const RingCanvas = dynamic(
  () => import("./RingCanvas").then((module) => module.RingCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_58%)]" />
    ),
  },
);

type RingShowcaseProps = {
  className?: string;
  frameClassName?: string;
  ringScale?: number;
};

export function RingShowcase({
  className,
  frameClassName,
  ringScale = 1,
}: RingShowcaseProps) {
  const interactionRef = useRef<RingInteractionState>({
    hovered: false,
    pressed: false,
    pointer: { x: 0, y: 0 },
    drag: { x: 0, y: 0 },
  });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      startTransition(() => {
        setReducedMotion(mediaQuery.matches);
      });
    };

    updateMotion();
    mediaQuery.addEventListener("change", updateMotion);

    return () => {
      mediaQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    const updateGlobalPointer = (event: PointerEvent | globalThis.PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = 1 - (event.clientY / window.innerHeight) * 2;

      interactionRef.current.hovered = true;
      interactionRef.current.pointer.x = clamp(x, -1, 1);
      interactionRef.current.pointer.y = clamp(y, -1, 1);
    };

    const resetGlobalHover = () => {
      interactionRef.current.hovered = false;
      interactionRef.current.pressed = false;
      interactionRef.current.pointer.x = 0;
      interactionRef.current.pointer.y = 0;
    };

    window.addEventListener("pointermove", updateGlobalPointer);
    window.addEventListener("blur", resetGlobalHover);

    return () => {
      window.removeEventListener("pointermove", updateGlobalPointer);
      window.removeEventListener("blur", resetGlobalHover);
    };
  }, []);

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = 1 - (event.clientY / window.innerHeight) * 2;

    interactionRef.current.hovered = true;
    interactionRef.current.pointer.x = clamp(x, -1, 1);
    interactionRef.current.pointer.y = clamp(y, -1, 1);

    if (interactionRef.current.pressed) {
      interactionRef.current.drag.x = clamp(
        interactionRef.current.drag.x +
          event.movementX * ringConfig.interaction.dragSensitivityX,
        -ringConfig.interaction.dragClampX,
        ringConfig.interaction.dragClampX,
      );
      interactionRef.current.drag.y = clamp(
        interactionRef.current.drag.y -
          event.movementY * ringConfig.interaction.dragSensitivityY,
        -ringConfig.interaction.dragClampY,
        ringConfig.interaction.dragClampY,
      );
    }
  };

  return (
    <div className={cn("relative mx-auto w-full max-w-[680px]", className)}>
      <div
        className={cn(
          "relative aspect-square w-full cursor-grab overflow-visible bg-transparent active:cursor-grabbing",
          frameClassName,
        )}
        onLostPointerCapture={() => {
          interactionRef.current.pressed = false;
        }}
        onPointerCancel={() => {
          interactionRef.current.pressed = false;
        }}
        onPointerDown={(event) => {
          interactionRef.current.hovered = true;
          interactionRef.current.pressed = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerEnter={() => {
          interactionRef.current.hovered = true;
        }}
        onPointerLeave={() => {
          interactionRef.current.pressed = false;
        }}
        onPointerMove={updatePointer}
        onPointerUp={(event) => {
          interactionRef.current.pressed = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        style={{ touchAction: "none" }}
      >
        <RingCanvas
          interactionRef={interactionRef}
          reducedMotion={reducedMotion}
          ringScale={ringScale}
        />
      </div>
    </div>
  );
}
