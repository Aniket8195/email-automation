import PropTypes from 'prop-types';
// import useHistory from 'react-router-dom';
const MyButton = ({ children }) => {
  // const history = useHistory();

  const handleLogin = async () => {
    try {
      window.location.href = 'http://localhost:3000/auth/google';
      //  history.push('/dashboard');
    } catch (error) {
      console.error('Error during login', error);
    }
  };
  return (
    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    onClick={handleLogin}
    >
      {children}
      
    </button>
  );
};

MyButton.propTypes = {
  children: PropTypes.node.isRequired,
};


export default MyButton;
