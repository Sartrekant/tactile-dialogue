import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-px w-full grow overflow-hidden bg-foreground/20">
      <SliderPrimitive.Range className="absolute h-full bg-foreground/50" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border border-foreground/30 bg-background ring-offset-background transition-colors duration-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-50 hover:border-foreground/60" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
