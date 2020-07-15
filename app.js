require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const connectDb = require("./config/dbConfig");
const Estudiantes = require("./models/Estudiantes");

const PORT = 5000;

// Configuracion
app.set("view engine", "pug");
app.set("views", "./views");

// Intermediarios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Controladores - Views
app.get("/estudiantes", async (req, res) => {
  const estudiantes = await Estudiantes.find().select("nombre edad");
  res.render("estudiantes", { estudiantes });
});
app.get("/estudiantes/:id", async (req, res) => {
  try {
    const estudiante = await Estudiantes.findById(req.params.id).select(
      "nombre edad"
    );
    res.render("estudiantes_detail", { estudiante });
  } catch (error) {
    console.log(error);
    throw error;
  }
});
app.post("/estudiantes", async (req, res) => {
  const { nombre, edad } = req.body;
  await Estudiantes.create({ nombre, edad });
  const estudiantes = await Estudiantes.find().select("nombre edad");
  res.render("estudiantes", { estudiantes });
});

app.delete("/estudiantes/:id", async (req, res) => {
  await Estudiantes.findByIdAndDelete(req.params.id),
    then(() => {
      res.status(200).json({});
    }).catch((err) => {
      res.status(500).json(err);
    });
});

// Controladores - API
app.get("/api/estudiantes/", async (req, res) => {
  const estudiantes = await Estudiantes.find().select("nombre edad");
  res.json({
    estudiantes,
    cantidad: estudiantes.length,
  });
});
app.post("/api/estudiantes/", async (req, res) => {
  const { nombre, edad } = req.body;
  await Estudiantes.create({ nombre, edad });
  res.json({ nombre, edad });
});
app.get("/api/estudiantes/:id", async (req, res) => {
  try {
    const estudiante = await Estudiantes.findById(req.params.id).select(
      "nombre edad"
    );
    res.json(estudiante);
  } catch (error) {
    console.log(error);
    res.json({});
  }
});

app.post("/estudiantes/update/:id", async (req, res) => {
  const { nombre, edad } = req.body;
  await Estudiantes.findByIdAndUpdate(req.params.id, {
    $set: { nombre, edad },
  })
    .then(() => {
      res.redirect("/estudiantes");
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.post("/estudiantes/delete/:id", async (req, res) => {
  await Estudiantes.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/estudiantes");
    })
    .catch((err) => {
      res.send("error");
    });
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Ejecutando en el puerto ${PORT}`);
  });
});
