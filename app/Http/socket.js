'use strict'

var co = require('co');
var Ioc = require('adonis-fold').Ioc

/**
|------------------------------------------------------------------------
|   Controllers
|------------------------------------------------------------------------
*/
var CatalogoController = Ioc.make('App/Http/Controllers/CatalogoController')
var AdminController = Ioc.make('App/Http/Controllers/AdminController')
var ParController = Ioc.make('App/Http/Controllers/CatalogoController')

co(function * () {
    yield AdminController.truncateAll()
})

module.exports = function (server) {

    const io = use('socket.io')(server)

    //Salas
    var catalogoRoom = io.of('/catalogo');
    var parRoom = io.of('/par');
    var adminRoom = io.of('/admin');


    /**
    |------------------------------------------------------------------------
    |   Sala Catálogo
    |------------------------------------------------------------------------
    */
    catalogoRoom.on('connection', function(socket){
        socket.on('addCatalogo', function(data){
            co(function * () {
                const result = yield CatalogoController.addCatalogo(socket,data.port,data.pares);
                socket.emit('id',socket.id);
                adminRoom.emit('newCatalogo',result);
            })
            .catch(console.error)
        });

        socket.on('addParToCatalogo', function(){
            var result = false;
            co(function * () {
                result = yield CatalogoController.addParToCatalogo(socket);
                if(result){
                    socket.emit('parAgregado')
                    adminRoom.emit('parAgregado',socket.id);
                }
            })
            .catch(console.error)

        });

        socket.on('syncPares',function(pares){
            co(function * () {
                yield CatalogoController.syncPares(socket,pares);
                adminRoom.emit('syncParVista',socket.id, pares);
            })
            .catch(console.error)
        });

        socket.on('removeParToCatalogo', function(){
            var result = false;
            co(function * () {
                result = yield CatalogoController.removeParToCatalogo(socket);
                if(result){
                    socket.emit('parEliminado')
                    adminRoom.emit('parEliminado',socket.id);
                }
            })
            .catch(console.error)

        });

        socket.on('getAllOthersCatalogos', function(callback){
            co(function * () {
                const result = yield CatalogoController.getAllOthersCatalogos(socket);
                callback(result);
            })
            .catch(console.error)

        });

        socket.on('disconnect', function(){
            co(function * () {
                const result = yield CatalogoController.removeCatalogo(socket);
                adminRoom.emit('deleteCatalogo',socket.id);
            })
            .catch(console.error)
        });
    });

    /**
    |------------------------------------------------------------------------
    |   Sala Par
    |------------------------------------------------------------------------
    */
    parRoom.on('connection', function (socket) {
        socket.on('getCatalogoLessBusy', function(data){
            co(function * () {
                const result = yield CatalogoController.getCatalogoLessBusy(socket);
                socket.emit('getCatalogoLessBusy',result);

            })
            .catch(console.error)

        });
    })

    /**
    |------------------------------------------------------------------------
    |   Sala Admin
    |------------------------------------------------------------------------
    */
    adminRoom.on('connection', function (socket) {
        socket.on('getEstadisticas', function(lastLog_id){
            co(function * () {
                const result = yield AdminController.getEstadisticas(lastLog_id);
                socket.emit('resultEstadisticas',result);
            })
            .catch(console.error)
        });
    })

}
