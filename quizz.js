document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://api.disneyapi.dev/character?pageSize=50"; // API Disney
    let characters = [];
    let currentCharacter = null;

    const characterImage = document.getElementById("character-image");
    const characterNameInput = document.getElementById("character-name");
    const submitButton = document.getElementById("submit-answer");
    const resultMessage = document.getElementById("result-message");

        // Vérifier si une image est valide
    async function isValidImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }


    // Récupérer les personnages depuis l'API
    async function fetchCharacters() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erreur API: ${response.statusText}`);
            }
            const data = await response.json();
            characters = data.data.filter(character => character.imageUrl); // Extraction des personnages avec image valide
            loadNewCharacter();
        } catch (error) {
            console.error("Erreur lors du chargement :", error);
            resultMessage.textContent = "Impossible de charger le quiz.";
            resultMessage.style.color = "red";
        }
    }

    // Charger un personnage aléatoire
    function loadNewCharacter() {
        if (characters.length === 0) return;

        const randomIndex = Math.floor(Math.random() * characters.length);
        currentCharacter = characters[randomIndex];

        characterImage.src = currentCharacter.imageUrl;
        characterImage.alt = "Devinez ce personnage";
        characterNameInput.value = "";
        resultMessage.textContent = "";
    }

    // Vérifier la réponse de l'utilisateur
    submitButton.addEventListener("click", () => {
        if (!currentCharacter) return;

        const userAnswer = characterNameInput.value.trim().toLowerCase();
        const correctAnswer = currentCharacter.name.toLowerCase();

        if (userAnswer === correctAnswer) {
            resultMessage.textContent = "Bonne réponse ! 🎉";
            resultMessage.style.color = "green";
            setTimeout(loadNewCharacter, 2000);
        } else {
            resultMessage.textContent = `Mauvaise réponse ! ❌ C'était ${currentCharacter.name}.`;
            resultMessage.style.color = "red";
            setTimeout(loadNewCharacter, 3000);
        }
    });

    // Démarrer le quiz
    await fetchCharacters();
});