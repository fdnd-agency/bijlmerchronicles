<script>

  import { Searchicon } from '$lib';

  export let type = "Searchbar";
  let query = '';
  
  function handleSearchClick() {
    console.log(`Zoeken naar: ${query}`);
  }

</script>
  
<form method="get" class="searchbar-container" on:submit={handleSearchClick}>

  <input
      class="search-input"
      type="text"
      name="query"
      bind:value={query}
      placeholder="Waar ligt de Johan Cruijff ArenA?"
      aria-label={type}
    />

  <button type="submit" class="search-button" aria-label="Zoeken">
    <Searchicon />
  </button>

</form>
  
<style>

  :root{
      --button-width-searchbar: 4.375rem;
      --button-height-searchbar: 3.125rem;
  }

  .searchbar-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 600px;
      width: 100%;
  }
    
  .search-input {
      width: 100%;
      padding: 0.7rem;
      font-size: 1.5rem;
      border: 4px solid var(--color-secondary);
      flex: 1;
      border-radius: 10px;
      background-color: var(--color-neutral-200);
      color: var(--color-secondary);
  }
    
  .search-input::placeholder {
      color: var(--color-secondary);
      opacity: 0.7;
      text-align: center;
  } 
    
  .search-button {
      background-color: var(--color-secondary);
      width: var(--button-width-searchbar);
      height: var(--button-height-searchbar);
      position: relative;
      padding: 1.7rem 1.1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 4px 4px 2px 1px var(--color-neutral-200);

  }
  
</style>
  
  