'use strict'

const Schema = use('Schema')

class CatalogosTableSchema extends Schema {

  up () {
    this.create('catalogos', (table) => {
      table.integer('socket_id')
      table.integer('cantidad_conexiones')
      table.timestamps()

      table.primary(['socket_id'])
    })
  }

  down () {
    this.drop('catalogos')
  }

}

module.exports = CatalogosTableSchema
