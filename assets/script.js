document.addEventListener('DOMContentLoaded', function() {
    const clueButton = document.getElementById('clueButton');
    clueButton.addEventListener('click', getNextClue);
});

async function getNextClue() {
    const teamNo = document.getElementById("team").value;
    const pin = document.getElementById("pin").value;
    const clueDisplay = document.getElementById("clue-display");

    // Clear previous content
    clueDisplay.innerHTML = '';

    // Input validation
    if (!teamNo || !pin) {
        clueDisplay.innerHTML = '<span class="error">Please enter Team number and PIN</span>';
        return;
    }

    if (teamNo < 1 || teamNo > 15) {
        clueDisplay.innerHTML = '<span class="error">Team number must be between 1 and 15</span>';
        return;
    }

    try {
        const response = await fetch('/treasure_hunt/assets/clues.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Convert pin to string for comparison
        const pinStr = pin.toString();
        let foundClue = null;
        let matchingTeam = false;

        // First check if the team number exists
        if (data.codes[teamNo]) {
            matchingTeam = true;
            // Then look for matching PIN within that team's codes
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