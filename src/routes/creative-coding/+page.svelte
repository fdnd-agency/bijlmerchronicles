<!-- SCRIPT -->
<script>
    import { onMount } from "svelte";
    import { on } from "svelte/events";
    import { gsap } from "gsap";

    onMount(() => {
        let changeButton = document.querySelector("button");
        let main = document.querySelector("main");

        changeButton.addEventListener("click", function () {
            main.classList.toggle("upside-down");

            let lights = document.querySelectorAll('.light')
            lights.forEach(light => {
                light.classList.toggle('flickering')
            })

            // als main de class "upside-down" heeft, voer animatie naar boven uit
            if (main.classList.contains("upside-down")) {
                // Animatie naar boven
                gsap.to(".bike", {
                    duration: 1,
                    x: "280px",
                    y: "-45vh",
                    rotation: 180,
                });
            } else {
                // Reset animatie naar originele positie
                gsap.to(".bike", {
                    duration: 1,
                    x: "0",
                    y: "0",
                    rotation: 0,
                });
            }
        });
    });
</script>

<button>Laat je verrassen</button>

<div class="bike-container">
    <div class="bike">
        <div class="frame">
            <div class="frame one"></div>
            <div class="frame two"></div>
            <div class="frame three"></div>
            <div class="frame four"></div>
            <div class="frame five"></div>
            <div class="frame six"></div>
            <div class="frame seat"></div>
            <div class="frame pedal"></div>
            <div class="frame handle"></div>
            <div class="frame light"></div>
        </div>
        <div class="wheel">
            <div class="wheel left">
                <div class="spokes">
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                </div>
            </div>
            <div class="wheel right">
                <div class="spokes">
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="bike">
        <div class="frame">
            <div class="frame one"></div>
            <div class="frame two"></div>
            <div class="frame three"></div>
            <div class="frame four"></div>
            <div class="frame five"></div>
            <div class="frame six"></div>
            <div class="frame seat"></div>
            <div class="frame pedal"></div>
            <div class="frame handle"></div>
            <div class="frame light"></div>
        </div>
        <div class="wheel">
            <div class="wheel left">
                <div class="spokes">
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                </div>
            </div>
            <div class="wheel right">
                <div class="spokes">
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="bike">
        <div class="frame">
            <div class="frame one"></div>
            <div class="frame two"></div>
            <div class="frame three"></div>
            <div class="frame four"></div>
            <div class="frame five"></div>
            <div class="frame six"></div>
            <div class="frame seat"></div>
            <div class="frame pedal"></div>
            <div class="frame handle"></div>
            <div class="frame light"></div>
        </div>
        <div class="wheel">
            <div class="wheel left">
                <div class="spokes">
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                </div>
            </div>
            <div class="wheel right">
                <div class="spokes">
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                </div>
            </div>
        </div>
    </div>

</div>

<!-- STYLING -->
<style>
    :global(*) {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        &:before, &:after {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
        &:before, &:after {
            position: absolute;
            content: '';
        }
    }
    :global(body) {
        display: flex;
        height: 100vh;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    :global(main) {
        display: flex;
        height: 100vh;
        width: 100%;
        justify-content: center;
        align-items: end;
        background-color: #aafff4;
        &.upside-down {
            background-image: url("../../lib/assets/upside-down.webp");
        }
    }

    button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }

    .bike-container {
        display: flex;
        gap: 20rem;
        margin-top: 20px;
    }

    .bike-container {
        width: 100%;
        height: 13.5rem;
    }

    .bike {
        margin-bottom: -3rem;
    }

    .bike:nth-of-type(1) {
        position: absolute;
        left: 5%;
    }

    .bike:nth-of-type(2) {
        display: none;
        position: absolute;
        left: 37.5%;
        @media (min-width: 900px) {
            display: block;
        }
    }

    .bike:nth-of-type(3) {
        display: none;
        position: absolute;
        left: 70%;
        @media (min-width: 1200px) {
            display: block;
        }
    }

    .frame {
        &.light {
            &:before {
                animation: lamp-flicker 1s infinite;
            }
        }
    }

    .bike {
        &.upside-down {
            transform: rotate(-180deg);
        }
    }

    /* DE REST */

    .frame {
        position: absolute;
        z-index: 1;
        background: #ffffff;
        &.one {
            top: 6.3rem;
            left: 2.45rem;
            width: 6.2rem;
            height: 0.5rem;
            -webkit-transform: rotate(-50deg);
            -ms-transform: rotate(-50deg);
            transform: rotate(-50deg);
        }
        &.two {
            top: 8.7rem;
            left: 3.3rem;
            width: 6rem;
            height: 0.5rem;
            border-radius: 1rem 0 0 1rem;
        }
        &.three {
            top: 5.5rem;
            left: 4.25rem;
            width: 7.5rem;
            height: 0.5rem;
            border-radius: 1rem;
            -webkit-transform: rotate(72deg);
            -ms-transform: rotate(72deg);
            transform: rotate(72deg);
        }
        &.four {
            top: 4rem;
            left: 7.5rem;
            width: 5.5rem;
            height: 0.5rem;
        }
        &.five {
            top: 6.5rem;
            left: 8rem;
            width: 6rem;
            height: 0.5rem;
            -webkit-transform: rotate(-50deg);
            -ms-transform: rotate(-50deg);
            transform: rotate(-50deg);
        }
        &.six {
            top: 4.7rem;
            left: 8.8rem;
            width: 8.8rem;
            height: 0.5rem;
            border-radius: 1rem;
            -webkit-transform: rotate(72deg);
            -ms-transform: rotate(72deg);
            transform: rotate(72deg);
        }
        &.seat {
            top: 1.5rem;
            left: 5.25rem;
            width: 3rem;
            height: 1.25rem;
            background: rgb(149, 149, 149);
            border-radius: 50% 100% 100% 50% / 50% 60% 100% 100%;
        }
        &.pedal {
            top: 8.4rem;
            left: 8.6rem;
            width: 1rem;
            height: 1rem;
            background: transparent;
            border: 0.5rem solid #a59c85;
            border-radius: 100%;
            -webkit-animation: wheelSpin 2s linear infinite;
            animation: wheelSpin 2s linear infinite;
            &:before {
                top: -0.15rem;
                left: -0.25rem;
                width: 0.5rem;
                height: 1.23rem;
                background: #fff;
                border-radius: 1rem 1rem 0 0;
            }
            &:after {
                top: 0.75rem;
                left: -0.5rem;
                width: 1rem;
                height: 0.5rem;
                background: #25262a;
                border-radius: 1rem;
                -webkit-animation: pedalSpin 2s linear infinite;
                animation: pedalSpin 2s linear infinite;
            }
        }
        &.handle {
            top: 0.5rem;
            left: 11.7rem;
            width: 1.5rem;
            height: 0.5rem;
            border-radius: 1rem;
            -webkit-transform: rotate(-25deg);
            -ms-transform: rotate(-25deg);
            transform: rotate(-25deg);
            &:before {
                top: -0.35rem;
                left: 0.2rem;
                width: inherit;
                height: inherit;
                background: rgb(135, 135, 135);
                border-radius: inherit;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }
        }
        &.light {
            top: 2.5rem;
            left: 12.3rem;
            width: 0.75rem;
            height: 0.5rem;
            background-color: black;
            z-index: -1;
            &:before {
                opacity: 0;
                background-color: yellow;
                width: 0.5rem;
                height: inherit;
                left: 0.75rem;
                z-index: -1;
                border-bottom-right-radius: 100% 50px;
                corner-shape: bevel;
            }
        }
    }

    .wheel {
        position: absolute;
        z-index: -1;
        &.left,
        &.right {
            top: 5.5rem;
            width: 7rem;
            height: 7rem;
            border: 0.5rem solid #25262a;
            border-radius: 100%;
            -webkit-box-shadow: inset 0 0 0 0.5rem #fff;
            box-shadow: inset 0 0 0 0.5rem #fff;
        }
        &.left:after {
            z-index: 1;
            top: 2.5rem;
            left: 2.5rem;
            width: 1rem;
            height: 1rem;
            background: transparent;
            border: 0.5rem solid #a59c85;
            border-radius: 100%;
        }
        &.right {
            &:after {
                z-index: 1;
                top: 2.5rem;
                left: 2.5rem;
                width: 1rem;
                height: 1rem;
                background: transparent;
                border: 0.5rem solid #a59c85;
                border-radius: 100%;
            }
            left: 11rem;
        }
    }

    .spokes {
        position: absolute;
        top: 0.25rem;
        left: 2.85rem;
        width: 0.3rem;
        height: 5.5rem;
        -webkit-animation: wheelSpin 2.5s linear infinite;
        animation: wheelSpin 2.5s linear infinite;
    }

    .spoke {
        position: absolute;
        top: 0;
        width: inherit;
        height: inherit;
        background: #fff;
        &:nth-child(1) {
            -webkit-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        &:nth-child(2) {
            -webkit-transform: rotate(30deg);
            -ms-transform: rotate(30deg);
            transform: rotate(30deg);
        }
        &:nth-child(3) {
            -webkit-transform: rotate(60deg);
            -ms-transform: rotate(60deg);
            transform: rotate(60deg);
        }
        &:nth-child(4) {
            -webkit-transform: rotate(120deg);
            -ms-transform: rotate(120deg);
            transform: rotate(120deg);
        }
        &:nth-child(5) {
            -webkit-transform: rotate(150deg);
            -ms-transform: rotate(150deg);
            transform: rotate(150deg);
        }
        &:nth-child(6) {
            -webkit-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            transform: rotate(90deg);
        }
    }

    @-webkit-keyframes wheelSpin {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @keyframes wheelSpin {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes pedalSpin {
        0% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }

        100% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
    }

    @keyframes pedalSpin {
        0% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }

        100% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
    }

    @keyframes lamp-flicker {
        0% {
            opacity: 0.1;
        }
        30% {
            opacity: 1;
        }
        60% {
            opacity: 0.3;
        }
        100% {
            opacity: 0.9;
        }
    }
</style>
