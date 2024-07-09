const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors'); // Importa el módulo CORS

const app = express();
const port = 5000;

app.use(bodyParser.json());

const corsOptions = {
  origin: '*', // Permite solicitudes desde cualquier origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permite estos métodos
  allowedHeaders: 'Content-Type,Authorization', // Permite estos encabezados
  credentials: true, // Permite enviar cookies y encabezados de autenticación
};

app.use(cors(corsOptions)); // Aplica el middleware CORS con las opciones configuradas

app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/user', userRoutes);

sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });




  /*Si no funciona solo agregue el cors por si no funciona como debería para render 
  const cors = require('cors'); // Importa el módulo CORS
  const corsOptions = {
  origin: '*', // Permite solicitudes desde cualquier origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permite estos métodos
  allowedHeaders: 'Content-Type,Authorization', // Permite estos encabezados
  credentials: true, // Permite enviar cookies y encabezados de autenticación
};

app.use(cors(corsOptions)); // Aplica el middleware CORS con las opciones configuradas 


Borrar si no agarra como debe*/