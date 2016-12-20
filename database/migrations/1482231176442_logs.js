'use strict'

const Schema = use('Schema')

class LogsTableSchema extends Schema {

  up () {
    this.create('logs', (table) => {
      table.increments()
      table.string('socket_id')
      table.text('descripcion')
      table.string('ip')
      table.string('port')
      table.string('type')
      table.timestamps()
    })
  }

  down () {
    this.drop('logs')
  }

}

module.exports = LogsTableSchema
