require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");
const path = require("path");
const userFilePath = path.join(__dirname, "users.json");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const PORT = 3000;
const PORT = process.env.PORT || 3000;
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

app.post("/users", (req, res) => {
  const newUser = req.body;
  const name = newUser.name;
  const email = newUser.email;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!newUser || Object.keys(newUser).length === 0) {
    return res.status(400).json({ error: "The data was not received" });
  }
  if (name.length < 3) {
    return res
      .status(400)
      .json({ error: "The name field must be 3 characters of longer" });
  }
  if (!regex.test(email)) {
    return res
      .status(400)
      .json({
        error:
          "The email field does not conform to the expected email struture",
      });
  }

  fs.readFile(userFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error with data connection" });
    }
    const users = JSON.parse(data);
    users.push(newUser);
    fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error saving user." });
      }
      res.status(201).json(newUser);
    });
  });
});

app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updateUser = req.body;

  // 1. Definimos la función (mejor si está fuera o al inicio)
  const validateForm = (userData, allUsers, isEditing) => {
    // Validación de ID duplicado
    if (!isEditing && allUsers.some((user) => user.id === userData.id)) {
      return { error: true, message: "ID already exists" };
    }
    // Validar el nombre del nuevo usuario
    if (
      !userData.name ||
      userData.name.length < 8 ||
      userData.name.length > 20
    ) {
      return {
        error: true,
        message: "Username must be between 8 and 20 characters",
      };
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(userData.email)) {
      return { error: true, message: "Email address is invalid" };
    }
    return { error: false };
  };

  fs.readFile(userFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error with data connection" });
    }
    let users = JSON.parse(data);

    const validation = validateForm(updateUser, users, true);
    if(validation.error) {
      return res.status(400).json({ error: validation.message });
    }
    

    users = users.map((user) =>
      user.id === userId ? { ...user, ...updateUser } : user,
    );
    fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error updating user" });
      }
      res.json(updateUser);
    });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server: http://localhost:${PORT}`);
  //   console.log(`Example app listening on port ${PORT}`);
});
