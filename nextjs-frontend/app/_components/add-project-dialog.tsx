"use client"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

import useUserStore from "@/Stores/user.zustand";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import client from "@/utills/apollo-client";
import { gql, useMutation } from "@apollo/client";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";

interface AddProjectDialogProps {
    trigger: boolean;
    close: () => void;
}



const ADD_PROJECT_MUTATION = gql`
mutation addNewProject($userId: String!, $title: String!, $githubLink: String!){
    addNewProject(userId: $userId, title: $title, githubLink: $githubLink) {
      pId
      title
      description
      git_link
      url
    deployed
    date_created
    profileUrl
    }
  }
`

export default function AddProjectDialog({ trigger, close }: AddProjectDialogProps) {
    const { user, projects, setProjects }: any = useUserStore()

    const [addNewProject] = useMutation(ADD_PROJECT_MUTATION, { client });

    const [open, setOpen] = useState(false);

    const giturlRef = useRef<HTMLInputElement>(null);
    const projectNameRef = useRef<HTMLInputElement>(null);

    const startDeploy = async () => {
        const giturl = giturlRef.current?.value;
        if (giturl === null || giturl === undefined || giturl === "") {
            alert("Please enter a valid git url")
            return;
        }

        const projectName = projectNameRef.current?.value;
        if (projectName === null || projectName === undefined || projectName === "") {
            alert("Please enter a valid project name")
            return;
        }


        if (projectName.length > 50) {
            toast.error("Project name should not exceed 50 characters")
            return;
        }


        const res = await addNewProject({
            variables:

            {
                "userId": user?.uid,
                "githubLink": giturl,
                "title": projectName
            }

        })


        const incomingPorject = res.data?.addNewProject

        const project = {
            pId: incomingPorject.pId,
            title: incomingPorject.title,
            description: incomingPorject.description,
            url: incomingPorject.url,
            git_link: incomingPorject.git_link,
            deployed: incomingPorject.deployed,
            date_created: incomingPorject.date_created,
            profileUrl: incomingPorject.profileUrl

        }

        projects?.push(project)
        setProjects(projects)
        toast("New Project Created!", {
            description: `${projectName} has been created successfully!`,
        })

        setOpen(false)
        close()
    }

    useEffect(() => {
        setOpen(true)
    }, [trigger])



    const cancel = () => {
        setOpen(false)
        close()
    }

    return (
        <Dialog open={open} >

            <DialogContent className="dark sm:max-w-[700px]" >
                <DialogHeader>
                    <DialogTitle className="text-white">Add a new project</DialogTitle>
                    <DialogDescription>
                        Import your project from github to get started
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-white" >
                            Project Name:
                        </Label>
                        <Input id="name" className="col-span-3 text-white" ref={projectNameRef} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-white" >
                            Git Repository URL:
                        </Label>
                        <Input id="name" className="col-span-3 text-white" ref={giturlRef} />
                    </div>

                </div>
                <div>
                    <div className="text-white flex w-full items-center pl-5 mb-4">

                        <HoverCard>
                            <HoverCardTrigger>
                                <InfoIcon size={20} className="text-white mr-2   cursor-pointer" />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-fit max-w-[600px]">
                                <p className="text-white">Rules</p>
                                <p className="text-white">1. It should be a valid git url</p>
                                <p className="text-white">2. It must contain a React app</p>
                                <p className="text-white">3. Project files should be not inside any other nested directory</p>
                            </HoverCardContent>
                        </HoverCard>



                        <p>Rules </p>
                    </div>

                </div>
                <DialogFooter>
                    <Button variant="destructive" onClick={cancel}>Cancel</Button>
                    <Button type="submit" onClick={startDeploy} >Let&apos;s Go</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}