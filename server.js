const net = require('net')
const logger = require('./logger')

const settings = {
    port: 1337,
    url: '127.0.0.1'
}

let clients = []

const handler = (socket, data) => {

    let r = true

    if(data === 'exit') {
        socket.end()
        r = false
    }

    return r

}

const broadcast = (message, sender) => {
    clients.forEach(client => {
        // if(client  === sender) return

        // send the message to the client
        client.write(message)
    })

    // log the message to the server
    console.log('LOG => ', message)
    process.stdout.write(message)
}

const server = net.createServer(socket => {

    socket.setEncoding('utf8')

    socket.name = `${socket.remoteAddress}:${socket.remotePort}`

    clients.push(socket)

    socket.on('close', () => {
        broadcast(logger(socket.name, 'Closed!', new Date()), socket)
    })

    socket.on('end', () => {
        clients.splice(clients.indexOf(socket), 1)
        broadcast(logger(socket.name, 'Ended!', new Date()), socket)
    })

    socket.on('error', error => {

        const message = `
        ------------ ERROR ------------
        \n ${error} \n
        ---------- END ERROR ----------
        `

        broadcast(logger(socket.name, message, new Date()), socket)
    })

    socket.on('data', data => {
        const r = handler(socket, data)
        if(r) broadcast(logger(socket.name, data, new Date()), socket)
    })
})

server.listen(settings.port, settings.url)

console.log(`Server running at ${settings.url}:${settings.port}`)
