'use strict'

const Catalogo = use('App/Model/Catalogo') 
const Database = use('Database')
const Helpers = use('Helpers')
var monolog = require('monolog')
var Logger = monolog.Logger
var StreamHandler = monolog.handler.StreamHandler
var log = new Logger('Log')
log.pushHandler(new StreamHandler(Helpers.storagePath('Log.json'),Logger.DEBUG))
console.log(__dirname);
class CatalogoController {

    * index (request, response) {
        yield response.sendView('catalogo.index') 
    }

    /**
    |------------------------------------------------------------------------
    |   Socket.io functions
    |------------------------------------------------------------------------
    */

    * addCatalogo (socket,cantidad_conexiones = 0){
        const instancia = new Catalogo()
        instancia.socket_id = socket.id
        instancia.cantidad_conexiones  = cantidad_conexiones
        instancia.ip = socket.request.connection.remoteAddress
        instancia.port = socket.request.connection.remotePort
        yield instancia.save() 

        log.info('ID: '+socket.id+' || Nuevo servidor de CATALOGO || IP:'+instancia.ip+':'+instancia.port)
        return instancia;
    }

    * removeCatalogo (socket_id){
        yield Database
            .table('catalogos')
            .where('socket_id', socket_id)
            .delete()

        log.info('ID: '+socket_id+' || Servidor de CATALOGO eliminado')
        return true;
    }

    * addParToCatalogo (catalogo_id){
        const instancia = yield Catalogo.findBy('socket_id', catalogo_id)

        const affectedRows = yield Database
                .table('catalogos')
                .where('socket_id', catalogo_id)
                .update('cantidad_conexiones', instancia.cantidad_conexiones+1)

        log.info('ID: '+catalogo_id+' || Par agregado a Servidor de CATALOGO')
        return true;
    }

    * removeParToCatalogo (catalogo_id){
        const instancia = yield Catalogo.findBy('socket_id', catalogo_id)

        if(instancia.cantidad_conexiones>0){
            const affectedRows = yield Database
                .table('catalogos')
                .where('socket_id', catalogo_id)
                .update('cantidad_conexiones', instancia.cantidad_conexiones-1)

            log.info('ID: '+catalogo_id+' || Par eliminado en Servidor de CATALOGO')
            return true;
        }

        return false;
    }

    * getAllOthersCatalogos (catalogo_id){
        const catalogos = yield Catalogo.query()
                            .where('socket_id', '<>' ,catalogo_id)
                            .fetch();

        log.info('ID: '+catalogo_id+' || Solicita otros Servidor de CATALOGO')
        return catalogos;
    }

    * getCatalogoLessBusy (){
        const catalogo = yield Catalogo.query()
                            .orderBy('cantidad_conexiones', 'asc')
                            .first();

        log.info('Solucitud de Servidor de CATALOGO más desocupado :'+catalogo.socket_id)
        return catalogo;
    }

    

}

module.exports = CatalogoController
