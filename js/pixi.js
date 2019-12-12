
let Application = PIXI.Application,
  Container = PIXI.Container,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite,
  Rectangle = PIXI.Rectangle;


let app = new Application({
  antialias: true,    // default: false
  transparent: false, // default: false
  resolution: 1
})
document.body.appendChild(app.view)
app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

loader
  .add("../allSprites.json")
  .load(setup)

let player, ennemy, chest, state, terrain, gameScene, door, healthBar, id, ennemySprite, gameOverScene, ennemies, message, container, explorerHit = false;

function setup() {
  gameScene = new Container()
  gameOverScene = new Container()
  gameOverScene.visible = false

  let style = new PIXI.TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white"
  })




  //Initializing terrain
  let dungeonTexture = TextureCache["dungeon.png"];
  terrain = new Sprite(dungeonTexture);
  terrain.anchor.set(0.5)
  terrain.scale.set(2)
  terrain.position.set(window.innerWidth / 2, window.innerHeight / 2)
  app.stage.addChild(terrain)

  //--


  //setup of container object
  container = { x: terrain.x - terrain.width / 2 + 79, y: terrain.y - terrain.height / 2 + 68, width: terrain.x + terrain.width / 2 - 40, height: terrain.y + terrain.height / 2 - 28 }


  //Level values
  let ennemyNumber = 6;
  let XMiddle = terrain.position.x
  let YMiddle = terrain.position.y
  let defaultPlayerPositionX = XMiddle - 400
  let defaultPlayerPositionY = YMiddle + 400
  let speed = 2;
  let direction = 1;
  console.log(terrain.width);
  //--

  //setting message
  message = new PIXI.Text("The End!", style)
  message.x = XMiddle
  message.y = YMiddle
  gameOverScene.addChild(message)
  // gameOverScene.addChild(message)

  //Create the health bar
  healthBar = new PIXI.Container();
  healthBar.position.set(XMiddle - terrain.width / 2, YMiddle + terrain.height / 2)
  healthBar.scale.set(2)
  gameScene.addChild(healthBar);

  //Create the black background rectangle
  let innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);
  healthBar.outer = outerBar;
 //---


  //Initializing player
  player = new Sprite(resources["../allSprites.json"].textures["explorer.png"])
  player.scale.set(2);
  player.anchor.set(0.5)
  player.vx = 0;
  player.vy = 0;
  player.position.set(defaultPlayerPositionX, defaultPlayerPositionY)
  gameScene.addChild(player)
  //---

  //Initializing ennemies
  ennemies = []
  for (let i = 0; i < ennemyNumber; i++) {
    ennemySprite = new Sprite(resources["../allSprites.json"].textures["blob.png"])
    ennemySprite.anchor.set(0.5)
    ennemySprite.scale.set(2);
    console.log(i);
    ennemySprite.x = XMiddle + randomInt(-350, 350)
    ennemySprite.y = YMiddle + randomInt(-350, 350)
    ennemySprite.vy = speed * direction;
    direction *= -1;
    ennemies.push(ennemySprite)
    gameScene.addChild(ennemySprite)
  }
  //---

  //initializing door
  door = new Sprite(resources["../allSprites.json"].textures["door.png"])
  door.scale.set(2)
  door.position.set(terrain.x - terrain.width / 2 + 250, terrain.y - terrain.height / 2)
  console.log(terrain.x - terrain.width / 2);
  gameScene.addChild(door)
  //---
  //initializing chest
  chest = new Sprite(resources["../allSprites.json"].textures["treasure.png"])
  chest.anchor.set(0.5)
  chest.scale.set(2)
  chest.position.set(XMiddle + 350, YMiddle - 350)
  gameScene.addChild(chest)
 //---
  //setup  control
  setupControls()
  //---
  app.stage.addChild(gameScene)
  app.stage.addChild(gameOverScene)
  state = play;
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta)
}

function play(delta) {
  if (hitTestRectangle(player, chest)) {
    chest.x = player.x - 8;
    chest.y = player.y - 8;
  }
  if (hitTestRectangle(chest, door)) {
    state = end;
    message.text = "You won!";
  }
  if (healthBar.outer.width < 0) {
    state = end;
    message.text = "You lost!";
  }
  if (explorerHit) {
    player.alpha = 0.5;
    healthBar.outer.width -= 1;
    explorerHit = false

  } else {
    player.alpha = 1;
  }
  contain(player, container)
  ennemies.forEach(blob => {
    blob.y += blob.vy;
    let blobHitsWall = contain(blob, container);
    if (blobHitsWall === "top" || blobHitsWall === "bottom") {
      blob.vy *= -1;
    }
    if (hitTestRectangle(player, blob)) {
      explorerHit = true;
    }
  });
  player.x += player.vx;
  player.y += player.vy;
}

function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

