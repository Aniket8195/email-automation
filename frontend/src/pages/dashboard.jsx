
import { useLocation} from 'react-router-dom';
import { useUser } from '../hooks';
import { AppBarD } from '../components/AppBarD';
import {HashLoader} from 'react-spinners'
export const Dashboard = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = query.get('id');
    const jwt = query.get('token');

    if (jwt && id) {
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('id', id);
    }

    const { user, loading } = useUser({ id });
    if (loading) {
        return <div className='flex justify-center items-center'>
            <HashLoader color={"#2563EB"} loading={loading} size={50} />
        </div>
    }
    if (!user) {
        return <h1>User not found</h1>;
    }
  return (
   <div>
    <div>
        {AppBarD()}
    </div>
   </div>
  );
};
