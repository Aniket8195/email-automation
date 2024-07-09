import { appBar } from "../components/AppBar"
import TextTransition, { presets } from 'react-text-transition';
import { useEffect ,useState} from "react";
// import { MyCard } from "../components/Card";
const TEXTS = ["Schedule emails", "Automate your workflow", "Save time", "Increase productivity"];
export const Landing = () => {
  const [index, setIndex] = useState(0);  
  useEffect(() => {
        const intervalId = setInterval(() => {
            setIndex((index) => index + 1);
          }, 4000);
          return () => clearTimeout(intervalId);
    }, [])
    
    return <div>
          <div>
        {appBar()}
          </div>
          <div className="flex flex-col h-screen items-center pt-10">
          <h1 className="text-4xl font-bold mb-4">Automate Your Email Workflow</h1>
          <h1 className="font-semibold">
          <TextTransition
            springConfig={presets.wobbly}>{TEXTS[index % TEXTS.length]}</TextTransition>
          </h1>
          {/* <div className="flex flex-wrap justify-center mt-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="m-4">
              <MyCard />
            </div>
          ))}
        </div> */}
          </div>
    </div>
}