<script>
    export let imgname = "lemmapngtest1";
</script>

<li>
    <a href="/">
        <img src="/{imgname}.png" alt="Ga naar de Johan Cruijff Arena op de map">
        <h2 aria-hidden="true">Johan Cruijff Arena</h2>
    </a>
</li>

<style>
    li {
        flex: 0 0 10%;
        scroll-snap-align: center;
        list-style-type: none;
        width: 100%;
        height: 100%;
        display: flex;
        &:nth-of-type(1n) {
            background-color: #BFCFB3;
        }
        &:nth-of-type(2n) {
            background-color: #CEBF8F;
        }
    }
    a {
        position: relative;
        display: block;
        width: 200px;
        height: 100px;
        border-radius: 8px;
        box-shadow: 5px 5px 0px rgb(0, 0, 0);
        h2 {
            opacity: 0  ;
            display: block;
            color: rgb(255, 255, 255);
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%) translateY(10px) scale(1.05);
            margin: 0;
            justify-self: center;
            white-space: nowrap;
            font-size: 1.25rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
            transition:
                opacity 0.25s ease-out,
                transform 0.25s ease-out;
        }
        &:hover h2 {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1.05);
        }
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px;
        transform: translateY(-10px);
    }
</style>