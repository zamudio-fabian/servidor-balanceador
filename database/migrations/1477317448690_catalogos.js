'use strict'

const Schema = use('Schema')

class CatalogosTableSchema extends Schema {

  up () {
    this.create('catalogos', (table) => {
      table.increments()
      table.string('socket_id').unique()
      table.integer('cantidad_conexiones')
      table.timestamps()
    })
  }

  down () {
    this.drop('catalogos')
  }

}

module.exports = CatalogosTableSchema
