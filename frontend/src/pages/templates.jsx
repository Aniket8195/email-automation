import { AppBarD } from "../components/AppBarD";
import { Link } from "react-router-dom";
import { useFetchTemplates } from "../hooks/index";
import { useEffect } from "react";
import {HashLoader} from 'react-spinners'
import { templateCard } from "../components/templateCard";
export const Templates = () => {
    const { templates, loading } = useFetchTemplates();

    useEffect(() => {
      console.log("Fetched templates:", templates);
    }, [templates]);
  
    if (loading) {
      return <div className="flex justify-center items-center">
      <HashLoader color={"#2563EB"} loading={loading} size={50} />
  </div>
    }
    return (
        <div>
            <div>
                {AppBarD()}
            </div>
            <div className="flex justify-between items-center px-4 py-4">
                <h1 className="text-3xl font-bold flex-grow text-center">Your Templates</h1>
                <Link to="/createTemplate">
                <div className=" flex justify-end ">
                    <button className="bg-black hover:bg-slate-700 text-white font-bold py-2 px-4 rounded">
                        Create New Template
                    </button>
                </div>
                </Link>
            </div>
            <div className="flex justify-center">
               <div>
                {templates.map((template) => (templateCard(template)))}
                
               </div>
            </div>
        </div>
    );
}