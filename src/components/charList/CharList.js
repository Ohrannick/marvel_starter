import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import cn from 'classnames';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../servises/MarvelService';

import './charList.scss';

const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [offset, setOffset] = useState(210);
  const [total, setTotal] = useState(0);
  const [charEnded, setCharEnded] = useState(false);
  const [charStarted, setCharStarted] = useState(false);

  const marvelService = new MarvelService();

  const onMaxCharacters = (max) => {
    setTotal(max);
  };

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  marvelService.getMaxCharacters().then(onMaxCharacters).catch(onError);

  useEffect(() => {
    console.log('effect', offset);
    onRequest(offset);
  }, [offset]);

  const onRequest = (newOffset) => {
    onCharsListLoading();

    if (total - newOffset < 9 && total - newOffset > 0) {
      newOffset = total - 9;
    } else if (newOffset < 0) {
      newOffset = 0;
    }
    setOffset(newOffset);

    console.log('onRequest', newOffset, offset);
    marvelService
      .getAllCharacters(newOffset)
      .then(onCharsListLoaded)
      // .then((itemRefs = [])) // Обнуление массива с Ref после обновления страницы
      .catch(onError);
  };

  const onCharsListLoading = () => {
    setBtnDisabled((btnDisabled) => true);
  };

  const onCharsListLoaded = (newChars) => {
    // debugger;
    let ended = false;
    let started = false;
    console.log('1', started, ended, offset);
    if (total - offset === 9) {
      ended = true;
    } else if (offset <= 0) {
      started = true;
    }
    console.log('2', started, ended, offset);

    setChars((chars) => [...newChars]);
    setLoading((loading) => false);
    setBtnDisabled((btnDisabled) => false);
    setCharStarted(started);
    setCharEnded(ended);
    console.log('3', charStarted, charEnded, offset);
  };

  let itemRefs = useRef([]);

  // setRef = (ref) => {
  //   if (ref !== null) {
  //     this.itemRefs.push(ref);
  //   }
  // };

  const focusOnItem = (id) => {
    // Я реализовал вариант чуть сложнее, и с классом и с фокусом
    // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
    // На самом деле, решение с css-классом можно сделать, вынеся персонажа
    // в отдельный компонент. Но кода будет больше, появится новое состояние
    // и не факт, что мы выиграем по оптимизации за счет большего кол-ва элементов
    // По возможности, не злоупотребляйте рефами, только в крайних случаях
    if (itemRefs.current.length > 0) {
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
            src={item.thumbnail}
            alt={item.name}
            className={cn('char__item-img', { contain: styleImg })}
          />
          <div className='char__name'>{item.name}</div>
        </li>
      );
    });
    return <ul className='char__grid'>{elements}</ul>;
  }

  const items = renderItems(chars);

  const spinner = loading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;
  const content = !(loading || error) ? items : null;

  return (
    <div className='char__list'>
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
          onClick={() => setOffset(offset - 9)}
        >
          <div className='inner'>load prev</div>
        </button>
        <button
          disabled={btnDisabled}
          className='button button__secondary'
          style={{ visibility: charEnded ? 'hidden' : 'visible' }}
          onClick={() => setOffset(offset + 9)}
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
