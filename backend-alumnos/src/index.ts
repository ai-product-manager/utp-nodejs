import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise'; // ¡Importamos la versión con Promesas!

// --- Configuración de la Conexión ---
// Creamos un "Pool" de conexiones. Es más eficiente que crear una por cada query.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Tu usuario de MySQL
  password: '123456', // Tu contraseña de MySQL
  database: 'utp_alumnos_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();

// Middlewares
app.use(express.json()); // Para entender JSON
app.use(cors());         // Para permitir peticiones (ej: de React)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});

// ENDPOINT 1: Obtener todos los alumnos (Read)
app.get('/api/students', async (req, res) => {
  try {
    // 1. Definimos el SQL
    const query = "SELECT * FROM student ORDER BY createdAt DESC";

    // 2. Ejecutamos el query usando el pool
    const [rows] = await pool.query(query);

    // 3. Respondemos con los datos (rows)
    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los alumnos' });
  }
});

// ENDPOINT 2: Crear un nuevo alumno (Create) - MODO SEGURO
app.post('/api/students', async (req, res) => {
  try {
    const { name, course } = req.body;

    // 1. Definimos el SQL con Placeholders (?)
    const query = "INSERT INTO student (name, course) VALUES (?, ?)";

    // 2. Pasamos los valores en un array separado
    const [result] = await pool.query(query, [name, course]);

    // 3. Respondemos con el nuevo ID (opcional)
    res.status(201).json({ newId: (result as any).insertId, name, course });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el alumno' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM student WHERE id = ?";
    await pool.query(query, [id]); // Pasamos [id] como array
    res.json({ message: `Alumno con id ${id} eliminado` });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el alumno' });
  }
});

app.get('/api/students/total/count', async (req, res) => {
  try {
    // Opción A (Más elegante con SQL):
    const [rows] = await pool.query("SELECT COUNT(*) as total FROM student");
    const total = (rows as any[])[0].total;
    res.json({ total: total });

    // Opción B (Si el alumno es muy novato y hace SELECT *):
    // const [rows] = await pool.query("SELECT * FROM student");
    // res.json({ total: (rows as any[]).length });
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
});