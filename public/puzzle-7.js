function initializePuzzle(container) {
    const messages = [
        "I love you",
        "You make my heart go boom boom",
        "You're the peanut butter to my jelly",
        "You're the ctrl to my alt delete",
        "You're the last chicken nugget in my meal",
        "You make me as happy as pizza without pineapple",
        "You're the strong wifi signal to my weak battery",
        "You're the semicolon to my JavaScript",
        "You're the matched parenthesis to my code",
        "Error 404: Life not found without you"
    ];

    let currentMessageIndex = 0;
    let currentInput = '';
    let startTime = null;
    let isComplete = false;
    let aiSpeed = 90; // Starting AI WPM
    let aiProgress = 0;
    let playerProgress = 0;
    let raceInterval;

    container.innerHTML = `
        <div class="p-4 text-center">
            <h2 class="text-xl font-bold mb-4">❤️ Race Me To My Heart! ❤️</h2>
            <p class="mb-4">Type faster than me to win my heart! Current speed: ${aiSpeed} WPM</p>
            
            <div class="mb-6">
                <div id="race-track" class="relative h-16 mb-4">
                    <div class="absolute left-0 w-full h-2 bg-gray-200 top-1/2 transform -translate-y-1/2"></div>
                    <div id="ai-racer" class="absolute left-0 text-2xl transform -translate-y-1/2" style="top: 25%">🏃‍♀️</div>
                    <div id="player-racer" class="absolute left-0 text-2xl transform -translate-y-1/2" style="top: 75%">🏃</div>
                    <div class="absolute right-0 text-2xl transform -translate-y-1/2" style="top: 50%">❤️</div>
                </div>

                <div id="target-message" 
                     class="text-xl font-bold text-pink-600 mb-4 h-12 flex items-center justify-center">
                    ${messages[0]}
                </div>
                
                <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-4 mb-4">
                    <input type="text" 
                           id="typing-input"
                           class="w-full p-2 border-2 border-pink-300 rounded-lg text-center
                                  focus:outline-none focus:border-pink-500"
                           placeholder="Type here..."
                           autocomplete="off">
                </div>
                
                <div id="message" class="text-lg font-medium text-gray-700 h-8 mb-4"></div>
            </div>
        </div>
    `;

    const input = container.querySelector('#typing-input');
    const targetMessage = container.querySelector('#target-message');
    const messageDiv = container.querySelector('#message');
    const aiRacer = container.querySelector('#ai-racer');
    const playerRacer = container.querySelector('#player-racer');

    function updateRacers() {
        aiRacer.style.left = `${aiProgress}%`;
        playerRacer.style.left = `${playerProgress}%`;
    }

    function startRace() {
        if (raceInterval) clearInterval(raceInterval);
        
        const raceTime = 10000; // 10 seconds to complete
        const aiStepSize = 100 / (raceTime / 100); // Progress per 100ms
        
        raceInterval = setInterval(() => {
            aiProgress += aiStepSize * (aiSpeed / 90);
            if (aiProgress >= 100) {
                clearInterval(raceInterval);
                aiSpeed -= 10;
                messageDiv.textContent = "Too slow! Try again! My speed dropped to " + aiSpeed + " WPM";
                resetRace();
            }
            updateRacers();
        }, 100);
    }

    function resetRace() {
        aiProgress = 0;
        playerProgress = 0;
        updateRacers();
        setTimeout(startRace, 2000);
    }

    function checkInput() {
        if (currentInput === messages[currentMessageIndex]) {
            if (!startTime) {
                startTime = Date.now();
                startRace();
            }
            
            playerProgress = (currentMessageIndex + 1) / messages.length * 100;
            updateRacers();
            
            if (playerProgress >= 100) {
                clearInterval(raceInterval);
                showVictory();
                return;
            }

            currentMessageIndex++;
            currentInput = '';
            input.value = '';
            
            if (currentMessageIndex < messages.length) {
                const nextMessage = messages[currentMessageIndex];
                targetMessage.textContent = nextMessage;
            }
        }
    }

    function showVictory() {
        isComplete = true;
        const endTime = Date.now();
        const timeSeconds = ((endTime - startTime) / 1000).toFixed(1);
        
        messageDiv.textContent = `You won my heart in ${timeSeconds} seconds! 💝`;
        
        // Victory animation
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = ['💝', '💖', '💗', '💓'][Math.floor(Math.random() * 4)];
                heart.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}vw;
                    top: 100vh;
                    font-size: 2rem;
                    animation: float-up 2s ease-out forwards;
                    z-index: 1000;
                `;
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 2000);
            }, i * 100);
        }

        setTimeout(() => {
            puzzleCompleted();
        }, 2000);
    }

    input.addEventListener('input', (e) => {
        currentInput = e.target.value;
        checkInput();
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        #ai-racer, #player-racer {
            transition: left 0.1s linear;
        }
    `;
    document.head.appendChild(style);

    input.focus();
}
