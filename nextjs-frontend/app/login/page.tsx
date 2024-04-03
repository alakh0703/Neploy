"use client"
import useUserStore from "@/Stores/user.zustand"
import GoogleIcon from "@/public/google.png"
import LogoWhite from "@/public/logo-white.png"
import client from "@/utills/apollo-client"
import Image from "next/image"
import { signInWithGoogle } from "@/auth/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { gql, useMutation } from "@apollo/client"
import { Caveat } from "next/font/google"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/auth/firebase"


const inter = Caveat({ subsets: ["latin"] });



const REGISTER_USER_QUERY = gql`
    
mutation registerNewUser($userId: String!, $displayName: String!, $email: String!){
    registerNewUser(userId: $userId, display_name: $displayName, email: $email) {
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

export default function Login() {
    const { setUser, setProjects }: any = useUserStore()
    const router = useRouter()
    const [addNewUser] = useMutation(REGISTER_USER_QUERY, { client });


    const googleHandler = async () => {
        let user = await signInWithGoogle()

        const userName = (user?.name)?.split(" ").join("")

        const url = `/${userName}/dashboard`

        const res = await addNewUser({
            variables:

            {
                "userId": user?.uid,
                "displayName": user?.name,
                "email": user?.email
            }

        })

        const users2 = res.data?.registerNewUser
        const finalUser = {
            name: user?.name,
            email: user?.email,
            accessToken: user?.accessToken,
            photoUrl: user?.photoUrl,
            verified: user?.verified,

            uid: user?.uid,
            git_username: users2?.git_username,
            git_url: users2?.git_url,
            linkedin_url: users2?.linkedin_url,
            personal_website: users2?.personal_website,
            notification: users2?.notification,
        }
        setUser(finalUser)

        const projects = users2?.projects
        setProjects(projects)


        router.push(url)

    }
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const username = (user.displayName)?.split(" ").join("")
                const url = `/${username}/dashboard`
                router.push(url)

                // ...
            } else {
                // User is signed out
                // ...
                router.push("/login")

            }
        });

    }, [])

    return (
        <div className="w-full text-white">
            <div className="w-full flex justify-center items-center text-white pt-5">
                <div className="flex items-center">
                    <Image src={LogoWhite} alt="logo" className="rotate-12" width={50} height={50} />
                    <h1 className={cn(inter.className, "text-5xl ml-5")}>Neploy</h1>
                </div>
            </div>

            <div className="w-full flex justify-center items-center">
                <div className="lg:[22%] md:w-[22%] sm:w-[30%] flex flex-col justify-center pt-[110px]">
                    <div className="w-full flex flex-col justify-center mb-4">

                        <Button variant="ghost" className="flex" onClick={googleHandler}>
                            <Image src={GoogleIcon} alt="google" width={30} height={30} />
                            <p className="ml-3">Continue with Google</p>

                        </Button>

                    </div>
                    <div className="w-full flex justify-center items-center mb-5 opacity-50">
                        <div className="bg-[#ffffff] flex-grow h-[1px]" />
                        <p className="ml-2 mr-2 text-[#ffffff]">or</p>
                        <div className="bg-[#ffffff] flex-grow h-[1px]" />

                    </div>
                    <div className="w-full flex flex-col justify-center">
                        <Input placeholder="Email" className="mb-3 text-black" />
                        <Button variant="destructive">Continue with magic link</Button>
                    </div>
                </div>
            </div>

        </div >
    );
}
