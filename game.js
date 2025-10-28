// --- START: audio-friendly splash (copy/paste toda esta função) ---
const FIRST_RUN_KEY = 'tfa_first_run_shown_v1';

async function tryPlayAudio(audioEl){
  try{
    await audioEl.play();
    return true;
  }catch(e){
    // autoplay blocked; return false so we can show a CTA button
    return false;
  }
}

function showSplashThenStart() {
  const shown = localStorage.getItem(FIRST_RUN_KEY);
  const splash = document.getElementById('splash');
  const canvas = document.getElementById('logoCanvas');
  const ctx = canvas.getContext('2d');

  const logoImg = new Image();
  logoImg.src = 'assets/obomsoft_logo_2048.png';

  // audio elements
  const soundID = new Audio('assets/sound_id.wav');
  const bgMusic = new Audio('assets/music1.wav');
  bgMusic.loop = true;
  bgMusic.volume = 0.55;

  // helper to create a "Tocar" button if autoplay blocked
  function showPlayButton(){
    const btn = document.createElement('button');
    btn.id = 'playSoundBtn';
    btn.textContent = 'Tocar áudio / Iniciar';
    btn.style.position = 'absolute';
    btn.style.zIndex = 9999;
    btn.style.left = '50%';
    btn.style.top = '75%';
    btn.style.transform = 'translate(-50%,-50%)';
    btn.style.padding = '12px 18px';
    btn.style.fontSize = '16px';
    btn.style.borderRadius = '12px';
    document.body.appendChild(btn);
    btn.addEventListener('click', async ()=>{
      await tryPlayAudio(soundID).catch(()=>{});
      await tryPlayAudio(bgMusic).catch(()=>{});
      btn.remove();
      proceedToGame();
    });
  }

  function proceedToGame(){
    splash.style.display='none';
    document.getElementById('gameContainer').style.display='block';
    if(!shown) localStorage.setItem(FIRST_RUN_KEY, '1');
    startPhaserGame(); // existing function that initialises o Phaser
    // dentro da scene em Phaser
if(!this.gridGraphics) this.gridGraphics = this.add.graphics();
this.gridGraphics.clear();
// desenhar cada célula preenchida
this.gridGraphics.fillStyle(0xffcc00, 1);
for(let y=0;y<20;y++){
  for(let x=0;x<10;x++){
    if(grid[y][x]){
      this.gridGraphics.fillRect(16 + x*32, 16 + y*32, 30, 30);
    }
  }
}
// desenhar peça atual
this.gridGraphics.fillStyle(0x66ccff, 1);
for(let ry=0; ry<current.h; ry++) for(let rx=0; rx<current.w; rx++){
  if(current.shape[ry][rx]){
    this.gridGraphics.fillRect(16 + (current.x+rx)*32, 16 + (current.y+ry)*32, 30, 30);
  }
}

  }

  logoImg.onload = async ()=>{
    // draw static logo once for fallback
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const w = canvas.width*0.9, h = canvas.height*0.7;
    ctx.drawImage(logoImg, (canvas.width-w)/2, (canvas.height-h)/2, w, h);

    if(shown){
      // skip intro animation
      proceedToGame();
      return;
    }

    // try to play soundID and background music
    const ok1 = await tryPlayAudio(soundID);
    const ok2 = await tryPlayAudio(bgMusic);

    // if autoplay blocked, show a big play button so user can start audio+game
    if(!ok1 || !ok2){
      showPlayButton();
      // also animate the logo visually but wait for user interaction to unmute music
      let start = performance.now();
      function anim(t){
        const dt = (t-start)/1000;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const g = ctx.createLinearGradient(0,0,0,canvas.height);
        g.addColorStop(0,'#8fd3f4'); g.addColorStop(1,'#f6a6ff');
        ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.globalAlpha = 0.95;
        ctx.drawImage(logoImg, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
        // beam
        ctx.fillStyle = 'rgba(255,255,255,'+ (0.06 + 0.04*Math.sin(dt*4)) +')';
        ctx.fillRect(canvas.width*0.2, canvas.height*0.45, canvas.width*0.6, 6*Math.abs(Math.sin(dt*3)));
        requestAnimationFrame(anim);
      }
      requestAnimationFrame(anim);
    } else {
      // autoplay worked — play intro animation for 3s then proceed
      let t0 = performance.now();
      function anim(t){
        const dt = (t-t0)/1000;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const g = ctx.createLinearGradient(0,0,0,canvas.height);
        g.addColorStop(0,'#8fd3f4'); g.addColorStop(1,'#f6a6ff');
        ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(logoImg, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
        ctx.fillStyle = 'rgba(255,255,255,'+ (0.08*Math.abs(Math.sin(dt*4))) +')';
        ctx.fillRect(canvas.width*0.2, canvas.height*0.45, canvas.width*0.6, 6*Math.abs(Math.sin(dt*3)));
        if(dt < 3) requestAnimationFrame(anim); else proceedToGame();
      }
      requestAnimationFrame(anim);
    }
  };
}
// call showSplashThenStart() at the end of page load
// --- END: audio-friendly splash ---
document.getElementById('openPanel').addEventListener('click', ()=> {
  document.getElementById('sidePanel').classList.remove('hidden');
});
document.getElementById('closePanel').addEventListener('click', ()=> {
  document.getElementById('sidePanel').classList.add('hidden');
});
