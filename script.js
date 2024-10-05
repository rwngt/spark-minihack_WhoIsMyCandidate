async function askCandidate1() {
    const question = document.getElementById("question1").value;

    const response = await fetch('http://localhost:3000/chatbot1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: question }),
    });

    const data = await response.json();
    document.getElementById("response1").innerText = data.response;
}

async function askCandidate2() {
    const question = document.getElementById("question2").value;

    const response = await fetch('http://localhost:3000/chatbot2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: question }),
    });

    const data = await response.json();
    document.getElementById("response2").innerText = data.response;
}
