const net = require('net')
const logger = require('./logger')

const settings = {
    port: 1337,
    url: '127.0.0.1'
}

let clients = []

const handler = (socket, data) => {

    if(data.startsWith('::')) {
        command(socket, data)
    } else {
        broadcast(logger(socket.name, data, new Date()), socket)
    }

}

const command = (socket, action) => {

    const odata = action

    const h = odata.split('->')[0].trim().slice(2)

    switch (h) {
        case 'exit':
            socket.end()
            break;

        case 'direct':

            // this also doesnt log to the server

            const msg = odata.split('->')[2].trim()

            if(!msg) {
                return false
            }

            const targetId = odata.split('->')[1].trim()

            const target = clients.filter(client => {
                return client.name === targetId
            })

            target[0].write(`DIRECT FROM: ${logger(socket.name, msg, new Date())}`)
            socket.write(`SENT TO: ${logger(targetId, msg, new Date())}`)
            break;
        default:
            socket.write(logger(socket.name, 'Comando não reconhecido', new Date()))
            return false;
            break;
    }

}

const broadcast = (message, sender) => {
    clients.forEach(client => {
        // send the message to the client
        client.write(message)
    })

    // log to the server
    process.stdout.write(message)
}

const server = net.createServer(socket => {

    socket.setEncoding('utf8')

    socket.name = `${socket.remoteAddress}:${socket.remotePort}`

    clients.push(socket)

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
        handler(socket, data)
    })
})

server.listen(settings.port, settings.url)

console.log(`Server running at ${settings.url}:${settings.port}`)
