const mongoose = require('mongoose');

// Schema de los usuarios
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  foto: String,
  curriculum: String
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;