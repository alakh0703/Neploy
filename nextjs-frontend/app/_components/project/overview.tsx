import useProjectStore from "@/Stores/project.zustand";
import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { InfoIcon } from "lucide-react";
import Link from "next/link";

export function Overview() {
    const { project }: any = useProjectStore()


    let dateCreated;
    try {
        dateCreated = parseISO(project.date_created);
    } catch (error) {
        console.error("Error parsing date:", error);
        return <div>Error parsing date</div>;
    }

    // Check if the parsed date is valid
    if (!isValid(dateCreated)) {
        console.error("Invalid date:", project.date_created);
        return <div>Invalid date</div>;
    }

    const formattedDate = formatDistanceToNow(dateCreated, { addSuffix: true });
    return <div>
        <div>
            <div className="w-full flex justify-between h-[100px] items-center pt-5 md:pt-0">
                <div className="text-4xl md:pl-12">
                    {project.title}
                </div>
                <div className="md:pr-20 flex flex-col md:block">
                    <Button variant="ghost" className="mr-12 mb-2 md:mb-0">
                        <Link href={project.git_link} target="_blank">
                            Git Repository
                        </Link>
                    </Button>
                    <Button variant="default">
                        <Link href={project.url} target="_blank">
                            Visit
                        </Link>
                    </Button>
                </div>
            </div>
            <hr className="opacity-20 mt-10 md:mt-0" />
            <div className="flex flex-col md:flex-row w-full border border-[#ffffff] mt-12 p-6 rounded-xl">
                <div className="w-[100%] pb-5 md:pb-0 md:w-[60%] flex items-center p-2 md:pr-12">
                    <img src={project.profileUrl} alt="neploy" className="rounded-xl cursor-pointer" />
                </div>
                <div className="pt-2 w-full">
                    <div className="flex justify-between w-full">
                        <div className="mb-4">
                            <p className="text-[#a3a1a1] text-sm">Deployment</p>
                            <Link className="hover:underline cursor-pointer" href={project.url} target="_blank">{project.url}</Link>
                        </div>
                        <div>
                            <HoverCard >
                                <HoverCardTrigger><InfoIcon className=" opacity-50 cursor-pointer" /></HoverCardTrigger>
                                <HoverCardContent className="w-[350px]">
                                    {project.description}
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-[#a3a1a1] text-sm">GitHub Url</p>
                        <Link className="hover:underline cursor-pointer" href={project.git_link} target="_blank">{project.git_link}</Link>
                    </div>
                    <div className="flex">
                        <div className="mb-4 mr-12">
                            <p className="text-[#a3a1a1] text-sm">Status</p>
                            <div className="flex items-center italic">
                                {project.status === "DEPLOYED" ? <div className="w-[15px] h-[15px] bg-[#45ff6d] rounded-full  mr-2" />
                                    : <div className="w-[15px] h-[15px] bg-[#ec3d3d] rounded-full  mr-2" />}
                                <p>{project.status}</p>
                            </div>
                        </div>
                        <div >
                            <p className="text-[#a3a1a1] text-sm">Created:</p>
                            <p>{formattedDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}