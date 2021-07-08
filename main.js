(function () {

  const modelPosX = 130;
  const modelPosY = 1050;
  const textYPos = 1345;
  const textAngle = -8;
  const textHeight = 40;

  window.addEventListener("load", init);

  function init() {
    // Wait for font load before drawing
    document.fonts.load("60px dragalialost").then(drawImage).then(setupListener);
  }

  function setupListener() {
    id("name").addEventListener("change", drawImage);
    id("element").addEventListener("change", drawImage);
    id("sparkAmount").addEventListener("change", drawImage);
    id("portraitUpload").addEventListener("change", changeImage);
    id("modelUpload").addEventListener("change", changeImage);
    id("portrait").addEventListener("load", drawImage);
    id("model").addEventListener("load", drawImage);
    document.querySelectorAll("input[type=number]").forEach(e => {
      qs(`[data-slider="${e.id}"]`).addEventListener("input", sliderUpdateNumInput);
      qs(`[data-slider="${e.id}"]`).addEventListener("change", sliderChangeNumInput);
      e.addEventListener("input", numInputUpdateSlider);
      e.addEventListener("change", drawImage);
    });
  }

  function sliderUpdateNumInput() {
    let input = id(this.dataset.slider);
    input.value = this.value;
  }

  function sliderChangeNumInput() {
    let input = id(this.dataset.slider);
    input.dispatchEvent(new Event('change'));
  }

  function numInputUpdateSlider() {
    let slider = qs(`[data-slider="${this.id}"]`);
    slider.value = this.value;
  }

  function changeImage() {
    id(this.dataset.image).src = window.URL.createObjectURL(this.files[0]);
  }

  async function drawImage() {
    const canvas = id("editor");
    const ctx = canvas.getContext("2d");
    const img = await loadImage("images/bg.png");
    const elementImg = await loadImage(`images/${id("element").value}.png`);
    const adventurerName = id("name").value;
    const spark = await loadImage("images/spark.png");
    const bar = await loadImage("images/bar.png");
    const portrait = id("portrait");
    const model = id("model");
    ctx.drawImage(img, 0, 0);

    drawImageOffsetScale(ctx, portrait, id("portraitScale").value, canvas.width / 2, canvas.height / 2, id("portraitOffsetX").value, id("portraitOffsetY").value);
    drawImageOffsetScale(ctx, model, id("modelScale").value, modelPosX, modelPosY, id("modelOffsetX").value, id("modelOffsetY").value);

    ctx.drawImage(bar, 0, 0);

    ctx.font = "60px dragalialost";
    ctx.fillStyle = "#6a551f";


    let textWidth = ctx.measureText(adventurerName).width;
    let rotateCenter = canvas.width / 2;
    let padding = 10;
    let textStart = rotateCenter - (textWidth + elementImg.width + padding) / 2 + elementImg.width + padding;

    ctx.translate(rotateCenter, textYPos);
    ctx.rotate(textAngle * Math.PI / 180);
    ctx.translate(-rotateCenter, -textYPos);

    ctx.fillText(adventurerName, textStart + 5, textYPos + 5);

    ctx.fillStyle = "white";

    ctx.fillText(adventurerName, textStart, textYPos);

    ctx.drawImage(elementImg, rotateCenter - (textWidth + elementImg.width + padding) / 2, textYPos - textHeight - (elementImg.height - textHeight) / 2);

    ctx.translate(rotateCenter, textYPos);
    ctx.rotate(-textAngle * Math.PI / 180);
    ctx.translate(-rotateCenter, -textYPos);

    for(let i = 0; i < parseInt(id("sparkAmount").value); i++)
    {
      if(Math.random() > 0.6) {
        let sparkScale = Math.min(Math.random(), .8);
        ctx.drawImage(spark, Math.random() * canvas.width,  Math.random() * canvas.height, spark.height * sparkScale, spark.width * sparkScale);
      }
    }

    id("download").href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");


    const previewCanvas = id("preview");
    const previewCtx = previewCanvas.getContext("2d");
    previewCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);
  }

  function drawImageOffsetScale(ctx, image, scale, centerX, centerY, offsetX, offsetY) {
    scale = parseFloat(scale);
    centerX = parseFloat(centerX);
    centerY = parseFloat(centerY);
    offsetX = parseFloat(offsetX);
    offsetY = parseFloat(offsetY);
    let width = image.naturalWidth * scale;
    let height = image.naturalHeight * scale;
    let x = centerX - width / 2 + offsetX;
    let y = centerY - height / 2 + offsetY;
    ctx.drawImage(image, x, y, width, height);
  }

  function id(elementId) {
    return document.getElementById(elementId);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function loadImage(src){
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

})();
