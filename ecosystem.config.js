module.exports = {
    apps: [
        {
            name: "dus",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 3000", //running on port 3000
            watch: false,
        },
    ],
};