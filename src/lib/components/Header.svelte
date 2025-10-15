<script>
    import logo from '$lib/assets/logo.avif';
    import { HamburgerSVG } from '$lib';
</script>

<nav>

    <div class="logo-container">
        <img src="{ logo }" alt="">
    </div>

    <div class="main-nav-container">
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
        --button-width: 7rem;
        --button-height: 2rem;
        --border-radius: 0.4rem;
    }
    a{
        color: var(--color-secondary);
        text-decoration: none;
        span{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2;
            border-radius: var(--border-radius);
        }
        .login-button-border{
            border: solid 1px var(--color-secondary-alt);
        }
        .signup-button-border{   
            border: solid 1px var(--color-primary-darker);
        }
    }
    img{
        width: 20vw;
        min-width: 9.25rem;
        max-width: 19rem;
    }
    nav{
        display: flex;
        align-items: center;
        height: 10vh;
        min-height: 9rem;
    }

    .logo-container, .main-nav-container, .loginNsignup-container, .hamburger-container{
        margin: 0 1rem 0; 
    }
    .main-nav-container{
        display: flex;
        justify-content: center;
        gap: 5vw;
    }
    .loginNsignup-container{
        display: flex;
        justify-content: center;
        gap: 1.5vw;
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
            width: calc(var(--button-width) + 0.25rem);
            height: calc(var(--button-height) + 0.1rem);
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

