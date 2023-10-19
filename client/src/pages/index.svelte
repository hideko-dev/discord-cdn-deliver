<script>
    let content;
    function change(event) {
        const res = event.target.files[0];
        if(res.size > 2480000) {
            console.log("File size is too large");
        } else {
            content = event.target.files[0];
        }
    }
    async function upload() {
        const formData = new FormData();
        formData.append('content', content);
        await fetch('http://localhost:2000/uploadContent', {
            method: 'POST',
            body: formData,
        });
    }


</script>

<main>
    <p>Content Server</p>
    <input type="file" on:change={change}>
    <button on:click={upload}>Upload File</button>
</main>

<style>
    main {
        color: white;
    }
</style>
