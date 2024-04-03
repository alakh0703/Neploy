"use client";
import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
const people = [
    {
        id: 1,
        name: "John Doe",
        designation: "Software Engineer",
        image:
            "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmedia.licdn.com%2Fdms%2Fimage%2FD5603AQFiQnMnw-LjmQ%2Fprofile-displayphoto-shrink_200_200%2F0%2F1697841734439%3Fe%3D2147483647%26v%3Dbeta%26t%3DjeVh52t_JoSWBKuazxlb6kgoDLDDKAPxCcgD_vXp4RQ&tbnid=ESHfmCfw-CQQbM&vet=12ahUKEwjK0NKEuqCFAxXfFGIAHciQDYQQMygZegUIARCFAQ..i&imgrefurl=https%3A%2F%2Fwww.linkedin.com%2Fpub%2Fdir%2FDhrumit%2FPatel&docid=0WImGo5MnwznOM&w=200&h=200&q=dhrumit%20patel&ved=2ahUKEwjK0NKEuqCFAxXfFGIAHciQDYQQMygZegUIARCFAQ",
    },

];

export function AnimatedTooltipPreview() {
    return (
        <div className="flex flex-row items-center justify-center mb-10 w-full">
            <AnimatedTooltip items={people} />
        </div>
    );
}
