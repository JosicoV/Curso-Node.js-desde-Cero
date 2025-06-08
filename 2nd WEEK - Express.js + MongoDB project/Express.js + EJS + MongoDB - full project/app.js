//.env
require('dotenv').config();

//BBDD mongoDB
const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI;

//Conexion a la BD
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.log('Error de conexión a mongoDB:', err);
})
// Importar Modelos
const Usuario = require('./models/Usuario');


//Módulos
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');


const app = express();
// Hacer accesible la carpeta public (y su contenido) desde cualquier página
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de EJS (motor de plantillas)
app.use(express.urlencoded({ extended: true })); // Permite que Express pueda leer datos de los formularios
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.mimetype.startsWith('image/') ? 'uploads/fotos' : 'uploads/pdfs';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Servir archivos estáticos
app.use('/fotos', express.static(path.join(__dirname, 'uploads/fotos')));
app.use('/curriculums', express.static(path.join(__dirname, 'uploads/pdfs')));

// Puerto configurable (con variable de entorno o un valor por defecto)
const PORT = process.env.PORT || 3000;

// Ruta principal (HTML desde archivo)
app.get('/', (req, res) => {
  res.render('index', {nombre: 'Josico Vila'});
});

// Ruta /about
app.get('/about', (req, res) => {
    res.render('about', {
        autor: 'Josico Vila',
        fecha: new Date().toLocaleDateString()
    });

});

// Ruta /contacto con HTML
app.get('/contacto', (req, res) => {
  res.render('contact', { email: 'escribe@asina.com' })
});

// Ruta GET /usuarios (plantilla EJS con inyección de datos de MongoDB)
app.get('/usuarios', async (req, res) => {
    const q = req.query.q || '';
    const orden = req.query.orden === 'desc' ? -1 : 1;
    const page = parseInt(req.query.page) || 1;
    const limit = 2;
    const skip = (page - 1) * limit;

    const criterio = q
        ? { $or: [{ nombre: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }] }
        : {};


    try{
        const total = await Usuario.countDocuments(criterio);
        const users = await Usuario.find(criterio)
            .sort({nombre: orden})
            .skip(skip)
            .limit(limit);
        
        res.render('users', { 
            users,
            q,
            orden: req.query.orden || 'asc',
            page,
            total,
            totalPages: Math.ceil(total / limit)
         });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error al obtener los usuarios de la base de datos', e);
    }
});

// Ruta /formulario
app.get('/formulario', (req, res) => {
  res.render('form');
});

// Ruta POST /usuarios (procesar datos del formulario: añadirlos a la BBDD)
app.post('/usuarios', upload.fields([
    {name: 'foto', maxCount: 1},
    {name: 'curriculum', maxCount: 1}
]), async (req, res) => {
    const { nombre, email } = req.body; //req.body estructura JSON con los name del formulario
    const foto = req.files?.['foto']?.[0]?.filename || '';
    const curriculum = req.files?.['curriculum']?.[0]?.filename || '';

    try{
        const existe = await Usuario.findOne({email});
        if(existe) {
            return res.status(400).send('El email ya existe');
        }

        const nuevoUsuario = new Usuario({nombre, email, foto, curriculum});
        await nuevoUsuario.save();
        res.redirect('/usuarios');

    } catch (e) {
        console.error(e);
        res.status(500).send('Error al guardar el usuario en la base de datos');
    }
});

// Ruta GET /exportar-csv
const { createObjectCsvWriter } = require('csv-writer');
const { decode } = require('punycode');

app.get('/exportar-csv', async (req, res) => {
    try {
        const usuarios = await Usuario.find().lean();
        const csvWriter = createObjectCsvWriter({
            path: 'usuarios.csv',
            header: [
                { id: 'nombre', title: 'Nombre' },
                { id: 'email', title: 'Email' },
                { id: 'foto', title: 'Foto' },
                { id: 'curriculum', title: 'Curriculum' }
            ]
        });
        await csvWriter.writeRecords(usuarios);
        res.download('usuarios.csv', 'usuarios.csv', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al descargar el archivo CSV');
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error al exportar a CSV');
    
    }
})

// Ruta GET /usuarios/:email (detalles del usuario)
app.get('/usuarios/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const usuario = await Usuario.findOne({email});
    if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
    }
    res.render('details', { usuario });
  } catch (e) {
    res.status(500).send('Error al obtener los detalles del usuario');
  }
})

// Ruta GET /api/usuarios (busqueda en vivo en la lista de usuarios)
/*
app.get('/api/usuarios', async (req, res) => {
    const q = req.query.q || '';
    const criterio = q
        ? { $or: [{ nombre: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }] }
        : {};
    try {
        const usuarios = await Usuario.find(criterio);
        res.json(usuarios);
    } catch (e) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});
*/

// Ruta /eliminar (Eliminar usuarios)
app.post('/eliminar', async (req, res) => {
    const {email} = req.body;
    try {
        await Usuario.deleteOne({email});
        res.redirect('/usuarios');
    } catch (e) {
        console.error(e);
        res.status(500).send('Error al eliminar el usuario');
    }
});

// Ruta /api (lee archivo json externo)
app.get('/api', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'message.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo leer el archivo JSON de message' });
    }

    try{
        const json = JSON.parse(data);
        json.fecha = new Date().toISOString(); //Actualizamos la fecha cada vez
        res.json(json);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al parsear el archivo JSON de message' });
    }
  }) // Cierra fs
});

// Ruta no encontrada (middleware final) 404
app.use((req, res) => {
  res.status(404).send('404 - Página no encontrada');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
