import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { CheckCircleIcon, FileWarningIcon } from "lucide-react";

interface Notification {
    notificationId: string;
    userId: string;
    notificationType: boolean;
    notificationMessage: string;
    notificationDate: string;
    notificationProjectName: string;

}
interface NotificationIndProps {
    notification: Notification

}

export default function NotificationInd({ notification }: NotificationIndProps) {
    const getFormatedDate = (date: string) => {
        let dateCreated;
        try {
            dateCreated = parseISO(date);
        } catch (error) {
            console.error("Error parsing date:", error);
            return <div>Error parsing date</div>;
        }

        // Check if the parsed date is valid
        if (!isValid(dateCreated)) {
            console.error("Invalid date:", date);
            return <div>Invalid date</div>;
        }

        // Format the date using formatDistanceToNow function
        const formattedDate = formatDistanceToNow(dateCreated, { addSuffix: true });
        return formattedDate
    }

    return (
        <div className="w-full h-[90px]">
            <div className="flex justify-between w-full h-full items-center pt-2">
                <div className="flex">
                    <div className="flex items-center">
                        {notification?.notificationType ? <CheckCircleIcon size={20} className="mr-3" /> : <FileWarningIcon size={20} className="mr-3" />}
                    </div>
                    <div>
                        <p className="text-sm">{notification?.notificationMessage}</p>
                        <p className="text-xs text-gray-500">{getFormatedDate(notification?.notificationDate)}</p>
                        <p className="text-xs text-gray-500 mt-1">@{notification?.notificationProjectName}</p>
                    </div>
                </div>

            </div>
            <hr className="w-full mt-2" />

        </div>
    );
}

