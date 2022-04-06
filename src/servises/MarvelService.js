import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
  const { loading, error, request, clearError } = useHttp();

  const _apiKey = '&apikey=e25937beab56ee26015e638b17075a47'; // ohrannick
  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  // const _apiKey = '&apikey=26e38d3e895ad27450942c501bc43854'; // ohrannick.pupkin
  const _baseOffset = 210;

  const getMaxCharacters = async () => {
    const res = await request(`${_apiBase}characters?${_apiKey}`);
    return res.data.total;
  };

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getAllComics = async (offset = 0) => {
    const res = await request(
      `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}${_apiKey}`
    );
    return res.data.results.map(_transformComics);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getNameCharacter = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      price: comics.prices[0].price
        ? `${comics.prices[0].price}$`
        : 'not available',
      description: comics.description || 'There is no description',
      pageCount: comics.pageCount
        ? `${comics.pageCount} pages`
        : 'No information about the number of pages',
      language: comics.textObjects.language || 'en-us',
    };
  };

  return {
    loading,
    error,
    getMaxCharacters,
    getAllCharacters,
    getCharacter,
    getNameCharacter,
    clearError,
    getAllComics,
    getComic,
  };
};

export default useMarvelService;
