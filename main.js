(function () {

  const modelPosX = 130;
  const modelPosY = 1050;
  const textYPos = 1345;
  const textAngle = -8;
  const textHeight = 40;
  const textures = {};
  const elementTextSpacing = 5;

  window.addEventListener("load", init);

  function init() {
    // Wait for font load before drawing
    document.fonts.load("60px dragalialost").then(drawImage).then(setupListener);
  }

  /**
   * Set up event listeners
   */
  function setupListener() {
    // Update image after upload
    id("portraitUpload").addEventListener("change", changeImage);
    id("modelUpload").addEventListener("change", changeImage);

    // Draw image after parameter change
    id("name").addEventListener("change", drawImage);
    id("element").addEventListener("change", drawImage);
    id("sparkAmount").addEventListener("change", drawImage);
    id("jp").addEventListener("change", drawImage);
    id("portrait").addEventListener("load", drawImage);
    id("model").addEventListener("load", drawImage);

    document.querySelectorAll("input[type=number]").forEach(e => {
      // Sync number input with slider
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

  async function loadTextures() {
    if(!textures.background) {
      textures.background = await loadImage("images/bg.png");
      textures.fire = await loadImage(`images/fire.png`);
      textures.wind = await loadImage(`images/wind.png`);
      textures.water = await loadImage(`images/water.png`);
      textures.light = await loadImage(`images/light.png`);
      textures.shadow = await loadImage(`images/shadow.png`);
      textures.spark = await loadImage("images/spark.png");
      textures.bar = await loadImage("images/bar.png");
      textures.skipjp = await loadImage("images/skipjp.png");
    }
  }

  /**
   * Draws the summon screen based on inputs
   */
  async function drawImage() {
    // Get canvas context
    const canvas = id("editor");
    const ctx = canvas.getContext("2d");

    // Load images for use
    await loadTextures();
    const background = textures.background;
    const element = textures[id("element").value];
    const spark = textures.spark;
    const bar = textures.bar;
    const sparkAmount = parseInt(id("sparkAmount").value);

    // Get parameters
    const adventurerName = id("name").value;
    const portrait = id("portrait");
    const model = id("model");

    // Draw background elements
    ctx.drawImage(background, 0, 0);

    if(id("jp").checked) {
      ctx.drawImage(textures.skipjp, 0, 0);
    }

    drawImageOffsetScale(ctx, portrait, id("portraitScale").value,
      canvas.width / 2, canvas.height / 2,
      id("portraitOffsetX").value, id("portraitOffsetY").value);

    drawImageOffsetScale(ctx, model, id("modelScale").value,
      modelPosX, modelPosY,
      id("modelOffsetX").value, id("modelOffsetY").value);

    ctx.drawImage(bar, 0, 0);

    // Calculate text position based on text width
    let textWidth = ctx.measureText(adventurerName).width;
    let canvasCenter = canvas.width / 2;
    let elementXPos = canvasCenter - (textWidth + element.width + elementTextSpacing) / 2;
    let elementYPos = textYPos - textHeight - (element.height - textHeight) / 2;
    let textXPos = elementXPos + element.width + elementTextSpacing;

    // Rotate the context to draw rotated text
    ctx.translate(canvasCenter, textYPos);
    ctx.rotate(textAngle * Math.PI / 180);
    ctx.translate(-canvasCenter, -textYPos);

    // Draw the shadow of text -> text -> element
    ctx.font = "60px dragalialost";

    let shadowOffset = 5;

    if(id("jp").checked) {
      await document.fonts.load("60px dragalialostjp");
      ctx.font = "60px dragalialostjp";
      shadowOffset = 7;
    }
    ctx.fillStyle = "#6a551f";
    ctx.fillText(adventurerName, textXPos + shadowOffset, textYPos + shadowOffset);
    ctx.fillStyle = "white";
    ctx.fillText(adventurerName, textXPos, textYPos);
    ctx.drawImage(element, elementXPos, elementYPos);

    // Rotate the context back to original rotation
    ctx.translate(canvasCenter, textYPos);
    ctx.rotate(-textAngle * Math.PI / 180);
    ctx.translate(-canvasCenter, -textYPos);

    // Draw sparks
    for(let i = 0; i < sparkAmount; i++)
    {
      let sparkScale = Math.min(Math.random(), .8);
      ctx.drawImage(spark, Math.random() * canvas.width,  Math.random() * canvas.height, spark.height * sparkScale, spark.width * sparkScale);
    }

    // Generate download url
    id("download").href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    // Draw the editor canvas on the smaller preview canvas
    const previewCanvas = id("preview");
    const previewCtx = previewCanvas.getContext("2d");
    previewCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);
  }

  function drawImageOffsetScale(ctx, image, scale, centerX, centerY, offsetX, offsetY) {
    scale = parseFloat(scale);
    centerX = parseFloat(centerX);
    centerY = parseFloat(centerY);
    offsetX = parseFloat(offsetX);
    offsetY = -parseFloat(offsetY);
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
