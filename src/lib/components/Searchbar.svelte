<script>
    import { Searchicon } from '$lib';

    export let type = "Searchbar";
    let query = '';
  
    function handleSearchClick() {
      console.log(`Zoeken naar: ${query}`);
    }
  </script>
  

  <div class="searchbar-container">
    <div class="searchbar-input-wrapper">
      <input
        class="search-input"
        type="text"
        bind:value={query}
        placeholder="Waar ligt het Johan Cruijff ArenA?"
        aria-label={type}
      />
    </div>
  
    <button class="search-button" on:click={handleSearchClick} aria-label="Zoeken">
      <Searchicon />
    </button>
  </div>
  
  <style>

    .searchbar-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 700px;
      width: 100%;
    }
  
    .searchbar-input-wrapper {
      background-color: var(--color-neutral-200);
      padding: 5px;
      border-radius: 14px;
      border: 4px solid var(--color-secondary);
      flex: 1;
    }
  
    .search-input {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      border: none;
      outline: none;
      background: transparent;
      color: var(--color-secondary);
    }
  
    .search-input::placeholder {
      color: var(--color-secondary);
      opacity: 0.7;
    }
  
    .search-button {
      background-color: var(--color-secondary);
      border: 5px;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  </style>
  
  