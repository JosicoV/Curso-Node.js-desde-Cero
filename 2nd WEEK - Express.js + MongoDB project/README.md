# Curso de Node.js desde Cero / 2nd WEEK - Express.js + MongoDB project

En este proyecto se repasa lo visto en la primera semana y se añade:
* Express.js: configuración del servidor mucho más rápida
* EJS: motor de plantillas
* MongoDB: como Base de Datos en la nube

## Necesario:
* Archivo .env con el siguiente contenido:
    MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/usuariosdb  // Reemplazar con tus datos
    PORT=Puerto_Deseado //Si no, por defecto está el 3000. Y por lo tanto http://localhost:3000 despues de ejecutar app.js (más abajo)

## Instalación de dependencias
npm install

## Ejecución
nodemon app.js //Si la semana anterior instalaste nodemon (recomendado), si no: node app.js