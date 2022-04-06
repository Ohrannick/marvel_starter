// import img from './error.gif';
import img from './error_404.png';

const ErrorMessage = () => {
  return (
    <img
      style={{
        display: 'block',
        width: '250px',
        height: '250px',
        objectFit: 'contain',
        margin: '0 auto',
      }}
      src={img}
      alt='Error message'
    />
  );
};

export default ErrorMessage;
