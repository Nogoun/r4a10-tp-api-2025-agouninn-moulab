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

    // Trie les résultats en fonction de leur similarité avec la chaîne recherchée
    const sortedResults = data.data.sort((a, b) => {
      const similarityA = this.calculateSimilarity(query, a.name);
      const similarityB = this.calculateSimilarity(query, b.name);
      return similarityB - similarityA; // Tri décroissant (le plus similaire en premier)
    });

    return sortedResults;
  }

  calculateSimilarity(query, name) {
    const queryLower = query.toLowerCase();
    const nameLower = name.toLowerCase();

    // Si le nom contient exactement la chaîne recherchée, priorité maximale
    if (nameLower.includes(queryLower)) {
      return queryLower.length / nameLower.length;
    }

    // Sinon, calcule une correspondance partielle
    let matches = 0;
    for (let i = 0; i < queryLower.length; i++) {
      if (nameLower.includes(queryLower[i])) {
        matches++;
      }
    }

    return matches / queryLower.length; // Retourne un score de similarité
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