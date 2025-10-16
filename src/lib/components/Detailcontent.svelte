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
