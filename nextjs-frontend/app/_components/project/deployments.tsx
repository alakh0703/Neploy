"use client"
import useProjectStore from "@/Stores/project.zustand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import client from "@/utills/apollo-client";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { toast } from "sonner";
import { ZodError, z } from "zod";


const START_DEPLOY_MUTATION = gql`
mutation startDeploy($title: String!, $pId: String!, $gitLink: String!, $url: String!) {
    startDeploy(title: $title, pId: $pId, git_link: $gitLink, url: $url) {
      url
      buildId
    }
  }
`


const VALUES = ["React"] as const;

const DeploymentFormSchema = z.object({
    giturl: z.string(),
    frameworkType: z.enum(VALUES),
    buildCommand: z.string(),
    outputDirectory: z.string(),
    installCommand: z.string(),
    rootDirectory: z.string()
});

export function Deployments() {
    const [start_deploy] = useMutation(START_DEPLOY_MUTATION, { client });

    const [framework, setFramework] = useState("")

    const { project, setProject }: any = useProjectStore()

    const formatDateTime = (dateTimeString: string): string => {
        const dateTime = new Date(dateTimeString);

        // Format date
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
        const formattedDate = dateTime.toLocaleDateString('en-US', options);

        // Format time
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const formattedTime = dateTime.toLocaleTimeString('en-US', timeOptions);

        return `${formattedDate} ${formattedTime}`;
    }
    const millisecondsToSeconds = (milliseconds: number): number => {
        return milliseconds / 1000;
    }
    const [open, setOpen] = useState(false)
    const [deployments, setDeployments] = useState(project?.builds || [])

    const openSlider = () => {
        setOpen(true)
    }

    const deploy = async () => {

        try {
            DeploymentFormSchema.parse({
                giturl: project.git_link,
                frameworkType: framework,
                buildCommand: "npm run build",
                outputDirectory: "build",
                installCommand: "npm install",
                rootDirectory: "./"

            })
        } catch (error) {
            // If validation fails, handle the error
            if (error instanceof ZodError) {
                // Extract and display error messages
                const errorCount = error.errors.length;
                console.log(error)
                if (errorCount === 1) {
                    const errorMessage = error.errors.map(err => err.message).join("\n");

                    if (error.errors[0].code === 'invalid_enum_value') {
                        toast.error("Please select a framework type");
                    }
                    else {
                        toast.error(errorMessage);
                    }

                } else {
                    toast.error("Please fill all the fields")
                }
                return
            } else {
                // Handle other types of errors
                console.error("An unexpected error occurred:", error);
                alert("An unexpected error occurred. Please try again later.");
                return
            }
        }
        // prompt yes or no
        const prompt = window.confirm("Are you sure you want to deploy this project? Previous deployments will be replaced.")
        if (!prompt) {
            return
        }



        const res = await start_deploy({
            variables:


            {
                "title": project.title,
                "pId": project.pId,
                "gitLink": project.git_link,
                "url": project.url
            }


        })
        console.log('res', res)
        // const build = {
        //     buildId: "vfdb",
        //     projectId: project.pId,
        //     buildStatus: 'in progress',
        //     buildDate: new Date().toISOString(),
        //     buildLog: "Build in progress...",
        //     timeToBuild: 'calculating...'
        // }
        const zustand_build = {
            buildId: res.data.startDeploy.buildId,
            buildDate: new Date().toISOString(),
            buildLog: "Build in progress...",
            buildStatus: 'in progress',
            timeToBuild: 'calculating...'

        }
        const builds = project.builds || []

        builds.push(zustand_build)
        setProject({ ...project, builds })


        // setDeployments([...deployments, build])
        console.log('res', res)
        setOpen(false)
    }
    const handleChange = (e: any) => {
        setFramework(e)
    }

    return <div>
        <div className="w-full flex justify-between h-[100px] items-center">
            <div className="text-4xl md:pl-12">
                Deployments
            </div>

            <div className="pr-20">
                <Sheet open={open} >
                    <SheetTrigger>
                        <Button variant="default" onClick={openSlider}>Start New Deployment</Button>
                    </SheetTrigger>
                    <SheetContent className="dark text-white">
                        <SheetHeader className="dark">
                            <SheetTitle className="dark">New Deployment</SheetTitle>
                            <SheetDescription>
                                Create a new deployment for your project
                            </SheetDescription>

                        </SheetHeader>
                        <p className="mt-6 mb-2 text-sm text-[#979393]">GitHub Url:</p>
                        <Input className="" placeholder="www.github.com/alakh0703/neploy" />
                        <p className="mt-6 mb-2 text-sm text-[#979393]">Framework Type:</p>
                        <Select onValueChange={handleChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Framework" />
                            </SelectTrigger>
                            <SelectContent className="dark">
                                <SelectItem value="React">React</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="mt-6 mb-2 text-sm text-[#979393]">Build Command:</p>
                        <Input className="" placeholder="npm run build" disabled />
                        <p className="mt-6 mb-2 text-sm text-[#979393]">Output Directory:</p>
                        <Input className="" placeholder="build" disabled />
                        <p className="mt-6 mb-2 text-sm text-[#979393]">Install Command:</p>
                        <Input className="" placeholder="npm install" disabled />
                        <p className="mt-6 mb-2 text-sm text-[#979393]">Root Directory:</p>
                        <Input className="" placeholder="./" disabled />



                        <Button className="mt-6 w-full" variant="default" onClick={deploy}> Deploy</Button>
                        <Button className="mt-6 w-full" variant="outline" onClick={() => setOpen(false)}> Cancel</Button>
                    </SheetContent>
                </Sheet>

            </div>
        </div>
        <hr className="opacity-20" />
        {deployments.length > 0 && <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-900 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Build ID</th>
                        <th className="px-6 py-3 bg-gray-900 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Build Status</th>
                        <th className="px-6 py-3 bg-gray-900 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Build Date</th>
                        <th className="px-6 py-3 bg-gray-900 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider">Time to Build (s)</th>
                    </tr>
                </thead>

                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {deployments.map((deployment: any, index: any) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-300">{deployment.buildId}</td>
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-300">{deployment.buildStatus}</td>
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-300">{formatDateTime(deployment.buildDate)}</td>
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-300">{millisecondsToSeconds(deployment.timeToBuild)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>}

    </div>
}