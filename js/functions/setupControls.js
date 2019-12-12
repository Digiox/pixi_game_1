function setupControls() {
    let left = keyboard("ArrowLeft"),
    right = keyboard("ArrowRight"),
    up = keyboard("ArrowUp"),
    down = keyboard("ArrowDown")
  //left press and release
  left.press = () => {
    // console.log("LEFT");

    player.vx = -3
    player.vy = 0
  }
  left.release = () => {
    if (!right.isDown && player.vy === 0) {
      player.vx = 0
    }
  }

  //Up
  up.press = () => {
    // console.log("up");

    player.vy = -3;
    player.vx = 0;
  }
  up.release = () => {
    if (!down.isDown && player.vx === 0) {
      player.vy = 0
    }
  }
  //right
  right.press = () => {
    player.vx = 3;
    player.vy = 0;
  }
  right.release = () => {
    if (!left.isDown && player.vy === 0) {
      player.vx = 0;
    }
  }

  //Down
  down.press = () => {
    player.vy = 3;
    player.vx = 0;
  }
  down.release = () => {
    if (!up.isDown && player.vx === 0) {
      player.vy = 0
    }
  }

}