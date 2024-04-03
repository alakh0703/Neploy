import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";



export function TypewriterEffectSmoothDemo() {
    const words = [
        {
            text: "Customize",
            className: "text-white"
        },
        {
            text: "your",
            className: "text-white"

        },
        {
            text: "profile",
            className: "text-white"

        },
        {
            text: "here",
            className: "text-white"

        },
        {
            text: `.`,
            className: "text-blue-500 dark:text-blue-500",
        },
    ];
    return (
        <div className="hidden md:flex flex-col justify-center h-[10rem] ">

            <TypewriterEffectSmooth words={words} />

        </div>
    );
}
