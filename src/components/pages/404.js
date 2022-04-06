import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../errorMessage/ErrorMessage';

const Page404 = () => {
  const navigate = useNavigate();
  const goBack = navigate(-1);

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '48px' }}>
        Sorry...
      </h1>
      <ErrorMessage />
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
        Page doesn't exist
      </p>
      <Link
        style={{
          display: 'block',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '24px',
          marginTop: '30px',
          color: 'orange',
        }}
        to='/characters'
      >
        Back to main page
      </Link>
    </div>
  );
};

export default Page404;
