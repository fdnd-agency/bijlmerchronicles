<script>
//codepen (voor uitleg): https://codepen.io/Lutrian1/pen/WbrXZZE
    import { onMount } from 'svelte';
    onMount(() => {
        const hamburgerButton = document.querySelector('button');
        let menu = document.querySelector('.hamburger-menu-nav');
        menu.style.setProperty('display', 'none');
        const topLine = document.querySelector('.line-top');
        const middleLine = document.querySelector('.line-middle');
        const bottomLine = document.querySelector('.line-bottom');
        const animation_duration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--animation-duration'),10);
        hamburgerButton.addEventListener('click', () => {
        const animation_is_on = hamburgerButton.classList.toggle('animation-is-on');
        hamburgerButton.classList.add('bounce_animation');
        topLine.classList.toggle('path_animation_top', animation_is_on);
        bottomLine.classList.toggle('path_animation_bottom', animation_is_on);
        if (animation_is_on) {
            middleLine.style.setProperty('display', 'none');
            menu.classList.add('open');
            menu.style.setProperty('display', 'block');
        } else {
            middleLine.style.setProperty('display', 'block');
            menu.classList.remove('open');
            menu.style.setProperty('display', 'none');
        }
        setTimeout(() => {
            hamburgerButton.classList.remove('bounce_animation');
        }, animation_duration + 100);
        });
    });

</script>

<!--
<div> 

    <button id="menu" aria-haspopup="true" aria-controls="menu"> <span class="sr-only">Hamburger menu</span>
        <svg class="hamburger-menu" width="44" height="26" viewBox="0 0 44 26">
            <path class="line-top" d="M41.0312 2.98676C39.0171 2.88676 37.003 2.79176 34.9888 2.70176C31.6696 2.55344 28.3504 2.4187 25.0312 2.29754C19.6979 2.10287 14.3646 1.94324 9.03125 1.81868L8.73145 1.85781C6.86385 2.36385 5.15646 3.05212 3.50407 4.14424C1.92624 5.19502 0.15087 6.98612 0.130538 9.48676C-0.0125909 11.8174 2.04822 13.7662 3.7354 14.3944C5.50365 15.1349 7.18726 15.3946 9.03125 15.4596C11.7395 15.4777 14.4478 15.4868 17.1561 15.4868C19.7812 15.4868 22.4062 15.4783 25.0313 15.4613L25.2939 15.4377C31.0715 14.2358 34.7016 8.27739 34.3207 2.98676C34.3136 2.61632 34.2545 2.23909 33.9943 1.82206C33.7247 1.38144 33.2309 1.10099 32.907 1.01259C32.729 0.958434 32.5559 0.929339 32.388 0.915225C32.2431 0.903739 32.129 0.903644 32.0022 0.908537C31.7625 0.917198 31.4804 0.960499 31.3119 0.99607C30.4905 1.16882 29.8055 1.4547 29.1934 1.72275C27.9156 2.29341 26.699 2.97631 25.565 3.64794C23.231 5.03816 21.048 6.513 18.8626 8.04659C14.5156 11.1106 10.2963 14.3556 6.17529 17.6647C4.59576 18.9344 3.01604 20.225 1.5 21.5C3.1367 20.3846 4.82837 19.2475 6.51223 18.1245C10.9062 15.2013 15.3495 12.2933 19.8413 9.53512C22.0961 8.15579 24.3361 6.82439 26.6565 5.59468C27.7799 5.00414 28.9805 4.40497 30.1282 3.95307C30.6669 3.74263 31.2848 3.5319 31.7677 3.45601C31.9921 3.41267 32.2287 3.44166 32.1449 3.43677C32.1104 3.43524 31.9257 3.34565 31.8303 3.19021C31.7396 3.04868 31.7459 2.96516 31.7418 2.98676C31.8471 7.57409 28.8567 11.6635 24.7686 12.5358L25.0313 12.5122C22.4062 12.4952 19.7812 12.4868 17.1561 12.4868C14.4478 12.4868 11.7395 12.4958 9.03125 12.5139C6.26861 12.491 2.71049 11.4948 2.86946 9.48676C2.75673 7.12062 6.36447 5.05801 9.33105 4.1157L9.03125 4.15483C14.3646 4.03027 19.6979 3.87065 25.0312 3.67597C28.3504 3.55481 31.6696 3.42007 34.9888 3.27176C37.003 3.18176 39.0171 3.08676 41.0312 2.98676Z" />
            <path class="line-middle" d="M0 2C24 2 32.6667 2 34 2" />
            <path class="line-bottom" d="M41.5312 17.0699C39.5288 17.1699 37.5263 17.2649 35.5238 17.3549C32.193 17.5046 28.8621 17.6405 25.5312 17.7625C20.1979 17.9579 14.8646 18.1178 9.53125 18.2423L9.23033 18.203C7.36212 17.6968 5.65461 17.0084 4.00172 15.9158C2.42351 14.8646 0.647057 13.0723 0.62693 10.5699C0.4839 8.2375 2.54659 6.28755 4.23426 5.65954C6.00317 4.91908 7.68693 4.65968 9.53125 4.59501C12.1229 4.57826 14.7146 4.56988 17.3063 4.56988C20.048 4.56988 22.7896 4.57925 25.5313 4.598L25.7934 4.62154C31.5693 5.82525 35.1948 11.7822 34.8116 17.0699C34.8063 17.4266 34.7439 17.7949 34.5189 18.1818C34.289 18.5943 33.832 18.9068 33.527 19.0139C32.7915 19.2679 32.3838 19.1842 31.9369 19.1377C31.1324 19.0163 30.4316 18.7634 29.8152 18.5246C28.5306 18.016 27.3268 17.398 26.1842 16.7773C23.8483 15.499 21.661 14.1258 19.4736 12.6956C15.1208 9.83628 10.8898 6.78632 6.76377 3.67447C5.15288 2.45848 3.54717 1.22495 2 0C3.66301 1.06192 5.37591 2.13853 7.08645 3.2046C11.469 5.92799 15.9104 8.63808 20.3943 11.1885C22.6443 12.463 24.8822 13.691 27.1947 14.8078C28.3209 15.3469 29.5043 15.8808 30.6449 16.2729C31.1814 16.4561 31.7998 16.6319 32.2491 16.6742C32.4766 16.7043 32.6796 16.6568 32.5895 16.6718C32.5537 16.6766 32.3946 16.7731 32.3222 16.9026C32.2513 17.0199 32.2543 17.0922 32.2509 17.0699C32.3539 12.4796 29.359 8.38868 25.2691 7.51823L25.5313 7.54176C22.7896 7.56051 20.048 7.56988 17.3063 7.56988C14.7146 7.56988 12.1229 7.56151 9.53125 7.54476C6.76877 7.56802 3.21275 8.56609 3.37307 10.5699C3.26001 12.9321 6.86629 14.9949 9.83216 15.9367L9.53125 15.8975C14.8646 16.0219 20.1979 16.1819 25.5312 16.3773C28.8621 16.4993 32.193 16.6352 35.5238 16.7849C37.5263 16.8749 39.5288 16.9699 41.5312 17.0699Z" />
        </svg>
    </button>
   
    <menu class="hamburger-menu-nav">
      <ul>
        <li><a href="#">home</a></li>
        <li><a href="#">portfolio</a></li>
        <li><a href="#">images</a></li>
        <li><a href="#">contact</a></li>
      </ul>
    </menu>
   
</div>

-->
<style>

    :root{
    --animation-duration: 400ms;
    }

/* --------------------------------------- BUTTON STYLING ---------------------------------------  */

    button{
        transition: transform var(--animation-duration) ease-in-out;
        background-color: none;
        border: none;

        .hamburger-menu{
            cursor: pointer;
            position:relative;
            width: 3vw;
            height: 3vh;
            min-width: 3rem;
            max-width: 3.5rem;
            min-height: 2.8rem;
            max-height: 3.5rem;

            &:hover{
                path{
                    stroke: var(--pop-out-color-500);
                }
            }

            path{
                position: absolute;
                fill:none;
                stroke: var(--color-neutral-600);
                stroke-width: 3;
                stroke-linecap:round;
            }

            .line-top{
                transform: translateY(1px);
                stroke-dasharray: 30 244;
                transition: stroke-dashoffset var(--animation-duration) ease-in-out;
            }

            .line-middle{
                transform: translateY(10px);
            }

            .line-bottom{
                transform: translateY(3px);
                stroke-dasharray: 35 244;
                transition: stroke-dashoffset var(--animation-duration) ease-in-out;
            }

        }

    }

/* --------------------------------------- Animaties ---------------------------------------  */

@layer animations{

    :global(.bounce_animation) {
        animation-name: bounce;
        animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
        animation-duration: 0.4s;
        animation-iteration-count: 1;
    }

    :global(.path_animation_top){
        stroke-dashoffset: -135px; /* Bepaald waar de lijn stopt */
        transition: stroke-dashoffset var(--animation-duration) ease-in-out;
    }

    :global(.path_animation_bottom){
        stroke-dashoffset: -127px; /* Bepaald waar de lijn stopt */
        transition: stroke-dashoffset var(--animation-duration) ease-in-out;
    }
    /* Doet iets niks betekend maar zorgt ervoor dat ik in javascript de class 'animation-is-on' kan aanspreken en deze weer kan removen*/
    :global(.animation-is-on){
        transform: translateX(0);
    }


    @keyframes bounce {
        0%, 50%, 57%, 64% {
            transform: scale(1);
        }
        10% {
            transform: scale(1.2, 0.8);
        }
        30% {
            transform: scale(0.8, 1.4);
        }
        100%{
            transform: scale(1);
        }
    }

}

/* --------------------------------------- Hamburger-menu styling ---------------------------------------  */

.hamburger-menu-nav {
  background-color: #263B1C;
  padding: 0;
  margin: 0;
  a{
    color: #CEBF8F;
    font-size: 2rem;
    text-decoration: none;
  }
}

/* -- Classlist open, is aangesproken in javascript en wordt toegevoegd aan het hamburger menu, deze styling is nodig voor het hamburger menu -- */
:global(.open) {
  display: block;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60%;
  
  ul{
    display: flex;
    flex-direction: column;
    align-items: center;
    
    li{
      list-style: none;
    }
  }
}

</style>
