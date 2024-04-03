"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"
import Image from "next/image";

const content = [
    {
        title: "Deploy with just one click",
        description:
            "Deploy your project with just one click. Our platform makes it easy to deploy your project to the cloud, so you can focus on what you do best. Say goodbye to the hassle of manual deployment and hello to the simplicity of automated deployment. Get your project up and running in no time with our easy-to-use platform.",
        content: (
            <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
                Deploy
            </div>
        ),
    },
    {
        title: "Live Logs while deploying",
        description:
            "Get real-time updates on your deployment with our live logs feature. Our platform provides you with detailed logs of your deployment process, so you can monitor its progress every step of the way. Stay informed, stay in control, and stay ahead of the game with our live logs feature",
        content: (
            <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
                Live Logs
            </div>
        ),
    },
    {
        title: "Watch Analytics",
        description:
            "Track the performance of your project with our analytics feature. Our platform provides you with detailed insights into how your project is performing, so you can make informed decisions about its future. Stay on top of your project's progress, identify areas for improvement, and optimize its performance with our analytics feature",
        content: (
            <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
                Watch Analytics
            </div>
        ),
    },
    {
        title: "Manage your profile",
        description:
            "Manage your profile with ease on our platform. Our platform provides you with all the tools you need to update your profile, change your settings, and customize your experience. Stay in control of your account, keep your information up to date, and personalize your profile to suit your needs with our easy-to-use platform",
        content: (
            <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
                Manage Profile
            </div>
        ),
    },
];
export function StickyScrollRevealDemo() {
    return (
        <div className="p-10 h-[100vh]">
            <StickyScroll content={content} />
        </div>
    );
}
