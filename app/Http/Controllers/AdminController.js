'use strict'

const Catalogo = use('App/Model/Catalogo') 
const Log = use('App/Model/Log') 

class AdminController {

    * index (request, response) {
        const posts = yield Catalogo.all()
        // es descendente ya que se trata como una cola
        const logs = yield Log.query().orderBy('id', 'desc').fetch();
        yield response.sendView('admin.index', { 
                posts: posts.toJSON(),
                logs: logs.toJSON()
        })
    }

    * getEstadisticas (lastLog_id) {
        //Es ascendente ya que se trata como una pila
        const logs = yield Log.query().where('id','>',lastLog_id).orderBy('id', 'asc').fetch();
        return logs
    }
}

module.exports = AdminController
