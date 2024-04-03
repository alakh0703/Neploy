import useUserStore from "@/Stores/user.zustand";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import GitHubIcon from "@/public/github-white.png";
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Project {
    pId: string,
    title: string,
    description: string,
    url: string,
    git_link: string,
    deployed: boolean,
    date_created: string,
    profileUrl: string

}
interface ProjectCardProps {
    project: Project;
}
export default function ProjectCardHorizontal({ project }: ProjectCardProps) {
    const router = useRouter()
    const { user }: any = useUserStore()
    // Parse the date string into a Date object
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
    const handleOuterLinkClick = (e: any) => {
        e.stopPropagation();
        const username = user?.name;
        router.push(`/${username}/${project.title}/${project.pId}`)
    }
    const formattedDate = formatDistanceToNow(dateCreated, { addSuffix: true });
    return (
        <div onClick={handleOuterLinkClick} className="w-full bg-[#020101] border border-[#6c6b6b] rounded-xl hover:border-[#ffffff] hover:border-3 hidden lg:flex justify-center items-center mb-6">
            <div className="flex w-full p-1 justify-center items-center">
                <Avatar className="ml-4 mr-2 mt-2">
                    <AvatarImage src={project.profileUrl} />

                </Avatar>
                <div className="flex flex-col pl-2 pr-2 flex-1 pt-2 pb-2 justify-start ">
                    <p >{project.title}</p>
                    <p className="cursor-pointer hover:underline text-[#b0b0b0]">{project.url}</p>
                </div>


                <HoverCard >
                    <HoverCardTrigger><InfoIcon className="mr-2 opacity-50 cursor-pointer" /></HoverCardTrigger>
                    <HoverCardContent className="w-[350px]">
                        {project.description}
                    </HoverCardContent>
                </HoverCard>
            </div>
            <div className="flex w-full items-center pl-12 mt-2 mb-2 opacity-80">
                <Image src={GitHubIcon} alt="GitHub" width={25} height={25} className="mr-2" />
                <p>{project.git_link}</p>
            </div>

            <div className="w-full flex justify-between pl-4 pt-2 pr-4 pb-2">
                <p className="text-[#b8b4b4]">{formattedDate}</p>
                <div className="flex justify-center items-center">
                    <p className="text-sm text-[#d3cfcf]">Status</p>
                    {project.deployed ? <div className="w-[15px] h-[15px] bg-[#45ff6d] rounded-full ml-2" />
                        : <div className="w-[15px] h-[15px] bg-[#ec3d3d] rounded-full ml-2" />}

                </div>
            </div>
        </div>
    )
}