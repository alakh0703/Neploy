"use client"
import { Caveat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


import useUserStore from "@/Stores/user.zustand";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import LogoW from "@/public/logo-white.png";
import client from "@/utills/apollo-client";
import { gql, useMutation } from "@apollo/client";
import { BellIcon, BellRingIcon, DollarSign, HomeIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon, XIcon } from "lucide-react";
import NotificationInd from "./notification-ind";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/auth/firebase";

const inter = Caveat({ subsets: ["latin"] });

interface Notification {
    notificationId: string;
    userId: string;
    notificationType: boolean;
    notificationMessage: string;
    notificationDate: string;
    notificationProjectName: string;

}

const GET_NOTIFICATIONS_MUTATION = gql`
mutation getNotification($userId: ID!){
    getNotification(userId: $userId) {
      userId
      notificationType
      notificationProjectName
      notificationMessage
      notificationId
      notificationDate
    }
  }
`

const SET_USER_NOTIFICATION_FALSE_MUTATION = gql`
mutation setNotificationFalse($userId: ID!) {
    setNotificationFalse(userId: $userId)
  }
`



export default function Navbar() {
    const router = useRouter()

    const [getNotification] = useMutation(GET_NOTIFICATIONS_MUTATION, { client })
    const [setNotificationFalse] = useMutation(SET_USER_NOTIFICATION_FALSE_MUTATION, { client })
    const { user, logout, setUser }: any = useUserStore()
    const userName = user?.name


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

            } else {
                router.push("/login")
            }
        });

    }, [])

    const [isBellRing, setIsBellRing] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const toggleMenu = () => {

        setIsMenuOpen(!isMenuOpen)
    }
    const [notifications, setNotifications] = useState<Notification[]>([])


    const handleBellRing = async () => {
        setIsBellRing(!isBellRing)
        if (user?.notification) {
            await setNotificationFalse({
                variables: {
                    "userId": user?.uid
                }
            })
            const user2 = { ...user, notification: false }
            setUser(user2)
        }
    }

    const getNoti = async () => {
        if (user === null) {
            return
        }
        const res = await getNotification({
            variables: {
                "userId": user?.uid
            }
        })
        const data = res?.data?.getNotification
        console.log("RESPONSE FROM GET NOTIFICATION", res?.data?.getNotification)
        setNotifications(data?.reverse())
        console.log("RESPONSE FROM GET NOTIFICATION", res?.data?.getNotification)
    }


    useEffect(() => {
        getNoti()
    }, [user])
    if (user === null) {
        return <h1>loading</h1>
    }
    return (
        <div className="flex flex-col w-full bg-black sticky">
            <div className="w-full flex justify-between pt-4 pl-[50px] pr-[50px]">
                <Link href={`/${userName}/dashboard`}>

                    <div className="flex">
                        <Image src={LogoW} alt="logo" className="rotate-12 cursor-pointer" width={30} height={30} />
                        <h1 className={cn(inter.className, "text-4xl ml-3 cursor-pointer")}>Neploy</h1>
                    </div>
                </Link>

                <div className="pr-12 justify-center items-center hidden sm:flex">
                    <Link href={`/${userName}/contact-us`}>
                        <Button className="mr-6 dark" variant="outline">Contact us</Button>

                    </Link>

                    <Popover>
                        <PopoverTrigger >
                            {user?.notification ? <BellRingIcon size={20} className="mr-6 cursor-pointer" onClick={handleBellRing} /> :
                                <BellIcon size={20} className="mr-6 cursor-pointer" onClick={handleBellRing} />}

                        </PopoverTrigger>
                        <PopoverContent className="dark mr-[150px] mt-3 rounded-2xl" asChild >
                            <ScrollArea className="h-[400px] w-[400px] rounded-md border p-4">
                                {notifications.length === 0 && <h1>No Notifications</h1>}
                                {notifications.map((notification) => (
                                    <NotificationInd key={notification.notificationId} notification={notification} />
                                )
                                )
                                }
                            </ScrollArea>

                        </PopoverContent>
                    </Popover>

                    <Popover >
                        <PopoverTrigger >
                            {user && <img src={user.photoUrl} alt="profile" className="rounded-full cursor-pointer w-[40px] h-[40px]" />}


                        </PopoverTrigger>
                        <PopoverContent className="dark mr-[100px] mt-3 rounded-2xl" asChild >
                            <Command >
                                {/* <CommandInput placeholder="Type a command or search..." /> */}
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup heading="General">
                                        <Link href={`/${userName}/dashboard`}>

                                            <CommandItem className="w-full flex justify-between pr-4">
                                                Dashboard
                                                <HomeIcon size={15} className="opacity-30" />

                                            </CommandItem>
                                        </Link>

                                        <Link href="https://www.buymeacoffee.com/socialalakp" target="_blank">

                                            <CommandItem className="w-full flex justify-between pr-4" >
                                                Support Us

                                                <DollarSign size={15} className="opacity-30" />
                                            </CommandItem>
                                        </Link>
                                        <Link href="/logout">
                                            <CommandItem className="w-full flex justify-between pr-4">Logout
                                                <LogOutIcon size={15} className="opacity-30" />
                                            </CommandItem></Link>
                                    </CommandGroup>
                                    <CommandSeparator />
                                    <CommandGroup heading="Settings">

                                        <Link href={`/${userName}/settings`}>

                                            <CommandItem className="w-full flex justify-between pr-4">Settings
                                                <SettingsIcon size={15} className="opacity-30" />
                                            </CommandItem>
                                        </Link>
                                    </CommandGroup>
                                </CommandList>
                            </Command>

                        </PopoverContent>
                    </Popover>

                </div>
                <div className="block sm:hidden" >
                    <Popover>
                        <PopoverTrigger>
                            {isMenuOpen ?
                                <XIcon size={30} className="cursor-pointer mt-3 block sm:hidden" onClick={toggleMenu} />
                                : <MenuIcon size={30} className="cursor-pointer mt-3 block sm:hidden" onClick={toggleMenu} />}

                        </PopoverTrigger >
                        <PopoverContent className="dark w-[100vw] mt-[20px]  block sm:hidden">

                            <Command>
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup heading="General">
                                        <CommandItem>Dashboard</CommandItem>
                                        <CommandItem>Support Us</CommandItem>
                                        <CommandItem>Contact Us</CommandItem>
                                        <CommandItem className="w-full flex justify-between pr-12">Logout
                                            <LogOutIcon size={15} className="opacity-30" />
                                        </CommandItem>
                                    </CommandGroup>
                                    <CommandSeparator />
                                    <CommandGroup heading="Settings">
                                        <CommandItem className="w-full flex justify-between pr-12">Profile

                                            <UserIcon size={15} className="opacity-30" />

                                        </CommandItem>
                                        <CommandItem>Settings</CommandItem>
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <hr className="mt-5 h-[0.1px] bg-[#969696] " />
        </div>
    );
}

