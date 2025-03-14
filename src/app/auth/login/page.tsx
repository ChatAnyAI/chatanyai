"use client"

import React, { useState, useEffect } from "react"

import { motion,AnimatePresence } from "framer-motion"
import { ArrowRight, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {api} from "@/lib/api";
import { useNavigate as useRouter } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/store/globalStore";
import Navbar from "./navbar";
import { AlertCircle } from "lucide-react"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [loginMethod] = useState("email")
    const [error, setError] = useState<string>("")
    const router = useRouter();
    const { toast } = useToast()
    const user = useGlobalStore(({ user }) => user);
    const setUser = useGlobalStore(({ setUser }) => setUser);


    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    useEffect(() => {
        if (user?.id) {
            console.log("is login", user)
            router("/");
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (loginMethod === "oauth") {
            router("/api/oauth/login")
        } else {
            // Handle LDAP or email/password login
            const payload = { username: "", password: password, email: email, login_type: loginMethod }

            try {
                const loginResponse = await api.auth.login({ ...payload })
                if (loginResponse?.code === 0) {
                    const profileResponse = await api.user.getProfile()
                    const data = {
                        ...profileResponse.data,
                        accessToken: loginResponse.data.token,
                    }
                    setUser(data)
                    setIsLoading(false)
                    toast({
                        title: "Login successful",
                        description: "Welcome back!",
                    })
                    router("/")
                } else {
                    setIsLoading(false)
                    setError(loginResponse.msg)
                    return
                }
            } catch (error) {
                console.error("Login error:", error)
            }
        }
    }


    return (
        <>
        <Navbar />
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="flex-1 flex items-center justify-center px-4 py-24">
                <div className="w-full max-w-md">
                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-100 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-1/3 w-64 h-64 bg-pink-100 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Floating Error Modal */}
                    <AnimatePresence>
                        {error && (
                            <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md mx-4 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center text-red-500 dark:text-red-400 mb-4">
                                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                                            <AlertCircle className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold">Login Error</h3>
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => setError("")}
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                        >
                                            OK
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
                    >
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to your account</p>
                        </motion.div>

                        <form onSubmit={handleSubmit}>
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Password
                                        </label>
                                        {/*<div className="text-sm">*/}
                                        {/*    <a href="/forgot-password" className="text-blue-600 hover:text-blue-500">*/}
                                        {/*        Forgot password?*/}
                                        {/*    </a>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:from-blue-500 hover:to-purple-500 border-none transition-all duration-300"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span className="ml-2">Signing in...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span>Sign in</span>
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        </form>

                    </motion.div>

                    {/* Decorative elements */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                </div>
            </div>
        </div>
        </>
    )
}