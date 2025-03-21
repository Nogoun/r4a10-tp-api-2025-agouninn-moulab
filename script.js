document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsSection = document.getElementById('results-section');
    const favoritesList = document.getElementById('favorites-list');
  
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
  
      if (query === '') {
        displayMessage('Veuillez entrer le nom d\'un personnage Disney.');
        return;
      }
  
      try {
        const response = await fetch(`https://api.disneyapi.dev/character?name=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error(`Erreur : ${response.status}`);
        }
  
        const data = await response.json();
        if (data.data.length === 0) {
          displayMessage('Aucun personnage trouvé. Veuillez vérifier l\'orthographe ou essayer un autre nom.');
        } else {
          displayCharacters(data.data);
        }
      } catch (error) {
        displayMessage('Une erreur s\'est produite lors de la récupération des données. Veuillez réessayer plus tard.');
        console.error(error);
      }
    });
  
    function displayMessage(message) {
      resultsSection.innerHTML = `<p>${message}</p>`;
    }
  
    function displayCharacters(characters) {
      resultsSection.innerHTML = '';
      characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('character-card');
  
        const favoriteCheckbox = document.createElement('input');
        favoriteCheckbox.type = 'checkbox';
        favoriteCheckbox.classList.add('favorite-checkbox');
        favoriteCheckbox.id = `favorite-${character._id}`;
        favoriteCheckbox.addEventListener('change', () => toggleFavorite(character, favoriteCheckbox.checked));
  
        const favoriteLabel = document.createElement('label');
        favoriteLabel.htmlFor = `favorite-${character._id}`;
        favoriteLabel.classList.add('favorite-label');
  
        const characterImage = document.createElement('img');
        characterImage.src = character.imageUrl || 'placeholder.jpg'; // Remplacez 'placeholder.jpg' par une image par défaut si nécessaire
        characterImage.alt = character.name;
  
        const characterDetails = document.createElement('div');
        characterDetails.classList.add('character-details');
  
        const characterName = document.createElement('h2');
        characterName.textContent = character.name;
  
        characterDetails.appendChild(characterName);
  
        if (character.films.length > 0) {
          const films = document.createElement('p');
          films.innerHTML = `<strong>Films :</strong> ${character.films.join(', ')}`;
          characterDetails.appendChild(films);
        }
  
        // Ajoutez des sections similaires pour les séries TV, les courts-métrages, les jeux vidéo, les attractions, les alliés et les ennemis
  
        characterCard.appendChild(favoriteCheckbox);
        characterCard.appendChild(favoriteLabel);
        characterCard.appendChild(characterImage);
        characterCard.appendChild(characterDetails);
  
        resultsSection.appendChild(characterCard);
      });
    }
  
    function toggleFavorite(character, isFavorite) {
      if (isFavorite) {
        addFavorite(character);
      } else {
        removeFavorite(character);
      }
    }
  
    function addFavorite(character) {
      const favoriteItem = document.createElement('li');
      favoriteItem.textContent = character.name;
      favoriteItem.dataset.characterId = character._id;
      favoritesList.appendChild(favoriteItem);
    }
  
    function removeFavorite(character) {
      const favoriteItems = favoritesList.querySelectorAll('li');
      favoriteItems.forEach(item => {
        if (item.dataset.characterId === character._id) {
          favoritesList.removeChild(item);
        }
      });
    }
  });
  