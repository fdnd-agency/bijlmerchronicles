<script>
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import gsap from 'gsap'
  import { onMount } from 'svelte'
</script>

<div class="background-canvas">
  <Canvas>
    <Scene />
  </Canvas>
</div>

<h1>
  <span class="letter-o">O</span><span class="letter-v">v</span><span class="letter-e">e</span><span class="letter-r">r</span> 
  <span class="letter-o-2">o</span><span class="letter-n">n</span><span class="letter-s">s</span>
</h1>

<style>
  @font-face {
    font-family: 'Crimes';
    src: url($lib/assets/fonts/crimes-times-six/CrimesTimesSix.ttf);
  }

  @font-face {
    font-family: 'Mustasurma';
    src: url($lib/assets/fonts/mustasurma/Mustasurma.ttf);
  }

  @font-face {
    font-family: 'Pinkend';
    src: url($lib/assets/fonts/pinkend/Pinkend.ttf);
  }

  *{
    font-family: 'Crimes', 'Franklin Gothic Medium', Arial, sans-serif;
  }

  h1{
    margin: 0;
    font-size: 20vw;
    height: 100vh;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .background-canvas{
    overflow: clip;
    z-index: 1000;
    height: 100vh;
    width: 100%;
    position: absolute; 
    top: 0;
    left: 0;
  }
  .letter-o, .letter-v, .letter-e, .letter-r {
    z-index: 1200;
  }
</style>
 