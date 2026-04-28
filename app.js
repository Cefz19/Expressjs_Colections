require("dotenv").config();
const express = require("express");

const LoggerMiddleware = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { validateUser, isUniqueId } = require("./utils/validation");

const bodyParser = require("body-parser");

const fs = require("fs");
const path = require("path");
const userFilePath = path.join(__dirname, "users.json");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(errorHandler);

// const PORT = 3000;
const PORT = process.env.PORT || 3005;
console.log(PORT);

app.get("/", (req, res) => {
  res.send(`
    <h1>Cours Express.js V1</h1>
    <p>This is an application node.js with express</p>
    <P>Runing in the port: ${PORT}</P>
    `);
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`Show information about user with ID: ${userId}`);
});

app.get("/search", (req, res) => {
  const terms = req.query.termino || "Not specified";
  const category = req.query.categoria || "All";

  res.send(`
        <h2>Result of Search</h2>
        <p>Termino: ${terms}</p>
        <p>Categoria: ${category}</p>
        `);
});

//Formularios
app.post("/form", (req, res) => {
  const name = req.body.nombre || "Anonymous";
  const email = req.body.email || "Unspecified";

  res.json({
    message: "Data Received",
    data: {
      name,
      email,
    },
  });
});

app.post("/api/data", (req, res) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No data was received" });
  }

  res.status(201).json({
    message: "Data JSON received",
    data,
  });
});

//       CRUD
app.get("/users", (req, res) => {
  fs.readFile(userFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error with data connection" });
    }
    const users = JSON.parse(data);
    res.json(users);
  });
});

// Ruta para creacion de usuarios (API).
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (!newUser || Object.keys(newUser).length === 0) {
    return res.status(400).json({ error: "No se enviaron datos" });
  }

  fs.readFile(userFilePath, "utf-8", (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Error con conexión de datos" });
    }
    
    const users = JSON.parse(data);

    // 1. Validamos estructura (nombre, email, etc.)
    const validation = validateUser(newUser, users);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    // 2. Validamos si el ID es único ANTES de hacer el push
    const validationId = isUniqueId(newUser.id, users);
    if (validationId) {
      return res.status(400).json({
        error: "Esa ID ya esta registrada, ingrese una diferente",
      });
    }

    // 3. Si todo está bien, AHORA sí lo agregamos
    users.push(newUser);

    fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (error) => {
      if (error) {
        return res.status(500).json({ error: "Error al guardar el usuario nuevo" });
      }
      return res.status(201).json(newUser);
    });
  });
});


app.put("/users/:id", (req, res) => {
  // Extraemos el id de la ruta dinamica y lo convertimos de string a int.
  const userId = parseInt(req.params.id, 10);
  // Obtenemos los datos de la solicitud.
  const updateUser = req.body;

  if (!updateUser || Object.keys(updateUser).length === 0) {
    return res
      .status(400)
      .json({ error: "El cuerpo de la solicitud no puede estar vacío" });
  }

  fs.readFile(userFilePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({
        error: "Error con conexión de datos",
      });
    }
    // Parseamos los datos JSON a Objeto.
    let users = JSON.parse(data);

    // Integramos las funciones de validacion.
    const validation = validateUser(updateUser, users);

    // Validamos los datos recibidos.
    if (!validation.isValid) {
      return res.status(400).json({
        error: validation.errors,
      });
    } else if (updateUser.id !== userId) {
      // Validamos que la ID de la solicitud y la ID del EndPoint sean iguales
      return res.status(400).json({
        error:
          "La ID en el EndPoint de la solicitud y la ID del formato JSON deben ser iguales",
      });
    } else {
      // Recorremos todos los usuarios y actualizar solo el que coincida con el ID proporcionado.
      users = users.map((user) => {
        // Actualizamos el usurio que coincida con el id.
        return user.id === userId ? { ...user, ...updateUser } : user;
      });
      // Guardamos los cambios en el archivo JSON.
      fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (error) => {
        // Manejamos errores
        if (error) {
          return res.status(500).json({
            error: "Error al actualizar el usuario",
          });
        } else {
          res.status(200).json(updateUser);
        }
      });
    }
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  fs.readFile(userFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error with data connection" });
    }
    let users = JSON.parse(data);
    users = users.filter((user) => user.id !== userId);
    fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error delete user" });
      }
      res.status(204).send();
    });
  });
});

app.get('/error', (req, res, next) => {
  next(new Error('Error Intencional'));
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server: http://localhost:${PORT}`);
  //   console.log(`Example app listening on port ${PORT}`);
});
