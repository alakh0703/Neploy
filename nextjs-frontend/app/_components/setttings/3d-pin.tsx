"use client";
import { PinContainer } from "@/components/ui/3d-pin";
import { GithubIcon, Link, LinkedinIcon } from "lucide-react";

export function AnimatedPinDemo() {
    return (
        <div className="flex items-center mb-20">
            < PinContainer
                title="www.alakhpatel.com"
                href="www.alakhpatel.com"
            >
                <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                    <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                        Alakh Patel
                    </h3>
                    <div className="text-base !m-0 !p-0 font-normal">
                        <Link>
                            <LinkedinIcon size={24} />

                        </Link>
                        <Link>
                            <GithubIcon size={24} />
                        </Link>
                    </div>
                    <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
                </div>
            </ PinContainer>
        </div >
    );
}
