'use strict'

const Lucid = use('Lucid')

class Log extends Lucid {

    static get table () {
        return 'logs'
    }

}

module.exports = Log
