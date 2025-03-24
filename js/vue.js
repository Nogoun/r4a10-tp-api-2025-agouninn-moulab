export class CharacterView {
  constructor() {
    this.searchInput = document.querySelector('#bloc-recherche input[type="text"]');
    this.searchButton = document.getElementById('btn-lancer-recherche');
    this.favoritesButton = document.getElementById('btn-favoris');
    this.resultsContainer = document.getElementById('bloc-resultats');
    this.loadingIndicator = document.getElementById('bloc-gif-attente');
    this.favoritesList = document.getElementById('liste-favoris');
    this.noResultsMessage = document.querySelector('#bloc-resultats .info-vide');
    this.noFavoritesMessage = document.querySelector('#section-favoris .info-vide');
  }

  displayResults(characters, defaultImageUrl) {
    this.resultsContainer.innerHTML = '';
    characters.forEach(character => {
      const characterCard = document.createElement('div');
      characterCard.classList.add('character-card');

      characterCard.innerHTML = `
        <div class="character-header">
          <img src="${character.imageUrl || defaultImageUrl}" alt="${character.name}" onerror="this.onerror=null;this.src='${defaultImageUrl}';">
          <h2>${character.name}</h2>
        </div>
        <div class="character-details" style="display: none;">
          ${character.films.length > 0 ? `<p><strong>Films :</strong> ${character.films.join(', ')}</p>` : ''}
          ${character.tvShows.length > 0 ? `<p><strong>Séries TV :</strong> ${character.tvShows.join(', ')}</p>` : ''}
          ${character.shortFilms.length > 0 ? `<p><strong>Court-métrages :</strong> ${character.shortFilms.join(', ')}</p>` : ''}
          ${character.videoGames.length > 0 ? `<p><strong>Jeux vidéo :</strong> ${character.videoGames.join(', ')}</p>` : ''}
          ${character.parkAttractions.length > 0 ? `<p><strong>Attractions :</strong> ${character.parkAttractions.join(', ')}</p>` : ''}
          ${character.allies.length > 0 ? `<p><strong>Alliés :</strong> ${character.allies.join(', ')}</p>` : ''}
          ${character.enemies.length > 0 ? `<p><strong>Ennemis :</strong> ${character.enemies.join(', ')}</p>` : ''}
        </div>
      `;

      characterCard.addEventListener('click', () => {
        const details = characterCard.querySelector('.character-details');
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
      });

      this.resultsContainer.appendChild(characterCard);
    });
  }

  clearResults() {
    this.resultsContainer.innerHTML = '';
  }

  updateFavoritesList(favorites) {
    this.favoritesList.innerHTML = ''; // Vide la liste des favoris
    favorites.forEach(favorite => {
      const listItem = document.createElement('li');
  
      // Crée un élément <span> pour afficher le nom du favori
      const span = document.createElement('span');
      span.textContent = favorite;
      span.title = 'Cliquer pour relancer la recherche';
  
      // Crée une icône de suppression (croix)
      const deleteIcon = document.createElement('img');
      deleteIcon.src = 'images/croix.svg'; // Assurez-vous que cette image existe
      deleteIcon.alt = 'Supprimer';
      deleteIcon.width = 15;
      deleteIcon.title = 'Supprimer ce favori';
      deleteIcon.style.cursor = 'pointer';

      // Ajoute le <span> et l'icône de suppression au <li>
      listItem.appendChild(span);
      listItem.appendChild(deleteIcon);
  
      // Ajoute le <li> à la liste des favoris
      this.favoritesList.appendChild(listItem);
    });
  }



  toggleNoResultsMessage(show) {
    this.noResultsMessage.style.display = show ? 'block' : 'none';
  }

  toggleNoFavoritesMessage(show) {
    this.noFavoritesMessage.style.display = show ? 'block' : 'none';
  }

  setLoadingIndicator(show) {
    this.loadingIndicator.style.display = show ? 'block' : 'none';
  }

  setSearchInput(value) {
    this.searchInput.value = value;
  }

  bindFavoriteSelection(handler) {
    this.favoritesList.addEventListener('click', (event) => {
      const listItem = event.target.closest('li');
      if (listItem) {
        const favorite = listItem.querySelector('span').textContent;
        handler(favorite);
      }
    });
  }

  bindFavoritesEvent(handler) {
    this.favoritesButton.addEventListener('click', handler);
  }

  bindFavoriteDeletion(handler) {
    this.favoritesList.addEventListener('click', (event) => {
      if (event.target.tagName === 'IMG') {
        const favorite = event.target.previousElementSibling.textContent;
        handler(favorite);
      }
    });
  }

  bindSearchEvent(handler) {
    this.searchButton.addEventListener('click', () => {
      const query = this.searchInput.value.trim();
      handler(query);
    });
  }

  bindSearchInputKeyPress(handler) {
    this.searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const query = this.searchInput.value.trim();
        handler(query); // Appelle le gestionnaire avec la requête
      }
    });
  }

  updateFavoritesButton(isFavorite) {
    this.favoritesButton.innerHTML = `<img src="images/${isFavorite ? 'etoile-pleine' : 'etoile-vide'}.svg" alt="${isFavorite ? 'Favori' : 'Non favori'}" width="22">`;
  }
  
  showLoadingIndicator(show) {
    this.loadingIndicator.style.display = show ? 'block' : 'none';
  }
}
