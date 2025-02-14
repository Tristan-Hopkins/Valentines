function initializePuzzle(container) {
   let attempts = 0;
   const messages = [
       "Very close... try again! Just say 'srekcitstop' - it's not that hard!",
       "Hmm... a little bit louder please!",
       "One more time, you're almost there!"
   ];

   container.innerHTML = `
       <div class="p-4 text-center">
           <h2 class="text-xl font-bold mb-4">Audio Verification Required 🎤</h2>
           <p class="mb-6">Please say "potstickers" backwards</p>
           
           <div class="flex justify-center mb-4">
               <button id="record-button" 
                       class="bg-red-500 hover:bg-red-600 text-white font-bold 
                              rounded-full w-24 h-24 flex items-center justify-center
                              transform transition-transform active:scale-95">
                   <div class="flex flex-col items-center">
                       <span class="text-3xl mb-1">🎤</span>
                       <span class="text-sm">Hold to Talk</span>
                   </div>
               </button>
           </div>
           
           <div id="message" class="text-lg font-medium text-gray-700 h-8"></div>
           
           <div class="text-sm text-gray-500 mt-4">

           </div>
       </div>
   `;

   const recordButton = container.querySelector('#record-button');
   const messageDiv = container.querySelector('#message');

   const style = document.createElement('style');
   style.textContent = `
       @keyframes pulse {
           0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
           70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
           100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
       }
       
       .recording {
           animation: pulse 2s infinite;
       }

       .fullscreen-takeover {
           position: fixed;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           background: linear-gradient(45deg, #ff69b4, #ff1493);
           display: flex;
           align-items: center;
           justify-content: center;
           color: white;
           z-index: 9999;
           animation: shake 0.5s infinite;
       }

       .emoji-spam {
           animation: bounce 1s infinite;
       }

       @keyframes shake {
           0%, 100% { transform: translateX(0); }
           25% { transform: translateX(-10px); }
           75% { transform: translateX(10px); }
       }

       @keyframes bounce {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-20px); }
       }
   `;
   document.head.appendChild(style);

   let isRecording = false;
   let recordingTimeout;

   function startRecording(e) {
       e.preventDefault();
       if (isRecording) return;
       
       isRecording = true;
       recordButton.classList.add('recording');
       messageDiv.textContent = "Recording...";

       if (attempts === 1) {
           container.querySelector('p.mb-6').textContent = "Just say 'srekcitstop' - it's not that hard!";
       }
   }

   function showFullscreenTakeover() {
       const takeover = document.createElement('div');
       takeover.className = 'fullscreen-takeover';
       takeover.innerHTML = `
           <div class="text-center">
               <div class="text-6xl mb-6">🤣 GOTCHA! 🤣</div>
               <div class="text-4xl mb-8">I JUST WANTED TO HEAR YOU SAY SILLY THINGS!</div>
               <div class="text-3xl mb-6">You must have sounded SO ridiculous!</div>
               <div class="emoji-spam text-5xl mb-8">😂🤣😆😂🤣😆</div>
               <div class="text-2xl">Ok ok, you passed! I can't stop laughing!</div>
           </div>
       `;
       document.body.appendChild(takeover);

       setTimeout(() => {
           takeover.remove();
           puzzleCompleted();
       }, 3000);
   }

   function stopRecording() {
       if (!isRecording) return;
       
       isRecording = false;
       recordButton.classList.remove('recording');
       
       attempts++;
       
       if (attempts < 3) {
           messageDiv.textContent = messages[attempts - 1];
       } else {
           showFullscreenTakeover();
       }
   }

   recordButton.addEventListener('mousedown', startRecording);
   recordButton.addEventListener('touchstart', startRecording);
   recordButton.addEventListener('mouseup', stopRecording);
   recordButton.addEventListener('touchend', stopRecording);
   recordButton.addEventListener('mouseleave', stopRecording);

   recordButton.addEventListener('contextmenu', (e) => e.preventDefault());
}
