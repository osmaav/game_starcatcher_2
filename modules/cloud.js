//cloud.js
//создаю облако
let cloud = {};
function cloudInit(x = 90, y = 180, height = 0, width = 0, empty = true) {
  cloud.x;
  cloud.y;
  cloud.width;
  cloud.height;
  cloud.empty;
  cloud.img = new Image();
  cloud.img.src = "./src/img/облако.png";
  return cloud;
};
cloudInit();
//рисую облака
function cloudsDraw(ctx) {
  ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
}
//двигаю облака
function cloudsMoove() {
    cloud.x -= cloud.speed;
    if (cloud.x + cloud.width < 0) {
      cloud.empty = true; //освобождаем место в таблице
      }
}

export { cloud, cloudsMoove, cloudsDraw };
