<script>
  import { T } from '@threlte/core'
  import { useGltf, useGltfAnimations, OrbitControls } from '@threlte/extras'

  // Load the GLTF
  const gltf = useGltf('/models/particle_wave/scene.gltf')

  // Extract animations
  const { actions } = useGltfAnimations(gltf)

  // Play the first available animation
  $effect(() => {
    const firstAnimation = Object.values($actions)[0]
    firstAnimation?.play()
  })
</script>

<!-- Wait for GLTF to load -->
{#await gltf then { scene }}
  <!-- Wrap in a group for scaling/rotation -->
  <T.Group scale={3} rotation={[0, Math.PI, 0]}> 
    <T is={scene} />
  </T.Group>
{/await}

<!-- Camera fixed on object -->
<T.PerspectiveCamera position={[1, 1, 1]} fov={15}>
</T.PerspectiveCamera>

<!-- Lights -->
<T.AmbientLight intensity={1} />
<T.DirectionalLight position={[1, 1, 5]} intensity={1} />
