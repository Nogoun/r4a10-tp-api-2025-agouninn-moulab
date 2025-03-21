document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('#bloc-recherche input[type="text"]');
  const searchButton = document.getElementById('btn-lancer-recherche');
  const favoritesButton = document.getElementById('btn-favoris');
  const resultsContainer = document.getElementById('bloc-resultats');
  const loadingIndicator = document.getElementById('bloc-gif-attente');
  const favoritesList = document.getElementById('liste-favoris');
  const noResultsMessage = document.querySelector('#bloc-resultats .info-vide');
  const noFavoritesMessage = document.querySelector('#section-favoris .info-vide');
  const defaultImageUrl = 'URL_DE_L_IMAGE_PAR_DÉFAUT'; // Remplacez par l'URL de votre image par défaut

  let currentSearch = '';
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  

  // Fonction pour afficher ou masquer le message "Aucun résultat trouvé"
  function toggleNoResultsMessage(show) {
    noResultsMessage.style.display = show ? 'block' : 'none';
  }

  // Fonction pour afficher ou masquer le message "Aucune recherche favorite"
  function toggleNoFavoritesMessage() {
    noFavoritesMessage.style.display = favorites.length === 0 ? 'block' : 'none';
  }

  // Fonction pour afficher les résultats de la recherche
  function displayResults(characters) {
    resultsContainer.innerHTML = '';
    characters.forEach(character => {
      const characterCard = document.createElement('div');
      characterCard.classList.add('character-card');
  
      // Contenu de la boîte (photo et nom)
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
  
      // Ajouter un gestionnaire d'événement pour développer/réduire la boîte
      characterCard.addEventListener('click', () => {
        const details = characterCard.querySelector('.character-details');
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
      });
  
      resultsContainer.appendChild(characterCard);
    });
  }

  // Fonction pour effectuer la recherche de personnages
  async function searchCharacters(query) {
    loadingIndicator.style.display = 'block';
    toggleNoResultsMessage(false);
    resultsContainer.innerHTML = '';
  
    try {
      const response = await fetch(`https://api.disneyapi.dev/character?name=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Erreur : ${response.status}`);
      }
  
      const data = await response.json();
      if (data.data.length === 0) {
        toggleNoResultsMessage(true);
      } else {
        // Trier les résultats par ressemblance avec la chaîne de recherche
        const sortedCharacters = sortBySimilarity(query, data.data);
        displayResults(sortedCharacters);
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des données.', error);
    } finally {
      loadingIndicator.style.display = 'none';
    }
  }

  function sortBySimilarity(query, characters) {
    return characters.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      const queryLower = query.toLowerCase();
  
      // Vérifier si la chaîne de recherche est contenue dans le nom
      const indexA = nameA.indexOf(queryLower);
      const indexB = nameB.indexOf(queryLower);
  
      // Les noms contenant la chaîne de recherche en premier sont prioritaires
      if (indexA !== indexB) {
        return indexA - indexB;
      }
  
      // Si les deux noms contiennent la chaîne, trier par ordre alphabétique
      return nameA.localeCompare(nameB);
    });
  }

  // Fonction pour mettre à jour l'état du bouton des favoris
  function updateFavoritesButton() {
    const isFavorite = favorites.includes(currentSearch.toLowerCase());
    favoritesButton.disabled = currentSearch === '';
    favoritesButton.innerHTML = `<img src="images/${isFavorite ? 'etoile-pleine' : 'etoile-vide'}.svg" alt="${isFavorite ? 'Favori' : 'Non favori'}" width="22">`;
  }

  // Fonction pour mettre à jour la liste des favoris affichée
  function updateFavoritesList() {
    favoritesList.innerHTML = '';
    favorites.forEach(favorite => {
      const listItem = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = favorite;
      span.title = 'Cliquer pour relancer la recherche';
      span.addEventListener('click', () => {
        searchInput.value = favorite;
        currentSearch = favorite;
        updateFavoritesButton();
        searchCharacters(favorite);
      });

      const deleteIcon = document.createElement('img');
      deleteIcon.src = 'images/croix.svg';
      deleteIcon.alt = 'Icone pour supprimer le favori';
      deleteIcon.width = 15;
      deleteIcon.title = 'Cliquer pour supprimer le favori';
      deleteIcon.addEventListener('click', () => {
        favorites = favorites.filter(fav => fav !== favorite);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesList();
        toggleNoFavoritesMessage();
        updateFavoritesButton();
      });

      listItem.appendChild(span);
      listItem.appendChild(deleteIcon);
      favoritesList.appendChild(listItem);
    });
    toggleNoFavoritesMessage();
  }

  // Gestionnaire d'événement pour le bouton de recherche
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query === '') return;
    currentSearch = query;
    updateFavoritesButton();
    searchCharacters(query);
  });

  // Gestionnaire d'événement pour le bouton des favoris
  favoritesButton.addEventListener('click', () => {
    if (currentSearch === '') return;
    const searchLower = currentSearch.toLowerCase();
    if (favorites.includes(searchLower)) {
      favorites = favorites.filter(fav => fav !== searchLower);
    } else {
      favorites.push(searchLower);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
    updateFavoritesButton();
  });

  // Initialisation
  updateFavoritesList();
  toggleNoFavoritesMessage();
  updateFavoritesButton();
}); 
