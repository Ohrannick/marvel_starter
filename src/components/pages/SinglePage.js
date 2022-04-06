import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useMarvelService from '../../servises/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = ({ Component, dataType }) => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { loading, error, getComic, getCharacter, clearError } =
    useMarvelService();

  useEffect(() => {
    updateData();
  }, [id]);

  const updateData = () => {
    clearError();

    switch (dataType) {
      case 'comic':
        getComic(id)
          .then(onDataLoaded)
          .catch((err) => (err ? navigate('/404', { replace: true }) : null));
        break;
      case 'character':
        getCharacter(id)
          .then(onDataLoaded)
          .catch((err) => (err ? navigate('/404', { replace: true }) : null));
    }
  };

  const onDataLoaded = (data) => {
    setData(data);
  };

  const spinner = loading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;
  const content = !(loading || error || !data) ? (
    <Component data={data} />
  ) : null;

  return (
    <>
      <AppBanner />
      {spinner}
      {errorMessage}
      {content}
    </>
  );
};

export default SinglePage;
