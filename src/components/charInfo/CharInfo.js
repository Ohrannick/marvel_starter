import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import cn from 'classnames';
import MarvelService from '../../servises/MarvelService';

import './charInfo.scss';

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
    started: 0,
    ended: 0,
    prev: false,
    next: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  onCharLoaded = (char) => {
    this.setState({ char, loading: false, ended: char.comics.length });
    if (this.state.ended - this.state.started > 10) {
      this.setState({ next: true });
    }
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onCharLoading = () => {
    this.setState({ loading: true, started: 0, next: false, prev: false });
  };

  onListUpdate = (newStart) => {
    this.setState({ started: newStart });
    const { ended, next, prev } = this.state;

    if (ended - newStart > 10 && next) {
      this.setState({ next: true });
    } else if (ended - newStart <= 10 && next) {
      this.setState({ next: false, prev: true });
    } else if (ended - newStart > 10 && prev) {
      this.setState({ next: true, prev: false });
    }
  };

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return;
    }
    this.onCharLoading();
    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  render() {
    const { char, loading, error, ...otherItems } = this.state;

    const skeleton = char || loading || error ? null : <Skeleton />;
    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || error || !char) ? (
      <View
        char={char}
        otherItems={otherItems}
        onListUpdate={this.onListUpdate}
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
  }
}

const View = ({ char, otherItems, onListUpdate }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  let { prev, next, started } = otherItems;
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
            <a href={homepage} className='button button__main'>
              <div className='inner'>homepage</div>
            </a>
            <a href={wiki} className='button button__secondary'>
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
        <div className='char__info-btns'>
          {!prev ? null : (
            <button
              className='button button__main'
              onClick={() => onListUpdate(started - 10)}
            >
              <div className='inner'>load prev</div>
            </button>
          )}
          {!next ? null : (
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

export default CharInfo;
