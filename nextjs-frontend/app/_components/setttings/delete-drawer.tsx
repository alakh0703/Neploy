"use client";
import useUserStore from "@/Stores/user.zustand";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import client from "@/utills/apollo-client";

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const DELETE_USER_MUTATION = gql`mutation deleteUser($userId: String!) {
    deleteUserById(userId: $userId)
  }`
export default function DeleteDrawer() {
    const [delete_user_by_id] = useMutation(DELETE_USER_MUTATION, { client })
    const { user }: any = useUserStore()
    const [loader, setLoader] = useState(false)
    const deleteMyAccount = async () => {
        const userId = user?.uid;
        if (!userId) return;
        const res = await delete_user_by_id({ variables: { userId: userId } })
        console.log(res)
        if (res.data.deleteUserById) {
            alert("Account Deleted!")
            window.location.href = "/logout"

        }

    }

    return (
        <Drawer >
            <DrawerTrigger className="dark">
                <Button variant="destructive">Delete My Account</Button>
            </DrawerTrigger>
            <DrawerContent className="dark">
                <DrawerHeader className="text-white">
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    {loader ? <Button variant="outline">Deleting ...</Button>
                        : <Button onClick={deleteMyAccount}>Yes, I&apos;m sure.</Button>}
                    <DrawerClose>
                        <Button variant="outline" className="text-white">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    );
}

