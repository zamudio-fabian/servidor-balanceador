'use strict'

const Catalogo = use('App/Model/Catalogo') 

class CatalogoController {

    * index (request, response) {
        const posts = yield Catalogo.all() 
        yield response.sendView('catalogo.index', { posts: posts.toJSON() }) 

    }

    /**
    |------------------------------------------------------------------------
    |   Socket.io functions
    |------------------------------------------------------------------------
    */
    welcome (socket){
        return 'Hi!! Your ID is '+socket.id;
    }

    

}

module.exports = CatalogoController
