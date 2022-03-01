import { Component } from 'react';
import cn from 'classnames';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../servises/MarvelService';

import './charList.scss';
class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
    btnDisabled: false,
    offset: 210,
    total: 0,
    charEnded: false,
    charStarted: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.marvelService
      .getMaxCharacters()
      .then(this.onMaxCharacters)
      .catch(this.onError);

    this.marvelService
      .getAllCharacters(this.state.offset)
      .then(this.onCharsListLoaded)
      .catch(this.onError);
  }

  onMaxCharacters = (max) => {
    this.setState({ total: max });
  };

  onRequest = (newOffset) => {
    this.onCharsListLoading();

    if (this.state.total - newOffset < 9 && this.state.total - newOffset > 0) {
      newOffset = this.state.total - 9;
    } else if (newOffset < 0) {
      newOffset = 0;
    }

    this.setState({ offset: newOffset });
    this.marvelService
      .getAllCharacters(newOffset)
      .then(this.onCharsListLoaded)
      .catch(this.onError);
  };

  onCharsListLoading = () => {
    this.setState({
      btnDisabled: true,
    });
  };

  onCharsListLoaded = (newChars) => {
    let ended = false;
    let started = false;
    if (this.state.total - this.state.offset === 9) {
      ended = true;
    } else if (this.state.offset <= 0) {
      started = true;
    }

    this.setState({
      chars: [...newChars],
      loading: false,
      btnDisabled: false,
      charStarted: started,
      charEnded: ended,
    });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  renderItems = (items) => {
    const elements = items.map((item) => {
      const styleImg = item.thumbnail.indexOf('not_available') !== -1;
      return (
        <li
          className='char__item'
          key={item.id}
          onClick={() => this.props.onCharSelected(item.id)}
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
  };

  render() {
    const {
      chars,
      loading,
      error,
      offset,
      btnDisabled,
      charEnded,
      charStarted,
      total,
    } = this.state;

    const items = this.renderItems(chars);

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
            style={{ display: charStarted ? 'none' : 'block' }}
            onClick={() => this.onRequest(0)}
          >
            <div className='inner'>Home</div>
          </button>
          <button
            disabled={btnDisabled}
            className='button button__main'
            style={{ display: charStarted ? 'none' : 'block' }}
            onClick={() => this.onRequest(offset - 9)}
          >
            <div className='inner'>load prev</div>
          </button>
          <button
            disabled={btnDisabled}
            className='button button__secondary'
            style={{ display: charEnded ? 'none' : 'block' }}
            onClick={() => this.onRequest(offset + 9)}
          >
            <div className='inner'>load next</div>
          </button>
          <button
            disabled={btnDisabled}
            className='button button__secondary'
            style={{ display: charEnded ? 'none' : 'block' }}
            onClick={() => this.onRequest(total - 9)}
          >
            <div className='inner'>End</div>
          </button>
        </div>
      </div>
    );
  }
}

export default CharList;
