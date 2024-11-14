## Índice
- [Proyecto Princial](#proyecto-principal)
- [Introducción](#introducción)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Características por módulo](#características-por-módulo-manual-de-usuario)
- [Manual de Usuario de la API](#manual-de-usuario-de-la-api)


## Proyecto Principal

Este proyecto es una API REST que permite a los usuarios de DevProbe realizar peticiones a la base de datos Firestore
y obtener datos de terceros. El proyecto principal se encuentra en el siguiente [enlace](https://github.com/juanfranciscocis/DevProbe_Tesis/).


## Introducción

Este readme describe el funcionamiento detallado del proyecto DevProbeApi encontrado 
en la sección [características por módulo](#características-por-módulo-manual-de-usuario).
Para instalar el proyecto se debe seguir los pasos descritos en la sección [instalación](#instalación).

## Requisitos

Para poder instalar el proyecto, se debe seguir los siguientes pasos:

1. Instalar Node.js (https://nodejs.org/)
2. Instalar Firebase CLI (https://firebase.google.com/docs/cli)
3. Instalar Firebase Auth (https://firebase.google.com/docs/auth)
4. Instalar Firebase Firestore (https://firebase.google.com/docs/firestore)
5. Instalar Firebase Storage (https://firebase.google.com/docs/storage)
6. Instalar Gemini, Vertex en el Dashboard de Firebase [Más información](https://firebase.google.com/docs/vertex-ai/).
7. Instalar Artillery, el framework de pruebas de carga en el Dashboard de Firebase [Más información](https://firebase.google.com/docs/firestore).
8. Instalar Axios, una librería para realizar peticiones HTTP en el Dashboard de Firebase [Más información](https://firebase.google.com/docs/firestore).

## Instalación

El proceso de instalación es el siguiente:

Son necesarios los siguientes [requisitos](#requisitos).

1. Clonar el repositorio o descargar el zip.
2. Instalar las dependencias con `npm install`
3. Iniciar el servidor de desarrollo con `npm start`
4. Abrir el navegador en `http://localhost:3000/`

**Nota: El proyecto principal NO requiere que servidor REST API esté corriendo**

## Características por módulo (Manual de Usuario)

En este manual de usuario se describen las características de cada ruta de la API, para cada ruta se detallan las funcionalidades que ofrece.

#### **Application Programming Interface (API)**

Un Application Programming Interface o en español una interfaz de programación de aplicaciones, “son mecanismos que permiten a dos componentes de software comunicarse entre sí mediante un conjunto de definiciones y protocolos” \[6\] . Existen varias arquitecturas de API, pero la mayoría conectan aplicativos tipo cliente-servidor.

Para este proyecto se ha decido utilizar la arquitectura API REST, REST proviene de transferencia de estado representacional, la misma es la más popular, y la que la mayoría de las webs utilizan para intercambiar datos. “El cliente envía las solicitudes al servidor. El servidor utiliza esta entrada del cliente para iniciar funciones internas y devuelve los datos de salida al cliente.” \[6\]

**Arquitectura general de una REST API**

![](https://firebasestorage.googleapis.com/v0/b/devprobe-89481.appspot.com/o/Readme-pwa%2Frest1.jpg?alt=media&token=80a01e70-4d3b-48ae-8301-5fbc2fa45fb6)

Cuando se dice que un API es de tipo transferencia de estado representacional, nos referimos a que la misma actúa únicamente como comunicador entre el servidor y el cliente, las REST API no almacenan estado y normalmente las respuestas de estas son simplificadas devolviendo objetos tipo json.

Debido a que las PWA se basan en la web, se ha decidido implementar una REST API, la misma que comunica al cliente con los servicios de Firebase, pero a su vez la REST API en este proyecto es el enlace principal desde y hacia servicios externos como la API de GitHub, la API de RIPE Atlas, IP-API y hasta el proveedor gratuito para notificaciones tipo push, Webpushr.

##### **Express JS Framework.**

Express es un framework de Node.js, el mismo nos permite desarrollar una infinidad de tipos de aplicativos como webs staticas, webs dinámicas y a su vez es el más popular a la hora de desarrollar REST API.

Si bien Node.js tiene por defecto el módulo HTTP, que nos permite realizar la creación de un servidor para aplicativos webs, este módulo funciona a muy bajo nivel. Express tiene la ventaja de entregar al desarrollador herramientas que facilitan el desarrollo, mantenimiento y escalabilidad de servidores web como lo son las mismas REST API.

“En el marco Express se usan la dirección URL, la ruta y verbos HTTP para la administración de rutas. Los verbos HTTP como post, put y get describen la acción deseada por el cliente.” \[7\] . En este caso Express es quien nos permite utilizar verbos HTTP reconocidos por librerías tales como Request, Axios y el Cordova HTTP module, para enviar y recibir datos desde el cliente. Del lado de Firebase, Express permite la instalación de paquetes NPM, mismos que permiten la correcta y segura conexión hacia Firestore y Authentication.

**Arquitectura REST API REST Express**

![](https://firebasestorage.googleapis.com/v0/b/devprobe-89481.appspot.com/o/Readme-pwa%2Frest2.jpg?alt=media&token=16f2735a-6107-4705-9cf7-9dc9577a78a4)


Como se ve en el diagrama 10, la API se encuentra hosteada en el servicio gratuito de Render.com. El cliente IONIC mediante el módulo el Cordova HTTP es capaz de enviar y recibir datos que provienen de la API REST Express, la API REST Express es la que analiza la ruta y el verbo HTTP para comunicar al cliente con Firebase o los servicios externos a los que el cliente necesita enviar y recibir datos.

#### **Servicios Externos**

En esta sección se detallan los servicios externos, estos servicios permiten a la aplicación realizar ciertas acciones tales como mediciones externas, obtener datos de un repositorio GitHub, enviar notificaciones tipo push, entre otras.

##### **Git API.**

Es el API oficial de GitHub, permite al aplicativo obtener datos sobre los repositorios que usan los SRE, además de archivos específicos de esos repositorios. Esta API es en su mayoría de uso gratuito y se comienzan a realizar cobros cuando existe un volumen alto de peticiones a la misma. En el desarrollo de la app no existieron cobros.

Se ha decido implementar esta conexión debido a que la misma en conjunto con Gemini nos permite realizar pruebas unitarias del código y de integración de manera autónoma, el ingeniero SRE es capaz de elegir el archivo específico del cuál se requiere realizar una prueba y el modelo de IA escribe el código del test.

**Arquitectura comunicación con la API de GitHub**

![](https://firebasestorage.googleapis.com/v0/b/devprobe-89481.appspot.com/o/Readme-pwa%2Fgit.jpg?alt=media&token=f776e4b4-e2f6-41b9-a022-87a0a2a5239d)



Tal como se observa en el diagrama 11, el ingeniero de fiabilidad del sitio provee una API key de su GitHub y el nombre del repositorio al que se va a realizar la conexión. Estos son enviados mediante una petición HTTP al API de Express, el API es quien realiza la lógica de conexión con GitHub y el Git API nos devuelve los datos que luego son mostrados en el front-end.

##### **RIPE Atlas.**

“RIPE Atlas es una plataforma de medición activa, es decir, se basa en sensores de medida desplegados sobre Internet.” \[8\] Estos sensores permiten realizar mediciones de latencias y traceroutes desde un probe o anchor (dispositivos proporcionados por RIPE NCC) localizado en cualquier parte del mundo hacia un servidor, una página web o a un servicio que cuente con una conexión a internet.

RIPE es un servicio abierto al público y es posible no incurrir en gastos en caso de que el usuario colabore en la red de mediciones. En este caso la app si incurre en gastos adicionales por medición realizada al servicio pero para el desarrollo de la misma se han utilizado los créditos gratuitos proporcionados a cuentas nuevas.

Debido a los requerimientos levantados, este servicio permite a los SRE realizar pruebas sobre sus servicios y es por esto que se ha decidido realizar esta implementación.

**Arquitectura comunicación con la API de RIPE Atlas**

![](https://firebasestorage.googleapis.com/v0/b/devprobe-89481.appspot.com/o/Readme-pwa%2Fripe.jpg?alt=media&token=84052ccf-317e-4f05-879e-72051c29e9e6)



El diagrama 12 provee la arquitectura actual de conexión desde el front-end de la PWA hacia el RIPE Atlas. Similar a la API de GitHub, la API de Express es la que realiza la comunicación entre la API de RIPE y el cliente. Adicional, la API de Express es capaz de guardar las mediciones en Firestore previo a enviar los datos al usuario.

##### **IP-API.**

IP-API, es una API que nos permite obtener la localización de una dirección IP. Esta API funciona en conjunto con la API de RIPE Atlas permitiendo obtener no solo el país o región de donde se realiza la medición, pero a su vez la ciudad desde donde se realizan las pruebas de latencia y de tipo traceroutes.

IP-API permite obtener los datos sin costos adicionales, se comienza a incurrir en gastos cuando se excede el volumen de peticiones de su capa gratuita, misma que durante el desarrollo de la PWA no se excedieron.

Los resultados de una prueba en RIPE, incluyen todas las IPs desde donde se realizaron las mediciones. Estas IPs son enviadas mediante una petición HTTP hacia el API de IP-API, misma que retorna un json con el país, estado/provincia/región y la ciudad a la que pertenece esa IP.

En algunos casos, debido a protecciones de los “probes” o “anchors” , no es posible obtener datos de localizaciones sobre las IPs, en ese caso la PWA permite la visualización del resultado ya sea de latencia o de traceroute, más no la localidad desde donde se realiza la medición.

**Arquitectura comunicación con la API de IP-API**

![](https://firebasestorage.googleapis.com/v0/b/devprobe-89481.appspot.com/o/Readme-pwa%2Fipapi.jpg?alt=media&token=b20a95b3-126d-4fe6-97ff-1eaa42aa0f23)



El diagrama 13 muestra la arquitectura de conexión entre el front-end y el API de IP-API, como se observa en este caso es el mismo cliente quien realiza la petición de la localización de la IP. Esta localización luego es actualizada en la base de datos Firestore y guardada en la medición correspondiente.

##### **WEBPUSHR.**

WEBPUSHR es un servicio de tipo REST, el mismo actúa como un servidor Web Push. En este caso se ha decidido utilizar esta API debido a que el despliegue de un servidor Web Push agregaría un nivel de dificultad extra al proyecto y además a largo plazo el mantenimiento de este tomaría más tiempo.

Sin embargo, es importante mencionar el funcionamiento del servidor para entender la funcionalidad que WEBPUSHR nos está dando. “Las notificaciones Web Push utilizan un sistema de llaves públicas/privadas llamadas VAPID donde el cliente tendrá la llave pública y el servidor tanto la pública como la privada” \[9\] . Este sistema es necesario debido a que el navegador o app debe suscribir al usuario a las notificaciones, de esta manera si el usuario no permite la recepción de notificaciones, el app o navegador es capaz de bloquearlas.

WEBPUSHR mediante verbos HTTP nos permite que la API REST Express envie notificaciones a usuarios suscritos, de esta manera nos evitamos el desarrollo del servidor Web Push. Adicionalmente WEBPUSHR permite que los usuarios se suscriban o de suscriban correctamente mediante llaves VAPID a sus servidores Push.

**Arquitectura suscripción del cliente con WEBPUSHR**

![](https://firebasestorage.googleapis.com/v0/b/devprobe-89481.appspot.com/o/Readme-pwa%2Fwebpushr.jpg?alt=media&token=c93e5200-a581-4e92-9c3e-b03d1f20e397)

La arquitectura de suscripción de un usuario al servicio de notificaciones push de WEBPUSHR comienza desde el cliente, mismo que genera la suscripción y la envía mediante un HTTP request al API de WEBPUSHR. WEBPUSHR suscribe al usuario y retorna un user ID. El user ID es almacenado en Firestore, dentro de la colección users.

**Arquitectura envió de notificación con WEBPUSHR**

![](https://firebasestorage.googleapis.com/v0/b/devprobe-89481.appspot.com/o/Readme-pwa%2Fwebpushr2.jpg?alt=media&token=3cb21c5f-8894-4d21-85bf-2d55490d21ca)

WEBPUSHR se usa en el aplicativo para avisar al usuario de que ocurrió un cambio o existe nueva información tal como se ve en el diagrama 15. La API REST Express es la encargada de generar estas notificaciones cuando la misma termina de ejecutar un proceso.

El proceso comienza desde el front-end, el usuario debe generar una notificación mediante alguna acción. Los datos se envían a la API REST Express junto con el user ID que es previamente obtenido en el proceso de login. Una vez el API procesa los datos, se hace una petición a WEBPUSHR. WEBPUSHR envía la notificación push al usuario.


## Manual de Usuario de la API

El manual de usurario de la API se encuentra en el siguiente [enlace](https://documenter.getpostman.com/view/28389822/2sAY55bJit).
Este manual contiene las rutas de la API REST Express, las peticiones que se pueden realizar con ejemplos de las respuestas que se retornan.
