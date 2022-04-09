import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../servises/MarvelService';
import cn from 'classnames';
import mjolnir from '../../resources/img/mjolnir.png';

import './randomChar.scss';

const RandomChar = () => {
  const [char, setChar] = useState(null);
  const [loadChar, setLoad] = useState(false);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
    // const timerId = setInterval(updateChar, 10000);

    // return () => {
    //   clearInterval(timerId);
    // };
  }, []);

  const onCharLoaded = (char) => {
    setChar(char);
    setLoad(true);
  };

  const updateChar = () => {
    clearError();
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    getCharacter(id).then(onCharLoaded);
  };

  const newRandomChar = () => {
    updateChar();
    setLoad(false);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <CSSTransition in={loadChar} timeout={300} classNames='randomchar'>
      <div className='randomchar'>
        {errorMessage}
        {spinner}
        {content}
        <div className='randomchar__static'>
          <p className='randomchar__title'>
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className='randomchar__title'>Or choose another one</p>
          <button onClick={newRandomChar} className='button button__main'>
            <div className='inner'>try it</div>
          </button>
          <img src={mjolnir} alt='mjolnir' className='randomchar__decoration' />
        </div>
      </div>
    </CSSTransition>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  const styleImg = thumbnail.indexOf('not_available') !== -1;
  return (
    <div className='randomchar__block'>
      <Link to={`/characters/${char.id}`}>
        <img
          src={
            !styleImg
              ? thumbnail
              : 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_xlarge.jpg'
          }
          alt='Random character'
          className={cn('randomchar__img', { randomchar__fit: styleImg })}
        />
      </Link>
      <div className='randomchar__info'>
        <p className='randomchar__name'>
          {name.length > 22 ? `${name.slice(0, 22)}...` : name}
        </p>
        <p className='randomchar__descr'>
          {description
            ? `${description.slice(0, 210)}...`
            : 'This is unknow character. It has not description'}
        </p>
        <div className='randomchar__btns'>
          <a
            href={homepage}
            target='_blank'
            rel='noreferrer'
            className='button button__main'
          >
            <div className='inner'>homepage</div>
          </a>
          <a
            href={wiki}
            target='_blank'
            rel='noreferrer'
            className='button button__secondary'
          >
            <div className='inner'>Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};
export default RandomChar;
