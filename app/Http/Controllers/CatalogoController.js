'use strict'

const Catalogo = use('App/Model/Catalogo') 
const Log = use('App/Model/Log') 
const Database = use('Database')
const Helpers = use('Helpers')
var monolog = require('monolog')
var Logger = monolog.Logger
var StreamHandler = monolog.handler.StreamHandler
var myLogger = new Logger('Log')
myLogger.pushHandler(new StreamHandler(Helpers.storagePath('Log.json'),Logger.DEBUG))

class CatalogoController {

    * index (request, response) {
        yield response.sendView('catalogo.index') 
    }

    /**
    |------------------------------------------------------------------------
    |   Socket.io functions
    |------------------------------------------------------------------------
    */

    * addCatalogo (socket,puerto,cantidad_conexiones = 0){
        const instancia = new Catalogo()
        instancia.socket_id = socket.id
        instancia.cantidad_conexiones  = cantidad_conexiones
        instancia.ip = socket.request.connection.remoteAddress
        instancia.port = puerto
        yield instancia.save() 

        const log = new Log()
        log.socket_id = socket.id
        log.ip = socket.request.connection.remoteAddress
        log.port = socket.request.connection.remotePort
        log.descripcion = 'Nuevo servidor de CATALOGO'
        log.type = 'success'
        yield log.save() 

        myLogger.info('ID: '+socket.id+' || Nuevo servidor de CATALOGO || IP:'+instancia.ip+':'+instancia.port)
        return instancia;
    }

    * removeCatalogo (socket){
        yield Database
            .table('catalogos')
            .where('socket_id', socket.id)
            .delete()

        const instancia = new Log()
        instancia.socket_id = socket.id
        instancia.ip = socket.request.connection.remoteAddress
        instancia.port = socket.request.connection.remotePort
        instancia.descripcion = 'Servidor de CATALOGO eliminado'
        instancia.type = 'danger'
        yield instancia.save()

        myLogger.info('ID: '+socket.id+' || Servidor de CATALOGO eliminado')
        return true;
    }

    * addParToCatalogo (socket){
        const instancia = yield Catalogo.findBy('socket_id', socket.id)

        const affectedRows = yield Database
                .table('catalogos')
                .where('socket_id', socket.id)
                .update('cantidad_conexiones', instancia.cantidad_conexiones+1)

        const log = new Log()
        log.socket_id = socket.id
        log.ip = socket.request.connection.remoteAddress
        log.port = socket.request.connection.remotePort
        log.descripcion = 'Par agregado a Servidor de CATALOGO TOTAL='+ parseInt(instancia.cantidad_conexiones+1)
        log.type = 'info'
        yield log.save()

        myLogger.info('ID: '+socket.id+' || Par agregado a Servidor de CATALOGO')
        return true;
    }

    * syncPares (socket,pares){
        const affectedRows = yield Database
                .table('catalogos')
                .where('socket_id', socket.id)
                .update('cantidad_conexiones', pares)

        return true;
    }

    * removeParToCatalogo (socket){
        const instancia = yield Catalogo.findBy('socket_id', socket.id)

        if(instancia.cantidad_conexiones>0){
            const affectedRows = yield Database
                .table('catalogos')
                .where('socket_id', socket.id)
                .update('cantidad_conexiones', instancia.cantidad_conexiones-1)

            const log = new Log()
            log.socket_id = socket.id
            log.ip = socket.request.connection.remoteAddress
            log.port = socket.request.connection.remotePort
            log.descripcion = 'Par eliminado en Servidor de CATALOGO TOTAL='+parseInt(instancia.cantidad_conexiones-1)
            log.type = 'warning'
            yield log.save()

            myLogger.info('ID: '+socket.id+' || Par eliminado en Servidor de CATALOGO')
            return true;
        }

        return false;
    }

    * getAllOthersCatalogos (socket){
        const catalogos = yield Catalogo.query()
                            .where('socket_id', '<>' ,socket.id)
                            .fetch();

        const log = new Log()
        log.socket_id = socket.id
        log.ip = socket.request.connection.remoteAddress
        log.port = socket.request.connection.remotePort
        log.descripcion = 'Solicita otros Servidor de CATALOGO'
        log.type = 'active'
        yield log.save()        

        myLogger.info('ID: '+socket.id+' || Solicita otros Servidor de CATALOGO')
        return catalogos;
    }

    * getCatalogoLessBusy (socket){
        const catalogo = yield Catalogo.query()
                            .orderBy('cantidad_conexiones', 'asc')
                            .first();
        if(catalogo != null){
            const log = new Log()
            log.socket_id = socket.id
            log.ip = socket.request.connection.remoteAddress
            log.port = socket.request.connection.remotePort
            log.descripcion = 'Solucitud de Servidor de CATALOGO más desocupado :'+catalogo.socket_id
            log.type = ''
            yield log.save()  

            myLogger.info('Solucitud de Servidor de CATALOGO más desocupado :'+catalogo.socket_id)
            
        }else{
            const log = new Log()
            log.socket_id = socket.id
            log.ip = socket.request.connection.remoteAddress
            log.port = socket.request.connection.remotePort
            log.descripcion = 'Solucitud de Servidor de CATALOGO más desocupado : no hay'
            log.type = ''
            yield log.save() 
            myLogger.info('Solucitud de Servidor de CATALOGO más desocupado : no hay')
        }
        return catalogo;
    }

}

module.exports = CatalogoController
