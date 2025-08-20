import React from "react"
import { useInView } from "../hooks/useInView"
import { cn } from "../lib/utils"

export function AnimatedDiv({ children, className, delay = 0, ...props }) {
    const { ref, isInView } = useInView()

    return (
        <div
            ref={ref}
            className={cn("animate-on-scroll", isInView && "is-in-view", className)}
            style={{ transitionDelay: `${delay}ms` }}
            {...props}
        >
            {children}
        </div>
    )
}