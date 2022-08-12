import buildServer from './config/server'

const startServer = async () => {
    const server = await buildServer()

    server.listen({ port: server.config.PORT }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })
}

startServer()