import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import cn from 'classnames';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../servises/MarvelService';

import './charList.scss';

const CharList = (props) => {
  let navigate = useNavigate();
  const offsetChar = localStorage.getItem('offsetChar')
    ? localStorage.getItem('offsetChar')
    : localStorage.setItem('offsetChar', 510);

  const [chars, setChars] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [offset, setOffset] = useState(offsetChar);
  const [total, setTotal] = useState();
  const [charEnded, setCharEnded] = useState(false);
  const [charStarted, setCharStarted] = useState(false);

  const { loading, error, getMaxCharacters, getAllCharacters } =
    useMarvelService();

  const onMaxCharacters = (max) => {
    setTotal(max);
  };

  useEffect(() => {
    getMaxCharacters().then(onMaxCharacters);
  }, []);

  useEffect(() => {
    onRequest(offset);
  }, [offset]);

  const onRequest = (newOffset) => {
    setBtnDisabled(true);

    if (total - newOffset < 9 && total - newOffset > 0) {
      newOffset = total - 9;
    } else if (newOffset < 0) {
      newOffset = 0;
    }
    setOffset(newOffset);
    localStorage.setItem('offsetChar', newOffset);
    getAllCharacters(newOffset)
      .then(onCharsListLoaded)
      .catch((err) => (err ? navigate('/404', { replace: true }) : null));
  };

  const onCharsListLoaded = (newChars) => {
    let ended = false;
    let started = false;
    if (total - offset === 9) {
      ended = true;
    } else if (offset <= 0) {
      started = true;
    }

    setChars([...newChars]);
    setBtnDisabled(false);
    setCharStarted(started);
    setCharEnded(ended);
  };

  let itemRefs = useRef([]);

  const focusOnItem = (id) => {
    if (itemRefs.current.length > 0 && itemRefs.current[0] !== null) {
      itemRefs.current.forEach((item) => {
        item.classList.remove('char__item_selected');
      });
      itemRefs.current[id].classList.add('char__item_selected');
      itemRefs.current[id].focus();
    }
  };

  function renderItems(items) {
    const elements = items.map((item, i) => {
      const styleImg = item.thumbnail.indexOf('not_available') !== -1;
      return (
        <CSSTransition key={item.id} timeout={500} classNames='char__item'>
          <li
            className='char__item'
            key={item.id}
            tabIndex={0}
            ref={(el) => (itemRefs.current[i] = el)}
            onClick={() => {
              props.onCharSelected(item.id);
              focusOnItem(i);
            }}
            onKeyPress={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                props.onCharSelected(item.id);
                focusOnItem(i);
              }
            }}
          >
            <img
              src={
                !styleImg
                  ? item.thumbnail
                  : 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_xlarge.jpg'
              }
              alt={item.name}
              className={cn('char__item-img', { char__item_fit: styleImg })}
            />
            <div className='char__name'>{item.name}</div>
          </li>
        </CSSTransition>
      );
    });
    return (
      <ul className='char__grid'>
        <TransitionGroup component={null}>{elements}</TransitionGroup>
      </ul>
    );
  }

  const items = renderItems(chars);

  const spinner = loading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;
  const content = !(loading || error) ? items : null;

  return (
    <div className='char__list'>
      <Helmet>
        <meta name='description' content='Page with list of our charscters' />
        <title>Characters page</title>
      </Helmet>
      {spinner}
      {errorMessage}
      {content}
      <div className='char__list-btns'>
        <button
          disabled={btnDisabled}
          className='button button__main'
          style={{ visibility: charStarted ? 'hidden' : 'visible' }}
          onClick={() => setOffset(0)}
        >
          <div className='inner'>Home</div>
        </button>
        <button
          disabled={btnDisabled}
          className='button button__main'
          style={{ visibility: charStarted ? 'hidden' : 'visible' }}
          onClick={() => setOffset(+offset - 9)}
        >
          <div className='inner'>load prev</div>
        </button>
        <button
          disabled={btnDisabled}
          className='button button__secondary'
          style={{ visibility: charEnded ? 'hidden' : 'visible' }}
          onClick={() => setOffset(+offset + 9)}
        >
          <div className='inner'>load next</div>
        </button>
        <button
          disabled={btnDisabled}
          className='button button__secondary'
          style={{ visibility: charEnded ? 'hidden' : 'visible' }}
          onClick={() => setOffset(total - 9)}
        >
          <div className='inner'>End</div>
        </button>
      </div>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
