// Data for the cards
const cards = [
  {
    id: 1,
    title: "Cincinnati",
    desc:
      "In different heights and shapes, the four versions of Floema low tables offer a variety of surfaces to satisfy different needs and uses in a contract environment, from work to moments of relaxation.",
    photo:
      "https://images.unsplash.com/photo-1649011327045-624a1bd2c3e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=853&q=80"
  },
  {
    id: 2,
    title: "Daytona",
    desc:
      "The Circle Coffee table from Wendelbo emulates almost a visual trick. A frame where mass and gravity is suspended, and the slim and delicate structure support the marble top, like a hovering platform.",
    photo:
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
  },
  {
    id: 3,
    title: "Indiana",
    desc:
      "With an appearance that is at once light and elegant, the Workshop Coffee Table fits perfectly into any living room, serving as a traditional coffee table as well as side table.",
    photo:
      "https://images.unsplash.com/flagged/photo-1588262516915-e342186ecdf6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
  },
  {
    id: 4,
    title: "Amarillo",
    desc:
      "Made from sustainably sourced solid American Oak, the Duo Table is composed of two seperate tops joined together on one side. The tops are solid and carved out to create a gentle lip. ",
    photo:
      "https://images.unsplash.com/photo-1622372738946-62e02505feb3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=832&q=80"
  }
];

let currentNum = 0;

// Function to get current card
function getCurrentCard() {
  return cards[currentNum];
}

// Function to update the DOM with current card data
function updateCardDisplay() {
  const currentCard = getCurrentCard();
  document.getElementById('style-card-info-title').textContent = currentCard.title;
  document.getElementById('style-card-info-desc').textContent = currentCard.desc;
  document.querySelector('.style-card-photo img').src = currentCard.photo;
}

// Animation functions
function playForward() {
  let tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: "sine.out"
    },
    onComplete: () => {
      playReverse();
      if (currentNum >= 3) {
        currentNum = 0;
      } else {
        currentNum++;
      }
      updateCardDisplay();
    }
  });
  tl.to("#mask-1", {
    yPercent: 100,
    scaleY: 1.4
  })
    .to(
      "#mask-2",
      {
        yPercent: -100,
        scaleY: 1.4
      },
      "<"
    )
    .to(
      "#card-info-title",
      {
        clipPath: `polygon(0 0, 100% 0, 100% 0%, 0% 0%)`
      },
      "<0.4"
    )
    .to(
      "#card-info-desc",
      {
        clipPath: `polygon(0 0, 100% 0, 100% 0%, 0% 0%)`
      },
      "<0.3"
    );
}

function playReverse() {
  let tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: "sine.in"
    }
  });
  tl.to("#mask-1", {
    yPercent: -100,
    scaleY: 1.4
  })
    .to(
      "#mask-2",
      {
        yPercent: 100,
        scaleY: 1.4
      },
      "<"
    )
    .to(
      "#card-info-title",
      {
        clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`
      },
      "<0.2"
    )
    .to(
      "#card-info-desc",
      {
        clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`
      },
      "<0.3"
    );
}

// Function to handle next card
function nextCard() {
  playForward();
}

// Initialize the display
document.addEventListener('DOMContentLoaded', () => {
  updateCardDisplay();
  document.getElementById('next-card-btn').addEventListener('click', nextCard);
});
