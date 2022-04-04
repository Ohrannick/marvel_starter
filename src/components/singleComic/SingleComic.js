import { Link } from 'react-router-dom';
import './singleComic.scss';

const SingleComic = ({ comic }) => {
  const { title, thumbnail, price, description, pageCount, language } = comic;
  const styleImg = thumbnail.indexOf('not_available') !== -1;
  return (
    <div className='comic'>
      <div className='single-comic'>
        <img
          src={
            !styleImg
              ? thumbnail
              : 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_xlarge.jpg'
          }
          alt={title}
          className='single-comic__img'
        />
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
