//background.js
//создаю фон
let background = {};
function backgroundInit(x, y, width, height){
  background.x;
  background.y;
  background.width;
  background.height;
  background.img = new Image();
  background.img.src = "./src/img/небо.png";
  return background;
};
backgroundInit();
//рисую Фон
function backgroundDraw(ctx) {
  ctx.drawImage(background.img, background.x, background.y, background.width, background.height);
}
//двигаю фон
function backgroundMoove(canvas) {
  background.x -= background.speed;
  if (background.x < -canvas.width) background.x = canvas.width;
}

export { backgroundInit, backgroundMoove,  backgroundDraw};
