require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { PGUSER, PGPASSWORD, PGHOST, PORT, PGDATABASE } = process.env;
let sequelize =
 new Sequelize({
      database: PGDATABASE,
      dialect: "postgres",
      host: PGHOST,
      port: PORT,
      username: PGUSER,
      password: PGPASSWORD,
      pool: {
        max: 3,
        min: 1,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          // Ref.: https://github.com/brianc/node-postgres/issues/2009
          rejectUnauthorized: false,
        },
        keepAlive: true,
      },
      ssl: true,
    });
// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/development`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
//hiiii
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Appointment, Image, Sale, Detailsale, Product, Schedule, Day, Hour, Service, User, Address } = sequelize.models;
console.log(sequelize.models)

//-----------------------> Address
User.hasMany(Address)
Address.belongsTo(User)

User.hasMany(Sale);
Sale.belongsTo(User);

//-----------------------> Sale
User.hasMany(Detailsale);
Detailsale.belongsTo(User);

Sale.hasMany(Detailsale)
Detailsale.belongsTo(Sale)

Product.hasMany(Detailsale)
Detailsale.belongsTo(Product)

//-------------------------------------> Image
Product.belongsToMany(Image, { through: "Product_Images", })
Image.belongsToMany(Product, { through: "Product_Images" })

//------------------------> Apointment
User.hasMany(Appointment);
Appointment.belongsTo(User);

//-----------------------> Schedule
Schedule.hasOne(Service)
Service.belongsTo(Schedule)

Schedule.hasMany(Day, { onDelete: 'CASCADE' });
Day.belongsTo(Schedule);

Day.hasMany(Hour, { onDelete: 'CASCADE' })
Hour.belongsTo(Day)




// Aca vendrian las relaciones
// Product.hasMany(Reviews);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
