//background.js
//создаю фон
let background = {};
function backgroundInit() {
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

export { background, backgroundMoove,  backgroundDraw};
