export const extendConfig = () => ({
    setup: {
        framework: "svelte",
        tool: "vite",
    },
    build: {
        type: "es2017-b8e6",
        outputType: "fast-7",
    },
    rendering: {
        no_catch: true,
        sync_plant: false,
    }
})