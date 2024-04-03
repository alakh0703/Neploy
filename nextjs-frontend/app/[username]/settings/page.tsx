import DeleteDrawer from "@/app/_components/setttings/delete-drawer";
import GeneralSett from "@/app/_components/setttings/general-sett";
import { TabsDemo } from "@/app/_components/setttings/social-sett";
import { TypewriterEffectSmoothDemo } from "@/app/_components/typewriter-effect";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Neploy - Settings",
    description: "Settings page for neploy users. Change your account settings here.",
};
export default function Settings() {
    return (
        <div className="h-full w-full pl-[10%] pr-[10%] pt-5 md:pt-0">
            <TypewriterEffectSmoothDemo />
            <Tabs defaultValue="general" className="w-full dark">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>

                </TabsList>
                <TabsContent value="general">
                    <GeneralSett />
                </TabsContent>
                <TabsContent value="social" className="pb-[50px]">
                    <TabsDemo />
                </TabsContent>
                <TabsContent value="other">
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Delete your Account</CardTitle>
                            <CardDescription>Think twice! because you cannot recover it again.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-6 pb-6">
                            <DeleteDrawer />
                        </CardContent>

                    </Card>
                </TabsContent>
            </Tabs>

        </div>
    );
}
