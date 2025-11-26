// Importamos nuestro hook personalizado
import { useStudents } from '../context/StudentContext';

import { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Importamos Axios

// ¡Ya NO necesita recibir Props!
export default function HomePage() {

  // ==========================================================
  // TAREA 3: Consumir el contexto
  // ==========================================================
  // Obtenemos la lista 'students' desde el contexto global
  const { students, deleteStudent  } = useStudents();

  // 2. Estado para el examen (El Contador)
  const [total, setTotal] = useState(0);

  // 3. useEffect para llamar al endpoint del examen
  useEffect(() => {
    // Llamamos al endpoint específico de conteo
    const fetchCount = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/students/total/count');
        setTotal(res.data.total);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCount();
  
  // TRUCO PRO: Ponemos 'students' en las dependencias.
  // Así, si borras un alumno, el contador se actualiza solo.
  }, [students]);


  return (
    <div>
      {/* ====================================================== */}
      {/* REQUISITO DE EXAMEN: MARCA DE AGUA Y CONTADOR */}
      {/* ====================================================== */}
      <div className="alert alert-info text-center">
        <h3>
            Sistema de ALVARO MARAVI {/* Cambiar por nombre del alumno */}
        </h3>
        <h4>Total de Alumnos en BD: <strong>{total}</strong></h4>
      </div>
      {/* ====================================================== */}

      <h2>Lista de Alumnos Registrados</h2>

      {/* Si 'students' está vacío, mostramos un mensaje.
        Esto cubrirá el estado inicial Y el tiempo de carga de 500ms del useEffect en App.tsx
      */}
      {students.length === 0 ? (
        <p className="text-muted">Cargando alumnos o aún no hay registros...</p>
      ) : (
        <div className="row">
          {/* El .map() funciona exactamente igual que en S12 */}
          {students.map(student => (
            <div className="col-md-4" key={student.id}>
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{student.name}</h5>
                  <p className="card-text">Curso: {student.course}</p>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteStudent(student.id)} // ¡El botón de borrado!
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}