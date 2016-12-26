'use strict'



const Route = use('Route')

Route.get('/', function * (request, response) {
  yield response.sendView('welcome')
})
Route.get('/par', 'ParController.index')
Route.get('/catalogo', 'CatalogoController.index')
Route.get('/admin', 'AdminController.index')
Route.get('/estadisticas', 'AdminController.estadisticas')
