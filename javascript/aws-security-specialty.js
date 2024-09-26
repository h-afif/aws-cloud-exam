document.addEventListener('DOMContentLoaded', function () {
    const topic = 'aws-security-specialty'; // Change this for each topic
    const totalQuestions = 20;
    let questionsData = [];
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let userAnswers = [];

    function loadQuestions() {
        fetch('aws-security-specialty.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Questions loaded:', data); // Log the loaded questions
                questionsData = shuffleArray(data).slice(0, totalQuestions);
                displayQuestion(questionsData[currentQuestionIndex]);
                updateQuestionInfo();
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function displayQuestion(questionData) {
        const questionSection = document.querySelector('#question-section');
        questionSection.innerHTML = `
            <div class="question-container">
                <h3>${questionData.question}</h3>
                ${questionData.options.map((option, index) => `
                    <div class="option-container" data-value="${option}">
                        <input type="radio" name="question${currentQuestionIndex}" id="option${index}" value="${option}">
                        <label for="option${index}" class="option-label">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.option-container').forEach(option => {
            option.addEventListener('click', function () {
                const radioButton = this.querySelector('input[type="radio"]');
                radioButton.checked = true;
                document.querySelectorAll('.option-container').forEach(container => {
                    container.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
    }

    function updateQuestionInfo() {
        document.getElementById('question-number').textContent = `Question ${currentQuestionIndex + 1}`;
        document.getElementById('questions-left').textContent = `Questions left: ${totalQuestions - (currentQuestionIndex + 1)}`;
    }

    function showResult() {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        
        const resultsContainer = document.getElementById('question-review');
        resultsContainer.innerHTML = '';
    
        // Display the score at the top
        const scoreMessage = document.createElement('p');
        scoreMessage.innerHTML = `<strong>You scored ${correctAnswersCount} out of ${totalQuestions}.</strong>`;
        resultsContainer.appendChild(scoreMessage);
    
        questionsData.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.answer;
    
            const userAnswerDisplay = userAnswer 
                ? `<span class="${isCorrect ? 'highlight-green' : 'highlight-red'}">${userAnswer}</span>` 
                : 'No answer';
    
            const correctAnswerDisplay = `<span class="highlight-green">${question.answer}</span>`;
    
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
    
            resultItem.innerHTML = `
                <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                ${isCorrect ? '' : `<p>Your Answer: ${userAnswerDisplay}</p>`}
                <p>Correct Answer: ${correctAnswerDisplay}</p>
                <p>Description: ${isCorrect ? question.description : question.description || 'No explanation provided.'}</p>
            `;
    
            resultsContainer.appendChild(resultItem);
        });
    }
    
    document.querySelector('.retake-btn').addEventListener('click', function() {
        location.reload(); // Reload the page to restart the quiz
    });
       
    
    document.getElementById('next-button').addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="question' + currentQuestionIndex + '"]:checked');
        if (!selectedOption) {
            alert('Please select an answer!');
            return;
        }
        
        const userAnswer = selectedOption.value;
        userAnswers[currentQuestionIndex] = userAnswer; // Save the user's answer
    
        // Check if the answer is correct
        if (userAnswer === questionsData[currentQuestionIndex].answer) {
            correctAnswersCount++;
        }
    
        currentQuestionIndex++;
    
        if (currentQuestionIndex >= totalQuestions) {
            showResult();
        } else {
            displayQuestion(questionsData[currentQuestionIndex]);
            updateQuestionInfo();
        }
    });    
        
    
    
    document.getElementById('prev-button').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(questionsData[currentQuestionIndex]);
            updateQuestionInfo();
        }
    });
    
    

    loadQuestions();
});
