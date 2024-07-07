class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }

    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
            <div class="card" data-name="${this.name}">
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">
                        <img src="${this.img}" alt="${this.name}">
                    </div>
                </div>
            </div>
        `;
        return cardElement;
    }

    flip() {
        this.isFlipped = true;
        this.element.querySelector(".card").classList.add("flipped");
    }

    unflip() {
        this.isFlipped = false;
        this.element.querySelector(".card").classList.remove("flipped");
    }

    toggleFlip() {
        this.isFlipped ? this.unflip() : this.flip();
    }

    matches(otherCard) {
        return this.name === otherCard.name;
    }
}

class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }

    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);
        columns = Math.max(2, Math.min(columns, 12));
        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }
        return columns;
    }

    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }

    render() {
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element.querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }

    shuffleCards() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    reset() {
        this.shuffleCards();
        this.flipDownAllCards();
        this.render();
    }

    flipDownAllCards() {
        this.cards.forEach(card => card.unflip());
    }

    onCardClicked(card) {
        if (this.onCardClick) {
            this.onCardClick(card);
        }
    }
}

class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;
        this.flippedCards = [];
        this.matchedCards = [];
        this.moveCount = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.flipDuration = this.#validateFlipDuration(flipDuration);
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.board.reset();
        this.startTimer();
    }

    #validateFlipDuration(flipDuration) {
        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            alert("La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms");
            return 350;
        }
        return flipDuration;
    }

    #handleCardClick(card) {
        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);
            this.moveCount++;
            if (this.flippedCards.length === 2) {
                setTimeout(() => this.checkForMatch(), this.flipDuration);
            }
        }
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        if (card1.matches(card2)) {
            this.matchedCards.push(card1, card2);
            if (this.matchedCards.length === this.board.cards.length) {
                this.endGame();
            }
        } else {
            card1.unflip();
            card2.unflip();
        }
        this.flippedCards = [];
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            console.log(`Time: ${this.timer}s`);
        }, 1000);
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.showEndgameModal();
    }

    showEndgameModal() {
        const modal = document.getElementById("endgame-modal");
        document.getElementById("modal-time").innerText = `Tiempo: ${this.timer}s`;
        document.getElementById("modal-moves").innerText = `Movimientos: ${this.moveCount}`;
        modal.classList.add("is-active");
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.flippedCards = [];
        this.matchedCards = [];
        this.moveCount = 0;
        this.timer = 0;
        this.board.reset();
        this.startTimer();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        { name: "Python", img: "./img/Python.svg" },
        { name: "JavaScript", img: "./img/JS.svg" },
        { name: "Java", img: "./img/Java.svg" },
        { name: "CSharp", img: "./img/CSharp.svg" },
        { name: "Go", img: "./img/Go.svg" },
        { name: "Ruby", img: "./img/Ruby.svg" },
    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);

    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();
    });

    document.getElementById("modal-close-button").addEventListener("click", () => {
        document.getElementById("endgame-modal").classList.remove("is-active");
    });

    document.querySelector(".modal-close").addEventListener("click", () => {
        document.getElementById("endgame-modal").classList.remove("is-active");
    });
});
