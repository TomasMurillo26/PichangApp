import {Sequelize} from 'sequelize';

const db = new Sequelize("pichangapp", "root", "12345678", {
    host: "localhost",
    dialect: "mysql",
    // logging: false
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
