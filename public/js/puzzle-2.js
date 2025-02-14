// puzzle-2.js
function initializePuzzle(container) {
    const WORD = 'taco bell'.replace(' ', '').toLowerCase();
    const DISPLAY_WORD = 'TACO BELL';
    let wrongGuesses = 0;
    const MAX_WRONG = 6;
    let guessedLetters = new Set();
    let gameWon = false;
 
    const heckles = [
        "Wow... our first lunch together and you forgot? 😒",
        "The disrespect is real right now... 😤",
        "I can't believe this is happening... 🤦",
        "Do you even remember dating me? 😪", 
        "Should I call your bestie for help? 📱",
        "I'm actually offended right now... 💔"
    ];
 
    function createFireworks() {
        const fireworks = document.createElement('div');
        fireworks.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(fireworks);
 
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.style.cssText = `
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: ${['#ff0', '#f0f', '#0ff', '#ff5', '#5ff'][Math.floor(Math.random() * 5)]};
                    animation: firework 1s ease-out forwards;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                `;
                
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes firework {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(30) rotate(${Math.random() * 360}deg); opacity: 0.5; }
                        100% { transform: scale(40) rotate(${Math.random() * 360}deg); opacity: 0; }
                    }
                `;
                
                document.head.appendChild(style);
                fireworks.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                    style.remove();
                }, 1000);
            }, i * 200);
        }
 
        setTimeout(() => {
            fireworks.remove();
        }, 4000);
    }
 
    function getHangmanArt(wrong) {
        const arts = [
            `
  +---+
  |   |
      |
      |
      |
      |
 =========`,
            `
  +---+
  |   |
  O   |
      |
      |
      |
 =========`,
            `
  +---+
  |   |
  O   |
  |   |
      |
      |
 =========`,
            `
  +---+
  |   |
  O   |
 /|   |
      |
      |
 =========`,
            `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
 =========`,
            `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
 =========`,
            `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
 =========`
        ];
        return arts[wrong];
    }

    function getWordDisplay() {
        const [leftPart, rightPart] = DISPLAY_WORD.split(' ');
        
        const leftDisplay = leftPart.split('').map(letter =>
          guessedLetters.has(letter.toLowerCase()) ? letter : '_'
        ).join(' ');
        
        const rightDisplay = rightPart.split('').map(letter =>
          guessedLetters.has(letter.toLowerCase()) ? letter : '_'
        ).join(' ');
        
        return `<span>${leftDisplay}</span><span style="margin: 0 0.5em;"></span><span>${rightDisplay}</span>`;
    }
      
    function updateDisplay() {
        const usedLetters = Array.from(guessedLetters).sort().join(' ').toUpperCase();
        
        container.innerHTML = `
            <div class="p-4 text-center">
                <h2 class="text-xl sm:text-2xl font-bold mb-4">After First Date Lunch 🍽️</h2>
                <p id="prompt" class="mb-4">${gameWon ? 'YES! Our special first lunch! 🎉' : 'Where did we eat after our date?'}</p>
                
                <pre class="font-mono text-sm sm:text-base mb-4 whitespace-pre">
    ${getHangmanArt(wrongGuesses)}
                </pre>
    
                <div class="mb-4 text-2xl font-bold tracking-wider" style="display: flex; justify-content: center; align-items: center;">
                    ${getWordDisplay()}
                </div>
    
                <div class="mb-4">
                    <p class="text-sm text-gray-600 mb-2">Used Letters:</p>
                    <div class="text-lg">${usedLetters || 'None'}</div>
                </div>
    
                ${!gameWon ? `
                <div class="grid grid-cols-7 sm:grid-cols-9 gap-1 max-w-md mx-auto">
                    ${Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => `
                        <button 
                            class="w-8 h-8 sm:w-10 sm:h-10 rounded ${guessedLetters.has(letter.toLowerCase()) ? 
                                'bg-gray-300 cursor-not-allowed' : 
                                'bg-pink-500 hover:bg-pink-600 text-white'} 
                        font-bold text-sm sm:text-base"
                            ${guessedLetters.has(letter.toLowerCase()) ? 'disabled' : ''}
                            data-letter="${letter}"
                        >${letter}</button>
                    `).join('')}
                </div>` : ''}
            </div>
        `;
    
        if (wrongGuesses > 0 && !gameWon) {
            container.querySelector('#prompt').textContent = heckles[wrongGuesses - 1];
        }
    }

    function showFailAnimation() {
        const failContainer = document.createElement('div');
        failContainer.id = 'fail-container';
        failContainer.className = 'fixed inset-0 flex items-center justify-center bg-pink-100 bg-opacity-90 z-50';
        failContainer.innerHTML = `
            <div class="bg-white p-8 rounded-2xl shadow-xl text-center relative overflow-hidden animate-bounce">
                <h2 class="text-4xl font-bold mb-4">💔 OH NO! 💔</h2>
                <p class="text-2xl mb-4">You let me die! How could you?! 😭</p>
                <div class="text-5xl mb-6">
                    <div class="animate-bounce">⚰️</div>
                </div>
                <button id="try-again" class="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors text-xl">
                    Try Again (Please don't kill me this time!) 🥺
                </button>
            </div>
        `;
        document.body.appendChild(failContainer);

        const style = document.createElement('style');
        style.id = 'fail-animation-style';
        style.textContent = `
            @keyframes tearfall {
                0% { transform: translateY(-20px); opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        for (let i = 0; i < 20; i++) {
            const tear = document.createElement('div');
            tear.textContent = '💧';
            tear.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -20px;
                font-size: ${Math.random() * 20 + 10}px;
                animation: tearfall ${Math.random() * 2 + 1}s linear infinite;
                animation-delay: ${Math.random()}s;
                z-index: 1000;
                pointer-events: none;
            `;
            failContainer.appendChild(tear);
        }

        failContainer.querySelector('#try-again').addEventListener('click', () => {
            const failContainer = document.querySelector('#fail-container');
            if (failContainer) failContainer.remove();
            const failStyle = document.querySelector('#fail-animation-style');
            if (failStyle) failStyle.remove();
            resetGame();
        });
    }

    function makeGuess(letter) {
        if (gameWon || guessedLetters.has(letter)) return;

        guessedLetters.add(letter);
        
        if (!WORD.includes(letter)) {
            wrongGuesses++;
            if (wrongGuesses >= MAX_WRONG) {
                showFailAnimation();
                return;
            }
        }

        if (WORD.split('').every(letter => guessedLetters.has(letter))) {
            gameWon = true;
            createFireworks();
            setTimeout(() => {
                puzzleCompleted();
            }, 1500);
        }

        updateDisplay();
    }
 
    function resetGame() {
        wrongGuesses = 0;
        guessedLetters.clear();
        gameWon = false;
        updateDisplay();
    }
 
    updateDisplay();
 
    container.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button || !button.dataset.letter) return;
 
        const letter = button.dataset.letter.toLowerCase();
        makeGuess(letter);
    });
 
    document.addEventListener('keydown', (e) => {
        if (/^[a-zA-Z]$/.test(e.key)) {
            makeGuess(e.key.toLowerCase());
        }
    });
}