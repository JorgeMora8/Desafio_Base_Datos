class ContenedorMysql { 
    constructor(config){ 
        this.knex = require("knex")(config)
    }

    crearTabla() {
        return this.knex.schema.dropTableIfExists("productos").finally(() => {
          return this.knex.schema.createTable("productos", (table) => {
            table.increments("id").primary();
            table.string("nombre", 50).notNullable();
            table.float("precio");
            table.string("imagen");
          });
        });
      }
    
      Guardar(producto) {
        return this.knex("productos").insert(producto);
      }
    
      ObtenerProductos() {
        return this.knex.select("*").from("productos");
      }
    
      ObtenerPorId(id) {
        return this.knex("productos").select("*").where({ id }).first();
      }
    
      EliminarPorId(id) {
        const producto = this.getById(id);
    
        if (Object.entries(producto).length < 0) {
          return false;
        }
    
        this.knex("productos").where("id", id).del();
    
        return true;
      }
    
      ActualizarProducto(objeto, id) {
        return this.knex("productos").where("id", id).update(objeto);
      }
    
      close() {
        this.knex.destroy();
      }
}

module.exports = ContenedorMysql