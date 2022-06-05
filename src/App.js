import React,{Component} from 'react';
import axios from 'axios';


import './App.css';

class App extends Component {
  constructor(props) {
      super(props);
    this.state=({
      prestamos:[],
      pos:null,
      title:'Nuevo Prestamo',
      id:0,
      titulo:0,
      nombre_usuario:0,
      fec_prestamo:"",
      fec_devolucion:"",
    })
    
    this.cambioLibro = this.cambioLibro.bind(this);
    this.cambioUsuario = this.cambioUsuario.bind(this);
    this.cambioFechaPres = this.cambioFechaPres.bind(this);
    this.cambioFechaDevo = this.cambioFechaDevo.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);
    
  }
  render() {
    return (<div align="center">
      <h1>Lista de Prestamos</h1>
      <table border="2" cellspacing="4">
        <thead>
          <tr>
            <th>EJEMPLAR</th>
            <th>LIBRO</th>
            <th>CLIENTE</th>
            <th>INICIO</th>
            <th>FIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.state.prestamos.map((prestamo,index) =>{
            return(
              <tr key={prestamo.id_prestamo}>
                <td>{prestamo.id_prestamo}</td>
                <td>{prestamo.titulo}</td>
                <td>{prestamo.nombre_usuario}</td>
                <td>{prestamo.fec_prestamo}</td>
                <td>{prestamo.fec_devolucion}</td>
                <td>
                  <button color="#841584"  onClick={()=>this.mostrar(prestamo.id_prestamo,index)} >Editar</button>
                  <button onClick={()=>this.eliminar(prestamo.id_prestamo)}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr/>
      <h1>{this.state.title}</h1>
      <form onSubmit={this.guardar}>
        <input type="hidden" value={this.state.id}/>
        <p>
          Ingrese id de libro:
          <input type="text" value={this.state.titulo} onChange={this.cambioLibro}/>
        </p>
        <p>
          Ingrese id de usuario:
          <input type="text" value={this.state.nombre_usuario} onChange={this.cambioUsuario}/>
        </p>
        <p>
          Ingrese fecha de prestamo:
          <input type="text" value={this.state.fec_prestamo} onChange={this.cambioFechaPres}/>
        </p>
        <p>
          Ingrese fecha de devolucion:
          <input type="text" value={this.state.fec_devolucion} onChange={this.cambioFechaDevo}/>
        </p>
        
        <p><input type="submit" value="Guardar"/></p>
      </form>

    </div>)
  }

  componentWillMount(){
    axios.get('http://127.0.0.1:8000/prestamos/')
    .then(res => {
      this.setState({ prestamos: res.data})
    });
  }

  cambioLibro(e){
    this.setState({
      titulo: e.target.value
    })
  }
  cambioUsuario(e){
    this.setState({
      nombre_usuario: e.target.value
    })
  }
  cambioFechaPres(e){
    this.setState({
      fec_prestamo:e.target.value
    })
  }
  cambioFechaDevo(e){
    this.setState({
      fec_devolucion: e.target.value
    })
  }

  mostrar(cod, index){
    axios.get('http://127.0.0.1:8000/prestamos/'+cod+'/')
    .then(res => {
      this.setState({ 
        pos: index,
        title: 'Editar',
        
        titulo : res.data.titulo,
        nombre_usuario: res.data.nombre_usuario,
        fec_prestamo: res.data.fec_prestamo,
        fec_devolucion: res.data.fec_devolucion

      })
    });
  }
  guardar(e){
    e.preventDefault();
    let cod=this.state.id_prestamo;
    let datos={
      titulo: this.state.titulo,
      nombre_usuario: this.state.nombre_usuario,
      fec_prestamo: this.state.fec_prestamo,
      fec_devolucion: this.state.fec_devolucion
    }
    if(cod>0){
      axios.put('http://127.0.0.1:8000/prestamos/'+cod+'/',datos)
      .then( res => {
        let indx = this.state.pos;
        this.state.prestamos[indx] = res.data;
        var temp = this.state.prestamos;
        this.setState({
          pos: null,
          title:'Nuevo',
          id:0,
          titulo:0,
          nombre_usuario:0,
          fec_prestamo:"",
          fec_devolucion:"",
          prestamos:temp
        });
      }).catch(error=>{
        console.log(error.toString());
      });
    }else{
      axios.post('http://127.0.0.1:8000/prestamos/', datos)
      .then(res => {
        this.state.series.push(res.data);
        var temp = this.state.series;
        this.setState({
          id:0,
          titulo:0,
          nombre_usuario:0,
          fec_prestamo:"",
          fec_devolucion:"",
          prestamos: temp
        });
      }).catch(error=>{
        console.log(error.toString());
      });
    }
  }
  eliminar(cod){
    let rpta= window.confirm("Desea eliminar un Prestamo");
    if(rpta){
      axios.delete('http://127.0.0.1:8000/prestamos/'+cod+'/')
      .then(res =>{
        var temp = this.state.prestamos.filter((prestamo)=>prestamo.id!==cod);
        this.setState({
          prestamos:temp
        })
      });
    }
  }
}

export default App;