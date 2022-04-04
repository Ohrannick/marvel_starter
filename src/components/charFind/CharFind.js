import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../servises/MarvelService';

import './charFind.scss';
import { Link } from 'react-router-dom';

const CharFind = (props) => {
  const [char, setChar] = useState(null);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, []);

  const onCharLoaded = (charNew) => {
    setChar(() => charNew);
  };

  const updateChar = () => {
    const { charId } = props;
    if (charId === 'null') {
      return;
    }

    clearError();
    getCharacter(charId).then(onCharLoaded);
  };

  return (
    <div className='charfind'>
      <h2 className='charfind__title'>Or find a character by name:</h2>
      <div className='charfind__block'>
        <input
          type='text'
          className='charfind__block-input'
          placeholder='Enter name'
        />
        <button className='button button__main'>
          <div className='inner'>Find</div>
        </button>
      </div>
      <div className='charfind__error'></div>
    </div>
  );
};

CharFind.propTypes = {
  charId: PropTypes.number,
};

export default CharFind;
