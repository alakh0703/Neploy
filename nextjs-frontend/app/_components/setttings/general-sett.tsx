"use client"
import useUserStore from "@/Stores/user.zustand";
import { auth, storage } from "@/auth/firebase";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { toast } from "sonner";

export default function GeneralSett() {
    const { user, setUser }: any = useUserStore()
    const [loading, setLoading] = useState(false)

    const updateUserAvatar = (downloadUrl: any) => {
        return new Promise((resolve, reject) => {

            const user = auth.currentUser;
            if (user) {

                updateProfile(user, {
                    photoURL: downloadUrl
                }).then(() => {
                    resolve("Avatar updated successfully.");

                }).catch((error) => {

                    reject(error);
                });
            } else {
                reject(new Error("User not authenticated"));
            }
        });
    }
    const selectImage = () => {
        return new Promise((resolve, reject) => {

            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (event: Event) => {
                const file = (event.target as HTMLInputElement)?.files?.[0]
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error("No file selected"));
                }
            };
            input.click();
        });
    }

    const uploadImageToStorage = (file: any) => {
        return new Promise((resolve, reject) => {

            const reference = ref(storage, `avatar/${file.name}`)

            uploadBytes(reference, file)
                .then(snapshot => {
                    return getDownloadURL(snapshot.ref)
                })
                .then(downloadURL => {
                    resolve(downloadURL);
                    console.log('Download URL', downloadURL)
                })

        });
    }
    const changeAvatar = async () => {
        try {
            const file = await selectImage();

            setLoading(true);
            const downloadUrl = await uploadImageToStorage(file);
            await updateUserAvatar(downloadUrl);

            setUser({ ...user, photoUrl: downloadUrl });

            console.log(user)
            setLoading(false);
            toast.success("Avatar changed successfully.");

        } catch (error) {
            setLoading(false);
            toast.error("Error while changing avatar.");
        }
    }
    return (
        <div className="flex flex-wrap pt-6 pb-12">
            <Card className="w-full md:w-fit mr-10 h-fit">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>

                    <CardDescription>Click on avatar to choose a new avatar.</CardDescription>

                </CardHeader>
                <CardContent className="pl-6 pb-6 w-full justify-center items-center">
                    <div onClick={changeAvatar} className="flex justify-center items-center rounded-full bg-white h-[150px] w-[150px] overflow-hidden cursor-pointer">
                        {loading ?
                            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />

                            : <img src={user?.photoUrl} alt="avatar" className="w-full h-full" />}
                    </div>
                    <div>
                        <p className="text-2xl mt-6">{user.name}</p>
                        <p className="text-[#9f9d9d]">{user.email}</p>

                    </div>
                </CardContent>

            </Card>

        </div>
    );
}

