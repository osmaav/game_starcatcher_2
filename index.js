const canvas = document.getElementById("gameScreen");
let soundBell = new Audio("./audio/колокольчик.mp3");
let musicFon = new Audio("./audio/fon.mp3");
import { boy, boyDraw, boyMoove, boyCheckPosition, boyCheckInClouds, boyCheckStarsCollection } from "./modules/boy.js";
import { star, starDraw, starMoove } from "./modules/star.js";
import { cloud } from "./modules/cloud.js";
import { backgroundInit, backgroundMoove,  backgroundDraw } from "./modules/background.js";
musicFon.addEventListener('loadmetadata', () => {
  musicFon.currentTime = 0;
  musicFon.muted = true;
  musicFon.loop = true;
  musicFon.volume = 0.2;
})

soundBell.addEventListener('loadmetadata', () => {
  soundBell.loop = false;
  soundBell.autoplay = false;
  soundBell.currentTime = 0;
  soundBell.volume = 0.2;
})
// @ts-ignore
const ctx = canvas.getContext("2d");
//определяю полотно в размеры всего окна
// @ts-ignore
canvas.width = window.innerWidth;
// @ts-ignore
canvas.height = window.innerHeight;
//строим таблицу мест под облака и звезды
let arrStars = [];
let arrClouds = [];
// @ts-ignore
const maxRowsStars = Math.round((canvas.height - 40) / 40);
// @ts-ignore
const maxColumnsStars = Math.round(canvas.width / 40);
// @ts-ignore
const maxRowsClouds = Math.round((canvas.height - 180) / 90);
// @ts-ignore
const maxColumnsClouds = Math.round(canvas.width / 180);
// for (let x = 1; x <= maxColumnsStars; x++) {
//   for (let y = 1; y <= maxRowsStars; y++) {
//     arrStars.push({
//       star.x = x * 40,
//       y: 20 + y * 40,
//       empty: true
//     });
//   }
// }
// for (let x = 1; x <= maxColumnsClouds; x++) {
//   for (let y = 1; y <= maxRowsClouds; y++) {
//     arrClouds.push({
//       x: x * 180,
//       y: 90 + y * 90,
//       empty: true
//     });
//   }
// }
const maxStar = arrStars.length - 1;
const maxClouds = arrClouds.length - 1;
let tuchX = 0;
let tuchY = 0;
let tuchPosition = '';
//задаю количество облаков на экране
const cloudsCount = 5;
//задаю количество звезд на экране
const starsCount = 9;
//задаю скорость анимации
let gameSpeed = 1;
let keyCode = " ";
let score = 0;
let fail = 0;

/// ===== ФОН (НЕБО) =====
//создаю фон
const bg1 = backgroundInit(0,0, canvas.width, vanvas.height);
const bg2 = backgroundInit(canvas.width,0, canvas.width, vanvas.height);

/// ===== ЗВЕЗДЫ =====
//создаю массив Звезд
const stars = [];


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

function handleTuch(evt) {
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
          // if (boy.onGround) {
            //мальчик на земле/облаке
            boy.onGround = false; //
            boy.dy = -25; //прыгаем вверх
          // }
          // else boy.dy = -boy.speed;
        } else { //под мальчиком
          tuchPosition = "под мальчиком";
          // @ts-ignore
          if (boy.onGround && boy.y + boy.height < canvas.height) {
            boy.onGround = false;
          }
          // boy.dy = boy.speed;//падаем
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
}//конец функции handleTuch

function startup() {
  // @ts-ignore
  canvas.addEventListener("touchstart", handleTuch, false);
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
  // backgroundMoove();
  // starsMoove();
  // cloudsMoove();

  boyMoove(boy, keyCode, canvas, clouds, gameSpeed);
  boyCheckPosition(boy, canvas);
  boyCheckInClouds(boy, keyCode, tuchPosition, clouds);
  boyCheckStarsCollection(boy, stars, arrStars, soundBell, maxColumnsStars, maxRowsStars, score);
  // backgroundDraw();
  if (gameSpeed) {
    // starsDraw();
    failDraw();
  }
  boyDraw(boy, ctx);
  if (gameSpeed) {
    // cloudsDraw();
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
  //для отлакдки
  // textDraw(
  //   // @ts-ignore
  //   canvas.width/2,
  //   30,
  //   "Boy.onGround: " + boy.onGround + " Key: " + keyCode,
  //   "#FFF",
  //   "1.0"
  // );


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
      // stars.forEach((s) => {
      //   s.speed = gameSpeed;
      // });
      // clouds.forEach((c) => {
      //   c.speed = gameSpeed;
      // });
      // bg1.speed = gameSpeed;
      // bg2.speed = gameSpeed;
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
