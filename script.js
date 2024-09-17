let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = 0;

async function fetchQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        // Shuffle questions and get the first 10
        questions = questions.sort(() => Math.random() - 0.5).slice(0, 10);
        displayQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerHTML = `
            <input type="checkbox" name="option" value="${option.charAt(0)}" id="option${index}">
            <label for="option${index}">${option}</label>
        `;
        optionsContainer.appendChild(optionElement);
    });

    document.getElementById('questions-left').textContent = `Questions left: ${questions.length - answeredQuestions}`;
    document.getElementById('current-question').textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

function showResults() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('review').style.display = 'block';

    document.getElementById('score').textContent = `Your score is ${score} out of ${questions.length}`;

    const reviewContainer = document.getElementById('review');
    reviewContainer.innerHTML = '';

    questions.forEach((q, index) => {
        const selected = q.selected ? q.options.filter(opt => q.selected.includes(opt.charAt(0))).join(', ') : 'None';
        const isCorrect = JSON.stringify(q.answer.split(', ').sort()) === JSON.stringify(q.selected.sort());
        const reviewClass = isCorrect ? 'correct' : 'incorrect';

        reviewContainer.innerHTML += `
            <div class="review-item ${reviewClass}">
                <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
                <p><strong>Selected:</strong> ${selected}</p>
                <p><strong>Correct:</strong> ${q.answer}</p>
            </div>
            <hr>
        `;
    });
}

function handleNextQuestion() {
    const selectedOptions = Array.from(document.querySelectorAll('input[name="option"]:checked')).map(el => el.value);

    if (selectedOptions.length === 0) {
        alert('Please select at least one answer.');
        return;
    }

    const correctAnswers = questions[currentQuestionIndex].answer.split(', ').sort();
    const selectedAnswers = selectedOptions.sort();

    if (JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers)) {
        score++;
    }

    questions[currentQuestionIndex].selected = selectedOptions;
    answeredQuestions++;
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        showResults();
    } else {
        displayQuestion();
    }
}

function handleRetakeQuiz() {
    // Shuffle questions again and get the first 10
    questions = questions.sort(() => Math.random() - 0.5).slice(0, 10);

    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;

    document.getElementById('question-container').style.display = 'block';
    document.getElementById('next-button').style.display = 'inline-block';
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('review').style.display = 'none';

    displayQuestion();
}

document.getElementById('next-button').addEventListener('click', handleNextQuestion);
document.getElementById('retake-quiz').addEventListener('click', handleRetakeQuiz);

// Initialize the quiz
fetchQuestions();


// Function to show the Quiz view and hide Study Guide view
function showQuizView() {
    document.getElementById('question-container').style.display = 'block'; // Show quiz
    document.getElementById('result-container').style.display = 'none'; // Hide result
    document.getElementById('review').style.display = 'none'; // Hide review
    document.getElementById('study-container').style.display = 'none'; // Hide study guide
}

// Function to show the Study Guide view and hide Quiz view
function showStudyView() {
    document.getElementById('question-container').style.display = 'none'; // Hide quiz
    document.getElementById('result-container').style.display = 'none'; // Hide result
    document.getElementById('review').style.display = 'none'; // Hide review
    document.getElementById('study-container').style.display = 'block'; // Show study guide
}

// Default view (show quiz when page loads)
showQuizView();
