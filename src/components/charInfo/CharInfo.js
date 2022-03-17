import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../servises/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import cn from 'classnames';
import './charInfo.scss';

const CharInfo = (props) => {
  const [char, setChar] = useState(null);
  const [started, setStarted] = useState(0);
  const [ended, setEnded] = useState();
  const [prevBtn, setPrevBtn] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  const onCharLoaded = (charNew) => {
    setChar(() => charNew);
    setEnded(() => charNew.comics.length);
    if (charNew.comics.length - started > 10) {
      setNextBtn(true);
    }
  };

  const onListUpdate = (newStart) => {
    setStarted(() => newStart);

    if (ended - newStart > 10 && nextBtn) {
      setNextBtn(true);
    } else if (ended - newStart <= 10 && nextBtn) {
      setNextBtn(false);
      setPrevBtn(true);
    } else if (ended - newStart > 10 && prevBtn) {
      setNextBtn(true);
      setPrevBtn(false);
    }
  };

  const updateChar = () => {
    const { charId } = props;
    if (!charId) {
      return;
    }
    setStarted(0);
    setNextBtn(false);
    setPrevBtn(false);

    clearError();
    getCharacter(charId).then(onCharLoaded);
  };

  const skeleton = char || loading || error ? null : <Skeleton />;
  const spinner = loading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;
  const content = !(loading || error || !char) ? (
    <View
      char={char}
      prevBtn={prevBtn}
      nextBtn={nextBtn}
      started={started}
      onListUpdate={onListUpdate}
    />
  ) : null;

  return (
    <div className='char__info'>
      {skeleton}
      {spinner}
      {errorMessage}
      {content}
    </div>
  );
};

const View = ({ char, prevBtn, nextBtn, started, onListUpdate }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  const styleImg = thumbnail.indexOf('not_available') !== -1;

  return (
    <>
      <div className='char__basics'>
        <img
          src={thumbnail}
          alt={name}
          className={cn('char__basics-img', { contain: styleImg })}
        />
        <div>
          <div className='char__info-name'>{name}</div>
          <div className='char__btns'>
            <a href={homepage} target='_blank' className='button button__main'>
              <div className='inner'>homepage</div>
            </a>
            <a href={wiki} target='_blank' className='button button__secondary'>
              <div className='inner'>Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className='char__descr'>
        {description
          ? description
          : 'This is unknow character. It has not description'}
      </div>
      <div className='char__comics'>Comics:</div>
      <ul className='char__comics-list'>
        {comics.slice(started, started + 10).length > 0
          ? null
          : 'There is no comics with this character'}
        {comics.slice(started, started + 10).map((item, i) => {
          return (
            <li key={i} className='char__comics-item'>
              {item.name}
            </li>
          );
        })}
      </ul>
      {
        <div
          className='char__info-btns'
          style={
            !prevBtn ? { justifyContent: 'end' } : { justifyContent: 'start' }
          }
        >
          {!prevBtn ? null : (
            <button
              className='button button__main'
              onClick={() => onListUpdate(started - 10)}
            >
              <div className='inner'>load prev</div>
            </button>
          )}
          {!nextBtn ? null : (
            <button
              className='button button__secondary'
              onClick={() => onListUpdate(started + 10)}
            >
              <div className='inner'>load next</div>
            </button>
          )}
        </div>
      }
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
