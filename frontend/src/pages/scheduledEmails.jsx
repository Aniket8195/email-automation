import { AppBarD } from "../components/AppBarD";
import { useFetchScheduledEmails } from "../hooks/index";
import { HashLoader } from 'react-spinners';

export const ScheduledEmails = () => {
    const { scheduledEmails, loading } = useFetchScheduledEmails();

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <HashLoader color={"#2563EB"} loading={loading} size={50} />
            </div>
        );
    }

    return (
        <div>
            <div>
                <AppBarD />
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold mt-10">Scheduled Emails</h1>
                <div className="mt-10 w-full max-w-3xl"> 
                    {scheduledEmails.map((email) => (
                        <div key={email.id} className="border p-4 my-4">
                            <div className="flex flex-col"> 
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold">{email.subject}</h2>
                                    <p className="text-sm">{email.body}</p>
                                </div>
                                <div className="mb-4">
                                    <p><strong>Send At:</strong> {email.sendAt}</p>
                                </div>
                                <div className="mb-4">
                                    <p><strong>Recipient:</strong> {email.recipient}</p>
                                </div>
                                <div>
                                    {email.status === 2 && <p><strong>Status:</strong> Sent</p>}
                                    {email.status === 1 && <p><strong>Status:</strong> Pending</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
