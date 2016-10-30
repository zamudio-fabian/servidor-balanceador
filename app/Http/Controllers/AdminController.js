'use strict'

const Catalogo = use('App/Model/Catalogo') 

class AdminController {

    * index (request, response) {
        const posts = yield Catalogo.all()
        yield response.sendView('admin.index', { 
                posts: posts.toJSON()
            }) 
    }
}

module.exports = AdminController
