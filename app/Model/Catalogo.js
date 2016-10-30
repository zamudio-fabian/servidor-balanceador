'use strict'

const Lucid = use('Lucid')

class Catalogo extends Lucid {

    static get table () {
        return 'catalogos'
    }

}

module.exports = Catalogo
