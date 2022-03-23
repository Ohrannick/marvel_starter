import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMarvelService from '../../servises/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import SingleComic from '../singleComic/SingleComic';

const SingleComicPage = () => {
  const { comicId } = useParams();
  console.log(comicId);
  const [comic, setComic] = useState(null);
  const { loading, error, getComic, clearError } = useMarvelService();

  useEffect(() => {
    updateComic();
  }, [comicId]);

  const updateComic = () => {
    clearError();
    getComic(comicId).then(onComicLoaded);
  };

  const onComicLoaded = (comic) => {
    setComic(comic);
  };

  const spinner = loading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;
  const content = !(loading || error || !comic) ? (
    <SingleComic comic={comic} />
  ) : null;

  return (
    <>
      {spinner}
      {errorMessage}
      {content}
    </>
  );
};

export default SingleComicPage;
