
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
    width: clamp(180px, 20vw, 260px);
    background: var(--color-neutral);
    padding: clamp(12px, 2vw, 24px);
    border-right: 1px solid #ddd;
    /* padding-top: 200px; */
  }

  h3 {
    margin: 0;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    color: var(--color-neutral-700);
  }

  .divider {
    height: 1px;
    background: var(--color-neutral-700);
    margin: clamp(4px, 1vh, 10px) 0;
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
    margin: clamp(4px, 1vh, 8px) 0 0 clamp(15px, 2vw, 25px);
    list-style: none;
    padding: 0;
  }

  details a {
    display: block;
    margin: clamp(4px, 1vh, 8px) 0;
    color: var(--link-color);
    text-decoration: none;
    font-size: clamp(0.8rem, 1.6vw, 1rem);
  }

  details a:hover {
    text-decoration: underline;
  }

  @media (min-width: 700px) {
    .sidebar {
      display: block;
    }
  }
</style>
