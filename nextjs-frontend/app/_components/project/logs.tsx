import useProjectStore from "@/Stores/project.zustand"
import { Button } from "@/components/ui/button"
import { RefreshCwIcon } from "lucide-react"
import axios from "axios"
import { useState } from "react"

export function Logs() {
    const { project }: any = useProjectStore()
    const logs0 = project?.builds || [
        {
            type: "reg",
            time: "20:10:20:400",
            message: "deployment started"
        },
        {
            type: "reg",
            time: "20:10:20:400",
            message: "deployment started"

        },
        {
            type: "reg",
            time: "20:10:20:400",
            message: "deployment started"
        }
    ]
    const [logs, setLogs] = useState(logs0)



    const fetchLogs = async () => {
        const build = project.builds[0]
        const buildId = build.buildId
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_SERVER}/logs/${buildId}`)
        const logs = res.data.logs;
        logs.reverse()

        setLogs(logs)
    }

    return <div>
        <div className="w-full flex justify-between h-[100px] items-center">
            <div className="text-4xl pl-12">
                Logs
            </div>
            <div className="pr-20">
                <Button variant="ghost">
                    <RefreshCwIcon onClick={fetchLogs} />
                </Button>
            </div>
        </div>
        <hr className="opacity-20" />
        <div className="bg-black mt-4">
            {
                logs.map((log: any, index: any) => {
                    return <div key={index} className="flex  text-white p-1 pl-2 italic">
                        <div className="mr-16 w-[100px]">{log.timestamp}</div>
                        <div>{log.log}</div>
                    </div>
                })
            }
        </div>
    </div>
}