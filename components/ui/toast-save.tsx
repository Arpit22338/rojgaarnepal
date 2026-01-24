"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface ToastSaveProps extends HTMLMotionProps<"div"> {
    state: "initial" | "loading" | "success"
    onReset?: () => void
    onSave?: () => void
    loadingText?: string
    successText?: string
    initialText?: string
    resetText?: string
    saveText?: string
}

const InfoIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        className="text-current"
    >
        <g
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            stroke="currentColor"
        >
            <circle cx="9" cy="9" r="7.25"></circle>
            <line x1="9" y1="12.819" x2="9" y2="8.25"></line>
            <path
                d="M9,6.75c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
                fill="currentColor"
                data-stroke="none"
                stroke="none"
            ></path>
        </g>
    </svg>
)

const springConfig = {
    type: "spring" as const,
    stiffness: 500,
    damping: 30,
    mass: 1,
}

export function ToastSave({
    state = "initial",
    onReset,
    onSave,
    loadingText = "Saving",
    successText = "Changes Saved",
    initialText = "Unsaved changes",
    resetText = "Reset",
    saveText = "Save",
    className,
    ...props
}: ToastSaveProps) {
    return (
        <motion.div
            className={cn(
                "inline-flex h-10 items-center justify-center overflow-hidden rounded-full",
                "bg-card/95 backdrop-blur-md",
                "border border-border/50",
                "shadow-toast",
                className,
            )}
            initial={false}
            animate={{ width: "auto" }}
            transition={springConfig}
            {...props}
        >
            <div className="flex h-full items-center justify-between px-3">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={state}
                        className="flex items-center gap-2 text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0 }}
                    >
                        {state === "loading" && (
                            <>
                                <Spinner size="xs" color="slate" />
                                <div className="text-[13px] font-bold leading-tight whitespace-nowrap">
                                    {loadingText}
                                </div>
                            </>
                        )}
                        {state === "success" && (
                            <>
                                <div className="p-0.5 bg-primary/10 dark:bg-primary/25 rounded-[99px] shadow-sm border border-primary/20 dark:border-primary/25 justify-center items-center gap-1.5 flex overflow-hidden">
                                    <Check className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="text-[13px] font-bold leading-tight whitespace-nowrap">
                                    {successText}
                                </div>
                            </>
                        )}
                        {state === "initial" && (
                            <>
                                <div className="text-primary/80">
                                    <InfoIcon />
                                </div>
                                <div className="text-[13px] font-bold leading-tight whitespace-nowrap">
                                    {initialText}
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                    {state === "initial" && (
                        <motion.div
                            className="ml-2 flex items-center gap-2"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ ...springConfig, opacity: { duration: 0 } }}
                        >
                            <Button
                                onClick={onReset}
                                variant="ghost"
                                className="h-7 px-3 py-0 rounded-[99px] text-[13px] font-bold hover:bg-muted/80 transition-colors"
                            >
                                {resetText}
                            </Button>
                            <Button
                                onClick={onSave}
                                className={cn(
                                    "h-7 px-4 py-0 rounded-[99px] text-[13px] font-black uppercase tracking-wider",
                                    "text-white",
                                    "bg-primary hover:bg-primary/90",
                                    "shadow-md active:scale-95",
                                    "transition-all duration-200",
                                )}
                            >
                                {saveText}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
