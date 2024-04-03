"use client"

import useUserStore from "@/Stores/user.zustand";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs } from "@/components/ui/tabs2";
import client from "@/utills/apollo-client";
import { gql, useMutation } from "@apollo/client";
import { GithubIcon, Globe2Icon, LinkedinIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";



const UPDATE_PERSONAL_WEBSTIE_MUTATION = gql`
mutation updatePersonalWebsite($userId: String!, $personalWebsite: String!) {
    updatePersonalWebsite(userId: $userId, personal_website: $personalWebsite)
  }
`

const UPDATE_LINKEDIN_URL_MUTATION = gql`
mutation updateLinkedInUrl($userId: String!, $linkedinUrl: String!) {
    updateLinkedInUrl(userId: $userId, linkedin_url: $linkedinUrl)
  }`

const UPDATE_GITHUB_URL_MUTATION = gql`
mutation updateGitHubInfo($userId: String!, $gitUsername: String!, $gitProfileUrl: String!) {
    updateGithubInfo(userId: $userId, git_username: $gitUsername, git_profile_url: $gitProfileUrl)
  }`
export function TabsDemo() {


    const tabs = [
        {
            title: "GitHub",
            value: "github",
            content: (
                <GithubContent />

            ),
        },
        {
            title: "LinkedIn",
            value: "linkedin",
            content: (
                <LinkedInContent />

            ),
        },
        {
            title: "Personal Website",
            value: "personal-website",
            content: (
                <PersonalContent />

            ),
        }
    ];

    return (
        <div className="h-[200px] [perspective:1000px] relative b flex flex-col max-w-5xl  w-full  items-start justify-start pt-12">
            <Tabs tabs={tabs} />
        </div>
    );
}

const GithubContent = () => {
    const [update_github_info] = useMutation(UPDATE_GITHUB_URL_MUTATION, { client })
    const { user, setUser }: any = useUserStore()
    const gitusernameRef = useRef<HTMLInputElement>(null)
    const giturlRef = useRef<HTMLInputElement>(null)
    const saveGithubInfo = async () => {
        let gitusername = gitusernameRef.current?.value;
        let giturl = giturlRef.current?.value;
        if (gitusername?.trim() === "" && giturl?.trim() === "") {
            return;
        }
        if (gitusername?.trim() === "") {
            gitusername = user?.git_username
        }
        if (giturl?.trim() === "") {
            giturl = user?.git_url
        }
        try {
            await update_github_info({
                variables: {
                    "userId": user?.uid,
                    "gitUsername": gitusername,
                    "gitProfileUrl": giturl
                }
            })

            if (giturlRef.current) giturlRef.current.value = ""
            if (gitusernameRef.current) gitusernameRef.current.value = ""

            setUser({ ...user, git_username: gitusername, git_url: giturl })
            toast.success("Github info updated successfully")
        }
        catch (e) {
            toast.error("Error updating github info")
        }
    }
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center">
                    GitHub
                    <GithubIcon size={24} className="bg-white ml-4 text-black rounded-full p-1" />
                </CardTitle>
                <CardDescription>Add your github details.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">GitHub Username</Label>
                            <Input id="name" placeholder={user?.git_username} ref={gitusernameRef} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">GitHub Url</Label>
                            <Input id="name" placeholder={user?.git_url} ref={giturlRef} />
                        </div>

                    </div>
                </form>
                <Button variant="outline" className="mt-4" onClick={saveGithubInfo}>Save</Button>

            </CardContent>

        </Card>
    );
}
const LinkedInContent = () => {
    const [update_linkedin_url] = useMutation(UPDATE_LINKEDIN_URL_MUTATION, { client })
    const { user, setUser }: any = useUserStore()
    const linkinRef = useRef<HTMLInputElement>(null)

    const saveLinkedInInfo = async () => {
        const linkedinUrl = linkinRef.current?.value;
        if (linkedinUrl?.trim() === "") {
            return;
        }
        try {
            await update_linkedin_url({
                variables: {
                    "userId": user?.uid,
                    "linkedinUrl": linkedinUrl
                }
            })
            if (linkinRef.current) linkinRef.current.value = ""
            setUser({ ...user, linkedin_url: linkedinUrl })
            toast.success("LinkedIn info updated successfully")

        }
        catch (e) {
            toast.error("Error updating linkedin info")
        }

    }
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center">
                    LinkedIn
                    <LinkedinIcon size={30} className="bg-white ml-4 text-black rounded-full p-1" />
                </CardTitle>
                <CardDescription>Add your linkedin details.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">LinkedIn Url</Label>
                            <Input id="name" placeholder={user?.linkedin_url} ref={linkinRef} />
                        </div>
                    </div>
                </form>
                <Button variant="outline" className="mt-4 mb-6" onClick={saveLinkedInInfo}>Save</Button>

            </CardContent>


        </Card>
    );
}

const PersonalContent = () => {
    const personalUrlRef = useRef<HTMLInputElement>(null)
    const { user, setUser }: any = useUserStore()
    const [update_personal_website] = useMutation(UPDATE_PERSONAL_WEBSTIE_MUTATION, { client })
    const savePersonalWebsite = async () => {
        const personalUrl = personalUrlRef.current?.value;
        // remove trailing spaces

        if (personalUrl?.trim() === "") {
            return;
        }
        try {
            await update_personal_website({
                variables: {
                    "userId": user?.uid,
                    "personalWebsite": personalUrl
                }
            })
            if (personalUrlRef.current) personalUrlRef.current.value = ""
            setUser({ ...user, personal_website: personalUrl })
            toast.success("Personal Website info updated successfully")

        }
        catch (e) {
            toast.error("Error updating personal website info")
        }

    }

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center">
                    Personal Website
                    <Globe2Icon size={30} className="bg-white ml-4 text-black rounded-full p-1" />
                </CardTitle>
                <CardDescription>Add your website details.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Website URL</Label>
                            <Input id="name" placeholder={user?.personal_website} ref={personalUrlRef} />
                        </div>
                    </div>
                </form>
                <Button variant="outline" className="mt-4 mb-6" onClick={savePersonalWebsite} >Save</Button>

            </CardContent>


        </Card>
    );
}

