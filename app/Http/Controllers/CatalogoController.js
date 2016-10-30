'use strict'

const Catalogo = use('App/Model/Catalogo') 
const Database = use('Database')

class CatalogoController {

    * index (request, response) {
        yield response.sendView('catalogo.index') 

    }

    /**
    |------------------------------------------------------------------------
    |   Socket.io functions
    |------------------------------------------------------------------------
    */

    * addCatalogo (socket_id,cantidad_conexiones = 0){
        const instancia = new Catalogo()
        instancia.socket_id = socket_id
        instancia.cantidad_conexiones  = cantidad_conexiones
        yield instancia.save() 
        return instancia;
    }

    * removeCatalogo (socket_id){
        yield Database
            .table('catalogos')
            .where('socket_id', socket_id)
            .delete()
        return true;
    }

    * addParToCatalogo (catalogo_id){
        const instancia = yield Catalogo.findBy('socket_id', catalogo_id)

        const affectedRows = yield Database
                .table('catalogos')
                .where('socket_id', catalogo_id)
                .update('cantidad_conexiones', instancia.cantidad_conexiones+1)


        return true;
    }

    * removeParToCatalogo (catalogo_id){
        const instancia = yield Catalogo.findBy('socket_id', catalogo_id)

        if(instancia.cantidad_conexiones>0){
            const affectedRows = yield Database
                .table('catalogos')
                .where('socket_id', catalogo_id)
                .update('cantidad_conexiones', instancia.cantidad_conexiones-1)

            return true;
        }

        return false;
    }

    * getAllOthersCatalogos (catalogo_id){
        const catalogos = yield Catalogo.query()
                            .where('socket_id', '<>' ,catalogo_id)
                            .fetch();
        return catalogos;
    }

    * getCatalogoLessBusy (){
        const catalogo = yield Catalogo.query()
                            .orderBy('cantidad_conexiones', 'asc')
                            .first();
        return catalogo;
    }

    

}

module.exports = CatalogoController
