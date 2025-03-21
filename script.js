document.addEventListener('DOMContentLoaded', () => {
    const inputRecherche = document.querySelector('#bloc-recherche input[type="text"]');
    const btnLancerRecherche = document.getElementById('btn-lancer-recherche');
    const btnFavoris = document.getElementById('btn-favoris');
    const blocResultats = document.getElementById('bloc-resultats');
    const blocGifAttente = document.getElementById('bloc-gif-attente');
    const listeFavoris = document.getElementById('liste-favoris');
    const infoVideFavoris = document.querySelector('#section-favoris .info-vide');
  
    let recherchesFavoris = JSON.parse(localStorage.getItem('recherchesFavoris')) || [];
  
    const afficherFavoris = () => {
      listeFavoris.innerHTML = '';
      if (recherchesFavoris.length === 0) {
        infoVideFavoris.style.display = 'block';
      } else {
        infoVideFavoris.style.display = 'none';
        recherchesFavoris.forEach(recherche => {
          const li = document.createElement('li');
          const span = document.createElement('span');
          span.textContent = recherche;
          span.title = 'Cliquer pour relancer la recherche';
          span.addEventListener('click', () => {
            inputRecherche.value = recherche;
            lancerRecherche();
          });
          const img = document.createElement('img');
          img.src = 'images/croix.svg';
          img.alt = 'Icone pour supprimer le favori';
          img.width = 15;
          img.title = 'Cliquer pour supprimer le favori';
          img.addEventListener('click', (e) => {
            e.stopPropagation();
            supprimerFavori(recherche);
          });
          li.appendChild(span);
          li.appendChild(img);
          listeFavoris.appendChild(li);
        });
      }
    };
  
    const ajouterFavori = (recherche) => {
      if (!recherchesFavoris.includes(recherche)) {
        recherchesFavoris.push(recherche);
        localStorage.setItem('recherchesFavoris', JSON.stringify(recherchesFavoris));
        afficherFavoris();
        btnFavoris.querySelector('img').src = 'images/etoile-pleine.svg';
        btnFavoris.disabled = true;
      }
    };
  
    const supprimerFavori = (recherche) => {
      recherchesFavoris = recherchesFavoris.filter(fav => fav !== recherche);
      localStorage.setItem('recherchesFavoris', JSON.stringify(recherchesFavoris));
      afficherFavoris();
    };
  
    const lancerRecherche = () => {
      const query = inputRecherche.value.trim();
      if (query === '') return;
  
      blocResultats.innerHTML = '';
      blocGifAttente.style.display = 'block';
  
      fetch(`https://api.disneyapi.dev/character?name=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          blocGifAttente.style.display = 'none';
          if (data.data.length === 0) {
            blocResultats.innerHTML = '<p class="info-vide">(Aucun résultat trouvé)</p>';
          } else {
            data.data.forEach(character => {
              const p = document.createElement('p');
              p.className = 'res';
              p.textContent = character.name;
              blocResultats.appendChild(p);
            });
          }
          if (!recherchesFavoris.includes(query)) {
            btnFavoris.disabled = false;
            btnFavoris.querySelector('img').src = 'images/etoile-vide.svg';
          } else {
            btnFavoris.disabled = true;
            btnFavoris.querySelector('img').src = 'images/etoile-pleine.svg';
          }
        })
        .catch(error => {
          blocGifAttente.style.display = 'none';
          blocResultats.innerHTML = '<p class="info-vide">(Erreur lors de la recherche)</p>';
          console.error('Erreur:', error);
        });
    };
  
    btnLancerRecherche.addEventListener('click', lancerRecherche);
  
    inputRecherche.addEventListener('input', () => {
      btnFavoris.disabled = true;
      btnFavoris.querySelector('img').src = 'images/etoile-vide.svg';
    });
  
    btnFavoris.addEventListener('click', () => {
      const query = inputRecherche.value.trim();
      if (query !== '') {
        ajouterFavori(query);
      }
    });
  
    afficherFavoris();
  });
  