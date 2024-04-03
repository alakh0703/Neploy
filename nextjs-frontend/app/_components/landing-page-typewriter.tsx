"use client";
import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"
export function TypewriterEffectSmoothDemo() {
    const words = [
        {
            text: "Deploy",
            className: "text-white",
        },
        {
            text: "awesome",
            className: "text-white",

        },
        {
            text: "React",

            className: "text-[#427da0]",

        },
        {
            text: "apps",
            className: "text-white",

        },
        {
            text: "with",
            className: "text-white",

        },
        {
            text: "Neploy.",
            className: "text-[#f1841d] dark:text-blue-500",
        },
    ];
    return (
        <div className="hidden md:flex flex-col items-center justify-center h-[40rem]">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
                See your website go live in seconds
            </p>
            <TypewriterEffectSmooth words={words} />
        </div>
    );
}
