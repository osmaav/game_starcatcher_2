//star.js
//создаю зыезду
let star = {};
function starInit(x = 0, y = 0, size = 0, speed = 0) {
  star.x;
  star.y;
  star.speed;
  star.radius = Math.round(size/2);
  star.collected= false;
  star.img= new Image();
  star.img.src = "src/img/звездочка.png";
  return star;
};
starInit();
//рисую Звезду
function starDraw(star = {}, ctx) {
    ctx.drawImage(
      star.img,
      star.x - star.radius,//координата X
      star.y - star.radius,//координата Y
      star.radius * 4,//ширина
      star.radius * 2//высота
    );
}

//двигаю Звезду
function starMoove(star = {}, fail = 0) {
    star.x -= star.speed;
    if (star.x + star.radius + 5 < 0) {
      star.collected = false; //освобождаем
      fail += 1; //увеличиваем значение голов
      // var ind = maxColumnsStars * maxRowsStars - (maxRowsStars - 2) - 1;
      // while (!arrStars[ind]?.empty) {
      //   //пока место не свободно
      //   ind =
      //     maxColumnsStars * maxRowsStars -
      //     Math.round(Math.random() * (maxRowsStars - 2)) -
      //     1; //выбираем случайное место в крайнем правом ряду таблицы
      // }
      // arrStars[ind].empty = false; //занимаем место
      // star.x = arrStars[ind].x;
      // star.y = arrStars[ind].y;
      // star.arrStarsInd = ind;
    }
}

export { star, starDraw, starMoove };
