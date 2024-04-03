"use client"
import useUserStore from "@/Stores/user.zustand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridIcon, ListIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddProjectDialog from "../../_components/add-project-dialog";
import ProjectCard from "../../_components/project-card";
import ProjectCardHorizontal from "../../_components/project-card-horizontal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/auth/firebase";
import { gql, useMutation } from "@apollo/client";
import client from "@/utills/apollo-client";
import { set } from "date-fns";


interface Project {
    pId: string;
    title: string;
    url: string;
    git_link: string;
    profileUrl: string;
    date_created: string;
    deployed: boolean;
    description: string;

}


const GET_USER_MUTATION = gql`
mutation getUser($email: String!) {
    getUserById(email: $email) {
       display_name
        git_username
          git_url
          linkedin_url
          personal_website
          notification
        projects {
          pId
          title
          url
          git_link
          profileUrl
          date_created
          deployed
          description
        }
    }
}  
`

export default function Dashboard() {
    const { user, projects, setUser, setProjects }: any = useUserStore();
    const router = useRouter();
    const [get_user] = useMutation(GET_USER_MUTATION, { client });

    const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
    const [Projects, setProjects2] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
    const [gridView, setGridView] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                const res = await get_user({ variables: { email: user.email } });
                const user2 = res.data?.getUserById
                const finalUser = {
                    name: user?.displayName,
                    email: user?.email,
                    accessToken: "user?.access",
                    photoUrl: user?.photoURL,
                    verified: user?.emailVerified,

                    uid: user?.uid,
                    git_username: user2?.git_username,
                    git_url: user2?.git_url,
                    linkedin_url: user2?.linkedin_url,
                    personal_website: user2?.personal_website,
                    notification: user2?.notification,
                }
                setUser(finalUser)
                console.log('user', user2)
                const projects = user2?.projects
                if (projects === undefined || projects === null) {
                    setProjects([])
                    alert("No Projects Found")
                    return
                }
                setProjects(projects)


                // ...
            } else {
                // User is signed out
                // ...
                router.push("/login")

            }
        });

    }, [])
    useEffect(() => {
        if (projects === null) {

            return;
        }

        setProjects2(projects);
        setFilteredProjects(projects);
    }, [projects])



    const setGridViewHandler = () => {
        setGridView(true);
    }
    const setListViewHandler = () => {
        setGridView(false);
    }


    const handleSearchChange = (e: any) => {
        if (e.target.value === "") {
            setFilteredProjects(projects);
        }
        else {
            setFilteredProjects(Projects.filter(project => project.title.toLowerCase().includes(e.target.value.toLowerCase())));
        }

    }

    const openDialog = () => {
        setIsAddProjectDialogOpen(true);
    }
    const closeDialog = () => {
        setIsAddProjectDialogOpen(false);
    }



    if (user === null) {
        return <h1></h1>
    }

    return (
        <div className="h-full w-full pl-[10%] pr-[10%]">
            <div className=" w-full flex mt-12">
                <Input type="email" placeholder="Search Projects ..." className="dark rounded-lg h-[45px] mr-2 md:mr-0" onChange={handleSearchChange} />

                <Tabs defaultValue="account" className="dark ml-4 mr-4 w-fit h-[45px] hidden md:block">
                    <TabsList className="bg-black h-full">
                        <TabsTrigger value="account" onClick={setGridViewHandler}>
                            <GridIcon size={20} className="mr-2" />
                        </TabsTrigger>
                        <TabsTrigger value="password" onClick={setListViewHandler}>
                            <ListIcon size={20} className="mr-2" />
                        </TabsTrigger>
                    </TabsList>

                </Tabs>
                <Button className="dark h-[45px]" variant="default" onClick={openDialog}>Add New Project</Button>

                {isAddProjectDialogOpen && <AddProjectDialog trigger={isAddProjectDialogOpen} close={closeDialog} />}

            </div>
            {gridView ? <div className="w-full grid gap-0 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
                {filteredProjects.map((project) => (
                    <ProjectCard key={project.pId} project={project} />
                ))}
            </div> :
                <div className="w-full pt-6">
                    {filteredProjects.map((project) => (
                        <ProjectCardHorizontal key={project.pId} project={project} />
                    ))}
                </div>
            }

        </div>
    );
}
