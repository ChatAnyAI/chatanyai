"use client"

import {
    Star,
    Plus, RefreshCw, ExternalLink, MessageCircle, MessageSquare
} from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

import useSWR from "swr";
import {ApiHomeRecent, ApiHomeRecentChatItem, ApiHomeRecentRes, AvatarUser, UserProfile} from "@/service/api";
import {Link} from "react-router-dom";
import {AppLabelEnum, AppVisibility, AppVisibilityEnum, RouteEnum} from "@/lib/constants/constants";
import {useGlobalStore} from "@/store/globalStore";
import {Icon} from "@/components/nav-group";
import {UserAvatar} from "@/components/user-avatar";
import { isToday, isYesterday, subDays, isAfter } from 'date-fns';

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
        <div className="w-full flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const todayChats = homeList.chatList.filter(chat => isToday(new Date(chat.updatedAt * 1000)));
    const yesterdayChats = homeList.chatList.filter(chat => isYesterday(new Date(chat.updatedAt * 1000)));
    const previous7DaysChats = homeList.chatList.filter(chat => {
        const chatDate = new Date(chat.updatedAt * 1000);
        return isAfter(chatDate, subDays(new Date(), 7)) && !isToday(chatDate) && !isYesterday(chatDate);
    });


    return (
        <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
                {/* Welcome section */}
                <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                    <h1 className="text-xl sm:text-2xl font-bold mb-2">Hello, {user.name}</h1>
                    <p className="text-muted-foreground">Welcome back to your workspace</p>
                </motion.div>

                {/* Recent pages with visual categories */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.2}}
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
                                    initial={{opacity: 0, scale: 0.95}}
                                    animate={{opacity: 1, scale: 1}}
                                    transition={{duration: 0.3, delay: 0.1 * index}}
                                    whileHover={{scale: 1.02}}
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
                                                    <span
                                                        className="text-xs px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground">
                                                        {AppLabelEnum[application.type]}
                                                    </span>
                                                </div>
                                                <h3 className="font-medium truncate">{application.name}</h3>
                                                <div
                                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(application.updatedAt * 1000).toLocaleString()}
                                                    </span>
                                                    <div className="flex gap-2">
                                                         <span
                                                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                application.visibility === AppVisibility.Public
                                                                    ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                                                    : "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20"
                                                            }`}
                                                        >
                                                           {AppVisibilityEnum[application.visibility] || "Unknown"}
                                                        </span>
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

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.2}}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent chats</h2>
                    </div>
                    <div className="mx-auto">
                        {todayChats  && todayChats.length > 0 && <div className="mb-4">
                            <h2 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 px-3">TODAY</h2>
                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                                {todayChats.map((item, index, array) => (
                                        <div key={item.id}>
                                            <HistoryItem item={item}/>
                                            {index < array.length - 1 && (
                                                <div
                                                    className="border-b border-zinc-100 dark:border-zinc-800 mx-3"></div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>}

                        {yesterdayChats && yesterdayChats.length > 0 &&<div className="mb-4">
                            <h2 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 px-3">YESTERDAY</h2>
                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                                {yesterdayChats.map((item, index, array) => (
                                        <div key={item.id}>
                                            <HistoryItem item={item}/>
                                            {index < array.length - 1 && (
                                                <div
                                                    className="border-b border-zinc-100 dark:border-zinc-800 mx-3"></div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>}

                        {previous7DaysChats  && previous7DaysChats.length > 0 && <div>
                            <h2 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 px-3">PREVIOUS 7
                                DAYS</h2>
                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                                {previous7DaysChats.map((item, index, array) => (
                                        <div key={item.id}>
                                            <HistoryItem item={item}/>
                                            {index < array.length - 1 && (
                                                <div
                                                    className="border-b border-zinc-100 dark:border-zinc-800 mx-3"></div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>}
                    </div>
                </motion.div>

                {/* Recent activity timeline */}
                {/*<motion.div */}
                {/*    initial={{ opacity: 0, y: 20 }}*/}
                {/*    animate={{ opacity: 1, y: 0 }}*/}
                {/*    transition={{ duration: 0.5, delay: 0.4 }}*/}
                {/*    className="mb-8"*/}
                {/*>*/}
                {/*    <div className="flex items-center justify-between mb-4">*/}
                {/*        <h2 className="text-xl font-bold">Recent activity</h2>*/}
                {/*        <Button variant="ghost" size="sm" className="gap-1">*/}
                {/*            <RefreshCw className="h-3.5 w-3.5"/>*/}
                {/*            <span className="hidden sm:inline">Refresh</span>*/}
                {/*        </Button>*/}
                {/*    </div>*/}
                {/*    <div className="border rounded-lg p-4 sm:p-5 bg-background shadow-sm">*/}
                {/*        <div className="space-y-3 sm:space-y-4">*/}
                {/*            {[*/}
                {/*                {*/}
                {/*                    user: "You",*/}
                {/*                    action: "edited",*/}
                {/*                    document: "Project Roadmap",*/}
                {/*                    time: "2 hours ago",*/}
                {/*                    icon: <RefreshCw className="h-3.5 w-3.5 text-blue-500"/>,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    user: "Alex Kim",*/}
                {/*                    action: "commented on",*/}
                {/*                    document: "Team Feedback",*/}
                {/*                    time: "Yesterday at 4:32 PM",*/}
                {/*                    icon: <MessageCircle className="h-3.5 w-3.5 text-green-500"/>,*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    user: "You",*/}
                {/*                    action: "created",*/}
                {/*                    document: "Weekly Goals",*/}
                {/*                    time: "2 days ago",*/}
                {/*                    icon: <Plus className="h-3.5 w-3.5 text-amber-500"/>,*/}
                {/*                },*/}
                {/*            ].map((activity, index) => (*/}
                {/*                <motion.div*/}
                {/*                    key={index}*/}
                {/*                    initial={{ opacity: 0, x: -10 }}*/}
                {/*                    animate={{ opacity: 1, x: 0 }}*/}
                {/*                    transition={{ duration: 0.3, delay: 0.1 * index + 0.4 }}*/}
                {/*                    className="flex items-start gap-3 pb-3 sm:pb-4 border-b last:border-0 last:pb-0"*/}
                {/*                >*/}
                {/*                    <div className="mt-0.5 bg-muted p-1.5 rounded-full">{activity.icon}</div>*/}
                {/*                    <div className="flex-1 min-w-0">*/}
                {/*                        <p className="text-sm">*/}
                {/*                            <span className="font-medium">{activity.user}</span>*/}
                {/*                            <span className="text-muted-foreground"> {activity.action} </span>*/}
                {/*                            <span className="font-medium">{activity.document}</span>*/}
                {/*                        </p>*/}
                {/*                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>*/}
                {/*                    </div>*/}
                {/*                    <Button variant="ghost" size="sm" className="h-7 px-2">*/}
                {/*                        <ExternalLink className="h-3.5 w-3.5"/>*/}
                {/*                        <span className="sr-only">Open</span>*/}
                {/*                    </Button>*/}
                {/*                </motion.div>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</motion.div>*/}

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


function HistoryItem({item}: { item: ApiHomeRecentChatItem }) {
    return (
        <Link to={`/${RouteEnum[item.type!]}/${item.appId}/c/${item.id}`}>
            <div
                className="flex items-center justify-between py-2.5 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-md transition-colors">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Icon type={item.type!} icon={item.icon}/>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                            <div className="text-sm font-medium truncate mr-2">{item.title}</div>
                            <div
                                className="text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0">{new Date(item.updatedAt * 1000).toLocaleString()}</div>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-600 dark:text-zinc-300 truncate">From {item.appName}</span>
                            <span
                                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    item.visibility === AppVisibility.Public
                                        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                        : "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20"
                                }`}
                            >
                                           {AppVisibilityEnum[item.visibility] || "Unknown"}
                                        </span>
                        </div>

                    </div>
                </div>

                <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
                    <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3.5 w-3.5 text-zinc-500"/>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.msgCount}</span>
                    </div>

                    <div className="flex -space-x-2">
                        {item.collaborators.slice(0, 3).map((collaborator) => (
                            <UserAvatar user={collaborator as AvatarUser}/>
                        ))}
                        {item.collaborators.length > 3 && (
                            <div
                                className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs">
                                +{item.collaborators.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

