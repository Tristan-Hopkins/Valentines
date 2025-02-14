// puzzle-3.js
function initializePuzzle(container) {
    const GRID_SIZE = 3;
    const TILE_COUNT = GRID_SIZE * GRID_SIZE;
    let tiles = Array.from({length: TILE_COUNT - 1}, (_, i) => i + 1);
    tiles.push(null);
 
    function shuffleArray(array) {
        do {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        } while (!isSolvable(array));
        return array;
    }
    
    function isSolvable(puzzle) {
        let inversions = 0;
        const puzzleWithoutNull = puzzle.filter(x => x !== null);
        
        for (let i = 0; i < puzzleWithoutNull.length - 1; i++) {
            for (let j = i + 1; j < puzzleWithoutNull.length; j++) {
                if (puzzleWithoutNull[i] > puzzleWithoutNull[j]) {
                    inversions++;
                }
            }
        }
        
        return inversions % 2 === 0;
    }
 
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            50% { transform: translateY(-50vh) scale(2); opacity: 0.6; }
            100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
 
        @keyframes tile-flip {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
 
        @keyframes sparkle {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.5); opacity: 0; }
        }
 
        @keyframes shine {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
 
        @keyframes confetti-fall {
            0% { transform: translateY(-10vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(720deg); }
        }
 
        .puzzle-tile {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(90deg, 
                transparent, rgba(255,255,255,0.2), transparent);
            background-size: 200% 100%;
            animation: shine 3s linear infinite;
        }
 
        .puzzle-tile:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(255,182,193,0.5);
            z-index: 10;
        }
 
        .tile-move {
            animation: tile-flip 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
 
        .sparkle {
            position: absolute;
            pointer-events: none;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, 
                rgba(255,255,255,1) 0%, 
                rgba(255,255,255,0.8) 25%,
                rgba(255,255,255,0.4) 50%,
                transparent 100%);
            animation: sparkle 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
 
        .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            animation: confetti-fall 2s linear forwards;
        }
 
        .victory-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, 
                rgba(255,192,203,0.9), 
                rgba(255,105,180,0.9));
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
 
    container.innerHTML = `
        <div class="p-4 text-center">
            <h2 class="text-xl font-bold mb-4">Picture Perfect! 📸</h2>
            <p class="mb-4">Remember this moment? Put the pieces together!</p>
            
            <div class="grid grid-cols-${GRID_SIZE} gap-1 mx-auto mb-4" 
                 style="width: 300px; height: 300px;" 
                 id="puzzle-grid">
                ${shuffleArray([...tiles]).map((tile, index) => `
                    <div class="puzzle-tile relative bg-gray-200 cursor-pointer" 
                         data-index="${index}"
                         style="width: 100px; height: 100px; overflow: hidden;">
                        ${tile !== null ? `
                            <div class="absolute w-full h-full" 
                                 style="background: url('/images/1-1.jpg');
                                        background-size: 300px 300px;
                                        background-position: ${-100 * ((tile - 1) % GRID_SIZE)}px ${-100 * Math.floor((tile - 1) / GRID_SIZE)}px;">
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            <button id="shuffle-button" 
                    class="bg-pink-500 text-white px-4 py-2 rounded-full 
                           hover:bg-pink-600 transition-colors">
                Shuffle
            </button>
        </div>
    `;
 
    let currentTiles = shuffleArray([...tiles]);
    let cheatMoves = null;
    
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    }
 
    function createConfetti() {
        const colors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0000ff', '#8800ff'];
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
    }
 
    function showVictoryAnimation() {
        const overlay = document.createElement('div');
        overlay.className = 'victory-overlay';
        overlay.innerHTML = `
            <h1 style="font-size: 3rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                PUZZLE COMPLETE! 🎉
            </h1>
            <p style="font-size: 1.5rem; color: white; margin-top: 1rem;">
                You're amazing! 💖
            </p>
        `;
        document.body.appendChild(overlay);
 
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createConfetti();
                if (i % 2 === 0) {
                    const heart = document.createElement('div');
                    heart.textContent = ['❤️', '💖', '💝', '💕', '💗'][Math.floor(Math.random() * 5)];
                    heart.style.cssText = `
                        position: fixed;
                        left: ${Math.random() * 100}vw;
                        top: ${Math.random() * 100}vh;
                        font-size: ${Math.random() * 2 + 1}rem;
                        animation: float-up ${Math.random() * 2 + 1}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                        z-index: 1000;
                    `;
                    document.body.appendChild(heart);
                    setTimeout(() => heart.remove(), 2000);
                }
            }, i * 50);
        }
 
        setTimeout(() => {
            overlay.remove();
            puzzleCompleted();
        }, 2000);
    }
 
    function updateTiles() {
        const tileElements = container.querySelectorAll('.puzzle-tile');
        tileElements.forEach((element, index) => {
            const tile = currentTiles[index];
            if (tile === null) {
                if (checkWin()) {
                    // Puzzle solved! Show the missing piece (tile 9)
                    const missingTile = TILE_COUNT; // which is 9
                    const bgPosX = -100 * ((missingTile - 1) % GRID_SIZE);
                    const bgPosY = -100 * Math.floor((missingTile - 1) / GRID_SIZE);
                    element.innerHTML = `
                        <div class="absolute w-full h-full" 
                             style="background: url('/images/1-1.jpg');
                                    background-size: 300px 300px;
                                    background-position: ${bgPosX}px ${bgPosY}px;">
                        </div>
                    `;
                } else {
                    element.innerHTML = '';
                }
            } else {
                element.innerHTML = `
                    <div class="absolute w-full h-full" 
                         style="background: url('/images/1-1.jpg');
                                background-size: 300px 300px;
                                background-position: ${-100 * ((tile - 1) % GRID_SIZE)}px ${-100 * Math.floor((tile - 1) / GRID_SIZE)}px;">
                    </div>
                `;
            }
        });
    }
    
 
    function checkWin() {
        return currentTiles.every((tile, index) => {
            if (index === TILE_COUNT - 1) {
                return tile === null;
            }
            return tile === index + 1;
        });
    }
 
    function getLegalMoves(emptyIndex) {
        const row = Math.floor(emptyIndex / GRID_SIZE);
        const col = emptyIndex % GRID_SIZE;
        let moves = [];
        if (row > 0) moves.push(emptyIndex - GRID_SIZE);
        if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE);
        if (col > 0) moves.push(emptyIndex - 1);
        if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1);
        return moves;
    }
 
    function handleTileClick(index) {
        const emptyIndex = currentTiles.indexOf(null);
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
        const emptyCol = emptyIndex % GRID_SIZE;
        
        if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
            const clickedTile = container.querySelectorAll('.puzzle-tile')[index];
            clickedTile.classList.add('tile-move');
            
            createSparkle(
                clickedTile.getBoundingClientRect().left + 50,
                clickedTile.getBoundingClientRect().top + 50
            );
 
            [currentTiles[index], currentTiles[emptyIndex]] = 
            [currentTiles[emptyIndex], currentTiles[index]];
            
            updateTiles();
            
            setTimeout(() => {
                clickedTile.classList.remove('tile-move');
            }, 300);
 
            if (checkWin()) {
                setTimeout(showVictoryAnimation, 300);
            }
        }
    }
 
    container.querySelector('#puzzle-grid').addEventListener('click', (e) => {
        const tile = e.target.closest('.puzzle-tile');
        if (tile) {
            const index = parseInt(tile.dataset.index);
            handleTileClick(index);
        }
    });
 
    container.querySelector('#shuffle-button').addEventListener('click', () => {
        if (cheatMoves === null) {
            currentTiles = [...tiles];
            cheatMoves = [];
            const movesCount = 10;
            let emptyIndex = currentTiles.indexOf(null);
            
            for (let i = 0; i < movesCount; i++) {
                let legalMoves = getLegalMoves(emptyIndex);
                if (cheatMoves.length > 0) {
                    const lastMove = cheatMoves[cheatMoves.length - 1];
                    legalMoves = legalMoves.filter(move => move !== lastMove.emptyIndex);
                }
                const chosenMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
                cheatMoves.push({ tileIndex: chosenMove, emptyIndex: emptyIndex });
                [currentTiles[emptyIndex], currentTiles[chosenMove]] = [currentTiles[chosenMove], currentTiles[emptyIndex]];
                emptyIndex = chosenMove;
            }
            updateTiles();
        } else if (cheatMoves.length > 0) {
            const move = cheatMoves.pop();
            const currentEmptyIndex = currentTiles.indexOf(null);
            
            const movedTile = container.querySelectorAll('.puzzle-tile')[move.emptyIndex];
            movedTile.classList.add('tile-move');
            
            [currentTiles[currentEmptyIndex], currentTiles[move.emptyIndex]] = 
            [currentTiles[move.emptyIndex], currentTiles[currentEmptyIndex]];
            
            updateTiles();
            
            setTimeout(() => {
                movedTile.classList.remove('tile-move');
            }, 300);
 
            if (cheatMoves.length === 0) {
                setTimeout(showVictoryAnimation, 300);
            }
        }
    });
 
    let lastMousePosition = { x: 0, y: 0 };
    document.addEventListener('mousemove', (e) => {
        const distance = Math.sqrt(
            Math.pow(e.clientX - lastMousePosition.x, 2) +
            Math.pow(e.clientY - lastMousePosition.y, 2)
        );
        
        if (distance > 30) {
            createSparkle(e.clientX, e.clientY);
            lastMousePosition = { x: e.clientX, y: e.clientY };
        }
    });
 
    updateTiles();
 }