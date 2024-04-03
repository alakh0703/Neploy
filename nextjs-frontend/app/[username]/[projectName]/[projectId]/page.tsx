"use client"

import { Analytics } from "@/app/_components/project/analytics"
import { Deployments } from "@/app/_components/project/deployments"
import { Logs } from "@/app/_components/project/logs"
import { Overview } from "@/app/_components/project/overview"
import { ProjectSettings } from "@/app/_components/project/project-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { gql, useMutation } from "@apollo/client"
import { useEffect } from "react"
import client from "@/utills/apollo-client"
import useProjectStore from "@/Stores/project.zustand"
import { toast } from "sonner"



const GET_PROJECT_DETAILS = gql`
mutation getProjectDetails($pId: ID!) {
    getProjectDetails(pId: $pId) {
      pId
      title
      description
      git_link
      deployed
      status
      date_created
      url
      profileUrl
      date_latest_deploy
      builds {
        buildDate
        buildId
        buildLog
        buildStatus
        timeToBuild
      }
    }
  }
`

export default function Page(params: any) {
    const [get_project_details] = useMutation(GET_PROJECT_DETAILS, { client });
    const { project, setProject }: any = useProjectStore()

    // code to fetch project details and set zustand state
    const getDetails = async (proId: string) => {

        try {
            const res = await get_project_details({
                variables:

                {
                    "pId": proId
                }

            })
            const projectDetails = res.data.getProjectDetails
            setProject(projectDetails)
        }
        catch (err) {
            toast.error("Project not found")
        }
    }


    useEffect(() => {
        const projectId = params.params.projectId
        const res = getDetails(projectId)

    }, [])

    if (!project) {
        return <div>Loading ...</div>
    }
    return <div className="w-full flex justify-center">
        <Tabs defaultValue="overview" className="w-full p-5 md:p-0 md:pt-6 md:w-[80%] dark sticky overflow-hidden">
            <TabsList>
                <TabsTrigger value="overview">
                    Overview
                </TabsTrigger>
                <TabsTrigger value="deployments">Deployments</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>

                <TabsTrigger value="settings">Settings</TabsTrigger>

            </TabsList>
            <TabsContent value="overview">
                <Overview />
            </TabsContent>
            <TabsContent value="deployments">
                <Deployments />
            </TabsContent>
            <TabsContent value="logs">
                <Logs />
            </TabsContent>
            <TabsContent value="analytics">
                <Analytics />
            </TabsContent>

            <TabsContent value="settings">
                <ProjectSettings />
            </TabsContent>




        </Tabs>

    </div>
}