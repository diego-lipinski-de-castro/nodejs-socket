const net = require('net')
const readline = require('readline');
const logger = require('./logger')

const settings = {
    port: 1337,
    url: '127.0.0.1'
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new net.Socket().setEncoding('utf8')

client.connect(settings.port, settings.url, () => {
    client.write(logger(`${settings.url}:${settings.port}`, 'Connected!', new Date()))
})

client.on('data', data => {
    console.log(data)
})

rl.on('line', input => {

    input = input.trim()

    if(!input.length) return

    if(input === '::exit') rl.close()

    client.write(input)
})
