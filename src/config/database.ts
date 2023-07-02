import {Sequelize} from 'sequelize';

process.env.TZ = 'America/Santiago';

const db = new Sequelize("pichangapp", "root", "12345678", {
    host: "localhost",
    dialect: "mysql",
    // logging: false,
    timezone: process.env.TZ,
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: process.env.TZ,
    },
    pool: {
        max: 1000,
        min: 1,
        acquire: 30000,
        idle: 10000,
        },
    });

db.authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((err: string) => {
        console.error("Unable to connect to the database:", err);
    });

db.sync({ alter: true }).then(() => {
    console.log('SYNC OK!');
});

export default db;
