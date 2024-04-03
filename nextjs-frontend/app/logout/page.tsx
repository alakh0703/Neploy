"use client"
import { auth } from "@/auth/firebase"
import { signOut } from "firebase/auth";
import useUserStore from "@/Stores/user.zustand"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
    const { logout }: any = useUserStore()
    const router = useRouter()

    const handleLogout = () => {

        signOut(auth).then(() => {
            // Sign-out successful.
            logout()
            router.push("/login")
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
            console.log(error)
        });
    }

    useEffect(() => {
        handleLogout()
    }, [])

    return (
        <div>
            <h1>Logout</h1>
        </div>
    )
}