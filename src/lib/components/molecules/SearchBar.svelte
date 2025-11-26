<script>

  import { SearchIcon } from '$lib';

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
    <SearchIcon />
  </button>

</form>
  
<style>

  :root{
    --button-width: 4.375rem;
    --button-height: 3.125rem;
  }

  .searchbar-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 37.5rem;
    width: 100%;
  }
  
  .search-input {
    width: 100%;
    padding: 0.7rem;
    font-size: 1.5rem;
    border: 0.3rem solid var(--color-secondary);
    flex: 1;
    border-radius: 0.6rem;
    background-color: var(--color-neutral-200);
    color: var(--color-secondary);
    &:focus {
      outline: 2px solid var(--color-secondary);
      outline-offset: 0.2rem;
      box-shadow: none;
    }
  }
  
  .search-input::placeholder {
    color: var(--color-secondary);
    opacity: 0.7;
    text-align: center;
  } 
  
  .search-button {
    background-color: var(--color-secondary);
    width: var(--button-width);
    height: var(--button-height);
    position: relative;
    padding: 1.7rem 1.1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow:  0.3rem  0.3rem 0.1rem 0.06rem var(--color-neutral-200);
    &:focus {
      outline: 0.1rem solid var(--color-secondary);
      outline-offset: 0.2rem;
      box-shadow: none;
    }
  }
  
</style>