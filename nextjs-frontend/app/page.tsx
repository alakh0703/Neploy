import { Button } from "@/components/ui/button";
import { StickyScrollRevealDemo } from "./_components/landing-page-ssr";
import { TypewriterEffectSmoothDemo } from "./_components/landing-page-typewriter";
import Logo from "@/public/logo-white.png"
import { Caveat } from "next/font/google";

import Image from "next/image";
import { cn } from "@/utills/cb";
import { AnimatedTooltipPreview } from "./_components/landing-page-at";
import Link from "next/link";
const inter = Caveat({ subsets: ["latin"] });

export default function Home() {

  return (
    <div className="h-full text-white">
      <div className="w-full flex justify-between pr-12 pl-12 pt-6">
        <div className="flex">
          <Image src={Logo} alt="logo" className="w-[50px] h-[50px]" />

          <h1 className={cn(inter.className, "text-4xl ml-3 cursor-pointer")}>Neploy</h1>

        </div>
        <Link href="/login">
          <Button className="bg-[#f1841d] dark:bg-blue-500 text-white mt-2">Get Started for FREE</Button>
        </Link>
      </div>
      <p className="block md:hidden text-center mt-12 text-3xl text-[#676363]">Deploy with just one click</p>
      <TypewriterEffectSmoothDemo />
      <hr className="bg-[#514f4f] h-[1px] w-full mt-20 hidden md:block" />

      <StickyScrollRevealDemo />
    </div>
  );
}
