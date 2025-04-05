"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

export default function Navbar() {
    const { t } = useTranslation()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-xs" : "bg-transparent",
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="flex items-center">
                            <span className="text-primary text-2xl font-bold">{t('login-navbar.ChatAnyAI')}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}

        </header>
    )
}

