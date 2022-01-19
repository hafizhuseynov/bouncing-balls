//Setting canvas
const caption = document.querySelector('h1');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
let balls = [];

caption.style.marginLeft = `${width / 2}px`;
caption.style.marginRight = `${width / 2}px`;
caption.style.marginTop = `${height / 2}px`;
caption.style.marginBottom = `${height / 2}px`;

function random(min, max) {
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	return num;
};

function isAllTaken(balls) {
	for (let i = 0; i < balls.length; i++) {
		if (balls[i].exists === true) return false;
	}
	return true;
};

function isTouchDevice() {
	return (('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0));
};

function createBalls() {
	while (balls.length < 20) {
		let size = random(10, 20);
		let ball = new Ball(
			random(size, width - size),
			random(size, height - size),
			random(-8, 8),
			random(-8, 8),
			'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')', size, true
		);
		balls.push(ball);
	};
}

function startGame() {
	ctx.fillStyle = 'rgba(0,0,0,0.25)';
	ctx.fillRect(0, 0, width, height);
	createBalls();
  myReq = requestAnimationFrame(startGame);
	for (let i = 0; i < balls.length; i++) {
		if (balls[i].exists) {
			balls[i].draw();
			balls[i].update();
			balls[i].collisionDetect();
      evilCircle.draw();
			evilCircle.checkBounds();
			evilCircle.collisionDetect();
		};
	};
	if (isAllTaken(balls)) {
		setTimeout(() => {
			cancelAnimationFrame(myReq);
      balls.length = 0;
			caption.style.display = 'block';
			caption.style.opacity = 1;
		}, 500);
	}
};

function startAgain() {
	balls.map(ball => ball.exists = true);
	caption.style.display = 'none';
	evilCircle._size = 10;
	startGame();
}

function handleClick(element,event){
  switch(event.type){
    case 'mousedown':
      if (Math.abs(event.offsetX - element.x) <= element._size && Math.abs(event.offsetY - element.y) <= element._size) {
				element._isTaken = true;
			};
      break;
    case 'mousemove':
      if (element._isTaken === true) {
				element.x = event.offsetX;
				element.y = event.offsetY;
			};
      break;
    case 'mouseup':
      if (element._isTaken === true) {
				element._isTaken = false;
			};
      break;
    default: break;
  }
}

function handleTouch(element, event){
  var touch = event.touches[0];
  switch(event.type){
    case 'touchstart':
      if (Math.abs(touch.pageX - element.x) <= element._size && Math.abs(touch.pageY - element.y) <= element._size) {
				element._isTaken = true;
			};
      break;
    case 'touchmove':
			if (element._isTaken === true) {
				element.x = touch.pageX;
				element.y = touch.pageY;
			};
      break;
    case 'touchend':
      if (element._isTaken === true) {
				element._isTaken = false;
			};
      break;
    default: break;
  }
}

class Shape {
	constructor(x, y, velX, velY, exists) {
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;
		this.exists = exists;
	};
  

	draw() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
	}

	update() {
		if ((this.x + this.size) >= width) {
			this.velX = -(this.velX);
		};
		if ((this.x - this.size) <= 0) {
			this.velX = -(this.velX);
		};
		if ((this.y + this.size) >= height) {
			this.velY = -(this.velY);
		};
		if ((this.y - this.size) <= 0) {
			this.velY = -(this.velY);
		};
		this.x += this.velX;
		this.y += this.velY;
	};
}

class Ball extends Shape {
	constructor(x, y, velX, velY, color, size, exists) {
		super(x, y, velX, velY, exists);
		this.color = color;
		this.size = size;
	};

	collisionDetect() {
		for (let j = 0; j < balls.length; j++) {
			if (!(this === balls[j]) && balls[j].exists) {
				const dx = this.x - balls[j].x;
				const dy = this.y - balls[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < this.size + balls[j].size) {
          this.color = `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
          //TODO Momentum and Collision rules.
				};
			};
		};
	};
};

class EvilCircle extends Shape {
	constructor(size, x, y, exists) {
		super(x, y, 20, 20, exists);
		this._color = 'white';
		this._size = size;
		this._isTaken = false;
	};

	get size() {
		return this._size;
	};

	draw() {
		ctx.beginPath();
		ctx.strokeStyle = this._color;
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.lineWidth = 3;
		ctx.stroke();
	};

	checkBounds() {
		if ((this.x + this.size) >= width) {
			this.x = width;
		}
		if ((this.x - this.size) <= 0) {
			this.x = 0;
		}
		if ((this.y + this.size) >= height) {
			this.y = height;
		}
		if ((this.y - this.size) <= 0) {
			this.y = 0;
		};
	};

	setDesktopControls() {
		let _this = this;

    //Controls whenever arrow buttons and 'W' 'A' 'S' 'D' pressed.
		window.onkeydown = function (e) {
			if (e.key === 'a' || e.key === 'ArrowLeft') {
				_this.x -= _this.velX;
			} else if (e.key === 'd' || e.key === 'ArrowRight') {
				_this.x += _this.velX;
			} else if (e.key === 'w' || e.key === 'ArrowUp') {
				_this.y -= _this.velY;
			} else if (e.key === 's' || e.key === 'ArrowDown') {
				_this.y += _this.velY;
			};
		};

    //Handling mouse events, take circle, move circle and leave circle 
		canvas.addEventListener('mousedown', event => {
			handleClick(this,event);
		});

		canvas.addEventListener('mousemove', event => {
			handleClick(this,event);
		});

		canvas.addEventListener('mouseup', event => {
			handleClick(this,event);
		});
	};

	setMobileControls() {
    //Handling touch events, take circle, move circle and leave circle
    canvas.addEventListener('touchstart', (event) => {
			handleTouch(this,event);
		});

		canvas.addEventListener('touchmove', (event) => {
			handleTouch(this,event);
		});

		canvas.addEventListener('touchend', (event) => {
			handleTouch(this,event);
		});		
	}

	collisionDetect() {
		for (let j = 0; j < balls.length; j++) {
      //Detect collision by distance between evil circle and ball
			if (balls[j].exists) {
				const dx = this.x - balls[j].x;
				const dy = this.y - balls[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
        //Disappear ball
        //Make evil Circle in the color of ball
        //Grow evil circle relative to ball's size
				if (distance < this.size + balls[j].size) {
					balls[j].exists = false;
					evilCircle._color = balls[j].color;
					this._size += 0.1 * balls[j].size;
				};
			};
		};
	};
}

let evilCircle = new EvilCircle(
  size=13,
	random(2*size, width - 2*size),
	random(2*size, height - 2*size),
	true
);

(isTouchDevice()) ? evilCircle.setMobileControls() : evilCircle.setDesktopControls();

startGame();
