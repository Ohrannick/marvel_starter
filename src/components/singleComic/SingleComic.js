import { Link } from 'react-router-dom';
import './singleComic.scss';

const SingleComic = ({ comic }) => {
  const { title, thumbnail, price, description, pageCount, language } = comic;
  return (
    <div className='comic'>
      <div className='single-comic'>
        <img src={thumbnail} alt={title} className='single-comic__img' />
        <div className='single-comic__info'>
          <h2 className='single-comic__name'>{title}</h2>
          <p className='single-comic__descr'>{description}</p>
          <p className='single-comic__descr'>{pageCount}</p>
          <p className='single-comic__descr'>{language}</p>
          <div className='single-comic__price'>{price}</div>
        </div>
        <Link to='/comics' className='single-comic__back'>
          Back to all
        </Link>
      </div>
    </div>
  );
};

export default SingleComic;
