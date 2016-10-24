'use strict'

const Ioc = require('adonis-fold').Ioc
/**
|------------------------------------------------------------------------
|   Controllers
|------------------------------------------------------------------------
*/
const CatalogoController = Ioc.make('App/Http/Controllers/CatalogoController')


module.exports = function (server) {

  const io = use('socket.io')(server)

  io.on('connection', function (socket) {
    console.log(CatalogoController.welcome(socket))
  })

}