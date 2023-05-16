import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";

Propiedad.belongsTo(Precio, { foreignKey: "PriceId" });
Propiedad.belongsTo(Categoria, { foreignKey: "CategoryId" });
Propiedad.belongsTo(Usuario, { foreignKey: "UserId" });

export { Propiedad, Precio, Categoria, Usuario };
