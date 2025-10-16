<script>
    export let title = "Naam Lemma";
    export let text = "Informatieve tekst";
    export let image = "";
  </script>
  
  <section>
    {#if image}
      <div class="image-container">
        <img src={image} alt={title} anchor-name="--titel" />
      </div>
    {/if}
    <h1>{title}</h1>
    <p>{text}</p>
  </section>
  <style>
    section {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      position: relative;
    }
    
    .image-container {
      display: flex;
      justify-content: center;
      position: relative;
    }
    
    .image-container img {
      width: 80%;
      height: auto;
      border-radius: 15px;
      anchor-name: --titel;
    }
    

    h1 {
      position-anchor: --titel;
      position: absolute;
      top: anchor(--titel bottom);
      left: anchor(--titel center);
      translate: -50% -60%; /* verplaatst de titel iets omhoog en naar links zodat hij exact gecentreerd onderaan de afbeelding staat */
      font-size: 2.5rem;
      text-transform: uppercase;
      color: var(--color-neutral-700);
      text-align: center; 
      margin: 0;

    }


    p {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--color-neutral-700);
      margin-top: 2rem;
    }
    
    /* Fallback voor browsers zonder anchor positioning */
    @supports not (position-anchor: --titel) {
      h1 {
        position: absolute;
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
      }
    }
