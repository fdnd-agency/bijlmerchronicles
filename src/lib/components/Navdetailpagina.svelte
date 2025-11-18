
<script>
  export let title = "Navbardetailpagina";
</script>


<div class="sidebar">
  <h3>Inhoud</h3>
  <div class="divider"></div>

  <details>
    <summary>Ipsum</summary>
    <ul>
      <li><a href="/help">Lorem Ipsum</a></li>
      <li><a href="/map">Lorem Ipsum</a></li>
      <li><a href="/navigatie">Lorem Ipsum</a></li>
      <li><a href="/overons">Lorem Ipsum</a></li>
      <li><a href="/wiki">Lorem Ipsum</a></li>
    </ul>
  </details>
</div>

<style>

  .sidebar {
    display: none;
    min-height: auto;
    width: clamp(11rem, 20vw, 16.3rem);
    background: var(--color-neutral);
    padding: clamp(0.8rem, 2vw, 1.5rem);
    border-right: 0.06rem solid #ddd;
  }

  h3 {
    margin: 0;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    color: var(--color-neutral-700);
  }

  .divider {
    height: 0.06rem;
    background: var(--color-neutral-700);
    margin: clamp(0.3rem, 1vh, 0.6rem) 0;
  }

  details summary {
    cursor: pointer;
    color: var(--color-secondary-600);
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
  }

  details summary::marker {
    content: "";
  }

  details summary::before {
    content: "";
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-right: 0.4em;
    background: url("/static/arrow.svg") no-repeat center;
  }

  details ul {
    margin: clamp(0.3rem, 1vh, 0.5rem) 0 0 clamp(1rem, 2vw, 1.6rem);
    list-style: none;
    padding: 0;
  }

  details a {
    display: block;
    margin: clamp(3rem, 1vh, 0.5rem) 0;
    color: var(--link-color);
    text-decoration: none;
    font-size: clamp(0.8rem, 1.6vw, 1rem);
  }

  details a:hover {
    text-decoration: underline;
  }

  @media (min-width: 75rem) {
    .sidebar {
      display: block;
    }
  }
</style>
