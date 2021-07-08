(function () {

  window.addEventListener('load', init);

  function init() {
    document.fonts.load('50px dragalialost').then(drawImage).then(setupListener);
  }

  function setupListener() {
    id('name').addEventListener('change', drawImage);
    id('element').addEventListener('change', drawImage);
    id('portraitUpload').addEventListener('change', changeImage);
    id('modelUpload').addEventListener('change', changeImage);
    id('portrait').addEventListener('load', drawImage);
    id('model').addEventListener('load', drawImage);
  }

  function changeImage() {
    id(this.dataset.image).src = window.URL.createObjectURL(this.files[0]);
  }

  async function drawImage() {
    const canvas = id('editor');
    const ctx = canvas.getContext('2d');
    const img = await loadImage('images/bg.png');
    const elementImg = await loadImage(`images/${id('element').value}.png`);
    const adventurerName = id('name').value;
    const spark = await loadImage('images/spark.png');
    const bar = await loadImage('images/bar.png');
    const portrait = id('portrait');
    const model = id('model');
    ctx.drawImage(img, 0, 0);

    let centerX = 675 / 2;
    let centerY = 1164 / 2;
    ctx.drawImage(portrait, centerX - portrait.naturalWidth / 2, centerY - portrait.naturalHeight / 2);

    centerX = 130;
    centerY = 800;
    ctx.drawImage(model, centerX - model.naturalWidth / 2, centerY - model.naturalHeight / 2);


    ctx.drawImage(spark, 0, 0);
    ctx.drawImage(bar, 0, 0);

    ctx.font = '50px dragalialost';
    ctx.fillStyle = '#6a551f';

    let defaultText = 1080;
    let textAngle = -7;

    let textWidth = ctx.measureText(adventurerName).width;
    let textHeight = 35;
    let rotateCenter = 337;
    let padding = 10;
    let textStart = 337 - (textWidth + elementImg.width + padding) / 2 + elementImg.width + padding;

    ctx.translate(rotateCenter, defaultText);
    ctx.rotate(textAngle * Math.PI / 180);
    ctx.translate(-rotateCenter, -defaultText);

    ctx.fillText(adventurerName, textStart + 5, defaultText + 5);

    ctx.fillStyle = 'white';

    ctx.fillText(adventurerName, textStart, defaultText);

    ctx.drawImage(elementImg, 337 - (textWidth + elementImg.width + padding) / 2, defaultText - textHeight - (elementImg.height - textHeight) / 2);

    ctx.translate(rotateCenter, defaultText);
    ctx.rotate(-textAngle * Math.PI / 180);
    ctx.translate(-rotateCenter, -defaultText);
  }

  function id(elementId) {
    return document.getElementById(elementId);
  }

  function loadImage(src){
    let img = new Image();
    img.src = src;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

})();
