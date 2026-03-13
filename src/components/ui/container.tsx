import {
  createElement,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
};

export function Container({
  as: Component = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  const resolvedClassName = cn(
    "mx-auto w-full max-w-[1320px] px-5 md:px-8 lg:px-12",
    className,
  );

  return createElement(
    Component,
    {
      className: resolvedClassName,
      ...props,
    },
    children,
  );
}
