// Wedding App JavaScript

const questions = [
    "Will the ceremony start on time?",
    "Will the groom cry during the ceremony?",
    "Will someone give a toast over 5 minutes?",
    "Will will the bride mention sports in her speech?",
    "Willl the groom inclue a a drinking anecdote in his speech?",
    "Will the band play a Taylor Swift song?",
    "Will the bride change dresses after the wedding and before the reception?",
];

// Store user answers
const userAnswers = {};

document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questions-container');
    let currentQuestionIndex = 0;
    
    // Create question boxes
    questions.forEach((question, index) => {
        const questionBox = document.createElement('div');
        questionBox.className = 'question-box';
        questionBox.dataset.questionId = index;
        
        // Only show the first question initially
        if (index === 0) {
            questionBox.classList.add('active');
        }
        
        questionBox.innerHTML = `
            <div class="question-text">${question}</div>
            <div class="question-options">
                <button class="option-btn yes-btn" data-answer="yes" data-question-id="${index}">Yes</button>
                <button class="option-btn no-btn" data-answer="no" data-question-id="${index}">No</button>
            </div>
        `;
        
        questionsContainer.appendChild(questionBox);
    });
    
    // Function to show next question
    function showNextQuestion() {
        // Hide current question
        const currentBox = document.querySelector(`[data-question-id="${currentQuestionIndex}"]`);
        if (currentBox) {
            currentBox.classList.remove('active');
            currentBox.classList.add('answered');
        }
        
        // Show next question
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            const nextBox = document.querySelector(`[data-question-id="${currentQuestionIndex}"]`);
            if (nextBox) {
                setTimeout(() => {
                    nextBox.classList.add('active');
                }, 300);
            }
        }
    }
    
    // Handle yes/no button clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-btn')) {
            const btn = e.target;
            const questionId = parseInt(btn.dataset.questionId);
            const answer = btn.dataset.answer;
            const questionBox = btn.closest('.question-box');
            
            // Only process if this is the active question
            if (!questionBox.classList.contains('active')) {
                return;
            }
            
            // Remove selected class from both buttons in this question
            questionBox.querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('selected');
            });
            
            // Add selected class to clicked button
            btn.classList.add('selected');
            
            // Store the answer
            userAnswers[questionId] = answer;
            
            // Save to localStorage
            localStorage.setItem('weddingBettingAnswers', JSON.stringify(userAnswers));
            
            console.log(`Question ${questionId}: ${answer}`);
            
            // Show next question after a short delay
            setTimeout(() => {
                showNextQuestion();
            }, 500);
        }
    });
    
    // Load saved answers and determine current question
    const savedAnswers = localStorage.getItem('weddingBettingAnswers');
    if (savedAnswers) {
        const answers = JSON.parse(savedAnswers);
        const answeredQuestionIds = Object.keys(answers).map(id => parseInt(id)).sort((a, b) => a - b);
        
        // Show all answered questions as answered
        answeredQuestionIds.forEach(questionId => {
            const answer = answers[questionId];
            const questionBox = document.querySelector(`[data-question-id="${questionId}"]`);
            if (questionBox) {
                const btn = questionBox.querySelector(`[data-answer="${answer}"]`);
                if (btn) {
                    btn.classList.add('selected');
                }
                questionBox.classList.add('answered');
                questionBox.classList.remove('active');
            }
        });
        
        // Find the first unanswered question
        const lastAnsweredId = answeredQuestionIds.length > 0 ? answeredQuestionIds[answeredQuestionIds.length - 1] : -1;
        currentQuestionIndex = lastAnsweredId + 1;
        
        // Show the current question if there are more questions
        if (currentQuestionIndex < questions.length) {
            const currentBox = document.querySelector(`[data-question-id="${currentQuestionIndex}"]`);
            if (currentBox) {
                currentBox.classList.add('active');
            }
        }
    }
    
    console.log('Wedding App initialized!');
});
