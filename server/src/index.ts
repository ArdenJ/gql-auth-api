import { genServer } from './server'

const server = genServer()
const PORT = 4000

server.listen(PORT).then(({url}) => {
  console.log(`the server lives on ${url} 🐮🐙🦎🦇`)
})