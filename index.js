const canvas = document.getElementById("gameScreen");
let musicBell = new Audio("audio/колокольчик.mp3");
let musicFon = new Audio("audio/fon.mp3");

musicFon.addEventListener('loadmetadata', () => {
  musicFon.currentTime = 0;
  musicFon.muted = true;
  musicFon.loop = true;
  musicFon.volume = 0.2;
})

musicBell.addEventListener('loadmetadata', () => {
  musicBell.loop = false;
  musicBell.autoplay = false;
  musicBell.currentTime = 0;
  musicBell.volume = 0.2;
})
// @ts-ignore
const ctx = canvas.getContext("2d");
//определяю полотно в размеры всего окна
// @ts-ignore
canvas.width = window.innerWidth;
// @ts-ignore
canvas.height = window.innerHeight;
//строим таблицу мест под облака и звезды
let matrixStars = [];
let matrixClouds = [];
// @ts-ignore
const maxRowsStars = Math.round((canvas.height - 40) / 40);
// @ts-ignore
const maxColumnsStars = Math.round(canvas.width / 40);
// @ts-ignore
const maxRowsClouds = Math.round((canvas.height - 180) / 90);
// @ts-ignore
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
const starsCount = 9;
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
// @ts-ignore
bg2.x = canvas.width;
bg2.y = 0;
bg2.speed = gameSpeed;
//рисую Фон
function backgroundDraw() {
  // @ts-ignore
  ctx.drawImage(bgImage, bg1.x, bg1.y, canvas.width, canvas.height);
  // @ts-ignore
  ctx.drawImage(bgImage, bg2.x, bg2.y, canvas.width, canvas.height);
}
//двигаю фон
function backgroundMoove() {
  bg1.x -= bg1.speed;
  bg2.x -= bg2.speed;
  // @ts-ignore
  if (bg1.x < -canvas.width) bg1.x = canvas.width;
  // @ts-ignore
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
// @ts-ignore
boy.x = Math.round(canvas.width / 2) - 37;
boy.y = 0;
boy.width = 74;
boy.height = 90;
boy.speed = 15;
boy.dx = 0;
boy.dy = 0;
boy.gravity = 1;
boy.stratMoveX = 0;
boy.onGround = false;
boy.img = new Image();
boy.img.src = boyImgSrc;
// }
//рисую Мальчика
function boyDraw() {
  ctx.drawImage(boy.img, boy.x, boy.y, boy.width, boy.height);
  // ctx.strokeStyle = "red";
  // ctx.strokeRect(boy.x, boy.y, boy.width, boy.height);
}
//двигаю мальчика по экрану
function boyMoove() {
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
    if (boy.dy > 0) boy.x += boy.dx;//двигаем горизонтально
  }
  if (
    ((boy.dx < 0) && (boy.stratMoveX - boy.x) >= boy.width/3) ||
    ((boy.dx > 0) && (boy.x - boy.stratMoveX) >= boy.width/3)
  ) boy.dx = 0;//если продвинулся далеко
}
//проверяю не вылетел ли мальчик за границы экрана
function boyCheckPosition() {
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
//проверяю мальчик попал ли в облако
function boyCheckInClouds() {
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
      var promise = musicBell.play();
      // @ts-ignore
      if (promise !== undefined) { promise.then(_ => { }).catch(error => { }); };
      // musicBell.play();
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
      withBoy: false,
      img: new Image(),
      matrixCloudsInd: ind
    });
    clouds[i].img.src = cloudImgSrc;
  }
//рисую облака
function cloudsDraw() {
  clouds.forEach(function (c) {
    ctx.drawImage(c.img, c.x, c.y, c.width, c.height);
    // ctx.strokeStyle = "blue";
    // ctx.strokeRect(c.x, c.y, c.width, c.height);
    // textDraw(c.x, c.y + 20, "boy: "+ c.withBoy);
  });
}
//двигаю облака
function cloudsMoove() {
  clouds.forEach(function (c) {
    c.x -= c.speed;
    if (c.x + c.width < 0) {
      matrixClouds[c.matrixCloudsInd].empty = true; //освобождаем место в таблице
      c.withBoy = false;
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


function handleStart(evt) {
  // evt.stopPropagation(); //перехватываем обработку событий
  evt.preventDefault();
  switch (evt.changedTouches.length) {
    case 1:
      // Обработка одинарного касания
      tuchX = evt.changedTouches[0].pageX;
      tuchY = evt.changedTouches[0].pageY;
      tuchPosition = "на экране";
      if (tuchX > boy.x - 15 && tuchX < boy.x + boy.width + 15) {
        //ткнули в границах ширины мальчика
        if (tuchY < boy.y + boy.height) {//над мальчиком
          if (boy.onGround) {
            //мальчик на земле/облаке
            boy.onGround = false; //
            boy.dy = -25; //прыгаем вверх
          }
          // else boy.dy = -boy.speed;
        } else { //под мальчиком
          tuchPosition = "под мальчиком";
          // @ts-ignore
          if (boy.onGround && boy.y + boy.height < canvas.height) {
            boy.onGround = false;
          }
          boy.dy = boy.speed;//падаем
        } //конец не выше
      } else {//не в границах мальчика
        if (tuchX < boy.x) {//ткнули левее
          if (boy.x + boy.dx < 0) {//за границами экрана
            boy.dx = 0;
            boy.x = 0;
          } else {//двигаем влево
            boy.dx = -boy.speed;
            boy.stratMoveX = boy.x;
            if (tuchY < boy.y) {//над мальчиком
              if (boy.onGround) {
                //мальчик на земле/облаке
                boy.onGround = false; //в воздухе
                boy.dy = -25; //прыгаем
              };
            };
          };
        } else if (tuchX > boy.x + boy.width) {//ткнули правее
          // @ts-ignore
          if (boy.x + boy.width + boy.dx > canvas.width) {//за границами экрана
            boy.dx = 0;
            // @ts-ignore
            boy.x = canvas.width - boy.width;
          } else {//двигаем вправо
            boy.dx = boy.speed;
            boy.stratMoveX = boy.x;
            if (tuchY < boy.y) {//над мальчиком
              if (boy.onGround) {
                //мальчик на земле/облаке
                boy.onGround = false; //в воздухе
                boy.dy = -25; //прыгаем
              };
            };
          }
        } //конец if
      }
      break;
    case 2:
    // Обработка тройного касания
      musicFon.muted = true;
      gameSpeed = gameSpeed ? 0 : 1;
      tuchPosition = "pause";
      stars.forEach((s) => {
        s.speed = gameSpeed;
      });
      clouds.forEach((c) => {
        c.speed = gameSpeed;
      });
      bg1.speed = gameSpeed;
      bg2.speed = gameSpeed;
      break;
    case 3:
    //Обработка другого касания
      musicFon.muted = !musicFon.muted;
      if (!musicFon.muted) {
          var promise = musicFon.play();
        // @ts-ignore
        if (promise !== undefined) { promise.then(_ => { }).catch(error => { }); };
      };
      break;
  }//конец switch
}//конец функции handleStart

function startup() {
  // @ts-ignore
  canvas.addEventListener("touchstart", handleStart, false);
}

//обработываю нажатия клавиш
window.onkeydown = (/** @type {{ code: string; }} */ e) => {
  keyCode = e.code;
  switch (keyCode) {
    case "KeyS": {
      //переключаем звук вкл/откл
      musicFon.muted = !musicFon.muted;
      if (!musicFon.muted) {
        var promise = musicFon.play();
        if (promise !== undefined) {
          promise.then(_ => {
            // Autoplay started!
          // @ts-ignore
          }).catch(error => {
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
          });
      }
      }
      // ?musicFon.play() : { };
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

  }
};
// ===== ДВИЖОК =====
//рисую все на экране (движок игры)
let fps = 0;

function animate() {
  //очищаю экран
  // @ts-ignore
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundMoove();
  starsMoove();
  cloudsMoove();

  boyMoove();
  boyCheckPosition();
  boyCheckInClouds();

  boyCheckStarsCollection();
  backgroundDraw();
  if (gameSpeed) {
    starsDraw();
    failDraw();
  }
  boyDraw();
  if (gameSpeed) {
    cloudsDraw();
  }
  scoreDraw();
  textDraw(
    // @ts-ignore
    canvas.width - 120,
    30,
    "Музыка: " + (musicFon.muted ? "откл." : 'вкл.'),
    (musicFon.muted ? "#F00" : "#FFF"),
    "1.0"
  );
  textDraw(
    // @ts-ignore
    canvas.width/2,
    30,
    "Boy.onGround: " + boy.onGround + " Key: " + keyCode,
    "#FFF",
    "1.0"
  );

  if (!gameSpeed) {
    if ((fps > 1) && (fps < 80 / 2)) {
      fps += 1;
      // @ts-ignore
      textDraw(canvas.width / 2 - 70, canvas.height / 2, "ПАУЗА", "#FF5", "3");
    } else { fps > 80 ? fps = 0 : fps += 1};
  }

  if (score === 100){
    if (gameSpeed && keyCode != "KeyP" && tuchPosition != "pause") {
      gameSpeed = 0;
      stars.forEach((s) => {
        s.speed = gameSpeed;
      });
      clouds.forEach((c) => {
        c.speed = gameSpeed;
      });
      bg1.speed = gameSpeed;
      bg2.speed = gameSpeed;
    }
    // @ts-ignore
    textDraw(canvas.width / 2 - 70, 40, "Андрей", "#FF5", "3");
    // @ts-ignore
    textDraw(canvas.width / 2 - 80, 70 , "Ты молодец!", "#FF5", "2");
    // @ts-ignore
    textDraw(canvas.width / 2 - 115, 100, "Собрал " + "100" + " звёзд!", "#FF5", "2");
  }
  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", startup);

//запускаю игру
animate();
