"use client"

import {
    Star,
    Plus, RefreshCw, ExternalLink, MessageCircle
} from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import useSWR from "swr";
import {ApiHomeRecent, ApiHomeRecentRes} from "@/service/api";
import {Link} from "react-router-dom";
import {AppLabelEnum, RouteEnum} from "@/lib/constants/constants";
// import Image1 from "@/assets/home/1.webp";
// import Image2 from "@/assets/home/2.webp";
// import Image3 from "@/assets/home/3.webp";
// import Image4 from "@/assets/home/4.webp";
import {useGlobalStore} from "@/store/globalStore";
import {Icon} from "@/components/nav-group";

export default function DashboardPage() {
    const user = useGlobalStore(state => state.user);

    // const tutorials = [
    //     {
    //         title: "Why We Created ChatAnyAI",
    //         duration: "5m read",
    //         verified: true,
    //         image: Image1,
    //     },
    //     {
    //         title: "Amazing Brainstorming",
    //         duration: "9m read",
    //         verified: true,
    //         image: Image2,
    //     },
    //     {
    //         title: "You Need Knowledge Base",
    //         duration: "8m read",
    //         verified: true,
    //         image: Image3,
    //     },
    //     {
    //         title: "How teams can collaborate with AI",
    //         duration: "5m read",
    //         verified: true,
    //         image: Image4,
    //     },
    // ]

    const { data: homeList, error } = useSWR<ApiHomeRecentRes>('ApiHomeRecent', ApiHomeRecent);
    if (error) return <div>Failed to load homeList</div>;
    if (!homeList) return (
        <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
                {/* Welcome section */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                    <h1 className="text-xl sm:text-2xl font-bold mb-2">Hello, {user.name}</h1>
                    <p className="text-muted-foreground">Welcome back to your workspace</p>
                </motion.div>

                {/* Recent pages with visual categories */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent applications</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {homeList.appList.map((application, index) => {
                            let color = "";
                            switch (index % 6) {
                                case 0:
                                    color = "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30"
                                    break;
                                case 1:
                                    color = "bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950/30"
                                    break;
                                case 2:
                                    color = "bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30"
                                    break;
                                case 3:
                                    color = "bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30"
                                    break;
                                case 4:
                                    color = "bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/30"
                                    break;
                                case 5:
                                    color = "bg-pink-50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-950/30"
                                    break;
                            }

                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                    whileHover={{ scale: 1.02 }}
                                    key={index}
                                >
                                    <Link to={`/${RouteEnum[application.type!]}/${application.id}`}
                                        className={`block border rounded-lg p-4 shadow-sm transition-all duration-300 ${color}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="w-full">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">
                                                        <Icon type={application.type!} icon={application.icon}/>
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground">
                                                        {AppLabelEnum[application.type]}
                                                    </span>
                                                </div>
                                                <h3 className="font-medium truncate">{application.name}</h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(application.updatedAt * 1000).toLocaleString()}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <span className="text-xs bg-background/80 px-2 py-0.5 rounded-full whitespace-nowrap">last chat</span>
                                                        <span className="text-xs bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full whitespace-nowrap">new chat</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Recent activity timeline */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent activity</h2>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <RefreshCw className="h-3.5 w-3.5"/>
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>
                    </div>
                    <div className="border rounded-lg p-4 sm:p-5 bg-background shadow-sm">
                        <div className="space-y-3 sm:space-y-4">
                            {[
                                {
                                    user: "You",
                                    action: "edited",
                                    document: "Project Roadmap",
                                    time: "2 hours ago",
                                    icon: <RefreshCw className="h-3.5 w-3.5 text-blue-500"/>,
                                },
                                {
                                    user: "Alex Kim",
                                    action: "commented on",
                                    document: "Team Feedback",
                                    time: "Yesterday at 4:32 PM",
                                    icon: <MessageCircle className="h-3.5 w-3.5 text-green-500"/>,
                                },
                                {
                                    user: "You",
                                    action: "created",
                                    document: "Weekly Goals",
                                    time: "2 days ago",
                                    icon: <Plus className="h-3.5 w-3.5 text-amber-500"/>,
                                },
                            ].map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index + 0.4 }}
                                    className="flex items-start gap-3 pb-3 sm:pb-4 border-b last:border-0 last:pb-0"
                                >
                                    <div className="mt-0.5 bg-muted p-1.5 rounded-full">{activity.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                            <span className="font-medium">{activity.user}</span>
                                            <span className="text-muted-foreground"> {activity.action} </span>
                                            <span className="font-medium">{activity.document}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 px-2">
                                        <ExternalLink className="h-3.5 w-3.5"/>
                                        <span className="sr-only">Open</span>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Tutorials */}
                {/*<motion.div */}
                {/*    initial={{ opacity: 0, y: 20 }}*/}
                {/*    animate={{ opacity: 1, y: 0 }}*/}
                {/*    transition={{ duration: 0.5, delay: 0.6 }}*/}
                {/*    className="mb-8"*/}
                {/*>*/}
                {/*    <div className="flex items-center justify-between mb-4">*/}
                {/*        <h2 className="text-xl font-bold">Beginner Tutorial</h2>*/}
                {/*        <Link to="https://chatanyai.com/docs" target="_blank">*/}
                {/*            <Button variant="ghost" size="sm">*/}
                {/*                View more docs*/}
                {/*            </Button>*/}
                {/*        </Link>*/}
                {/*    </div>*/}
                {/*    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">*/}
                {/*        {tutorials.map((tutorial, i) => (*/}
                {/*            <motion.div*/}
                {/*                key={i}*/}
                {/*                initial={{ opacity: 0, scale: 0.95 }}*/}
                {/*                animate={{ opacity: 1, scale: 1 }}*/}
                {/*                transition={{ duration: 0.3, delay: 0.1 * i + 0.6 }}*/}
                {/*                whileHover={{ y: -5, transition: { duration: 0.2 } }}*/}
                {/*            >*/}
                {/*                <Card className="p-3 sm:p-4 space-y-3 sm:space-y-4 h-full shadow-sm hover:shadow-md transition-all duration-300">*/}
                {/*                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">*/}
                {/*                        <img src={tutorial.image} alt={tutorial.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />*/}
                {/*                    </div>*/}
                {/*                    <div>*/}
                {/*                        <div className="flex items-center gap-2">*/}
                {/*                            <div className="font-medium line-clamp-2">{tutorial.title}</div>*/}
                {/*                            {tutorial.verified && */}
                {/*                                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>*/}
                {/*                                    <Star className="w-4 h-4 text-primary fill-primary" />*/}
                {/*                                </motion.div>*/}
                {/*                            }*/}
                {/*                        </div>*/}
                {/*                        <div className="text-sm text-muted-foreground mt-1">{tutorial.duration}</div>*/}
                {/*                    </div>*/}
                {/*                </Card>*/}
                {/*            </motion.div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</motion.div>*/}
            </div>
        </div>
    )
}

