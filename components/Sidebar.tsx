"use client";

import { CodeIcon, ImageIcon, LayoutDashboard, MessageSquare, Music, Music2Icon, Settings, VideoIcon } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
const montserrat = Montserrat({ weight: "600", subsets: ["latin"] })


// array that holds the sidebar items or routes
const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500"
    },
    {
        label: "Conversations",
        icon: MessageSquare,
        href: "/conersation",
        color: "text-violet-500"
    },
    {
        label: "Image Generation",
        icon: ImageIcon,
        href: "/image",
        color: "text-pink-700"
    },
    {
        label: "Video Generation",
        icon: VideoIcon,
        href: "/video",
        color: "text-orange-700"
    },
    {
        label: "Music Generation",
        icon: Music,
        href: "/music",
        color: "text-emerald-500"
    },
    {
        label: "Code Generation",
        icon: CodeIcon,
        href: "/code",
        color: "text-green-700"
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        
    },
    
];

const Sidebar = () => {
    
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white" >
            <div className="px-3 py-2 flex-1">
                {/* heading of AI and logo inside link */}
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Image fill alt="Logo" src="/logo.jpg" />
                    </div>
                    <h1 className="text-2xl font-bold ">
                        Vikash A.I
                    </h1>

                </Link>
                {/* all routes */}
                <div className="space-y-1">
                    {
                        routes.map((route)=>(
                            <Link 
                                href={route.href}
                                key={route.href}
                                className="text-sm flex items-center transition-all duration-200 ease-in-out hover:bg-gray-800 hover:text-sky-400 rounded-md px-2 py-2"

                            >
                                <div className="flex items-center">
                                    <route.icon className={`h-5 w-5 mr-3 ${route.color}`}/>
                                    {route.label}
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default Sidebar;