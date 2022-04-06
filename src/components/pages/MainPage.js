import { useState } from 'react';

import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import CharFind from '../charFind/CharFind';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
  const idChar = localStorage.getItem('idChar')
    ? localStorage.getItem('idChar')
    : localStorage.setItem('idChar', null);

  const [selectedChar, setChar] = useState(idChar);

  const onCharSelected = (id) => {
    setChar(() => id);
    localStorage.setItem('idChar', id);
  };

  return (
    <>
      <ErrorBoundary>
        <RandomChar />
      </ErrorBoundary>
      <div className='char__content'>
        <ErrorBoundary>
          <CharList onCharSelected={onCharSelected} />
        </ErrorBoundary>
        <div className='char__search'>
          <ErrorBoundary>
            <CharInfo charId={Number(selectedChar)} />
          </ErrorBoundary>
          <ErrorBoundary>
            <CharFind />
          </ErrorBoundary>
        </div>
      </div>
      <img className='bg-decoration' src={decoration} alt='vision' />
    </>
  );
};

export default MainPage;
