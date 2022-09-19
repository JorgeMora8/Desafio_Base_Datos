const express = require("express"); 
const { appendFile } = require("fs");
const {Server:HttpServer} = require("http"); 
const {Server:IOServer} = require("socket.io"); 
const PORT = 5000; 

const app = express(); 
const httpServer = new HttpServer(app); 
const io = new IOServer(httpServer); 

app.use(express.static("public")); 
app.use(express.urlencoded({extended:true})); 
app.use(express.json()); 




//HandleBars SetUp
const handlebarsConfig = {defaultlayout: "main.handlebars"}
const {engine} = require("express-handlebars"); 
app.engine("handlebars", engine(handlebarsConfig)); 
app.set("view engine", ".handlebars"); 
app.set("views", "./views");

//=>Contenedor en base a Arrays; 
const Datos = require("../Contenedor/Datos"); 
const Contenedor = new Datos //=>Contenedor Productos; 
const Chat = new Datos //=>Contenedor Chat; 

//=>Instalacion base de datos; 
const ClienteSqlite = require("../ContenedorSQLITE/ClienteSqlite.js")
const ClienteMysql = require("../ContenedorMYSQL/ClienteMysql"); 


const server = httpServer.listen(PORT, () => { 
    console.log("Usando el puerto: " + PORT)
})
server.on("error", (err) => { 
    console.log(err)
})

app.get("/", (req,res) => { 
    res.render("home.handlebars", {productos:ClienteMysql.ObtenerProductos()})
})



io.on("connection", async (socket) => { 

    // await ClienteMysql.crearTabla();
    // await ClienteSqlite.CrearTabla()
 


    socket.emit("productos", await ClienteMysql.ObtenerProductos()); 
    socket.emit("chat", await ClienteSqlite.ObtenerTodosMensajes())

    socket.on("nuevoProducto", async (data) => { 
      await ClienteMysql.Guardar(data)
       io.sockets.emit('productos', await ClienteMysql.ObtenerProductos())
 
    })


    socket.on("nuevoMensaje", async (data) => { 
      await ClienteSqlite.Guardar(data); 
       io.sockets.emit('chat',await ClienteSqlite.ObtenerTodosMensajes())
    });
    

})