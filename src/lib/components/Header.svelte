<script>
    import { Logo } from '$lib';
    import { Hamburger_menu } from '$lib';
</script>

<nav>

    <div class="logo-container">
        <Logo />
    </div>

    <div class="main-nav-container">
        <a href="/nieuwsbrief">Nieuwsbrief</a>
        <a href="/overons">Over ons</a>
        <a href="/help">Help center</a>
    </div>


    <aside class="loginNsignup-container">
        <a href="/" class="login-button">Inloggen</a>
        <a href="/" class="signup-button">Aanmelden</a>
    </aside>

    
    <div class="hamburger-container">
        <Hamburger_menu />
    </div>

</nav>

<style>
    nav{
        display: flex;
    }
</style>