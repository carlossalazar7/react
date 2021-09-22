import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';

function App() {

  const baseUrl = "http://localhost/apiFrameworks/";
  const [data, setData] = useState([]);

  //inicio de ventanas modal
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  // fin de ventanas modal


  // almacenamiento de input's
  const [frameworkSeleccionado, setFrameworkSeleccionado] = useState({
    id: '',
    nombre: '',
    lanzamiento: '',
    desarrollador: ''
  });

  // capturar info. de input's
  const handleChange = e => {
    const { name, value } = e.target;
    setFrameworkSeleccionado((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  //inicio de abrir y cerrar ventanas modal
  const ModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const ModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const ModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }
  //fin de abrir y cerrar ventanas modal


  // inicio de peticiones http

  const peticionGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPost = async () => {
    var f = new FormData();
    f.append("nombre", frameworkSeleccionado.nombre);
    f.append("lanzamiento", frameworkSeleccionado.lanzamiento);
    f.append("desarrollador", frameworkSeleccionado.desarrollador);
    f.append("METHOD", "POST");
    // permite hacer sencillas las operaciones como cliente HTTP
    await axios.post(baseUrl, f)
      .then(response => {
        setData(data.concat(response.data));
        ModalInsertar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPut = async () => {
    var f = new FormData();
    f.append("nombre", frameworkSeleccionado.nombre);
    f.append("lanzamiento", frameworkSeleccionado.lanzamiento);
    f.append("desarrollador", frameworkSeleccionado.desarrollador);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, { params: { id: frameworkSeleccionado.id } })
      .then(response => {
        var dataNueva = data;
        dataNueva.map(framework => {
          if (framework.id === frameworkSeleccionado.id) {
            framework.nombre = frameworkSeleccionado.nombre;
            framework.lanzamiento = frameworkSeleccionado.lanzamiento;
            framework.desarrollador = frameworkSeleccionado.desarrollador;
          }
        });
        setData(dataNueva);
        ModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionDelete = async () => {
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, { params: { id: frameworkSeleccionado.id } })
      .then(response => {
        setData(data.filter(framework => framework.id !== frameworkSeleccionado.id));
        ModalEliminar();
      }).catch(error => {
        console.log(error);
      })
  }
  //fin de peticiones http

  const seleccionarFramework = (framework, caso) => {
    setFrameworkSeleccionado(framework);

    (caso === "Editar") ?
      ModalEditar() :
      ModalEliminar()
  }

  useEffect(() => {
    peticionGet();
  }, [])

  return (
    <div className="container">
      <h1 className="text-center p-3">CRUD PHP-MYSQL-API-REST/REACT</h1>
      <button className="btn btn-success" onClick={() => ModalInsertar()}>Insertar</button>
      <table className="table table-striped w-75 mx-auto">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>{e.lanzamiento}</td>
              <td>{e.desarrollador}</td>
              <td>
                <button className="btn btn-primary" onClick={() => seleccionarFramework(e, "Editar")}>Editar</button>
                <button className="btn btn-danger" onClick={() => seleccionarFramework(e, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Framework</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" name="nombre" onChange={handleChange} />
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input type="text" className="form-control" name="lanzamiento" onChange={handleChange} />
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type="text" className="form-control" name="desarrollador" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()}>Insertar</button>{"   "}
          <button className="btn btn-danger" onClick={() => ModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>



      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Framework</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input type="text" className="form-control" name="nombre" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.nombre} />
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input type="text" className="form-control" name="lanzamiento" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.lanzamiento} />
            <br />
            <label>Desarrollador: </label>
            <br />
            <input type="text" className="form-control" name="desarrollador" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.desarrollador} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPut()}>Editar</button>{"   "}
          <button className="btn btn-danger" onClick={() => ModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Estás seguro que deseas eliminar el Framework {frameworkSeleccionado && frameworkSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => ModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
