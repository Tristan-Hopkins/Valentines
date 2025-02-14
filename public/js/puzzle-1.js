// puzzle-1.js
function initializePuzzle(container) {
    const WORD = 'kayak';
    const MAX_ATTEMPTS = 5;
    let currentAttempt = 0;
    let currentGuess = '';
 
    // Array of messages to show on wrong attempts
    const wrongAttemptMessages = [
        "Wow, you really don't remember our first date? 💔",
        "I'm hurt... that was our first date! 😢", 
        "Seriously? How could you forget? 😤",
        "This is getting embarrassing... 🤦",
        "Last chance! I might cry! 😭"
    ];
 
    container.innerHTML = `
        <div class="p-2 sm:p-4">
            <h2 class="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Our First "Date" ❤️</h2>
            <p id="puzzle-prompt" class="mb-2 sm:mb-4">What did we do on our first date?</p>
            <p class="text-sm mb-2 sm:mb-4 text-gray-600">(5 letters)</p>
            
            <div id="game-board" class="grid gap-1 sm:gap-2 mx-auto mb-4" style="max-width: 300px;">
                ${Array(MAX_ATTEMPTS).fill().map(() => `
                    <div class="grid grid-cols-5 gap-1">
                        ${Array(5).fill().map(() => `
                            <div class="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 flex items-center justify-center text-xl sm:text-2xl font-bold uppercase"></div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
 
            <div id="keyboard" class="grid gap-1 sm:gap-2 mx-auto w-full" style="max-width: min(500px, 95vw);">
                            <div class="flex justify-center gap-[2px] sm:gap-1">
                    ${['q','w','e','r','t','y','u','i','o','p'].map(key => `
                        <button class="w-8 sm:w-10 h-10 sm:h-12 rounded bg-gray-200 text-black font-bold uppercase keyboard-btn text-sm sm:text-base" data-key="${key}">${key}</button>
                    `).join('')}
                </div>
                <div class="flex justify-center gap-[2px] sm:gap-1">
                    ${['a','s','d','f','g','h','j','k','l'].map(key => `
                        <button class="w-8 sm:w-10 h-10 sm:h-12 rounded bg-gray-200 text-black font-bold uppercase keyboard-btn text-sm sm:text-base" data-key="${key}">${key}</button>
                    `).join('')}
                </div>
                <div class="flex justify-center gap-[2px] sm:gap-1">
                    <button class="px-2 sm:px-4 h-10 sm:h-12 rounded bg-gray-200 text-black font-bold uppercase keyboard-btn text-sm sm:text-base" data-key="enter">↵</button>
                    ${['z','x','c','v','b','n','m'].map(key => `
                        <button class="w-8 sm:w-10 h-10 sm:h-12 rounded bg-gray-200 text-black font-bold uppercase keyboard-btn text-sm sm:text-base" data-key="${key}">${key}</button>
                    `).join('')}
                    <button class="px-2 sm:px-4 h-10 sm:h-12 rounded bg-gray-200 text-black font-bold uppercase keyboard-btn text-sm sm:text-base" data-key="backspace">←</button>
                </div>
            </div>
 
            <div id="message" class="mt-4 text-lg font-bold hidden"></div>
        </div>
    `;
 
    const messageElement = container.querySelector('#message');
    const promptElement = container.querySelector('#puzzle-prompt');
 
    function updateBoard() {
        const rows = container.querySelectorAll('#game-board > div');
        const currentRow = rows[currentAttempt];
        const cells = currentRow.querySelectorAll('div');
 
        // Clear current row
        cells.forEach((cell, i) => {
            cell.textContent = i < currentGuess.length ? currentGuess[i] : '';
        });
    }
 
    function checkGuess() {
        if (currentGuess.length !== 5) {
            showMessage('Not enough letters!');
            return;
        }
 
        const rows = container.querySelectorAll('#game-board > div');
        const currentRow = rows[currentAttempt];
        const cells = currentRow.querySelectorAll('div');
        const keyboard = container.querySelectorAll('.keyboard-btn');
 
        let remainingLetters = WORD.split('');
        const result = new Array(5).fill('wrong');
 
        // First pass: mark correct letters
        for (let i = 0; i < 5; i++) {
            if (currentGuess[i] === WORD[i]) {
                result[i] = 'correct';
                remainingLetters[i] = null;
            }
        }
 
        // Second pass: mark present letters
        for (let i = 0; i < 5; i++) {
            if (result[i] === 'wrong') {
                const letterIndex = remainingLetters.indexOf(currentGuess[i]);
                if (letterIndex !== -1) {
                    result[i] = 'present';
                    remainingLetters[letterIndex] = null;
                }
            }
        }
 
        // Update colors
        cells.forEach((cell, i) => {
            cell.style.transition = 'all 0.3s';
            setTimeout(() => {
                if (result[i] === 'correct') {
                    cell.style.backgroundColor = '#4ade80';
                    cell.style.borderColor = '#4ade80';
                } else if (result[i] === 'present') {
                    cell.style.backgroundColor = '#fbbf24';
                    cell.style.borderColor = '#fbbf24';
                } else {
                    cell.style.backgroundColor = '#9ca3af';
                    cell.style.borderColor = '#9ca3af';
                }
                cell.style.color = 'white';
            }, i * 100);
        });
 
        // Update keyboard colors
        keyboard.forEach(key => {
            const letter = key.dataset.key;
            if (letter.length === 1) {
                const guessIndices = [...currentGuess].map((char, i) => char === letter ? i : -1).filter(i => i !== -1);
                let bestResult = 'wrong';
                guessIndices.forEach(i => {
                    if (result[i] === 'correct') bestResult = 'correct';
                    else if (result[i] === 'present' && bestResult !== 'correct') bestResult = 'present';
                });
                
                const colors = {
                    correct: '#4ade80',
                    present: '#fbbf24',
                    wrong: '#9ca3af'
                };
                
                if (bestResult !== 'wrong' || !key.style.backgroundColor) {
                    key.style.backgroundColor = colors[bestResult];
                    key.style.borderColor = colors[bestResult];
                    key.style.color = 'white';
                }
            }
        });
 
        if (currentGuess === WORD) {
            showMessage('Finally! You remembered! ❤️');
            setTimeout(() => {
                puzzleCompleted();
            }, 1500);
            return;
        }
 
        // Update prompt with sassy message if wrong
        if (currentAttempt < wrongAttemptMessages.length) {
            promptElement.textContent = wrongAttemptMessages[currentAttempt];
        }
 
        currentAttempt++;
        currentGuess = '';
 
        if (currentAttempt >= MAX_ATTEMPTS) {
            showAnimatedFailMessage();
        }
    }
 
    function showMessage(text) {
        messageElement.textContent = text;
        messageElement.classList.remove('hidden');
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 2000);
    }
 
    function showAnimatedFailMessage() {
        const failMessage = document.createElement('div');
        failMessage.className = 'fixed inset-0 flex items-center justify-center bg-pink-100 bg-opacity-90 z-50';
        failMessage.innerHTML = `
            <div class="bg-white p-8 rounded-2xl shadow-xl text-center relative overflow-hidden">
                <h2 class="text-4xl font-bold mb-4 animate-bounce">💔😭💔</h2>
                <p class="text-2xl mb-4 animate-pulse">I thought u loved me!</p>
                <div id="emoji-rain" class="absolute inset-0 pointer-events-none"></div>
                <button id="try-again" class="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors text-xl mt-4">
                    I guess u have to try again 🥺
                </button>
            </div>
        `;
        document.body.appendChild(failMessage);
 
        // Create raining emojis
        const emojiRain = failMessage.querySelector('#emoji-rain');
        for (let i = 0; i < 50; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = '😭';
            emoji.style.position = 'absolute';
            emoji.style.left = `${Math.random() * 100}%`;
            emoji.style.top = '-20px';
            emoji.style.fontSize = `${Math.random() * 20 + 10}px`;
            emoji.style.opacity = Math.random() * 0.5 + 0.5;
            emoji.style.animation = `fall ${Math.random() * 2 + 1}s linear infinite`;
            emoji.style.animationDelay = `${Math.random() * 2}s`;
            emojiRain.appendChild(emoji);
        }
 
        // Add falling animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                0% { transform: translateY(-20px); }
                100% { transform: translateY(calc(100vh + 20px)); }
            }
        `;
        document.head.appendChild(style);
 
        failMessage.querySelector('#try-again').addEventListener('click', () => {
            failMessage.remove();
            style.remove();
            resetGame();
        });
    }
 
    function resetGame() {
        currentAttempt = 0;
        currentGuess = '';
        
        // Reset prompt
        promptElement.textContent = "What did we do on our first date?";
        
        // Reset board
        const cells = container.querySelectorAll('#game-board div div');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.backgroundColor = '';
            cell.style.borderColor = '#d1d5db';
            cell.style.color = 'black';
        });
 
        // Reset keyboard
        const keys = container.querySelectorAll('.keyboard-btn');
        keys.forEach(key => {
            key.style.backgroundColor = '#e5e7eb';
            key.style.borderColor = '#e5e7eb';
            key.style.color = 'black';
        });
    }
 
    // Event listeners
    container.addEventListener('click', (e) => {
        const key = e.target.closest('.keyboard-btn');
        if (!key) return;
 
        const value = key.dataset.key;
 
        if (value === 'enter') {
            checkGuess();
        } else if (value === 'backspace') {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        } else if (currentGuess.length < 5) {
            currentGuess += value;
            updateBoard();
        }
    });
 
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkGuess();
        } else if (e.key === 'Backspace') {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        } else if (/^[a-z]$/.test(e.key) && currentGuess.length < 5) {
            currentGuess += e.key;
            updateBoard();
        }
    });
}
