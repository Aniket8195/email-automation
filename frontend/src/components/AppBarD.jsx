import { Link} from 'react-router-dom';
import { Avatar } from './Avatar';

export function AppBarD() {
    //const navigate = useNavigate();
    // const handleAutoMailClick = () => {
    //     const userId = localStorage.getItem('userId');
    //     const jwtToken = localStorage.getItem('jwtToken');
        
    //     if (userId && jwtToken) {
    //         navigate(`/dashboard?id=${userId}&token=${encodeURIComponent(jwtToken)}`);
    //     }
    // };
    // const handleLogout = () => {
    //     localStorage.removeItem('userId');
    //     localStorage.removeItem('jwtToken');
    //     navigate('/');
    // }
    return (
        <div className="border-b flex justify-between items-center px-10 py-4">
            <div>
                 {/* <div className="font-bold flex items-center px-8 py-2.5 cursor-pointer" onClick={handleAutoMailClick}>
                    AutoMail
                </div> */}
                <Link to={'/dashboard'}>
                    <div className="font-bold flex items-center px-8 py-2.5">
                        AutoMail
                    </div>
                </Link>
            </div>
            
            <div className="flex space-x-4">
                <Link to={'/schedule'}>
                    <button 
                        type="button" 
                        className="font-medium rounded-full text-sm px-8 py-2.5 mb-2"
                    >
                        Schedule Email
                    </button>
                </Link>
                
                {/* <Link to={'/followup'}>
                    <button 
                        type="button" 
                        className="font-medium rounded-full text-sm px-8 py-2.5 mb-2"
                    >
                        Follow Ups
                    </button>
                </Link> */}
                <Link to={'/scheduledEmails'}>
                    <button 
                        type="button" 
                        className="font-medium rounded-full text-sm px-8 py-2.5 mb-2"
                    >
                        Scheduled Emails
                    </button>
                </Link>
                <Link to={'/templates'}>
                    <button 
                        type="button" 
                        className="font-medium rounded-full text-sm px-8 py-2.5 mb-2"
                    >
                        Templates
                    </button>
                </Link>
            </div>
            
        <div >
            <div className='flex'>
            <Avatar name="A" size="small" />
            </div>
            <div className='cursor-pointer'>
                <p className="font-medium text-sm">Logout</p>
            </div>
        </div>
        </div>
    );
}
