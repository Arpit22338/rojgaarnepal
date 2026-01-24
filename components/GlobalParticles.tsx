"use client"

import { useEffect, useState } from "react"
import { Particles } from "@/components/ui/particles"

export default function GlobalParticles() {
    const [color, setColor] = useState("#ffffff")

    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.classList.contains("dark")
            setColor(isDark ? "#ffffff" : "#000000")
        }

        checkTheme()

        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        })

        return () => observer.disconnect()
    }, [])

    return (
        <Particles
            className="fixed inset-0 -z-5 pointer-events-none"
            quantity={100}
            ease={80}
            color={color}
            refresh
        />
    )
}
