document.addEventListener('DOMContentLoaded', () => {
    const clueButton = document.getElementById('clueButton');
    const clueDisplay = document.getElementById('clueDisplay');
    const pinInput = document.getElementById('pin');
    const teamInput = document.getElementById('team');

    clueButton.addEventListener('click', handleClueRequest);

    async function handleClueRequest() {
        clueDisplay.innerHTML = '';
        
        const teamNo = teamInput.value;
        const pinStr = pinInput.value.trim();
        
        if (!teamNo || !pinStr) {
            clueDisplay.innerHTML = '<span class="error">Please enter both team number and PIN.</span>';
            return;
        }

        if (teamNo < 1 || teamNo > 15) {
            clueDisplay.innerHTML = '<span class="error">Team number must be between 1 and 15.</span>';
            return;
        }

        if (pinStr.length > 6) {
            clueDisplay.innerHTML = '<span class="error">PIN should not exceed 6 digits.</span>';
            return;
        }

        try {
            const response = await fetch('clues.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (pinStr === "999999") {
                clueDisplay.innerText = data.codes.final_clue;
                return;
            }

            if (!data.clues[teamNo] || !data.codes[teamNo]) {
                clueDisplay.innerHTML = '<span class="error">Invalid team number! Please try again.</span>';
                return;
            }

            let foundClue = null;
            let currentLevel = null;

            for (let level = 1; level <= 4; level++) {
                if (data.codes[teamNo][level].toString() === pinStr) {
                    foundClue = data.clues[teamNo][level];
                    currentLevel = level;
                    break;
                }
            }

            if (!foundClue) {
                clueDisplay.innerHTML = '<span class="error">Invalid PIN for this team! Please try again.</span>';
                return;
            }

            if (currentLevel === 4) {
                clueDisplay.innerText = `${foundClue}\n\nFinal Clue: ${data.codes.final_clue}`;
            } else {
                clueDisplay.innerText = foundClue;
            }

        } catch (error) {
            console.error('Error:', error);
            clueDisplay.innerHTML = '<span class="error">An error occurred while fetching the clue. Please try again later.</span>';
        }
    }

    teamInput.addEventListener('input', clearError);
    pinInput.addEventListener('input', clearError);

    function clearError() {
        if (clueDisplay.querySelector('.error')) {
            clueDisplay.innerHTML = '';
        }
    }
});
