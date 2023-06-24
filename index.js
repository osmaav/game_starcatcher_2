const canvas = document.getElementById("gameScreen");
let musicBell = new Audio("audio/колокольчик.mp3");
let musicFon = new Audio("audio/fon.mp3");

musicFon.addEventListener('loadmetadata', () => {
  musicFon.currentTime = 0;
  musicFon.muted = true;
  musicFon.autoplay = true;
  musicFon.loop = true;
  musicFon.volume = 0.2;
})

musicBell.addEventListener('loadmetadata', () => {
  musicBell.loop = false;
  musicBell.autoplay = false;
  musicBell.currentTime = 0;
  musicBell.volume = 0.2;
})
const ctx = canvas.getContext("2d");
//определяю полотно в размеры всего окна
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//строим таблицу мест под облака и звезды
let matrixStars = [];
let matrixClouds = [];
const maxRowsStars = Math.round((canvas.height - 40) / 40);
const maxColumnsStars = Math.round(canvas.width / 40);
const maxRowsClouds = Math.round((canvas.height - 180) / 90);
const maxColumnsClouds = Math.round(canvas.width / 180);
for (let x = 1; x <= maxColumnsStars; x++) {
  for (let y = 1; y <= maxRowsStars; y++) {
    matrixStars.push({
      x: x * 40,
      y: 20 + y * 40,
      empty: true
    });
  }
}
for (let x = 1; x <= maxColumnsClouds; x++) {
  for (let y = 1; y <= maxRowsClouds; y++) {
    matrixClouds.push({
      x: x * 180,
      y: 90 + y * 90,
      empty: true
    });
  }
}
const maxStar = matrixStars.length - 1;
const maxClouds = matrixClouds.length - 1;
let tuchX = 0;
let tuchY = 0;
let tuchPosition = '';
//задаю количество облаков на экране
const cloudsCount = 5;
//задаю количество звезд на экране
const starsCount = 7;
//задаю скорость анимации
let gameSpeed = 1;
const bgImgSrc = "src/img/небо.png";
const cloudImgSrc = "src/img/облако.png";
const boyImgSrc = "src/img/мальчик.png";
const starImgSrc = "src/img/звездочка.png";
let keyCode = " ";
let score = 0;
let fail = 0;

/// ===== ФОН (НЕБО) =====
//создаю фон
const bgImage = new Image();
bgImage.src = bgImgSrc;
let bg1 = {};
let bg2 = {};
bg1.x = 0;
bg1.y = 0;
bg1.speed = gameSpeed;
bg2.x = canvas.width;
bg2.y = 0;
bg2.speed = gameSpeed;
//рисую Фон
function backgroundDraw() {
  ctx.drawImage(bgImage, bg1.x, bg1.y, canvas.width, canvas.height);
  ctx.drawImage(bgImage, bg2.x, bg2.y, canvas.width, canvas.height);
}
//двигаю фон
function backgroundMoove() {
  bg1.x -= bg1.speed;
  bg2.x -= bg2.speed;
  if (bg1.x < -canvas.width) bg1.x = canvas.width;
  if (bg2.x < -canvas.width) bg2.x = canvas.width;
}

/// ===== ЗВЕЗДЫ =====
//создаю массив Звезд
const stars = [];
  for (var i = 0; i < starsCount; i++) {
    var ind = maxColumnsStars * maxRowsStars - (maxRowsStars - 2) - 1;
    while (!matrixStars[ind]?.empty) {
      //пока место не свободно
      ind = Math.round(Math.random() * maxStar); //выбираем случайное место
    }
    matrixStars[ind].empty = false; //занимаем место
    stars.push({
      x: matrixStars[ind].x,
      y: matrixStars[ind].y,
      radius: 20,
      collected: false,
      img: new Image(),
      speed: gameSpeed,
      dy: 0,
      matrixStarsInd: ind
    });
    stars[i].img.src = starImgSrc;
  }
//двигаем звезды
function starsMoove() {
  stars.forEach(function (star) {
    star.x -= star.speed;
    star.y += star.dy;
    if (star.x + star.radius + 5 < 0) {
      matrixStars[star.matrixStarsInd].empty = true; //освобождаем место
      fail += 1; //увеличиваем значение голов
      var ind = maxColumnsStars * maxRowsStars - (maxRowsStars - 2) - 1;
      while (!matrixStars[ind]?.empty) {
        //пока место не свободно
        ind =
          maxColumnsStars * maxRowsStars -
          Math.round(Math.random() * (maxRowsStars - 2)) -
          1; //выбираем случайное место в крайнем правом ряду таблицы
      }
      matrixStars[ind].empty = false; //занимаем место
      star.x = matrixStars[ind].x;
      star.y = matrixStars[ind].y;
      star.matrixStarsInd = ind;
    }
  });
}
//рисую Звезды
function starsDraw() {
  stars.forEach(function (star) {
    ctx.drawImage(
      star.img,
      star.x - star.radius,
      star.y - star.radius,
      star.radius * 4,
      star.radius * 2
    );
  });
}

/// ===== МАЛЬЧИК =====
//создаю мальчика
  const boy = {};
  boy.x = Math.round(canvas.width / 2) - 37;
  boy.y = 0;
  boy.width = 74;
  boy.height = 90;
  boy.speed = 15;
  boy.dx = 0;
  boy.dy = 0; // This is the vertical velocity of the boy
  boy.gravity = 1; // This is the constant force pulling the boy down
  boy.onGround = false;
  boy.img = new Image();
  boy.img.src = boyImgSrc;
// }
//рисую Мальчика
function boyDraw() {
  ctx.drawImage(boy.img, boy.x, boy.y, boy.width, boy.height);
}
//двигаю мальчика по экрану
function boyMoove() {
  boy.dy += boy.gravity;
  boy.y += boy.dy;
  if (boy.dx > 0) {
    boy.dx += 1;
  } else if (boy.dx < 0) {
    boy.dx -= 1;
  }
}
//проверяю не вылетел ли мальчик за границы экрана
function boyCheckPosition() {
  //если мальчик вылетел за верхную границу экрана
  if (boy.y + boy.dy < 0) {
    boy.y = 0;
    boy.dy = 0;
  }
  //если мальчик вылетел за нижную границу экрана
  if (boy.y + boy.height > canvas.height) {
    boy.y = canvas.height - boy.height; //устанавливаем его на землю
    boy.dy = 0;
    boy.onGround = true;
  }
  if (boy.dx > boy.speed + 3 || boy.dx < -boy.speed - 3) boy.dx = 0;
  boy.x += boy.dx;
  if (boy.x + boy.width + boy.dx > canvas.width) {
    boy.x = canvas.width - boy.width;
    boy.dx = 0;
  }
  if (boy.x + boy.dx < 0) {
    boy.x = 0;
    boy.dx = 0;
  }
  if ((keyCode == "ArrowDown" && boy.dy)) keyCode = "";
  if ((tuchPosition == "под мальчиком" && boy.dy)) tuchPosition = "";
}
//проверяю мальчик попал ли в облако
function boyCheckInClouds() {
  //если нажата клавиша вниз - не цепляемся за облако
  if (keyCode != "ArrowDown" && tuchPosition != "под мальчиком") {
    var targetY = boy.y + boy.height;
    clouds.forEach((cloud) => {
      if (
        targetY > cloud.y &&
        targetY < cloud.y + cloud.height &&
        boy.x + boy.width / 2 > cloud.x &&
        boy.x + boy.width / 2 < cloud.x + cloud.width &&
        boy.dy > 0
      ) {
        boy.y = cloud.y - boy.height / 3;
        boy.dy = 0;
        boy.x -= gameSpeed;
        if (boy.x <= 0) boy.x = 0;
        boy.onGround = true;
      }
    });
  }
}
//проверяю собрал ли мальчик звезду
function boyCheckStarsCollection() {
  stars.forEach(function (star) {
    if (
      !star.dy &&
      !star.collected &&
      boy.x < star.x + star.radius &&
      boy.x + boy.width > star.x - star.radius &&
      boy.y < star.y + star.radius &&
      boy.y + boy.height > star.y - star.radius
    ) {
      musicBell.currentTime = 0;
      musicBell.loop = false;
      musicBell.muted=false;
      musicBell.play();
      matrixStars[star.matrixStarsInd].empty = true; //освобождаем место
      var ind = maxColumnsStars * maxRowsStars - Math.round(Math.random() * maxRowsStars) - 1; //выбираем случайное место в крайнем правом ряду таблицы
      while (!matrixStars[ind]?.empty) {
        //пока место не свободно
        ind = maxColumnsStars * maxRowsStars - Math.round(Math.random() * maxRowsStars) - 1; //выбираем случайное место в крайнем правом ряду таблицы
      }
      matrixStars[ind].empty = false; //занимаем место
      star.x = matrixStars[ind].x + star.radius * 2;
      star.y = matrixStars[ind].y;
      star.matrixStarsInd = ind;
      score += 1;
    }
  });
}

/// ===== ОБЛАКА =====
//создаю масссив облаков
var clouds = [];
  for (var i = 0; i < cloudsCount; i++) {
    var ind = maxClouds - 1;
    while (!matrixClouds[ind]?.empty) {
      //пока место не свободно
      ind = Math.round(Math.random() * maxClouds); //выбираем случайное место
    }
    matrixClouds[ind].empty = false; //занимаем место
    clouds.push({
      x: matrixClouds[ind].x,
      y: matrixClouds[ind].y,
      height: 90,
      width: 180,
      speed: gameSpeed,
      img: new Image(),
      matrixCloudsInd: ind
    });
    clouds[i].img.src = cloudImgSrc;
  }
//рисую облака
function cloudsDraw() {
  clouds.forEach(function (c) {
    ctx.drawImage(c.img, c.x, c.y, c.width, c.height);
  });
}
//двигаю облака
function cloudsMoove() {
  clouds.forEach(function (c) {
    c.x -= c.speed;
    if (c.x + c.width < 0) {
      matrixClouds[c.matrixCloudsInd].empty = true; //освобождаем место в таблице
      var ind = maxColumnsClouds * maxRowsClouds - maxColumnsClouds - 1;
      while (!matrixClouds[ind]?.empty) {
        //пока место не свободно
        ind =maxColumnsClouds * maxRowsClouds -Math.round(Math.random() * (maxColumnsClouds + 1)) -1; //выбираем случайное место в крайнем правом ряду таблицы
      }
      matrixClouds[ind].empty = false; //занимаем место
      c.x = matrixClouds[ind].x;
      c.y = matrixClouds[ind].y;
      c.matrixCloudsInd = ind;
    }
  });
}

//пишу текст на экране
/**
 * @param {number} x
 * @param {number} y
 * @param {string} text
 */
function textDraw(x, y, text, color = "white", size = "1") {
  ctx.font = size + "em Arial";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

//вывожу на экран счет
function scoreDraw() {
  textDraw(5, 30, "Звезд набрал: " + score, "#0FF", "1.1");
}

//вывожу на экран голы
function failDraw() {
  textDraw(5, 60, "Звезд упустил: " + fail, "#FF0", "1.1");
}

function startup() {
  canvas.addEventListener("touchstart", handleStart, false);
  //canvas.addEventListener("touchend", handleEnd, false);
  //canvas.addEventListener("touchcancel", handleCancel, false);
  //canvas.addEventListener("touchmove", handleMove, false);
}

//обработываю нажатия клавиш
window.onkeydown = (/** @type {{ code: string; }} */ e) => {
  keyCode = e.code;
  switch (e.code) {
    case "KeyS": {
      //переключаем звук вкл/откл
      musicFon.muted = !musicFon.muted;
      !musicFon.muted ? musicFon.play() : {};
      break;
    }
    case "KeyP": {
      gameSpeed = gameSpeed ? 0 : 1;
      // musicFon.muted = !gameSpeed;
      stars.forEach((s) => {
        s.speed = gameSpeed;
      });
      clouds.forEach((c) => {
        c.speed = gameSpeed;
      });
      bg1.speed = gameSpeed;
      bg2.speed = gameSpeed;
      break;
    }
    case "ArrowLeft": {
      if (boy.x + boy.dx < 0) {
        boy.dx = 0;
        boy.x = 0;
      } else {
        boy.dx = -boy.speed;
      }
      break;
    }
    case "ArrowRight": {
      if (boy.x + boy.width + boy.dx > canvas.width) {
        boy.dx = 0;
        boy.x = canvas.width - boy.width;
      } else {
        boy.dx = boy.speed;
      }
      break;
    }
    case "ArrowDown": {
      if (boy.onGround && boy.y + boy.height < canvas.height) {
        boy.onGround = false;
      }
      boy.dy = boy.speed;
      break;
    }
    case "ArrowUp": {
      if (boy.onGround) {
        boy.dy = -25;
        boy.onGround = false;
      } else boy.dy = -boy.speed;
      break;
    }
    case "Space": {
      if (boy.onGround) {
        boy.dy = -25;
        boy.onGround = false;
      } else boy.dy = -boy.speed;
      break;
    }
  }
};
// ===== ДВИЖОК =====
//рисую все на экране (движок игры)
let fps = 0;

function animate() {
  //очищаю экран
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundMoove();
  starsMoove();
  cloudsMoove();
  boyMoove();
  boyCheckInClouds();
  boyCheckPosition();
  boyCheckStarsCollection();
  backgroundDraw();
  starsDraw();
  boyDraw();
  cloudsDraw();
  scoreDraw();
  failDraw();
  textDraw(
    canvas.width - 120,
    30,
    "Музыка: " + (musicFon.muted ? "откл." : 'вкл.'),
    (musicFon.muted ? "#F00" : "#FFF"),
    "1.0"
  );

  if (!gameSpeed) {
    if ((fps > 1) && (fps < 100 / 2)) {
      fps += 1;
      textDraw(canvas.width / 2 - 160, canvas.height / 2, "ПАУЗА", "#FF5", "7");
    } else { fps > 100 ? fps = 0 : fps += 1};
  }

  if (score >= 100 && score < 105) {
    if ((fps > 1) && (fps < 300 / 2)) {
      fps += 1;
      textDraw(canvas.width / 2 - 160, canvas.height / 2, "Андрей", "#FF5", "3");
      textDraw(canvas.width / 2 - 170, canvas.height / 2 +45 , "Ты молодец!", "#FF5", "2");
      textDraw(canvas.width / 2 - 210, canvas.height / 2 +90, "Собрал " + "100" + " звёзд!", "#FF5", "2");
    } else { fps > 310 ? fps = 0 : fps += 1 };
  }
  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", startup);

/**
 * @param {{ stopPropagation: () => void; changedTouches: any; }} evt
 */
function handleStart(evt) {
  evt.stopPropagation(); //перехватываем обработку событий
  var touches = evt.changedTouches;
  if (touches.length === 2) {
    // Обработка двойного касания
    gameSpeed = gameSpeed ? 0 : 1;
    // musicFon.muted = !gameSpeed;
    stars.forEach((s) => {
      s.speed = gameSpeed;
    });
    clouds.forEach((c) => {
      c.speed = gameSpeed;
    });
    bg1.speed = gameSpeed;
    bg2.speed = gameSpeed;
  }
  for (var i = 0; i < touches.length; i++) {
    tuchX = touches[i].pageX;
    tuchY = touches[i].pageY;
    tuchPosition = "на экране";
    if (tuchX > boy.x - 15 && tuchX < boy.x + boy.width + 15) {//ткнули в границы ширины мальчика
      // tuchPosition = "над границами мальчика";
      if (tuchY < boy.y + boy.height) {//точно в мальчика
        // tuchPosition = "над мальчиком";
        keyCode = "ArrowUp";
        if (boy.onGround) {
          //мальчик на земле/облаке
          boy.dy = -25; //прыгаем
          boy.onGround = false; //
        } else boy.dy = -boy.speed; //двигаемся влево со скоростью игры
      } else { //не выше
          tuchPosition = "под мальчиком";
          keyCode = "ArrowDown";
          if (boy.onGround && boy.y + boy.height < canvas.height) {
            boy.onGround = false;
          }
          boy.dy = boy.speed;
      } //конец не выше
    } else {//не в границах мальчика
      if (tuchX < boy.x) {//ткнули левее
        if (boy.x + boy.dx < 0) {
          boy.dx = 0;
          boy.x = 0;
        } else {
          boy.dx = -boy.speed;
        }
      } //конец ткнули левее
      if (tuchX > boy.x + boy.width) {//ткнули правее
        if (boy.x + boy.width + boy.dx > canvas.width) {
          boy.dx = 0;
          boy.x = canvas.width - boy.width;
        } else {
          boy.dx = boy.speed;
        }
      } //конец ткнули правее
    } //конец не в границах мальчика
  } //конец цикла for
}//конец функции handleStart

//запускаю игру
animate();
