"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import styles from "./TextType.module.css";

type TextTypeProps = HTMLAttributes<HTMLElement> & {
  text: string | string[];
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: {
    min: number;
    max: number;
  };
  onSentenceComplete?: (text: string, index: number) => void;
  startOnVisible?: boolean;
  retriggerOnVisible?: boolean;
  reverseMode?: boolean;
};

export function TextType({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName,
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  retriggerOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const wasIntersectingRef = useRef(false);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const currentText = textArray[currentTextIndex] ?? "";
  const processedText = useMemo(() => {
    return reverseMode ? currentText.split("").reverse().join("") : currentText;
  }, [currentText, reverseMode]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) {
      return typingSpeed;
    }

    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [typingSpeed, variableSpeed]);

  const getCurrentTextColor = useCallback(() => {
    if (textColors.length === 0) {
      return "inherit";
    }

    return textColors[currentTextIndex % textColors.length];
  }, [currentTextIndex, textColors]);

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (retriggerOnVisible && !wasIntersectingRef.current) {
              setDisplayedText("");
              setCurrentCharIndex(0);
              setIsDeleting(false);
              setCurrentTextIndex(0);
            }

            wasIntersectingRef.current = true;
            setIsVisible(true);
          } else if (retriggerOnVisible) {
            wasIntersectingRef.current = false;
            setIsVisible(false);
            setDisplayedText("");
            setCurrentCharIndex(0);
            setIsDeleting(false);
            setCurrentTextIndex(0);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [retriggerOnVisible, startOnVisible]);

  useEffect(() => {
    if (!showCursor || !cursorRef.current) {
      return;
    }

    const cursorNode = cursorRef.current;

    gsap.killTweensOf(cursorNode);
    gsap.set(cursorNode, { opacity: 1 });
    gsap.to(cursorNode, {
      opacity: 0,
      duration: cursorBlinkDuration,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      gsap.killTweensOf(cursorNode);
    };
  }, [cursorBlinkDuration, showCursor]);

  useEffect(() => {
    if (!isVisible || processedText.length === 0) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (!isDeleting) {
      if (currentCharIndex < processedText.length) {
        const delay =
          currentCharIndex === 0 && displayedText === "" ? initialDelay : variableSpeed ? getRandomSpeed() : typingSpeed;

        timeoutId = setTimeout(() => {
          setDisplayedText(processedText.slice(0, currentCharIndex + 1));
          setCurrentCharIndex((value) => value + 1);
        }, delay);
      } else {
        onSentenceComplete?.(currentText, currentTextIndex);

        if (!loop && currentTextIndex === textArray.length - 1) {
          return;
        }

        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else if (displayedText.length > 0) {
      timeoutId = setTimeout(() => {
        setDisplayedText((value) => value.slice(0, -1));
      }, deletingSpeed);
    } else {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setCurrentCharIndex(0);
        setCurrentTextIndex((value) => (value + 1) % textArray.length);
      }, pauseDuration);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    currentCharIndex,
    currentText,
    currentTextIndex,
    deletingSpeed,
    displayedText,
    getRandomSpeed,
    initialDelay,
    isDeleting,
    isVisible,
    loop,
    onSentenceComplete,
    pauseDuration,
    processedText,
    textArray.length,
    typingSpeed,
    variableSpeed,
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < processedText.length || isDeleting);

  return (
    <Component
      ref={containerRef as never}
      className={cn(styles.root, className)}
      {...props}
    >
      <span
        className={styles.content}
        style={{ color: getCurrentTextColor() }}
      >
        {displayedText}
      </span>
      {showCursor ? (
        <span
          ref={cursorRef}
          className={cn(
            styles.cursor,
            shouldHideCursor && styles.cursorHidden,
            cursorClassName,
          )}
        >
          {cursorCharacter}
        </span>
      ) : null}
    </Component>
  );
}
