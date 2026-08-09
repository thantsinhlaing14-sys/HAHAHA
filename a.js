const DATA = [
    {
        trigger: "Welcome",
        response: "မင်္ဂလာပါ။ ကျွန်မကတော့ Naypyitaw State Polytechnic University စက်မှုအင်ဂျင်နီယာဌာနမှ ကျောင်းသားများ ဖန်တီးထားသော AI စက်ရုပ်တစ်ခုဖြစ်ပါတယ်။",
        audio: "welcome.wav"
    },

    {
        trigger: "NSPU Overview",
        response: "NayPyiTaw State Polytechnic University သည် ပုဗ္ဗသီရိမြို့နယ်တွင် တည်ရှိပါတယ်။ ဤတက္ကသိုလ်တွင် မြို့ပြ၊ စက်မှု၊ အီလက်ထရွန်နစ်၊ လျှပ်စစ်စွမ်းအား၊ စိုက်ပျိုးရေး၊ ကွန်ပျူတာ နှင့် ဗိသုကာ ဘာသာရပ်များကို သင်ကြားပေးလျက် ရှိပါတယ်။",
        audio: "nspu_overview.wav"
    },

    {
        trigger: "Saying Demo",
        response: "အင်တာနက် ချိတ်ဆက်မှု မရှိသည့်အတွက် ကျွန်မရဲ့ စွမ်းဆောင်နိုင်စွမ်း အစစ်အမှန်ကို မပြသနိုင်သော်လည်း ယခု Demo Version မှတစ်ဆင့် Screen ဖြင့် Interactive ဖြစ်အောင် ပြုလုပ်ထားပါတယ်။",
        audio: "saying_demo.wav"
    },

    {
        trigger: "Goodbye",
        response: "အခုလို မိတ်ဆက်ခွင့်ရရှိသည့်အတွက် ကျေးဇူးတင်ပါတယ်ရှင်။ နှုတ်ဆက်လိုက်ပါတယ်ရှင်။",
        audio: "goodbye.wav"
    }
];


let activeStreamInterval = null;


// ===============================
// Navigation
// ===============================

function switchTab(tabName, button) {

    document.querySelectorAll(".tab-content")
        .forEach(el => {
            el.classList.remove("active");
        });

    document.querySelectorAll(".nav-btn")
        .forEach(el => {
            el.classList.remove("active");
        });

    const tab = document.getElementById("tab-" + tabName);

    if (tab) {
        tab.classList.add("active");
    }

    if (button) {
        button.classList.add("active");
    }
}


// ===============================
// Text Streaming
// ===============================

function streamText(targetId, text, speed = 40) {

    const container = document.getElementById(targetId);

    if (!container) return;

    if (activeStreamInterval) {
        clearInterval(activeStreamInterval);
    }

    container.innerText = "";

    const characters = [...text];

    let index = 0;

    activeStreamInterval = setInterval(() => {

        if (index < characters.length) {

            container.innerText += characters[index];

            index++;

        } else {

            clearInterval(activeStreamInterval);
            activeStreamInterval = null;
        }

    }, speed);
}


// ===============================
// Create Buttons
// ===============================

function renderUI() {

    const container =
        document.getElementById("trigger-buttons");

    if (!container) {
        console.error("trigger-buttons not found");
        return;
    }

    container.innerHTML = "";

    DATA.forEach(item => {

        const button =
            document.createElement("button");

        button.className = "action-btn";

        button.innerText =
            item.trigger.toUpperCase();

        button.addEventListener("click", () => {

            // Show text
            streamText(
                "current-response",
                item.response,
                60
            );

            // Play audio
            const audio = new Audio(item.audio);

            audio.play().catch(error => {
                console.log("Audio error:", error);
            });

        });

        container.appendChild(button);
    });
}


// ===============================
// Start
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    renderUI
);
