let flashcards = [];
let currentCardIndex = 0;
let showingAnswer = false;
let correctCount = 0;
let totalCount = 0;

const flashcardElement = document.getElementById('flashcard');
const scoreElement = document.getElementById('score');

// Check if we have questions in localStorage
window.addEventListener('load', function() {
  const savedQuestions = localStorage.getItem('generatedQuestions');
  if (savedQuestions) {
    try {
      flashcards = JSON.parse(savedQuestions);
      if (flashcards.length > 0) {
        renderCard();
        updateScore();
      } else {
        flashcardElement.textContent = 'No questions available. Please generate some questions first.';
      }
    } catch (err) {
      flashcardElement.textContent = 'Error loading questions. Please generate new questions.';
    }
  } else {
    flashcardElement.textContent = 'No questions available. Please generate some questions first.';
  }
});

function updateScore() {
  scoreElement.textContent = `Correct: ${correctCount} / ${totalCount}`;
}

function renderCard() {
  if (flashcards.length === 0) return;
  const card = flashcards[currentCardIndex];
  flashcardElement.textContent = showingAnswer ? card.answer : card.question;
}

function goBack() {
  window.location.href = './index.html';
}

// Click to flip functionality
function flipCard() {
  if (flashcards.length === 0) return;
  showingAnswer = !showingAnswer;
  renderCard();
}

// Navigation functions
function nextCard() {
  if (flashcards.length === 0) return;
  currentCardIndex = (currentCardIndex + 1) % flashcards.length;
  showingAnswer = false;
  renderCard();
}

function previousCard() {
  if (flashcards.length === 0) return;
  currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
  showingAnswer = false;
  renderCard();
}

// Answer marking functions
function markCorrect() {
  if (flashcards.length === 0 || !showingAnswer) return;
  correctCount++;
  totalCount++;
  updateScore();
  // Move to next card after answering
  currentCardIndex = (currentCardIndex + 1) % flashcards.length;
  showingAnswer = false;
  renderCard();
}

function markIncorrect() {
  if (flashcards.length === 0 || !showingAnswer) return;
  totalCount++;
  updateScore();
  // Move to next card after answering
  currentCardIndex = (currentCardIndex + 1) % flashcards.length;
  showingAnswer = false;
  renderCard();
}

// Add click event listener to flashcard
flashcardElement.addEventListener('click', flipCard);

// Keyboard event listeners (still work for desktop users)
document.addEventListener('keydown', function (e) {
  if (flashcards.length === 0) return;

  if (e.code === 'Space') {
    flipCard();
    e.preventDefault();
  } else if (e.code === 'ArrowRight') {
    nextCard();
  } else if (e.code === 'ArrowLeft') {
    previousCard();
  } else if (e.key === '1') {
    markCorrect();
  } else if (e.key === '2') {
    markIncorrect();
  }
}); 