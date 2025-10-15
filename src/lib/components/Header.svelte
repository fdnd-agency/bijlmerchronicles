<script>
    import logo from '$lib/assets/logo.avif';
    import { HamburgerSVG } from '$lib';
</script>

<nav>

    <div class="logo-container">
        <img src="{ logo }" alt="">
    </div>

    <div class="links-nav-container">
        <a href="/nieuwsbrief">Nieuwsbrief</a>
        <a href="/overons">Over ons</a>
        <a href="/help">Help center</a>
    </div>

    <aside class="loginNsignup-container">
        <a href="/" class="login-button"><span class="login-button-border">Inloggen</span></a>
        <a href="/" class="signup-button"><span class="signup-button-border">Aanmelden</span></a>
    </aside>

    
    <div class="hamburger-container">
        <HamburgerSVG />
    </div>

</nav>

<style>
    :root{
        --button-width: 8rem;
        --button-height: 2rem;
        --border-radius: 0.4rem;
    }
    a{
        color: var(--color-secondary);
        text-decoration: none;
        font-size: var(--paragraph-size);
        span{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 5;
            border-radius: var(--border-radius);
        }
        .login-button-border{
            border: solid 1px var(--color-secondary-alt);
        }
        .signup-button-border{   
            border: solid 1px var(--color-primary-darker);
        }
    }
    .logo-container{
        flex-grow: 3;
        img{
            width: 20vw;
            min-width: 9.25rem;
            max-width: 19rem;
        }
    }
    nav{
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
        container-name: nav;
        container-type: inline-size;
        height: 10vh;
        min-height: 9rem;
    }

    .loginNsignup-container{
        display: none;
    }

    .links-nav-container{
        display: none;
    }

    @container header (width > 570px) {
        .loginNsignup-container{
            display: flex;
            justify-content: center;
            gap: 1.5vw;
        }
    }

    @container header (width > 1025px) {
        nav{
            display: flex;
            justify-content: space-between;
            padding: 0 0.6rem 0;
        }
        .logo-container{
            flex-grow: 1;
        }
        .links-nav-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5vw;
            flex-grow: 2;
            a{
                min-width: 5.5rem;
                max-width: 7rem;
            }
        }
    }

    .logo-container, .links-nav-container, .loginNsignup-container, .hamburger-container{
        z-index: 5;
        margin: 0 1rem 0; 
    }

    .login-button, .signup-button{
        width: var(--button-width);
        height: var(--button-height);
        position: relative;
        border-radius: var(--border-radius);
        z-index: 1;
        &::before{
            content: '';
            position: absolute;
            top: -0.15rem;
            right: 0.1rem;
            width: calc(var(--button-width) + 0.2rem);
            height: calc(var(--button-height) + 0.15rem);
            border-radius: inherit;
            z-index: -1;
        }
    }

    .login-button{
        color: var(--color-secondary-alt);
        &::before{
            background-color: var(--color-secondary);
        }
    }
    .signup-button{
        color: var(--color-primary-darker);
        &::before{
            background-color: var(--color-primary-lighter);
        }
    }

</style>

