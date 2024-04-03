import useProjectStore from "@/Stores/project.zustand";
import useUserStore from "@/Stores/user.zustand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import client from "@/utills/apollo-client";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";


const DELETE_PROJECT_MUTATION = gql`
mutation deleteProjectById($pId: ID!) {
    deleteProject(pId: $pId) {
      pId
    }
  }
`

const UPDATE_PROJECT_NAME_MUTATION = gql`
mutation updateProjectName($pId: ID!, $title: String!, $userId: String!) {
    updateProjectName(pId: $pId, title: $title, userId: $userId) {
      pId
      title
    }
  }
`
const UPDATE_GITHUB_LINK_MUTATION = gql`
mutation updateGitHubLink($pId: ID!, $newUrl: String!, $userId: String!) {
    updateGitHubUrl(pId: $pId, newUrl: $newUrl, userId: $userId) {
      pId
      userId
      git_link
    }
  }
`
const UPDATE_PROJECT_DESCRIPTION_MUTATION = gql`
mutation updateDescription($pId: ID!, $newDescription: String!, $userId: String!) {
    updateProjectDescription(pId: $pId, newDescription: $newDescription, userId: $userId)
  }`
export function ProjectSettings() {
    const { user, projects, setProjects }: any = useUserStore()
    const { project, setProject }: any = useProjectStore()


    const router = useRouter()

    const [delete_project_by_id] = useMutation(DELETE_PROJECT_MUTATION, { client });
    const [update_project_name] = useMutation(UPDATE_PROJECT_NAME_MUTATION, { client });
    const [update_github_link] = useMutation(UPDATE_GITHUB_LINK_MUTATION, { client });
    const [update_project_description] = useMutation(UPDATE_PROJECT_DESCRIPTION_MUTATION, { client });

    const url = `/${user.userName}/dashboard`

    const newTitleRef = useRef<HTMLInputElement>(null)
    const gitLinkRef = useRef<HTMLInputElement>(null)
    const deleteRef = useRef<HTMLInputElement>(null)
    const newDescriptionRef = useRef<HTMLTextAreaElement>(null)

    const deleteThisProject = () => {
        if (deleteRef.current?.value !== "permanently-delete") {
            toast.error("Please type 'permanently-delete' to delete the project")
            return
        }

        const res = delete_project_by_id({ variables: { pId: project.pId } })
        res.then((res) => {
            // console.log('DELETED PROJECT', res)
            const newProjects = projects?.filter((p: any) => p.pId !== project.pId)
            setProjects(newProjects)
            setProject(null)
            router.push(url)
        })
    }

    const updateProjectName = async () => {
        const userId = user.uid;
        const projectId = project.pId;
        const newTitle = newTitleRef.current?.value;
        if (newTitle) {
            if (newTitle.length === 0) {
                return
            }
            if (newTitle.length > 50) {
                toast.error("Project name should not exceed 50 characters")
                return
            }

            const res = await update_project_name({ variables: { pId: projectId, title: newTitle, userId: userId } })
            setProject({ ...project, title: newTitle })
            setProjects(projects?.map((p: any) => {
                if (p.pId === projectId) {
                    return { ...p, title: newTitle }
                }
                return p
            }
            ))

            newTitleRef.current.value = ""
            toast("Project name updated succesfully!", {
                description: `but the url of the project will remain the same.`,
            })
        }
    }
    const updateGitLink = async () => {
        const userId = user.uid;
        const projectId = project.pId;
        const gitLink = gitLinkRef.current?.value;

        if (gitLink) {
            if (gitLink.length === 0) {
                return
            }
            const res = await update_github_link({ variables: { pId: projectId, newUrl: gitLink, userId: userId } })
            setProject({ ...project, git_link: gitLink })
            setProjects(projects?.map((p: any) => {
                if (p.pId === projectId) {
                    return { ...p, git_link: gitLink }
                }
                return p
            }
            ))
            gitLinkRef.current.value = ""
            toast("GitHub link updated succesfully!", {
                description: `The code will be fetched from the new link.`,
            })
        }
    }

    const updateProjectDescription = async () => {
        try {
            const userId = user.uid;
            const projectId = project.pId;
            const newDescription = newDescriptionRef.current?.value as string;
            if (newDescription === "") {
                return
            }
            if (newDescription.length > 500) {
                toast.error("Project description should not exceed 500 characters")
                return
            }
            const res = await update_project_description({ variables: { pId: projectId, newDescription: newDescription, userId: userId } })
            setProject({ ...project, description: newDescription })
            setProjects(projects?.map((p: any) => {
                if (p.pId === projectId) {
                    return { ...p, description: newDescription }
                }
                return p
            }
            ))
            if (newDescriptionRef.current) newDescriptionRef.current.value = ""
            toast("Project description updated succesfully!", {
                description: `The description of the project has been updated.`,
            })
        }
        catch (error) {
            toast.error("Error updating project description")
        }
    }
    return <div>
        <div className="w-full flex justify-between h-[100px] items-center">
            <div className="text-4xl pl-12">
                Settings
            </div>

        </div>
        <hr className="opacity-20" />
        <div className="mt-4">
            <div className="w-full p-6 border border-[#d6d3d3] rounded-xl mt-12">
                <h3 className="text-2xl">Project Name</h3 >
                <p className="text-sm text-[#a3a0a0] mb-6">Used to identify your project on Dashboard,and URLs of the deployed website.</p>
                <Input placeholder={(project.title).split(' ').join('-').toLowerCase()} ref={newTitleRef} />
                <Button variant="outline" className="mt-4" onClick={updateProjectName}>Save</Button>
            </div>
            <div className="w-full p-6 border border-[#d6d3d3] rounded-xl mt-12">
                <h3 className="text-2xl">GitHub URL</h3 >
                <p className="text-sm text-[#a3a0a0] mb-6">Used to fetch the code for deployment.</p>
                <Input placeholder={project.git_link} ref={gitLinkRef} />
                <Button variant="outline" className="mt-4" onClick={updateGitLink}>Save</Button>
            </div>
            <div className="w-full p-6 border border-[#d6d3d3] rounded-xl mt-12">
                <h3 className="text-2xl mb-4">Project Description</h3 >
                <Textarea placeholder={(project.description)} ref={newDescriptionRef} />
                <Button variant="outline" className="mt-4" onClick={updateProjectDescription}>Save</Button>
            </div>
            <div className="w-full p-6 border border-[#f74c4c] rounded-xl mt-12 mb-28">
                <h3 className="text-2xl">DELETE PROJECT</h3 >
                <p className="text-sm text-[#a3a0a0] mb-6">Permanently delete your project.</p>
                <Input placeholder="type 'permanently-delete'" ref={deleteRef} />
                <Button variant="destructive" className="mt-4" onClick={deleteThisProject}>DELETE</Button>
            </div>
        </div>
    </div>
}