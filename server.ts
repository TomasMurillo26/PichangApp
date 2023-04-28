import express, { Application } from 'express';
import cors from 'cors';

import userRoutes  from './src/routes/users';
import regionRoutes  from './src/routes/regions';
import communeRoutes  from './src/routes/communes';
import friendrequeststatusRoutes from './src/routes/friendrequeststatus';
import roleRoutes from './src/routes/roles';
import sportRoutes from './src/routes/sports';
import gamestatusRoutes from './src/routes/gamestatuses';
import gametypeRoutes from './src/routes/gametypes';
import groundtypeRoutes from './src/routes/groundtypes';
import groundRoutes from './src/routes/grounds';
import teamRoutes from './src/routes/teams';
import userteamRoutes from './src/routes/user_teams';
import positionRoutes from './src/routes/positions';
import usergameRoutes from './src/routes/user_games';
import gameRoutes from './src/routes/games';
import qualificationgameRoutes from './src/routes/qualificationgames';
import friendRoutes from './src/routes/friends';
import authRoutes from './src/routes/auth';

import db from './src/config/database';
import bodyParser from 'body-parser';


class Server {

	private app: Application;
	private port: string;
	private paths = {
		users: '/api/users',
		roles: '/api/roles',
		communes: '/api/communes',
		regions: '/api/regions',
		friendrequeststatuses: '/api/friendrequeststatuses',
		login: '/api/login',
		sports: '/api/sports',
		gamestatuses: '/api/gamestatuses',
		gametypes: '/api/gametypes',
		groundtypes: '/api/groundtypes',
		grounds: '/api/grounds',
		teams: '/api/teams',
		userteams: '/api/userteams',
		positions: '/api/positions',
		usergames: '/api/usergames',
		games: '/api/games',
		qualificationgames: '/api/qualificationgames',
		friends: '/api/friends'
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
		this.app.use(this.paths.friendrequeststatuses, 
			friendrequeststatusRoutes);
		this.app.use(this.paths.sports, sportRoutes);
		this.app.use(this.paths.gamestatuses, gamestatusRoutes);
		this.app.use(this.paths.gametypes, gametypeRoutes);
		this.app.use(this.paths.grounds, groundRoutes);
		this.app.use(this.paths.groundtypes, groundtypeRoutes);
		this.app.use(this.paths.teams, teamRoutes);
		this.app.use(this.paths.userteams, userteamRoutes);
		this.app.use(this.paths.positions, positionRoutes);
		this.app.use(this.paths.usergames, usergameRoutes);
		this.app.use(this.paths.games, gameRoutes);
		this.app.use(this.paths.qualificationgames, 
			qualificationgameRoutes);
		this.app.use(this.paths.friends, friendRoutes);
	}

	listen() {
		this.app.listen( this.port, () => {
			console.log('Servidor corriendo en puerto '+ this.port);
		})
	}
}

export default Server;