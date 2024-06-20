var g_id_gestion="";
function Gestion(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
    "query": "select ges.id_gestion,cli.id_cliente, ges.comentarios,CONCAT(cli.nombres, ' ',cli.apellidos) as cliente,CONCAT(usu.nombres,' ' ,usu.apellidos) as usuario,tge.nombre_tipo_gestion,res.nombre_resultado,ges.fecha_registro from gestion ges,usuario usu,cliente cli,tipo_gestion tge,resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado "
    });
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_gestion').DataTable();
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
function completarFila(element,index,arr){


var fechaGestionFormateada = formatearFecha(element.fecha_registro);

arr[index] = document.querySelector('#tbl_gestion tbody').innerHTML += 
`<tr>
<td>${element.id_gestion}</td>
<td>${element.usuario}</td>
<td>${element.cliente}</td>
<td>${element.nombre_resultado}</td>
<td>${element.comentarios}</td>
<td>${fechaGestionFormateada}</td>
<td>
<a href='actualizar.html?id=${element.id_gestion}' class='btn btn-success btn-sm'>Actualizar</a>
<a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
</td>
</tr>`


}


function actualizarGestion(){
    var txt_id_usuario = document.getElementById("sel_id_usuario").value;
    var txt_id_cliente = document.getElementById("sel_id_cliente").value;
    var txt_id_resultado = document.getElementById("sel_id_resultado").value;
    var txt_comentarios = document.getElementById("txt_comentarios").value;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var fechaActual = obtenerFecha();

    const raw = JSON.stringify({
    "id_usuario": txt_id_usuario,
    "id_cliente": txt_id_cliente,
    "id_tipo_gestion" : txt_id_tipo_gestion,
    "id_resultado": txt_id_resultado,
    "comentarios": txt_comentarios,
    "fecha_registro": fechaActual
    });

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
    .then(response => {
        if(response.status == 200) {
            location.href ="listar.html";
        }
        if(response.status == 400) {
            alert("Se ha producido un error");
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function cargarListasDesplegables(){
obtenerTipoGestion();
obtenerResultado();
obtenerUsuario();
obtenerCliente();
}
function obtenerResultado(){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/resultado/?_size=300", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarSelectResultado);
         
        } 
        )
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
function obtenerCliente(){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/cliente/?_size=300", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarSelectCliente);
         
        } 
        )
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
function obtenerUsuario(){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/usuario/?_size=300", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarSelectUsuario);
         
        } 
        )
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
 function completarSelectResultado(element,index,arr){
    arr[index] = document.querySelector('#sel_id_resultado').innerHTML += 
    `<option value='${element.id_resultado}'>${element.nombre_resultado}</option>`
 }
 function completarSelectCliente(element,index,arr){
    arr[index] = document.querySelector('#sel_id_cliente').innerHTML += 
    `<option value='${element.id_cliente}'>${element.apellidos} ${element.nombres}</option>`
 }
 function completarSelectUsuario(element,index,arr){
    arr[index] = document.querySelector('#sel_id_usuario').innerHTML += 
    `<option value='${element.id_usuario}'>${element.apellidos} ${element.nombres}</option>`
 }

 function obtenerParametroGestionEliminar(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get('id');
    g_id_gestion = p_id_gestion;
    obtenerDatosGestionEliminar(p_id_gestion);   
}
function obtenerDatosGestionEliminar(p_id_gestion){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/gestion/"+p_id_gestion, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiquetaEliminar) 
        )
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
function completarEtiquetaEliminar(element,index,arr){
    var id_gestion = element.id_gestion;
    var fecha_gestion = formatearFecha(element.fecha_registro);
    var etiquetaEliminar = document.getElementById('lbl_eliminar');
    etiquetaEliminar.innerHTML = "<p>¿Seguro que desea eliminar esta gestión? ID: " + id_gestion + " de fecha "+ fecha_gestion+"</p>";
  
}
function eliminarGestion(){
 
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

 

    const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/"+g_id_gestion, requestOptions)
    .then(response => {
        if(response.status == 200) {
            location.href ="agregar.html";
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function obtenerFecha(){
    var fechaActual = new Date();
    var fechaFormateada = fechaActual.toLocaleString('es-ES',{
        hour12 :false,
        year:'numeric',
        month:'2-digit',
        day:'2-digit',
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
    return fechaFormateada;
}
function formatearFecha(fecha_registro){

    //Formateamos la fecha
var fechaGestion = new Date(fecha_registro);
var fechaFormateada = fechaGestion.toLocaleString('es-ES',{
    hour12 :false,
    year:'numeric',
    month:'2-digit',
    day:'2-digit',
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit',
    timeZone:'UTC'
}).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5');
return fechaFormateada;
    
}