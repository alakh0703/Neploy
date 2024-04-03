"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import client from "@/utills/apollo-client";
import { gql, useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ZodError, z } from "zod";

const ADD_FEEDBACK_MUTATION = gql`
mutation addFeedback($userName: String!, $userEmail: String!, $issueType: String!, $feedbackMessage: String!){
    addFeedback(userName: $userName, userEmail: $userEmail, issueType: $issueType, feedbackMessage: $feedbackMessage) {
      feedbackId
      issueType
      userName
      userEmail
      feedbackMessage
    }
  }
`

const VALUES = ["Suggestions", "Report an issue", "Other"] as const;

const FeedbackSchema = z.object({
    userName: z.string(),
    userEmail: z.string().endsWith("@gmail.com"),
    issueType: z.enum(VALUES),
    feedbackMessage: z.string()
});

export default function ContactUs() {
    const [add_feedback] = useMutation(ADD_FEEDBACK_MUTATION, { client })
    const [issue, setIssue] = useState("")
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const messageRef = useRef<HTMLTextAreaElement>(null)

    const addFeedback = () => {
        const userName = nameRef.current?.value as string;
        const userEmail = emailRef.current?.value as string;
        const feedbackMessage = messageRef.current?.value as string;


        try {
            // Validate user input using Zod
            FeedbackSchema.parse({
                userName: userName,
                userEmail: userEmail,
                issueType: issue,
                feedbackMessage: feedbackMessage
            });

            // If validation passes, proceed with adding feedback
            if (feedbackMessage.length > 500) {
                toast.error("Feedback message should not exceed 500 characters");
                return;
            }
            add_feedback({
                variables: {
                    userName: userName,
                    userEmail: userEmail,
                    issueType: issue,
                    feedbackMessage: feedbackMessage
                }
            });

            // Clear form fields and show success message
            setIssue("");
            if (nameRef.current) nameRef.current.value = "";
            if (emailRef.current) emailRef.current.value = "";
            if (messageRef.current) messageRef.current.value = "";

            toast.success("Feedback Sent Successfully", {
                description: "We will get back to you soon"
            });
        } catch (error) {
            if (error instanceof ZodError) {
                const errorCount = error.errors.length;
                console.log(error)
                if (errorCount === 1) {
                    const errorMessage = error.errors.map(err => err.message).join("\n");
                    if (error.errors[0].code === 'invalid_enum_value') {
                        toast.error("Please select a valid issue type");
                    }
                    else {
                        toast.error(errorMessage);
                    }

                } else {
                    toast.error("Please fill all the fields")
                }
            } else {
                // Handle other types of errors
                console.error("An unexpected error occurred:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    }

    const handleChange = (e: any) => {
        setIssue(e)
    }

    return (
        <div className="w-full flex justify-center">
            <div className="w-[80%] md:w-[60%] pt-12">
                <h1 className="text-2xl font-bold font-sans">Contact Us</h1>
                <p className="text-sm text-[#b3b1b1] font-mono mb-6">Feel free to contact!</p>
                <Input placeholder="Your Name" className="dark mb-6" ref={nameRef} />
                <Input placeholder="Email" className="dark mb-6" ref={emailRef} />

                <Select onValueChange={handleChange}>
                    <SelectTrigger className="w-[180px] dark">
                        <SelectValue placeholder="Select a Reason" />
                    </SelectTrigger>
                    <SelectContent className="dark">
                        <SelectGroup className="dark" >
                            <SelectItem value="Suggestions">Suggestions</SelectItem>
                            <SelectItem value="Report an issue">Report an issue</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>

                        </SelectGroup>
                    </SelectContent>

                </Select>

                <Textarea placeholder="Type your message here." className="dark mt-6 mb-6" ref={messageRef} />
                <Button className="dark" onClick={addFeedback}>Send the Message</Button>
            </div>
        </div>
    );
}
