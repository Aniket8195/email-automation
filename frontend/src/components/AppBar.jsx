import  MyButton  from "./button"
import  {Link} from "react-router-dom"



export const appBar = () => {
    return <div>
        <div className="border-b flex justify-between px-10 py-4">
            <div className="font-bold flex flex-col justify-center px-8 py-2.5">
               AutoMail
            </div>
            <div>
                <Link to={'/login'}>
                <MyButton>
                  Login
              </MyButton>
                </Link>
            </div>
        </div>
    </div>
}