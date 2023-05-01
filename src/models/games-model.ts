import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';

import Sport from './sports-model';
import Ground from './grounds-model';
import GameType from './gametypes-model';
import User from './users-model';
import GameStatus from './gamestatuses-model';

interface Game extends Model {
    id: number;
    start_hour: Date,
    end_hour: Date,
    date: Date,
    num_players: number,
    sport_id: Sport,
    ground_id: Ground,
    gametype_id: GameType,
    createduser_id: User,
    gamestatus_id: GameStatus,
    associations: {
        users: Association<User, Game>;
        sports: Association<Sport, Game>;
        grounds: Association <Ground, Game>;
        gametypes: Association <GameType, Game>;
        gamestatuses: Association <GameStatus, Game>;
    }
}

const Game = db.define<Game>('Game',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    start_hour: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_hour: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    num_players: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

Game.belongsTo(Ground, {
    foreignKey: {
        name: 'ground_id',
        allowNull: true,
    }
});

Ground.hasMany(Game, {
    foreignKey: {
        name: 'ground_id',
        allowNull: true,
    }
});

Game.belongsTo(GameType, {
    foreignKey: {
        name: 'gametype_id',
        allowNull: false,
    }
});

GameType.hasMany(Game, {
    foreignKey: {
        name: 'gametype_id',
        allowNull: false,
    }
});

Game.belongsTo(GameStatus, {
    foreignKey: {
        name: 'gamestatus_id',
        allowNull: false,
    }
});

GameStatus.hasMany(Game, {
    foreignKey: {
        name: 'gamestatus_id',
        allowNull: false,
    }
});

Game.belongsTo(Sport, {
    foreignKey: {
        name: 'sport_id',
        allowNull: false,
    }
});

Sport.hasMany(Game, {
    foreignKey: {
        name: 'sport_id',
        allowNull: false,
    }
});

export default Game;