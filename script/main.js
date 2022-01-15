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
			random(0 + size, width - size),
			random(0 + size, height - size),
			random(-7, 7),
			random(-7, 7),
			'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')', size, true
		);
		balls.push(ball);
	};
}

function startGame() {
	myReq = requestAnimationFrame(startGame);
	ctx.fillStyle = 'rgba(0,0,0,0.25)';
	ctx.fillRect(0, 0, width, height);
	createBalls();
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
			caption.style.display = 'block';
			caption.style.opacity = 1;
		}, 500);
	};
};

function startAgain() {
	balls.map(ball => ball.exists = true);
	caption.style.display = 'none';
	evilCircle._size = 10;
	startGame();
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

	collisionDetect() {
		for (let j = 0; j < balls.length; j++) {
			if (!(this === balls[j])) {
				const dx = this.x - balls[j].x;
				const dy = this.y - balls[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < this.size + balls[j].size) {
					balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
				};
			};
		};
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
					balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
				};
			};
		};
	};
};

class EvilCircle extends Shape {
	constructor(x, y, exists) {
		super(x, y, 20, 20, exists);
		this._color = 'white';
		this._size = 10;
		this._isTaken = false;
	};

	get size() {
		return this._size;
	}

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

		canvas.addEventListener('mousedown', e => {
			if (Math.abs(e.offsetX - _this.x) <= _this._size && Math.abs(e.offsetY - _this.y) <= _this._size) {
				_this._isTaken = true;
			}
		});

		canvas.addEventListener('mousemove', e => {
			if (_this._isTaken === true) {
				_this.x = e.offsetX;
				_this.y = e.offsetY;
			}
		});

		canvas.addEventListener('mouseup', e => {
			if (_this._isTaken === true) {
				_this._isTaken = false;
			}
		});

		caption.addEventListener('click', () => {
			startAgain();
		});
	};

	setMobileControls() {
		let _this = this;
		canvas.addEventListener('touchstart', (e) => {
			var touch = e.touches[0];
			if (Math.abs(touch.pageX - _this.x) <= _this._size && Math.abs(touch.pageY - _this.y) <= _this._size) {
				_this._isTaken = true;
			};
		});

		canvas.addEventListener('touchmove', (e) => {
			var touch = e.touches[0];
			if (_this._isTaken === true) {
				_this.x = touch.pageX;
				_this.y = touch.pageY;
			}
		});

		canvas.addEventListener('touchend', (e) => {
			var touch = e.touches[0];
			if (_this._isTaken === true) {
				_this._isTaken = false;
			}
		});

		caption.addEventListener('touchstart', () => {
			startAgain();
		});
	}

	collisionDetect() {
		for (let j = 0; j < balls.length; j++) {
			if (balls[j].exists) {
				const dx = this.x - balls[j].x;
				const dy = this.y - balls[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
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
	random(0 + this.size, width - this.size),
	random(0 + EvilCircle.size, height - EvilCircle.size),
	true
);

evilCircle.x = random(0 + evilCircle.size, width - evilCircle.size);
evilCircle.y = random(0 + evilCircle.size, height - evilCircle.size);

(isTouchDevice()) ? evilCircle.setMobileControls() : evilCircle.setDesktopControls();

startGame();
