import { ThemeToggle } from "@/components/ui/theme-toggle"

function DefaultToggle() {
    return (
        <div className="space-y-4 text-center p-10">
            <h2 className="text-xl font-bold font-sans">Theme Toggle UI</h2>
            <div className="flex justify-center">
                <ThemeToggle />
            </div>
        </div>
    )
}

const DemoOne = () => {
    return (
        <div className="w-full h-[300px] relative bg-background overflow-hidden flex items-center justify-center rounded-[40px] border border-border/50">
            <div className="z-10 text-center space-y-6 glass-card p-10 rounded-[40px]">
                <h1 className="text-3xl font-black text-foreground">Theme Toggle Demo</h1>
                <div className="flex justify-center">
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
};

import { useState } from "react"
import { ToastSave } from "@/components/ui/toast-save"

function ToastSaveDemo() {
    const [state, setState] = useState<"initial" | "loading" | "success">("initial")

    const handleSave = () => {
        setState("loading")
        setTimeout(() => {
            setState("success")
            setTimeout(() => {
                setState("initial")
            }, 2000)
        }, 2000)
    }

    const handleReset = () => {
        setState("initial")
    }

    return (
        <div className="flex flex-col items-center justify-center p-10 space-y-4 border border-border/50 rounded-[40px] bg-accent/5">
            <h2 className="text-xl font-bold font-sans capitalize">Interactive Save Toast</h2>
            <ToastSave
                state={state}
                onSave={handleSave}
                onReset={handleReset}
            />
        </div>
    )
}

export { DefaultToggle, DemoOne, ToastSaveDemo }
