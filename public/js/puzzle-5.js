function initializePuzzle(container) {
    const correctAnswer = "3u";
    let isComplete = false;
    let attempts = 0;

    const heckles = [
        "Awww I love you, but that's not right! Try distributing first! 🥺",
        "Still love you lots but... think about isolating i! 💕",
        "My love, are you even trying? Let's focus! 💝",
        "Sweetie... maybe double check your math? 💖",
        "Love you forever but PLEASE get this right! 💗",
        "You're lucky you're cute because this math... 😘"
    ];

    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatIn {
            0% { transform: scale(0.1) rotate(-180deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(10deg); opacity: 0.8; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes heartBeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.1); }
            40% { transform: scale(1); }
            60% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }

        .message-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(255,192,203,0.95), rgba(255,105,180,0.95));
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 20px;
            animation: floatIn 0.5s ease-out;
        }

        .big-message {
            font-size: 3rem;
            font-weight: bold;
            color: white;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.2);
            text-align: center;
            animation: heartBeat 1.5s ease-in-out infinite;
        }

        .sub-message {
            font-size: 1.5rem;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .floating-heart {
            position: fixed;
            font-size: 2rem;
            pointer-events: none;
            animation: float 3s ease-in-out infinite;
        }

        .try-again-btn {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 1.2rem;
            background: white;
            color: #ff69b4;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .try-again-btn:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    container.innerHTML = `
        <div class="p-4 text-center">
            <h2 class="text-xl font-bold mb-4">Solve for i:</h2>
            
            <div class="mb-6">
                <div class="text-xl font-bold mb-4">
                    <p>9x - 7i > 3(3x - 7u)</p>
                    <p class="mt-2">You must simplify and solve for i:</p>
                    <p class="text-2xl text-pink-500 mt-2">i < ___</p>
                </div>
                
                <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-4 mb-4">
                    <input type="text" 
                           id="answer-input"
                           class="w-full p-2 border-2 border-pink-300 rounded-lg text-center
                                  focus:outline-none focus:border-pink-500"
                           placeholder="Enter simplified answer">
                    
                    <button id="submit-btn"
                            class="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600">
                        Enter
                    </button>
                </div>
            </div>
        </div>
    `;

    function showMessage(message, subMessage, isSuccess) {
        const overlay = document.createElement('div');
        overlay.className = 'message-overlay';
        
        overlay.innerHTML = `
            <div class="big-message">${message}</div>
            <div class="sub-message">${subMessage}</div>
            ${!isSuccess ? '<button class="try-again-btn">Try Again 💝</button>' : ''}
        `;

        document.body.appendChild(overlay);

        // Add floating hearts
        const hearts = ['💖', '💝', '💗', '💓', '💕'];
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.top = `${Math.random() * 100}vh`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            overlay.appendChild(heart);
        }

        if (!isSuccess) {
            const tryAgainBtn = overlay.querySelector('.try-again-btn');
            tryAgainBtn.addEventListener('click', () => {
                overlay.remove();
                input.focus();
            });
        } else {
            setTimeout(() => {
                overlay.remove();
                puzzleCompleted();
            }, 3000);
        }
    }

    const input = container.querySelector('#answer-input');
    const submitBtn = container.querySelector('#submit-btn');

    function checkAnswer() {
        const userAnswer = input.value.trim().toLowerCase().replace(/\s+/g, '');
        
        if (userAnswer === correctAnswer && !isComplete) {
            isComplete = true;
            showMessage("AWW, I LOVE YOU TOO! 💝", "You got it right!", true);
        } else if (!isComplete) {
            attempts++;
            input.value = '';
            showMessage("I STILL LOVE YOU! 💖", heckles[Math.min(attempts - 1, heckles.length - 1)], false);
        }
    }

    submitBtn.addEventListener('click', checkAnswer);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    input.focus();
}
