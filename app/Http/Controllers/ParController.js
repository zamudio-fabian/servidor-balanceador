'use strict'

class ParController {

    * index (request, response) {
        yield response.sendView('par.index') 
    }

}

module.exports = ParController
