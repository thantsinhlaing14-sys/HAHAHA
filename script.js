// --- Default Offline Storage ---
const DEFAULT_DATA = [
    { trigger: "greeting", response: "Hello! Welcome to our facility. How can I help you today?" },
    { trigger: "help", response: "I can assist you with directions, facility information, and basic inquiries." },
    { trigger: "goodbye", response: "Goodbye! Have a great day and see you next time." }
];

let activeStreamInterval = null;

function getData() {
    const saved = localStorage.getItem('robot_data');
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
}

// --- Navigation ---
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.target.classList.add('active');
}

// --- Token-by-Token Streaming Function ---
function streamText(targetElementId, text, speed = 80, callback = null) {
    const container = document.getElementById(targetElementId);
    if (!container) return;

    // Clear any previous ongoing stream
    if (activeStreamInterval) {
        clearInterval(activeStreamInterval);
        activeStreamInterval = null;
    }

    container.innerText = "";
    
    // Split text into tokens (words) to simulate token streaming
    const tokens = text.split(" ");
    let index = 0;

    activeStreamInterval = setInterval(() => {
        if (index < tokens.length) {
            container.innerText += (index === 0 ? "" : " ") + tokens[index];
            index++;
        } else {
            clearInterval(activeStreamInterval);
            activeStreamInterval = null;
            if (callback) callback();
        }
    }, speed);
}

// --- Render Logic ---
function renderUI() {
    const data = getData();
    
    // Render Main Interactive Buttons
    const btnContainer = document.getElementById('trigger-buttons');
    btnContainer.innerHTML = '';
    data.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.innerText = item.trigger.toUpperCase();
        btn.onclick = () => {
            // Stream response word-by-word and speak upon trigger
            streamText('current-response', item.response, 100);
            speakText(item.response);
        };
        btnContainer.appendChild(btn);
    });
}

// --- Speech Synthesis & Voice Recognition ---
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

function startSTT() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Web Speech API is not supported in this browser.");
        return;
    }
    const recognition = new SpeechRecognition();
    document.getElementById('stt-result').innerText = "Listening...";
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        document.getElementById('stt-result').innerText = transcript;
        
        const data = getData();
        const match = data.find(item => transcript.includes(item.trigger.toLowerCase()));
        const reply = match ? match.response : "I didn't recognize that command.";
        
        // Stream AI response token by token
        streamText('ai-result', reply, 100);
        speakText(reply);
    };
    recognition.start();
}

// Initial Run
document.addEventListener('DOMContentLoaded', renderUI);