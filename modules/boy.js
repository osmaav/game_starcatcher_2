//boy.js
//создаю мальчика
class Boy {
  name = "boy";
  constructor(x = 0, y = 0, width = 74, height = 90, dx = 0, dy = 0, speed = 15, gravity =1, onGround = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.dx = dx;
    this.dy = dy;
    this.gravity = gravity;
    this.stratMoveX = 0;
    this.onGround = onGround;
    this.img = new Image();
    this.img.src = "./src/img/мальчик.png";
  }
  boyDraw(contex) {
    contex.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  boyMoove(boy = {}, keyCode = "", canvas, clouds = {}, gameSpeed = 0) {
  switch (keyCode) {
    case "ArrowLeft":
      boy.dx = -25;
      boy.stratMoveX = boy.x;
      keyCode = '';
      break;
    case "ArrowRight":
      boy.dx = 25;
      boy.stratMoveX = boy.x;
      keyCode = '';
      break;
    case "ArrowUp":
      boy.dy = -25;
      boy.stratMoveX = boy.x;
      keyCode = '';
      boy.onGround = false;
      break;
    case "Space":
      boy.dy = -25;
      boy.stratMoveX = boy.x;
      keyCode = '';
      boy.onGround = false;
      break;
    case "ArrowDown":
      keyCode = '';
      boy.onGround = false;
      break;
  }
  if (boy.onGround) {//мальчик на земле/на облаке
    boy.dy = 0;//останавливаем движение по вертикали
    // @ts-ignore
    if (boy.y + boy.height < canvas.height) {//если мальчик выше земли
      if (boy.dx != 0) {
        boy.dx += boy.gravity;
        boy.x += boy.dx;//двигаем горизонтально
        clouds.forEach((cloud) => {
          if (
            cloud.withBoy &&
            boy.x + Math.round(boy.width / 2) < cloud.x ||
            boy.x + Math.round(boy.width / 2) > cloud.x + cloud.width
          ) {
            cloud.withBoy = false;
            boy.onGround = false;
          };
        });
      } else boy.x -= gameSpeed;//двигаем со скоростью игры
    } else { //если мальчик на земле
      if (boy.dx != 0) {
        boy.dx += boy.gravity;
        boy.x += boy.dx;//двигаем горизонтально
      }
    }
  } else {//мальчик в вертикальном движении
    boy.dy += boy.gravity;//увеличиваем скорость движения
    boy.y += boy.dy;//двигаем вертикально
    if (boy.dy != 0) boy.x += boy.dx;//двигаем горизонтально
  }
  if (
    ((boy.dx < 0) && (boy.stratMoveX - boy.x) >= 3*boy.width) ||
    ((boy.dx > 0) && (boy.x - boy.stratMoveX) >= 3*boy.width)
  ) boy.dx = 0;//если продвинулся далеко
  }
  boyCheckPosition(boy = {}, canvas) {
  //если мальчик вылетел за верхную границу экрана
  if (boy.y + boy.dy < 0) {
    boy.y = 0;
    boy.dy = 0;
  }
  //если мальчик вылетел за нижную границу экрана
  // @ts-ignore
  if (boy.y + boy.height > canvas.height) {
    // @ts-ignore
    boy.y = canvas.height - boy.height; //устанавливаем его на землю
    boy.dy = 0;
    boy.onGround = true;
  }
  // @ts-ignore
  if (boy.x + boy.width + boy.dx > canvas.width) {//если мальчик вылетел за правую границу экрана
    // @ts-ignore
    boy.x = canvas.width - boy.width;
    boy.dx = 0;
  }
  if (boy.x + boy.dx < 0) {//если мальчик вылетел за левую границу экрана
    boy.x = 0;
    boy.dx = 0;
    if (boy.y + boy.height < canvas.height) boy.onGround = false;
  }
  }
  boyCheckInClouds(boy = {}, keyCode = "", tuchPosition = "", clouds = {}) {
  //если нажата клавиша вниз - не цепляемся за облако
  if (keyCode != "ArrowDown" && tuchPosition != "под мальчиком") {
    clouds.forEach((cloud) => {
      if (
        (boy.dy > 0 || boy.dx !=0) &&
        boy.x + boy.width / 2 > cloud.x &&
        boy.x + boy.width / 2 < cloud.x + cloud.width &&
        boy.y + boy.height > cloud.y + Math.round(boy.height / 2) &&
        boy.y + boy.height < cloud.y + Math.round(boy.height / 2) + boy.dy + 2
      ) {
        boy.onGround = true;
        cloud.withBoy = true;
      }
    });
  }

  }
  boyCheckStarsCollection(boy = {}, stars = {}, arrStars = [], sound, maxColumnsStars = 0, maxRowsStars = 0, score = 0) {
  stars.forEach(function (star) {
    if (
      !star.dy &&
      !star.collected &&
      boy.x < star.x + star.radius &&
      boy.x + boy.width > star.x - star.radius &&
      boy.y < star.y + star.radius &&
      boy.y + boy.height > star.y - star.radius
    ) {
      sound.currentTime = 0;
      sound.loop = false;
      sound.muted=false;
      var promise = sound.play();
      // @ts-ignore
      if (promise !== undefined) { promise.then(_ => { }).catch(error => { }); };
      // sound.play();
      arrStars[star.arrStarsInd].empty = true; //освобождаем место
      var ind = maxColumnsStars * maxRowsStars - Math.round(Math.random() * maxRowsStars) - 1; //выбираем случайное место в крайнем правом ряду таблицы
      while (!arrStars[ind]?.empty) {
        //пока место не свободно
        ind = maxColumnsStars * maxRowsStars - Math.round(Math.random() * maxRowsStars) - 1; //выбираем случайное место в крайнем правом ряду таблицы
      }
      arrStars[ind].empty = false; //занимаем место
      star.x = arrStars[ind].x + star.radius * 2;
      star.y = arrStars[ind].y;
      star.arrStars = ind;
      score += 1;
    }
  });
  }

}

export { Boy };
