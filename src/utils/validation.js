function isValidEmail(email) {
    // Expresión regular para validar el email.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validación de nombre (mínimo 3 caracteres)
function isValidName(name) {
    return typeof name === 'string' && name.length >= 3;
}

// Validación de la no repeticion del numero de ID.
function isUniqueId(id, users) {
    const isUnique = users.some(user => user.id === id);
    return isUnique
}


// Validación de ID (numérico y único)
function isValidId(id) {

    const numericId = Number(id); // Intentamos convertir a número
    return !isNaN(numericId) && numericId > 0;
    // Expresión regular para validar que el id es un entero positivo.
    // const idRegex = /^[0-9]+$/;
    // return typeof id === 'number' && idRegex.test(id)
}

// Función principal de validación
function validateUser(user, users) {
    const errors = [];

    if (!isValidName(user.name)) {
        errors.push("El nombre debe tener al menos tres caracteres");
    }

    if (!isValidEmail(user.email)) {
        errors.push("El correo electrónico no es válido");
    }

    if (!isValidId(user.id)) {
        errors.push("El ID debe de ser un numero positivo");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
module.exports = {
  isValidEmail,
  isValidName,
  isUniqueId,
  isValidId,
  validateUser
};


// app.post("/users", (req, res) => {
//   const newUser = req.body;
//   fs.readFile(userFilePath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: "Error with data connection" });
//     }
//     const users = JSON.parse(data);

//     const validationId = isUniqueId(newUser.id, users);
//     const validation = validateUser(newUser, users);



//     users.push(newUser);
//     fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
//       if (err) {
//         return res.status(500).json({ error: "Error saving user." });
//       }
//       res.status(201).json(newUser);
//     });
//   });
// });

// app.put("/users/:id", (req, res) => {
//   const userId = parseInt(req.params.id, 10);
//   const updateUser = req.body;

//   // 1. Definimos la función (mejor si está fuera o al inicio)
//   const validateForm = (userData, allUsers, isEditing) => {
//     // Validación de ID duplicado
//     if (!isEditing && allUsers.some((user) => user.id === userData.id)) {
//       return { error: true, message: "ID already exists" };
//     }
//     // Validar el nombre del nuevo usuario
//     if (
//       !userData.name ||
//       userData.name.length < 8 ||
//       userData.name.length > 20
//     ) {
//       return {
//         error: true,
//         message: "Username must be between 8 and 20 characters",
//       };
//     }
//     const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!regex.test(userData.email)) {
//       return { error: true, message: "Email address is invalid" };
//     }
//     return { error: false };
//   };

//   fs.readFile(userFilePath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: "Error with data connection" });
//     }
//     let users = JSON.parse(data);

//     const validation = validateForm(updateUser, users, true);
//     if(validation.error) {
//       return res.status(400).json({ error: validation.message });
//     }
    

//     users = users.map((user) =>
//       user.id === userId ? { ...user, ...updateUser } : user,
//     );
//     fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
//       if (err) {
//         return res.status(500).json({ error: "Error updating user" });
//       }
//       res.json(updateUser);
//     });
//   });
// });






// const name = newUser.name;
//   const email = newUser.email;
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!newUser || Object.keys(newUser).length === 0) {
//     return res.status(400).json({ error: "The data was not received" });
//   }
//   if (name.length < 3) {
//     return res
//       .status(400)
//       .json({ error: "The name field must be 3 characters of longer" });
//   }
//   if (!regex.test(email)) {
//     return res
//       .status(400)
//       .json({
//         error:
//           "The email field does not conform to the expected email struture",
//       });
//   }



// 1. Definimos la función (mejor si está fuera o al inicio)
//   const validateForm = (userData, allUsers, isEditing) => {
    // Validación de ID duplicado
    // if (!isEditing && allUsers.some((user) => user.id === userData.id)) {
    //   return { error: true, message: "ID already exists" };
    // }
    // Validar el nombre del nuevo usuario
    // if (
    //   !userData.name ||
    //   userData.name.length < 8 ||
    //   userData.name.length > 20
    // ) {
    //   return {
    //     error: true,
    //     message: "Username must be between 8 and 20 characters",
    //   };
    // }
    // const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (!regex.test(userData.email)) {
    //   return { error: true, message: "Email address is invalid" };
    // }
    // return { error: false };
//   };