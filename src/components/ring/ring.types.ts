export type RingInteractionState = {
  hovered: boolean;
  pressed: boolean;
  pointer: {
    x: number;
    y: number;
  };
  drag: {
    x: number;
    y: number;
  };
};
