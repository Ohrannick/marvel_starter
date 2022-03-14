class MarvelService {
  // _apiKey = '&apikey=e25937beab56ee26015e638b17075a47';  // ohrannick
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = '&apikey=26e38d3e895ad27450942c501bc43854'; // ohrannick.pupkin
  _baseOffset = 210;

  getResourse = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Coud not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getMaxCharacters = async () => {
    const res = await this.getResourse(
      `${this._apiBase}characters?${this._apiKey}`
    );
    return res.data.total;
  };

  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResourse(
      `${this._apiBase}characters?limit=9&offset=${offset}${this._apiKey}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const res = await this.getResourse(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacter = (char) => {
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
}

export default MarvelService;
