// ----- 5 SENSES QUIZ DATA (fun & educational) -----
const sensesQuiz = [
  {
    question: "Which sense helps you enjoy the smell of freshly baked cookies?",
    options: ["Taste", "Smell", "Touch", "Hearing"],
    correct: 1,  // Smell
    explanation: "👃 Your nose detects aromas through the olfactory system — that's the sense of smell!"
  },
  {
    question: "When you listen to your favorite song, which sense is active?",
    options: ["Sight", "Touch", "Hearing", "Smell"],
    correct: 2,  // Hearing
    explanation: "👂 Hearing (audition) allows you to perceive sound waves and enjoy music."
  },
  {
    question: "Feeling the warmth of sunshine on your skin involves which sense?",
    options: ["Taste", "Smell", "Sight", "Touch"],
    correct: 3,  // Touch
    explanation: "✋ Your skin senses temperature, pressure, and pain — that's the sense of touch!"
  },
  {
    question: "Which sense do you use to see a beautiful rainbow after rain?",
    options: ["Hearing", "Sight", "Taste", "Smell"],
    correct: 1,  // Sight
    explanation: "👁️ Your eyes capture light and color — sight lets you enjoy the world's beauty."
  },
  {
    question: "Eating a slice of lemon pie activates your sense of _____.",
    options: ["Touch", "Smell", "Taste", "Hearing"],
    correct: 2,  // Taste
    explanation: "👅 Taste buds on your tongue detect sweet, sour, salty, bitter, and umami flavors!"
  },
  {
    question: "Which two senses work together most when eating food?",
    options: ["Sight & Hearing", "Smell & Taste", "Touch & Smell", "Hearing & Touch"],
    correct: 1,  // Smell & Taste
    explanation: "🍽️ Smell and taste are closely linked — that's why food seems bland when you have a stuffy nose!"
  },
  {
    question: "What sense helps you know if a surface is rough or smooth?",
    options: ["Sight", "Hearing", "Smell", "Touch"],
    correct: 3,  // Touch
    explanation: "🖐️ Your skin's receptors detect texture, vibration, and pressure — touch at work!"
  },
  {
    question: "Which organ is primarily responsible for the sense of hearing?",
    options: ["Skin", "Nose", "Ears", "Eyes"],
    correct: 2,  // Ears
    explanation: "👂 The ears capture sound waves and send signals to the brain — amazing, right?"
  }
];

// Game state
let currentIdx = 0;
let userSelections = new Array(sensesQuiz.length).fill(null);   // stores selected option index
let quizFinished = false;
let answerLock = false;

const dynamicContainer = document.getElementById("quizDynamicArea");

// Helper: calculate current score
function computeScore() {
  let score = 0;
  for (let i = 0; i < sensesQuiz.length; i++) {
    if (userSelections[i] !== null && userSelections[i] === sensesQuiz[i].correct) {
      score++;
    }
  }
  return score;
}

// Helper to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
    return c;
  });
}

// Render main quiz view
function renderQuestion() {
  if (quizFinished) {
    renderResultScreen();
    return;
  }

  const currentQ = sensesQuiz[currentIdx];
  const selectedAns = userSelections[currentIdx];
  const isAnswered = selectedAns !== null;

  // Build options html
  let optionsHtml = '';
  
  currentQ.options.forEach((opt, idx) => {
    let additionalClass = '';
    let iconSymbol = '';
    // assign a playful icon based on option content
    if (opt.toLowerCase().includes('smell')) iconSymbol = '👃';
    else if (opt.toLowerCase().includes('taste')) iconSymbol = '👅';
    else if (opt.toLowerCase().includes('touch')) iconSymbol = '✋';
    else if (opt.toLowerCase().includes('sight') || opt.toLowerCase().includes('see')) iconSymbol = '👁️';
    else if (opt.toLowerCase().includes('hear') || opt.toLowerCase().includes('ear')) iconSymbol = '👂';
    else iconSymbol = '🔍';
    
    // apply styles if answer is already submitted
    if (isAnswered) {
      if (idx === currentQ.correct) {
        additionalClass = 'correct-highlight';
      } else if (idx === selectedAns && idx !== currentQ.correct) {
        additionalClass = 'wrong-highlight';
      } else {
        additionalClass = 'disabled-opt';
      }
    }
    
    const disabledAttr = isAnswered ? 'disabled' : '';
    
    optionsHtml += `
      <button class="sense-option ${additionalClass}" data-opt-index="${idx}" ${disabledAttr}>
        <span class="option-icon">${iconSymbol}</span>
        <span>${escapeHtml(opt)}</span>
      </button>
    `;
  });
  
  // feedback area if answered
  let feedbackHtml = '';
  if (isAnswered) {
    const isUserCorrect = (selectedAns === currentQ.correct);
    const correctAnswerText = currentQ.options[currentQ.correct];
    feedbackHtml = `
      <div class="feedback-message">
        ${isUserCorrect ? '✅ Yay! ' : '❌ Oops! '}
        ${escapeHtml(currentQ.explanation)}
        ${!isUserCorrect ? `<br><strong>✨ Correct answer: ${escapeHtml(correctAnswerText)}</strong>` : ''}
      </div>
    `;
  } else {
    feedbackHtml = `<div class="feedback-message">🌈 Tap an answer — let's explore your senses!</div>`;
  }
  
  const progress = currentIdx + 1;
  const total = sensesQuiz.length;
  const currentScore = computeScore();
  
  const quizHtml = `
    <div class="quiz-stats">
      <div class="badge"><span>🔍 QUESTION</span> <span>${progress}/${total}</span></div>
      <div class="badge"><span>🏆 SCORE</span> <span>${currentScore}/${total}</span></div>
    </div>
    <div class="quiz-body">
      <div class="question-box">
        <div class="question-text">${escapeHtml(currentQ.question)}</div>
      </div>
      <div class="options-area" id="optionsContainer">
        ${optionsHtml}
      </div>
      ${feedbackHtml}
      <button class="next-btn" id="nextSenseBtn" ${!isAnswered ? 'disabled' : ''}>
        ${currentIdx === total - 1 ? '🎉 FINISH QUIZ 🎉' : '➡ NEXT SENSE'}
      </button>
    </div>
    <footer>🌟 Five senses make our world magical — learn & play!</footer>
  `;
  
  dynamicContainer.innerHTML = quizHtml;
  
  // attach option click handlers
  const optButtons = document.querySelectorAll('.sense-option');
  optButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (answerLock || userSelections[currentIdx] !== null || quizFinished) return;
      const selectedIdx = parseInt(btn.dataset.optIndex);
      handleAnswer(selectedIdx);
    });
  });
  
  // next button handler
  const nextBtn = document.getElementById('nextSenseBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (userSelections[currentIdx] === null) return;
      goToNextQuestion();
    });
  }
}

function handleAnswer(selectedIdx) {
  if (answerLock) return;
  if (userSelections[currentIdx] !== null) return;
  
  // save answer
  userSelections[currentIdx] = selectedIdx;
  answerLock = true;
  // re-render to show result, feedback and enable next
  renderQuestion();
  answerLock = false;
}

function goToNextQuestion() {
  if (currentIdx === sensesQuiz.length - 1) {
    // finish quiz
    quizFinished = true;
    renderQuestion(); // will show result screen
  } else {
    currentIdx++;
    renderQuestion();
  }
}

// Result screen with detailed review
function renderResultScreen() {
  const totalQ = sensesQuiz.length;
  const finalScore = computeScore();
  const percentage = Math.round((finalScore / totalQ) * 100);
  
  let motivational = '';
  if (percentage === 100) motivational = '🌟 Sensory Superstar! You know all five senses perfectly! 🌟';
  else if (percentage >= 70) motivational = '👏 Great job! You have sharp sensory knowledge! 👏';
  else if (percentage >= 50) motivational = '👍 Good try! A little review and you’ll master the senses!';
  else motivational = '📚 Keep exploring! The world of senses is fascinating — try again!';
  
  // build detailed answer review
  let reviewHtml = '';
  for (let i = 0; i < sensesQuiz.length; i++) {
    const q = sensesQuiz[i];
    const userChoice = userSelections[i];
    const isCorrect = (userChoice === q.correct);
    const userAnswerText = (userChoice !== null) ? q.options[userChoice] : 'Not answered';
    const correctText = q.options[q.correct];
    
    reviewHtml += `
      <div class="review-item">
        <div style="font-weight: 800; margin-bottom: 8px;">❓ ${escapeHtml(q.question)}</div>
        <div style="font-size: 0.9rem;">🧠 Your answer: <strong style="color: ${isCorrect ? '#2b7a2e' : '#c7362b'}">${escapeHtml(userAnswerText)}</strong> ${isCorrect ? '✓' : '✗'}</div>
        <div style="font-size: 0.85rem; color: #b45f2b;">✅ Correct: ${escapeHtml(correctText)}</div>
        <div style="font-size: 0.8rem; margin-top: 6px; color: #5a3e28;">📘 ${escapeHtml(q.explanation)}</div>
      </div>
    `;
  }
  
  const resultHtml = `
    <div class="quiz-body result-screen">
      <div class="result-emoji">🎉🧠✨</div>
      <h2 style="margin: 10px 0 0; font-size: 1.8rem;">Your Senses Score</h2>
      <div class="final-score">${finalScore} / ${totalQ}</div>
      <div style="font-size: 1.2rem; font-weight: 500;">${percentage}% • ${motivational}</div>
      
      <div class="answer-review">
        <h3 style="margin: 20px 0 12px; font-size: 1.2rem;">📖 Detailed review</h3>
        ${reviewHtml}
      </div>
      
      <button class="restart-quiz" id="restartSenseQuiz">🔄 PLAY AGAIN</button>
    </div>
    <footer>🌈 Keep using your senses — every day is an adventure!</footer>
  `;
  
  dynamicContainer.innerHTML = resultHtml;
  const restartBtn = document.getElementById('restartSenseQuiz');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      resetFullQuiz();
    });
  }
}

// Reset everything
function resetFullQuiz() {
  currentIdx = 0;
  userSelections = new Array(sensesQuiz.length).fill(null);
  quizFinished = false;
  answerLock = false;
  renderQuestion();
}

// Initial render
function initQuiz() {
  renderQuestion();
}

// Start the quiz when page loads
initQuiz();