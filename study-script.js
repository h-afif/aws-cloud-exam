// Load questions, options, and answers from the JSON file and display them
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        const questionsContainer = document.getElementById('questions-container');
        
        data.forEach((item, index) => {
            // Create a new div for each question-answer pair
            const studyItem = document.createElement('div');
            studyItem.classList.add('study-item');
            
            // Question title
            const questionTitle = document.createElement('h3');
            questionTitle.textContent = `Question ${index + 1}:`;
            studyItem.appendChild(questionTitle);
            
            // Question text
            const questionText = document.createElement('p');
            questionText.textContent = item.question;
            studyItem.appendChild(questionText);
            
            // Options title
            const optionsTitle = document.createElement('h4');
            optionsTitle.textContent = 'Options:';
            studyItem.appendChild(optionsTitle);
            
            // Options list (assuming options are an array in the JSON)
            const optionsList = document.createElement('ul');
            optionsList.classList.add('options-list');
            item.options.forEach(option => {
                const optionItem = document.createElement('li');
                optionItem.textContent = option;
                optionsList.appendChild(optionItem);
            });
            studyItem.appendChild(optionsList);
            
            // Answer title
            const answerTitle = document.createElement('h4');
            answerTitle.textContent = 'Correct Answer:';
            studyItem.appendChild(answerTitle);
            
            // Answer text
            const answerText = document.createElement('p');
            answerText.textContent = item.answer;
            studyItem.appendChild(answerText);
            
            // Add the new question-answer pair to the container
            questionsContainer.appendChild(studyItem);
        });
    })
    .catch(error => {
        console.error('Error loading questions:', error);
    });
