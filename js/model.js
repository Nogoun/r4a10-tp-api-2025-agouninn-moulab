class CharacterModel {
    constructor() {
      this.apiUrl = 'https://api.disneyapi.dev/character';
      this.defaultImageUrl = 'URL_DE_L_IMAGE_PAR_DÉFAUT'; // Remplacez par l'URL de votre image par défaut
      this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    }
  
    async searchCharacters(query) {
      const response = await fetch(`${this.apiUrl}?name=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Erreur : ${response.status}`);
      }
      const data = await response.json();
      return data.data;
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
      return this.favorites.includes(characterName.toLowerCase());
    }
  }
  