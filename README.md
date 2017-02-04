# Servidor Balanceador

#### Propósito

Con la intención de crear un controlador para administrar las conexiones de los pares hacia los servidores catalogos, se crea un servidor que se encarga de balancear y distribuir el trabajo basándose en la cantidad de conexiones actuales de cada servidor catalogo. Para este propósito se utilizaron las tecnologías: NodeJs, framework AdonisJs, SQLite, Socket.io lo que nos permitió un desarrollo e independencia de cada componente del proceso.

#### Funciones

* Balancear carga en base a la cantidad de conexiones de cada servidor catálogo.
* Devolver lista de catálogos al catálogo que lo solicite.
* Asignar un catálogo a un par.

#### Requisitos

Como parte fundamental del proyecto es necesario tener instalado NodeJs (https://nodejs.org/es/) y npm para la instalación de librerías.

#### Instalación

```sh
$ git clone git@github.com:zamudio-fabian/servidor-balanceador.git
$ cd servidor-balanceador
$ npm install
$ touch .env
```

Llenar el archivo con los datos segun corresponda

>   HOST=localhost

>   PORT=3333

>   APP_KEY=krXAwJcbYB36A1BzrPtiohF41KmK9Np4

>   NODE_ENV=development

>   CACHE_VIEWS=false

>   SESSION_DRIVER=cookie

>   DB_CONNECTION=sqlite

>   DB_HOST=127.0.0.1

>   DB_USER=root

>   DB_PASSWORD=

>   DB_DATABASE=adonis



```
$ ./ace migration:run
$ npm run dev
```


### Author
Zamudio Fabian
fabian.zamudio.89@gmail.com
