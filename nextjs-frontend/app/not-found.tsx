import { Button } from "@/components/ui/button";
import { GlobeDemo } from "./_components/error-github-globe";

export default function Custom404() {
    const go2Home = () => {
        window.location.href = "/"
    }

    return <div className="text-white" >
        <h1 className="text-center pt-4 text-2xl">ERROR 404</h1>
        <p className="text-center">Oops! You are at wrong place.</p>
        <GlobeDemo />
    </div>
}