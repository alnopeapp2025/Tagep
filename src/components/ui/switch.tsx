import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef&lt;
  React.ElementRef&lt;typeof SwitchPrimitives.Root&gt;,
  React.ComponentPropsWithoutRef&lt;typeof SwitchPrimitives.Root&gt;
&gt;(({ className, ...props }, ref) =&gt; (
  &lt;SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  &gt;
    &lt;SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    /&gt;
  &lt;/SwitchPrimitives.Root&gt;
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
