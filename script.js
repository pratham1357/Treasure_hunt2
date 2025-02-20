document.addEventListener('DOMContentLoaded', function() {
    const clueButton = document.getElementById('clueButton');
    clueButton.addEventListener('click', getNextClue);
});

async function getNextClue() {
    const teamNo = document.getElementById("team").value;
    const pin = document.getElementById("pin").value;
    const clueDisplay = document.getElementById("clue-display");

    clueDisplay.innerHTML = '';

    if (!teamNo || !pin) {
        clueDisplay.innerHTML = '<span class="error">Please enter Team number and PIN</span>';
        return;
    }

    if (teamNo < 1 || teamNo > 15) {
        clueDisplay.innerHTML = '<span class="error">Team number must be between 1 and 15</span>';
        return;
    }

    try {
        const response = await fetch('treasure_hunt\clues.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const pinStr = pin.toString();
        let foundClue = null;
        let matchingTeam = false;

        if (data.codes[teamNo]) {
            matchingTeam = true;
            for (let level in data.codes[teamNo]) {
                if (data.codes[teamNo][level].toString() === pinStr) {
                    foundClue = data.clues[teamNo][level];
                    break;
                }
            }
        }

        if (pinStr === "FINAL") {
            clueDisplay.innerText = data.final_clue;
        } else if (!matchingTeam) {
            clueDisplay.innerHTML = '<span class="error">Invalid team number! Please try again.</span>';
        } else if (!foundClue) {
            clueDisplay.innerHTML = '<span class="error">Invalid PIN for this team! Please try again.</span>';
        } else {
            clueDisplay.innerText = foundClue;
        }

    } catch (error) {
        console.error('Error:', error);
        clueDisplay.innerHTML = '<span class="error">An error occurred while fetching the clue. Please try again later.</span>';
    }
}