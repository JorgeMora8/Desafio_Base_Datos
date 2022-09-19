

class ContenedorSqlite { 
    constructor(config){ 
        this.knex=require("knex")(config)
    }

    CrearTabla(){
        return this.knex.schema.dropTableIfExists("mensajes").finally(() => {
          return this.knex.schema.createTable("mensajes", (table) => {
            table.increments("id").primary();
            table.string("nombre", 20);
            table.string("mensaje", 50);
            table.string("fecha", 20);
          });
        });
      }

      Guardar(mensaje) {
        return this.knex("mensaje").insert(mensaje);
      }
    
      ObtenerTodosMensajes() {
        return this.knex.select("*").from("mensajes");
      }
    
      CerrarConexion() {
        this.knex.destroy();
      }
}

module.exports = ContenedorSqlite; 