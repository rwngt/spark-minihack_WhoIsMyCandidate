document.addEventListener('DOMContentLoaded', () => {
    const button1 = document.querySelector('.candidate-box:nth-child(1) button'); // Adjust the selector as needed
    const button2 = document.querySelector('.candidate-box:nth-child(2) button'); // Adjust the selector as needed

    button1.addEventListener('click', async () => {
        const userMessage = document.querySelector('.candidate-box:nth-child(1) textarea').value; // Adjust selector for Candidate 1
        const responseDiv = document.querySelector('.candidate-box:nth-child(1) .response'); // Adjust selector for Candidate 1

        const answer = await fetchChatbotResponse('trump', userMessage); // Fetch response for Trump
        responseDiv.innerText = answer;
    });

    button2.addEventListener('click', async () => {
        const userMessage = document.querySelector('.candidate-box:nth-child(2) textarea').value; // Adjust selector for Candidate 2
        const responseDiv = document.querySelector('.candidate-box:nth-child(2) .response'); // Adjust selector for Candidate 2

        const answer = await fetchChatbotResponse('harris', userMessage); // Fetch response for Harris
        responseDiv.innerText = answer;
    });
});

// Updated fetch function to accept candidate parameter
async function fetchChatbotResponse(candidate, message) {
    const response = await fetch(`/chat/${candidate}`, { // Use candidate in the endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.answer; // Adjust according to your server response structure
}
