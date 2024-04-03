import useProjectStore from "@/Stores/project.zustand"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"

export function Analytics() {
    const { project }: any = useProjectStore()
    const [loader, setLoader] = useState(false)
    const [showImage, setShowImage] = useState(false)
    let image = ""
    const fetchAnalysis = async () => {
        try {
            setLoader(true)
            const url0 = project.url;
            const url = url0.split("/").join("")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_ANALYTIC_BACKEND_URI}/analytic/${url}`)
            image = res.data.image;

            localStorage.setItem('image', image);
            const imgTag: any = document.getElementById('analyticsImage');

            if (imgTag) imgTag.src = `data:image/png;base64, ${image}`;
            setLoader(false)
            setShowImage(true)
        } catch (e) {
            console.log(e)
            setLoader(false)
        }

    }



    return <div>
        <div className="w-full flex justify-between h-[100px] items-center">
            <div className="text-4xl pl-12">
                Analytics
            </div>

        </div>
        <hr className="opacity-20" />
        <div className="mt-4">
            <Button variant={loader ? "outline" : "default"} onClick={fetchAnalysis}>
                {loader ? "Loading..." : "Fetch Analytics"}
            </Button>
            {showImage && <img src={image} alt="analytics" id="analyticsImage" className="rounded-lg mt-5" />}
        </div>

    </div>
}