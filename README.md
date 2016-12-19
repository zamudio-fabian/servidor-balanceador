# Servidor Balanceador

##### Propósito

Con la intención de crear un controlador para administrar las conexiones de los pares hacia los servidores catalogos, se crea un servidor que se encarga de balancear y distribuir el trabajo basandose en la cantidad de conexiones actuales de cada servidor catalogo. Para este proposito se utilizaron las tecnologias: NodeJs, framework AdonisJs, SQLite, Socket.io lo que nos permitio un desarrollo e independencia de cada componente del proceso.

#### Requisitos

Como parte fundamental del proyecto es necesario tener instalado NodeJs (https://nodejs.org/es/) y npm para la instalación de librerias.

#### Instalación

```sh
$ git clone git@github.com:zamudio-fabian/servidor-balanceador.git
$ cd servidor-balanceador
$ npm install
$ touch .env
```

Llenar el archivo con los datos segun corresponda

>   HOST=localhost
PORT=3333
APP_KEY=krXAwJcbYB36A1BzrPtiohF41KmK9Np4
NODE_ENV=development
CACHE_VIEWS=false
SESSION_DRIVER=cookie
DB_CONNECTION=sqlite
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_DATABASE=adonis



```
$ ./ace migration:run
$ npm run
```


### Author
Zamdudio Fabian
fabian.zamudio.89@gmail.com