<script>
    export let title = "Naam Lemma";
    export let text = "Informatieve tekst";
    export let image = ""
  </script>
  

<section>
  {#if image}
    <div class="image-container">
      <img src={image} alt="" />
    </div>
  {/if}

  <h1>{title}</h1>
  <p>{text}</p>
</section>

<style>
  section {
    max-width: 50rem;
    margin: 0 auto;
    padding: 1rem;
    position: relative;
    container-type: inline-size;
  }

  .image-container {
    display: flex;
    justify-content: center;
    position: relative;
  }

  .image-container img {
    width: 360%;
    height: auto;
    justify-content: center;
    border-radius: 0.7rem;
  }

  h1 {
    font-size: var(--wiki-heading);
    text-transform: uppercase;
    color: var(--color-neutral-700);
    text-align: center;
    margin: 0rem 1rem 0rem;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
}

  p {
    font-size: var(--wiki-p);
    line-height: 1.6;
    color: var(--color-neutral-700);
    margin-top: 8rem;
  }


  @supports (anchor-name: --titel) and (position-anchor: --titel) {
    .image-container img {
      anchor-name: --titel;
    }

    h1 {
      position: absolute;
      position-anchor: --titel;
      top: anchor(--titel bottom);
      left: anchor(--titel center);
      translate: -50% -60%;
      margin: 0;
    }
  }

 /* RESPONSIVE met container query */

@container ( width > 48rem) {
  h1 {
    font-size: var(--wiki-heading-mobile);
    translate: -50% -60%;
  }

  p {
    font-size: var(--wiki-p-mobile);
    margin-top: 8rem;
  }
}

</style>
