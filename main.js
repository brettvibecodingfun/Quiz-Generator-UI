import { BACKEND_URL } from './config.js';

// Subcategory data for each main category
const subcategories = {
    'Sports': [
        'NBA', 'MLB', 'NFL', 'College Basketball', 'College Football', 'Olympics'
    ],
    'Geography': [
        'USA Geography', 'World Capitals', 'World Geographical Features', 'Major World Cities', 'Most Populous Countries/Cities'
    ],
    'Music': [
        'Classic Rock', 'Hip Hop', 'Country', 'Pop', 'EDM'
    ],
    'Movies/TV Shows': [
        'Actors', 'Actresses', 'Directors', 'Comedies', 'Thriller', 'Drama'
    ],
    'History': [
        'US History', 'World History', '20th century history', '21st century history'
    ]
};

const mainCategorySelect = document.getElementById('mainCategory');
const subcategoriesDiv = document.getElementById('subcategories');
const quizForm = document.getElementById('quizForm');
const customSubcategoryInput = document.getElementById('customSubcategory');
const addCustomBtn = document.getElementById('addCustomBtn');
const customSubcategoriesList = document.getElementById('customSubcategories');

// Array to store custom subcategories
let customSubcategories = [];

// Function to populate subcategories
function populateSubcategories(category) {
    subcategoriesDiv.innerHTML = '';
    
    if (category && subcategories[category]) {
        subcategories[category].forEach(subcat => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            checkboxItem.innerHTML = `
                <input type="checkbox" id="${subcat.toLowerCase().replace(/\s+/g, '-')}" 
                       name="subcategories" value="${subcat}">
                <label for="${subcat.toLowerCase().replace(/\s+/g, '-')}">${subcat}</label>
            `;
            subcategoriesDiv.appendChild(checkboxItem);
        });
        subcategoriesDiv.classList.remove('hidden');
    } else {
        subcategoriesDiv.classList.add('hidden');
    }
}

// Populate subcategories when main category changes
mainCategorySelect.addEventListener('change', function() {
    populateSubcategories(this.value);
});

// Initialize with Sports subcategories on page load
populateSubcategories('Sports');

// Add custom subcategory functionality
addCustomBtn.addEventListener('click', addCustomSubcategory);
customSubcategoryInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addCustomSubcategory();
    }
});

function addCustomSubcategory() {
    const customValue = customSubcategoryInput.value.trim();
    if (customValue && customValue.length > 0) {
        // Check if it already exists
        if (!customSubcategories.includes(customValue)) {
            customSubcategories.push(customValue);
            renderCustomSubcategories();
            customSubcategoryInput.value = '';
            addCustomBtn.disabled = true;
        }
    }
}

function removeCustomSubcategory(subcategory) {
    const index = customSubcategories.indexOf(subcategory);
    if (index > -1) {
        customSubcategories.splice(index, 1);
        renderCustomSubcategories();
    }
}

function renderCustomSubcategories() {
    customSubcategoriesList.innerHTML = '';
    customSubcategories.forEach(subcat => {
        const item = document.createElement('div');
        item.className = 'custom-subcategory-item';
        item.innerHTML = `
            <input type="checkbox" name="subcategories" value="${subcat}" checked>
            <span>${subcat}</span>
            <button type="button" class="remove-custom-btn" onclick="removeCustomSubcategory('${subcat}')">×</button>
        `;
        customSubcategoriesList.appendChild(item);
    });
}

// Enable/disable add button based on input
customSubcategoryInput.addEventListener('input', function() {
    addCustomBtn.disabled = !this.value.trim();
});

// Handle form submission
quizForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        mainCategory: mainCategorySelect.value,
        subcategories: Array.from(document.querySelectorAll('input[name="subcategories"]:checked'))
            .map(cb => cb.value),
        questionCount: document.getElementById('questionCount').value,
        difficulty: document.getElementById('difficulty').value
    };

    console.log('Form submitted with data:', formData);
    
    // Validate form data
    if (!formData.mainCategory || formData.subcategories.length === 0 || !formData.questionCount || !formData.difficulty) {
        alert('Please fill in all required fields and select at least one subcategory.');
        return;
    }

    // Format the prompt
    const subcategoriesText = formData.subcategories.join(' and ');
    const prompt = `Create me ${formData.questionCount} ${formData.difficulty} ${formData.mainCategory.toLowerCase()} trivia questions about ${subcategoriesText}. Format it as a JSON array with 'question' and 'answer' keys.`;

    console.log('Generated prompt:', prompt);

    // Send request to backend
    sendRequestToBackend(prompt, formData);
});

// Function to send request to backend
async function sendRequestToBackend(prompt, formData) {
    try {
        // Show loading state
        const generateBtn = document.querySelector('.generate-btn');
        const originalText = generateBtn.textContent;
        generateBtn.innerHTML = '<span class="spinner"></span>Generating Questions...';
        generateBtn.disabled = true;
        generateBtn.classList.add('loading');

        // Make API call to backend
        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                count: formData.questionCount,
                difficulty: formData.difficulty,
                category: formData.mainCategory,
                subcategories: formData.subcategories
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const questions = await response.json();
        console.log('Backend response:', questions);

        // Handle the response (questions data)
        if (Array.isArray(questions)) {
            // Save questions to localStorage and redirect to flashcard page
            localStorage.setItem('generatedQuestions', JSON.stringify(questions));
            window.location.href = 'flashcard.html';
        } else {
            throw new Error('Invalid response format from backend');
        }

    } catch (error) {
        console.error('Error sending request to backend:', error);
        alert('Error generating questions. Please try again.');
    } finally {
        // Reset button state
        const generateBtn = document.querySelector('.generate-btn');
        generateBtn.textContent = 'Generate Questions';
        generateBtn.disabled = false;
        generateBtn.classList.remove('loading');
    }
} 