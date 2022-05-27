import {
  colorsArray,
  randomIntFromRange,
  randomColor,
  distance,
} from "./utils/index.js";

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class MousePoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let mouseArray = [];
let ballsArray = [];

// Event listeners
let mouseIsDownLeft = false;

const resetBalls = () => {
  mouseArray = [];
  if (ballsArray.length > 1000) {
    ballsArray = ballsArray.slice(0, 1000);
  }

  ballsArray.forEach((ball) => {
    ball.update(null, null, true);
  });
};

window.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    mouseIsDownLeft = true;
  }
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    resetBalls();
  }
});

window.addEventListener("mousemove", (event) => {
  if (mouseIsDownLeft) {
    const mouse = new MousePoint(event.clientX, event.clientY);
    mouseArray.push(mouse);
  }
});

window.addEventListener("mouseup", (event) => {
  if (event.button === 0) {
    mouseIsDownLeft = false;
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

class Ball {
  constructor(default_x, default_y, target_x, target_y, radius, color) {
    this.target_x = target_x;
    this.current_x = default_x;
    this.target_y = target_y;
    this.current_y = default_y;
    this.radius = radius;
    this.color = color;
    this.dx = 0;
    this.dy = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.current_x, this.current_y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  goToWall() {
    if (this.current_y === this.radius) {
      this.dy = 0;
    } else if (this.current_y > this.radius) {
      this.dy = -5;

      if (this.current_y + this.dy <= this.radius) {
        this.dy = this.radius - this.current_y;
      }
    } else if (this.current_y < this.radius) {
      this.dy = 5;

      if (this.current_y + this.dy > this.radius) {
        this.dy = this.radius - this.current_y;
      }
    }
  }

  rollOnWall(isTopWall, isLeftWall, isBottomWall, isRightWall) {
    if (isTopWall) {
      this.dx = 1;
      this.dy = 0;
    } else if (isRightWall) {
      this.dy = 1;
      this.dx = 0;
    } else if (isBottomWall) {
      this.dx = -1;
      this.dy = 0;
    } else if (isLeftWall) {
      this.dy = -1;
      this.dx = 0;
    }
  }

  goInCircles() {
    if (this.current_y - this.radius < 0) {
      this.dy = 1;
    } else if (this.current_y + this.radius > canvas.height) {
      this.dy = -1;
    }

    if (this.current_x + this.radius > canvas.width) {
      this.dx = -1;
    } else if (this.current_x - this.radius < 0) {
      this.dx = 1;
    }

    const isTopWall =
      this.current_y - this.radius - this.dy === 0 &&
      this.current_x + this.radius < canvas.width;

    const isRightWall =
      this.current_x + this.radius + this.dx === canvas.width &&
      this.current_y + this.radius < canvas.height;

    const isBottomWall =
      this.current_y + this.radius === canvas.height &&
      this.current_x - this.radius > 0;

    const isLeftWall =
      this.current_x - this.radius === 0 && this.current_y - this.radius > 0;

    const inWalls = isTopWall || isLeftWall || isBottomWall || isRightWall;

    if (!inWalls) {
      this.goToWall(isTopWall);
    } else {
      this.rollOnWall(isTopWall, isLeftWall, isBottomWall, isRightWall);
    }
  }

  update(target_x = null, target_y = null, changeTarget = false) {
    if (changeTarget) {
      this.target_x = target_x;
      this.target_y = target_y;
    }

    if (this.target_x !== null && this.target_y !== null) {
      if (this.current_y > this.target_y) {
        this.dy = -10;

        if (this.current_y + this.dy <= this.target_y) {
          this.dy = this.target_y - this.current_y;
        }
      } else if (this.current_y < this.target_y) {
        this.dy = 10;

        if (this.current_y + this.dy > this.target_y) {
          this.dy = this.target_y - this.current_y;
        }
      } else {
        this.dy = 0;
      }

      if (this.current_x > this.target_x) {
        this.dx = -10;

        if (this.current_x + this.dx <= this.target_x) {
          this.dx = this.target_x - this.current_x;
        }
      } else if (this.current_x < this.target_x) {
        this.dx = 10;

        if (this.current_x + this.dx > this.target_x) {
          this.dx = this.target_x - this.current_x;
        }
      } else {
        this.dx = 0;
      }
    } else {
      this.goInCircles();
    }

    this.current_x += this.dx;
    this.current_y += this.dy;
    this.draw();
  }

  getTargetX() {
    return this.target_x;
  }

  getTargetY() {
    return this.target_y;
  }

  getCurrentX() {
    return this.current_x;
  }

  getCurrentY() {
    return this.current_y;
  }

  setCurrentX(currentX) {
    this.current_x = currentX;
  }

  setCurrentY(currentY) {
    this.current_y = currentY;
  }
}

const addMoreBalls = () => {
  for (let i = ballsArray.length; i < mouseArray.length; i++) {
    const radius = 10;
    const default_x = randomIntFromRange(radius, innerWidth - radius);
    const default_y = randomIntFromRange(radius, innerHeight - radius);
    const color = randomColor(colorsArray);
    const ball = new Ball(default_x, default_y, null, null, radius, color);
    ballsArray.push(ball);
  }
};

const setPointToBall = (ballsArray) => {
  let point;
  let pointsToRemoveIndex = [];

  if (ballsArray.length <= mouseArray.length) {
    addMoreBalls();
  }

  ballsArray.forEach((ball, index) => {
    if (index < mouseArray.length && ball.getTargetX() === null) {
      point = mouseArray[index];
      ball.update(point.x, point.y, true);
      pointsToRemoveIndex.push(index);
    } else {
      ball.update();
    }
  });

  pointsToRemoveIndex.forEach((index) => {
    mouseArray.splice(index, 1);
  });
};

// const calculateInvestment = (
//   growthPerYear,
//   investmentPerMonth,
//   timePeriod,
//   startingFund
// ) => {
//   const growthPerMonth = growthPerYear / 12;
//   let totalInvestment = startingFund;
//   let totalMoney = startingFund;
//   for (let i = 0; i < timePeriod * 12; i++) {
//     totalMoney = totalMoney * (1 + growthPerMonth / 100) + investmentPerMonth;
//     totalInvestment += investmentPerMonth;
//   }
//   console.log("investment", totalInvestment);
//   console.log("net income", totalMoney - totalInvestment);
//   console.log("timePeriod", timePeriod);
// console.log("total:", totalMoney);
//   return totalMoney;
// };

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  if (mouseArray.length === 0) {
    ballsArray.forEach((ball) => {
      ball.update();
    });
  } else {
    setPointToBall(ballsArray);
  }
}

function init() {
  ballsArray = [];
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < 10; i++) {
    const radius = 10;
    const default_x = randomIntFromRange(radius, innerWidth - radius);
    const default_y = randomIntFromRange(radius, innerHeight - radius);
    const color = randomColor(colorsArray);
    const ball = new Ball(default_x, default_y, null, null, radius, color);
    ballsArray.push(ball);
  }
}

init();
animate();
