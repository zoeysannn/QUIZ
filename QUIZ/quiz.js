let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;

const questionElem = document.getElementById("question");
const answersElem = document.getElementById("answers");
const feedbackElem = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const resultElem = document.getElementById("result");

document.getElementById("startQuiz").addEventListener("click", () => {
        const subject = document.getElementById("subjectSelector").value;
        const filePath = `subjects/${subject}.json`;

    document.getElementById("setupArea").classList.add("fade-out");
    

    fetch(filePath)
    .then(res => res.json())
    .then(data => {
        questions = [...data].sort(() => Math.random() - 0.5); // ✅ Shuffle here
        current = 0;
        correct = 0;
        wrong = 0; // ✅ Add this
        resultElem.innerHTML = "";
        nextBtn.style.display = "none";
        document.getElementById("scoreBoard").innerText = `✅ Correct: 0 | ❌ Wrong: 0`; // ✅ Reset scoreboard
        loadQuestion();
    })
    .catch(err => {
        questionElem.innerText = "⚠️ Failed to load questions.";
        console.error("Error loading subject file:", err);
    });

});

    
function loadQuestion() {
    document.getElementById("progress").innerText = `Question ${current + 1} of ${questions.length}`;

    let q = questions[current];
    questionElem.innerText = q.question;
    feedbackElem.innerText = "";
    answersElem.innerHTML = "";

    // q.options.forEach(opt => {
    //     let btn = document.createElement("button");
    //     btn.innerText = opt;
    //     btn.className = "button";
    //     btn.onclick = () => handleAnswer(opt, q.answer, btn);
    //     answersElem.appendChild(btn);
    // });
    let shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        shuffledOptions.forEach(opt => {
            let btn = document.createElement("button");
            btn.innerText = opt;
            btn.className = "button";
            btn.onclick = () => handleAnswer(opt, q.answer, btn);
            answersElem.appendChild(btn);
        });


    questionElem.classList.remove("fade-in");
    void questionElem.offsetWidth; // Force reflow
    questionElem.classList.add("fade-in");

    answersElem.classList.remove("fade-in");
    void answersElem.offsetWidth;
    answersElem.classList.add("fade-in");


}

function handleAnswer(selected, correctAnswer, btn) {
    questions[current].userAnswer = selected;
    const buttons = document.querySelectorAll(".button");

    buttons.forEach(b => {
        b.disabled = true;

        if (b.innerText === correctAnswer) {
            b.classList.add("correct");
        } else if (b.innerText === selected) {
            b.classList.add("incorrect");
        } else {
            b.classList.add("neutral");
        }
    });

    if (selected === correctAnswer) {
        feedbackElem.innerHTML = "🎉 Great job! That’s correct!";
        correct++;
    } else {
        feedbackElem.innerHTML = `😅 Oops! The correct answer was <strong>${correctAnswer}</strong>. You're learning!`;
        wrong++;
    }

    // 🧮 Update the scoreboard live
    document.getElementById("scoreBoard").innerText = `✅ Correct: ${correct} | ❌ Wrong: ${wrong}`;
    nextBtn.style.display = "inline-block";
}


nextBtn.addEventListener("click", () => {
    current++;
    nextBtn.style.display = "none";

    if (current < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    questionElem.innerText = "🎊 Quiz Complete!";
    answersElem.innerHTML = "";
    feedbackElem.innerHTML = "";
    resultElem.innerHTML = `✅ You got <strong>${correct}</strong> out of <strong>${questions.length}</strong> correct!<br>🌟 Keep going – you're amazing! 💪`;

    const reviewElem = document.getElementById("review");
    reviewElem.innerHTML = "<h3>📋 Review Your Answers:</h3>";
    
    questions.forEach((q, index) => {
        const userAnswer = q.userAnswer || "❌ No answer";
        const isCorrect = userAnswer === q.answer;
        reviewElem.innerHTML += `
            <p>
                <strong>${index + 1}. ${q.question}</strong><br>
                ✅ Correct: <em>${q.answer}</em><br>
                ${isCorrect ? "🎉" : "❌"} Your answer: <em>${userAnswer}</em>
            </p>
            <hr>
        `;
    });
}
