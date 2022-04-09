import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import './singleCharacter.scss';

const SingleCharacter = ({ data }) => {
  const { name, thumbnail, description } = data;
  const styleImg = thumbnail.indexOf('not_available') !== -1;
  return (
    <div className='char'>
      <Helmet>
        <meta name='description' content={`${name} character of comics`} />
        <title>{name}</title>
      </Helmet>
      <div className='single-char'>
        <img
          src={
            !styleImg
              ? thumbnail
              : 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_xlarge.jpg'
          }
          alt={name}
          className='single-char__img'
        />
        <div className='single-char__info'>
          <h2 className='single-char__name'>{name}</h2>
          <p className='single-char__descr'>
            {description
              ? description
              : 'This is unknow character. It has not description'}
          </p>
        </div>
        <Link to='/characters' className='single-char__back'>
          Back to all
        </Link>
      </div>
    </div>
  );
};

export default SingleCharacter;
