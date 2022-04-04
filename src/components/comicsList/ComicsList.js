import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../servises/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
  const offsetCimic = localStorage.getItem('offsetComic')
    ? localStorage.getItem('offsetComic')
    : localStorage.setItem('offsetComic', 210);

  const [comics, setComics] = useState([]);
  const [offset, setOffset] = useState(offsetCimic);
  const [newItemsLoading, setNewItemsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { loading, error, getAllComics, clearError } = useMarvelService();

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onScroll = () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      setNewItemsLoading(true);
    }
  };

  useEffect(() => {
    if (newItemsLoading) {
      onRequest();
    }
  }, [newItemsLoading]);

  const onRequest = () => {
    clearError();
    localStorage.setItem('offsetComic', +offset);
    getAllComics(offset).then(onComicsLoaded);
  };

  const onComicsLoaded = (newComics) => {
    setNewItemsLoading(false);

    setComics([...comics, ...newComics]);
    setOffset(+offset + 8);
    setIsEnd(newComics.length < 8 ? true : false);
  };

  function renderItems(items) {
    const elements = items.map((item, i) => {
      const styleImg = item.thumbnail.indexOf('not_available') !== -1;
      return (
        <CSSTransition
          key={item.id}
          timeout={500}
          classNames='comics__item'
          tabIndex={0}
        >
          <li className='comics__item'>
            <Link to={`/comics/${item.id}`}>
              <img
                src={
                  !styleImg
                    ? item.thumbnail
                    : 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_xlarge.jpg'
                }
                alt={item.title}
                className='comics__item-img'
              />
              <div className='comics__item-name'>{item.title}</div>
              <div className='comics__item-price'>{item.price}</div>
            </Link>
          </li>
        </CSSTransition>
      );
    });

    return (
      <ul className='comics__grid'>
        <TransitionGroup component={null}>{elements}</TransitionGroup>
      </ul>
    );
  }

  const items = renderItems(comics);

  const spinner = loading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;

  return (
    <div className='comics__list'>
      {errorMessage}
      {items}
      {spinner}
      <button
        className='button button__main button__long'
        disabled={newItemsLoading}
        style={{ display: isEnd ? 'none' : 'block' }}
        onClick={() => onRequest(+offset)}
      >
        <div className='inner'>load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
