export class CharacterModel {
  constructor() {
    this.apiUrl = 'https://api.disneyapi.dev/character';
    this.defaultImageUrl = 'images/background4.png';
    this.favorites = [];
  }

  async searchCharacters(query) {
    const response = await fetch(`${this.apiUrl}?name=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Erreur : ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  }

  loadFavorites() {
    this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  }

  addFavorite(characterName) {
    const nameLower = characterName.toLowerCase();
    if (!this.favorites.includes(nameLower)) {
      this.favorites.push(nameLower);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
  }

  removeFavorite(characterName) {
    const nameLower = characterName.toLowerCase();
    this.favorites = this.favorites.filter(fav => fav !== nameLower);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  isFavorite(characterName) {
    if (!characterName) return false; // Si characterName est undefined ou vide, retourne false
    return this.favorites.includes(characterName.toLowerCase());
  }

  toggleFavorite(characterName) {
    if (!characterName) return;
    if (this.isFavorite(characterName)) {
      this.removeFavorite(characterName);
    } else {
      this.addFavorite(characterName);
    }
  }
}