import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neploy - Deploy your projects with ease",
  description: "App to deploy your react projects on the web with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-[#181a1c] ")} >

        {children}
        <Toaster />

      </body>
    </html>
  );
}
