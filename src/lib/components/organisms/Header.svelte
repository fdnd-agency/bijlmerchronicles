<script>
    import logo from '$lib/assets/logo.avif';
    import { HamburgerMenu } from '$lib';
</script>

<nav>

    <div class="logo-container">
        <a href="/"><span class="sr-only">Home</span><img src="{ logo }" alt=""></a>
    </div>

    <div class="links-nav-container" aria-hidden="true">
        <a href="/nieuwsbriefhehre">Nieuwsbrief</a>
        <a href="/overons">Over ons</a>
        <a href="/helpgewegwg">Help</a>
        <a href="/kaart">Kaart</a>
        <a href="/wikiwegwge">Wiki</a>
    </div>

    <aside class="loginNsignup-container">
        <a href="/" class="login-button"><span class="login-button-border">Inloggen</span></a>
        <a href="/" class="signup-button"><span class="signup-button-border">Aanmelden</span></a>
    </aside>

    
    <div class="hamburger-container">
        <HamburgerMenu />
    </div>

    <div class="bottom-border-bevel"></div>
</nav>

<style>
@layer general-styling{

    /* --------------------------------------- General styling ---------------------------------------  */
    :root{
        --signup-login-button-width: 8rem;
        --signup-login-button-height: 2rem;
        --border-radius: 0.4rem;
        --bevel-header-height-adjustment: 1.5rem;
    }

    nav{
        background-color: var(--color-background);
        height: var(--header-height);
        min-height: 7.25rem;
        width: 100%;
        z-index: 10;
        position: fixed;
        top: 0;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
    }

    @supports (corner-shape: bevel) {
		nav {
            height: calc(var(--header-height) + var(--bevel-header-height-adjustment) * 1.6);
            corner-shape: bevel;
			border-bottom-left-radius: 100% var(--bevel-header-height-adjustment);
		}
	}

    .logo-container{
        flex-grow: 3;

        img{
            z-index: 1000;
            width: 20vw;
            min-width: 9.25rem;
            max-width: 19rem;
        }

    }

    .logo-container, .links-nav-container, .loginNsignup-container, .hamburger-container{
        z-index: 5;
        margin: 0 1rem 0; 
    }

    a{
        color: var(--color-secondary);
        text-decoration: none;
        font-size: var(--paragraph-size);

        &:hover{
            color: var(--pop-out-color-500);
        }

        /* --------------------------------------- Login / 'aanmelden' Button styling ---------------------------------------  */
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
            border: solid 1px var(--accent-color);
        }

        .signup-button-border{   
            border: solid 1px var(--color-primary-darker);
        }

    }

    /* --------------------------------------- RESPONSIVE STYLING ---------------------------------------  */

    .loginNsignup-container{
        display: none;
    }

    /* -- Each child starts on display none for mobile --  */
    .links-nav-container{
        display: none;

        a:first-child, a:nth-child(2), a:nth-child(3), a:nth-child(4), a:last-child{
            display: none;
        }

    }

    /* --------------------------------------- MEDIA QUERIES ---------------------------------------  */

    /* @container header (width > 570px) */
    @media (min-width: 570px) {

        .loginNsignup-container{
            display: flex;
            justify-content: center;
            gap: 1.5vw;
        }
        
    }

    /* @container header (width > 700px) */
    @media (min-width: 700px) {

        .links-nav-container{
            display: flex;
            justify-content: center;
            align-items: center;

            a:nth-child(2){
                display: block;
            }
        }

    }

    /* @container header (width > 810px) */
    @media (min-width: 810px) {

        .links-nav-container{
            gap: 5vw;
            flex-grow: 2;

            a:first-child{
                display: block;
            }
        }

    }

    /* @container header (width > 1025px) */
    @media (min-width: 1025px) {

        nav{
            justify-content: space-between;
            padding: 0;
        }

        .logo-container{
            flex-grow: 1;
        }

        .links-nav-container {
            gap: 5vw;
            flex-grow: 2;

            a{
                min-width: 5.5rem;
                max-width: 7rem;
            }

            a:nth-child(3){
                display: block;
            }
        }

    }

    /* @container header (width > 1625px) */
    @media (min-width: 1625px) {

        .links-nav-container {

            a:nth-child(4), 
            a:last-child{
                min-width: 3.5rem;
                max-width: 5rem;
                display: block;
            }

        }

    }

    /* --------------------------------------- BUTTON STYLING ---------------------------------------  */

    .login-button, .signup-button{
        width: var(--signup-login-button-width);
        height: var(--signup-login-button-height);
        position: relative;
        border-radius: var(--border-radius);
        z-index: 1;

        /* -- Box shadow in button recreated --  */
        &::before{
            content: '';
            position: absolute;
            top: -0.15rem;
            right: 0.1rem;
            width: calc(var(--signup-login-button-width) + 0.2rem);
            height: calc(var(--signup-login-button-height) + 0.15rem);
            border-radius: inherit;
            z-index: -1;
        }
        
    }

    /* -- Hover styling per button --  */
    .login-button{
        color: var(--accent-color);

        &::before{
            background-color: var(--color-secondary);
        }

        &:hover{
            color: var(--color-secondary);

            .login-button-border{
                border-color: var(--color-secondary);
            }

            &::before{
                background-color: var(--pop-out-color-500);
            }

        }

    }

    .signup-button{
        color: var(--color-primary-darker);

        &::before{
            background-color: var(--color-primary-lighter);
        }
        
        &:hover{
            color: var(--pop-out-color);

            .signup-button-border{
                border-color: var(--pop-out-color);
            }

            &::before{
                background-color: var(--accent-color);
            }
        }
    }

    @supports (corner-shape: bevel) {
		.bottom-border-bevel {
            z-index: 1;
			background-color: var(--color-secondary);
			position: absolute;
			width: 100%;
			height: 8px;
			transform: rotate(2deg);
            top: calc(var(--header-height) + var(--bevel-header-height-adjustment) * .96);

            @media (min-width: 750px) {
                transform: rotate(.9deg);
            }
		}
	}
}

</style>
