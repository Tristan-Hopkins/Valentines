// puzzle-trivia.js
function initializePuzzle(container) {
   const questions = [
       {
           question: "What's my favorite color?",
           options: ["Red", "Green", "Blue", "Pink"],
           correct: 2,
           caption: "Let's start this ez... 😏",
           success: "Ok good, at least you know THAT! Let's make it harder... 😈"
       },
       {
           question: "What was the name of my first dog?", 
           options: ["Sabrina", "Luke", "Jasper", "Jeff"],
           correct: 0,
           caption: "Hmm... do you remember? 🐕",
           success: "Did you even listen when I told you about my childhood? 😤"
       },
       {
           question: "Do I love you?",
           options: ["Yes", "Definitely Yes", "Super Yes", "Super SUPER Yes"],
           correct: 3,
           caption: "This should be obvious! 💕",
           success: "You better have known this one! 💝"
       },
       {
           question: "Why did I have to get stitches on my face?",
           options: ["Fourwheeler", "Dirtbike", "Go Kart", "Hank"],
           correct: 0,
           caption: "Remember this scar? 🤕",
           success: "Time to make this REALLY hard... 😈"
       },
       {
           question: "If I could only eat ONE thing forever, what would it be?",
           options: ["Watermelon", "Potstickers", "Salad", "You 😘"],
           correct: 0,
           caption: "Choose wisely... 🍉",
           success: "OMG YOU REALLY KNOW ME! 🎉"
       }
   ];

   let currentQuestion = 0;

   function createQuestionCard(alertMessage = null, isError = false) {
       const q = questions[currentQuestion];
       return `
           <div class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center">
               ${alertMessage ? `
                   <div class="mb-4 p-3 rounded-lg ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} 
                        animate-bounce font-bold">
                       ${alertMessage}
                   </div>
               ` : ''}
               
               <div class="relative">
                   <div class="bg-pink-50 rounded-lg p-3 mb-4">
                       <h2 class="text-2xl font-bold">Question ${currentQuestion + 1}/5</h2>
<p class="text-pink-500">${q.caption}</p>
                   </div>
                   
                   <p class="text-xl mb-6 font-bold">${q.question}</p>
                   
                   <div class="space-y-3">
                       ${q.options.map((option, i) => `
                           <button class="answer-btn w-full py-3 px-6 
                                   bg-gradient-to-r from-pink-100 to-purple-100 
                                   hover:from-pink-200 hover:to-purple-200 
                                   rounded-lg transition-all transform hover:scale-105
                                   font-bold relative overflow-hidden" data-index="${i}">
                               <span class="relative z-10">${option}</span>
                               <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                                         opacity-0 hover:opacity-30 transition-opacity shine-effect"></div>
                           </button>
                       `).join('')}
                   </div>
               </div>
           </div>
       `;
   }

   function showFailAnimation() {
       container.innerHTML = `
           <div class="p-6 max-w-md mx-auto bg-pink-50 rounded-xl shadow-md text-center">
               <div class="bg-red-100 rounded-lg p-4 mb-4 animate-shake">
                   <div class="text-6xl mb-2">😭</div>
                   <h2 class="text-3xl font-bold text-red-500">WRONG ANSWER!</h2>
                   <p class="text-xl text-red-400">How could you not know this?! 💔</p>
                   <div class="mt-4 space-y-1">
                       <div class="text-3xl animate-fall">💔</div>
                       <div class="text-3xl animate-fall" style="animation-delay: 0.2s">💔</div>
                       <div class="text-3xl animate-fall" style="animation-delay: 0.4s">💔</div>
                   </div>
                   <p class="mt-4 font-bold">Starting over in 3... 2... 1...</p>
               </div>
           </div>
       `;

       setTimeout(() => {
           currentQuestion = 0;
           container.innerHTML = createQuestionCard("Let's try this again... 🙄", true);
       }, 3000);
   }

   function showSuccessAnimation() {
       container.innerHTML = `
           <div class="text-center p-6 animate-success">
               <div class="bg-green-100 rounded-lg p-6">
                   <h2 class="text-3xl font-bold mb-4">YOU REALLY DO KNOW ME! 🎉</h2>
                   <p class="text-xl mb-4">I'm so proud of you! 💖</p>
                   <div class="flex justify-center space-x-4">
                       <div class="text-5xl animate-bounce">🎊</div>
                       <div class="text-5xl animate-bounce" style="animation-delay: 0.2s">💝</div>
                       <div class="text-5xl animate-bounce" style="animation-delay: 0.4s">🎉</div>
                   </div>
               </div>
           </div>
       `;

       // Create falling confetti effect
       for(let i = 0; i < 50; i++) {
           const confetti = document.createElement('div');
           confetti.className = 'absolute confetti';
           confetti.style.left = Math.random() * 100 + 'vw';
           confetti.style.animationDelay = Math.random() * 3 + 's';
           confetti.innerHTML = ['🎉', '✨', '💖', '💝', '💕'][Math.floor(Math.random() * 5)];
           container.appendChild(confetti);
       }

       setTimeout(() => {
           puzzleCompleted();
       }, 3000);
   }

   function handleAnswer(index) {
       const q = questions[currentQuestion];
       
       if (index === q.correct) {
           if (currentQuestion === questions.length - 1) {
               showSuccessAnimation();
               return;
           }
           
           currentQuestion++;
           container.innerHTML = createQuestionCard(q.success, false);
       } else {
           showFailAnimation();
       }
   }

   // Initial render
   container.innerHTML = createQuestionCard();

   // Event delegation for answer buttons
   container.addEventListener('click', (e) => {
       const btn = e.target.closest('.answer-btn');
       if (btn) {
           const index = parseInt(btn.dataset.index);
           handleAnswer(index);
       }
   });

   // Add animations
   const style = document.createElement('style');
   style.textContent = `
       @keyframes shake {
           0%, 100% { transform: translateX(0); }
           25% { transform: translateX(-10px) rotate(-5deg); }
           75% { transform: translateX(10px) rotate(5deg); }
       }
       
       @keyframes fall {
           0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
           50% { opacity: 1; }
           100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
       }
       
       @keyframes success {
           0% { transform: scale(0.8); opacity: 0; }
           100% { transform: scale(1); opacity: 1; }
       }

       @keyframes confettiFall {
           0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
           100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
       }
       
       .animate-shake {
           animation: shake 0.5s ease-in-out infinite;
       }
       
       .animate-fall {
           animation: fall 2s ease-in-out forwards;
       }
       
       .animate-success {
           animation: success 0.5s ease-out forwards;
       }

       .confetti {
           position: fixed;
           top: -20px;
           font-size: 1.5rem;
           pointer-events: none;
           animation: confettiFall 3s linear forwards;
       }
       
       .answer-btn::after {
           content: '';
           position: absolute;
           top: -50%;
           left: -50%;
           width: 200%;
           height: 200%;
           background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
           transform: rotate(45deg);
           transition: all 0.3s;
       }
       
       .answer-btn:hover::after {
           left: 100%;
       }

       .shine-effect {
           position: absolute;
           top: 0;
           left: -100%;
           width: 100%;
           height: 100%;
           background: linear-gradient(
               120deg,
               transparent,
               rgba(255,255,255,0.3),
               transparent
           );
           animation: shine 2s infinite linear;
       }
       
       @keyframes shine {
           0% { transform: translateX(-100%); }
           100% { transform: translateX(100%); }
       }
   `;
   document.head.appendChild(style);
}
