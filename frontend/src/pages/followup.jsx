import { AppBarD } from "../components/AppBarD";

export const FollowUp = () => {
    return (
        <div>
            <div>
                {AppBarD()}
            </div>
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-3xl font-bold">Follow Up</h1>
            </div>
        </div>
    );
}