'use strict'

var co = require('co');
var Ioc = require('adonis-fold').Ioc

/**
|------------------------------------------------------------------------
|   Controllers
|------------------------------------------------------------------------
*/
var CatalogoController = Ioc.make('App/Http/Controllers/CatalogoController')
var ParController = Ioc.make('App/Http/Controllers/CatalogoController')

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
        socket.on('addCatalogo', function(){
            co(function * (cantidad_conexiones) {
                const result = yield CatalogoController.addCatalogo(socket,cantidad_conexiones);
                socket.emit('id',socket.id);
                adminRoom.emit('newCatalogo',result);
            })
            .catch(console.error)
        });

        socket.on('addParToCatalogo', function(){
            var result = false;
            co(function * () {
                result = yield CatalogoController.addParToCatalogo(socket.id);
                if(result){
                    socket.emit('parAgregado')
                    adminRoom.emit('parAgregado',socket.id);
                }
            })
            .catch(console.error)

                    });  

        socket.on('removeParToCatalogo', function(){
            var result = false;
            co(function * () {
                result = yield CatalogoController.removeParToCatalogo(socket.id);
                if(result){
                    socket.emit('parEliminado')
                    adminRoom.emit('parEliminado',socket.id);
                }
            })
            .catch(console.error)
            
        }); 

        socket.on('getAllOthersCatalogos', function(){
            co(function * () {
                const result = yield CatalogoController.getAllOthersCatalogos(socket.id);
                socket.emit('resultAllOthersCatalogos',result);
            })
            .catch(console.error)

        });       

        socket.on('disconnect', function(){
            co(function * () {
                const result = yield CatalogoController.removeCatalogo(socket.id);
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
        socket.on('getCatalogoLessBusy', function(){
            co(function * () {
                const result = yield CatalogoController.getCatalogoLessBusy();
                callback(result);
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
    })

}