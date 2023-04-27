import express, { Application } from 'express';
import cors from 'cors';

import userRoutes  from './src/routes/users';
import regionRoutes  from './src/routes/regions';
import communeRoutes  from './src/routes/communes';
import friendrequeststatusRoutes from './src/routes/friendrequeststatus';
import roleRoutes from './src/routes/roles';
import sportRoutes from './src/routes/sports';
import authRoutes from './src/routes/auth';

import db from './src/config/database';
import bodyParser from 'body-parser';


class Server {

	private app: Application;
	private port: string;
	private paths = {
		users: '/api/users',
		roles: 'api/roles',
		communes: '/api/communes',
		regions: '/api/regions',
		friendrequeststatus: 'api/friendrequeststatus',
		login: '/api/login',
		sports: '/api/sports'
	}

	constructor() {
		this.app = express();
		this.port = process.env.PORT || '8080';

		//Metodos iniciales
		this.middlewares();
		this.routes();  
		this.dbConnection();
	}

	async dbConnection() {
		try{
			await db.authenticate();
			console.log('Database online');
		}catch(e){
			console.error('No se conecto',e);
		}
	}

	middlewares() {

		//CORS
		this.app.use(cors());
		//body-parser
		this.app.use(bodyParser.json()) // for parsing application/json
		this.app.use(bodyParser.urlencoded({ extended: true }))
		//Carpeta pública
		this.app.use( express.static('public'))
	}

	routes(){
		this.app.use(this.paths.users, userRoutes);
		this.app.use(this.paths.regions, regionRoutes);
		this.app.use(this.paths.communes, communeRoutes);
		this.app.use(this.paths.roles, roleRoutes);
		this.app.use(this.paths.login, authRoutes);
		this.app.use(this.paths.friendrequeststatus, 
			friendrequeststatusRoutes);
		this.app.use(this.paths.sports, sportRoutes);
	}

	listen() {
		this.app.listen( this.port, () => {
			console.log('Servidor corriendo en puerto '+ this.port);
		})
	}
}

export default Server;