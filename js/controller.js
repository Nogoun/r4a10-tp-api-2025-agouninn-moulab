import { CharacterModel } from './model.js';
import { CharacterView } from './vue.js';

document.addEventListener('DOMContentLoaded', () => {
  const model = new CharacterModel();
  const view = new CharacterView();

  // Initialisation des favoris à partir du stockage local
  model.loadFavorites();
  view.updateFavoritesList(model.favorites);

  // Gestionnaire d'événement pour le bouton de recherche
  view.bindSearchEvent(async (query) => {
    if (query === '') return;
    model.currentSearch = query;
    view.showLoadingIndicator(true);
    view.clearResults();

    try {
      const characters = await model.searchCharacters(query);
      if (characters.length === 0) {
        view.displayNoResultsMessage();
      } else {
        view.displayResults(characters);
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des données.', error);
    } finally {
      view.showLoadingIndicator(false);
    }
  });

  view.bindSearchInputKeyPress(async (query) => {
    if (query === '') return;
    model.currentSearch = query;
    view.showLoadingIndicator(true);
    view.clearResults();
  
    try {
      const characters = await model.searchCharacters(query);
      if (characters.length === 0) {
        view.displayNoResultsMessage();
      } else {
        view.displayResults(characters);
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des données.', error);
    } finally {
      view.showLoadingIndicator(false);
    }
  });

  // Gestionnaire d'événement pour le bouton des favoris
  view.bindFavoritesEvent(() => {
    if (model.currentSearch === '') return;
    model.toggleFavorite(model.currentSearch);
    view.updateFavoritesButton(model.isFavorite(model.currentSearch));
    view.updateFavoritesList(model.favorites);
  });

  // Gestionnaire d'événement pour la sélection d'un favori
  view.bindFavoriteSelection((favorite) => {
    model.currentSearch = favorite; // Met à jour la recherche actuelle
    view.setSearchInput(favorite); // Met à jour le champ de recherche
    view.clearResults();
    view.showLoadingIndicator(true);
  
    // Relance la recherche
    model.searchCharacters(favorite)
      .then((characters) => {
        if (characters.length === 0) {
          view.displayNoResultsMessage();
        } else {
          view.displayResults(characters);
        }
      })
      .catch((error) => {
        console.error('Une erreur s\'est produite lors de la recherche :', error);
      })
      .finally(() => {
        view.showLoadingIndicator(false); 
      });
  });

  // Gestionnaire d'événement pour la suppression d'un favori
  view.bindFavoriteDeletion((favorite) => {
    model.removeFavorite(favorite);
    view.updateFavoritesList(model.favorites);
    view.updateFavoritesButton(model.isFavorite(model.currentSearch));
  });
});
