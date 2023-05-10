import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';

import User from './users-model';
import Game from './games-model';
import UserTeam from './user_teams-model';

interface UserGame extends Model {
    id: number,
    isVictory: boolean,
    user_id: number,
    userteam_id: number,
    game_id: number,
    associations: {
        games: Association<Game, UserGame>;
        users: Association<User, UserGame>;
        userteams: Association<UserTeam, UserGame>;
    }
}

const UserGame = db.define<UserGame>('UserGame',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    isVictory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
});

UserGame.belongsTo(UserTeam, {
    foreignKey: {
        name: 'userteam_id',
        allowNull: true,
    }
});

UserTeam.hasMany(UserGame, {
    foreignKey: {
        name: 'userteam_id',
        allowNull: true,
    }
});

UserGame.belongsTo(Game, {
    foreignKey: {
        name: 'game_id',
        allowNull: false,
    },
    onDelete: 'cascade'
});

Game.hasMany(UserGame, {
    foreignKey: {
        name: 'game_id',
        allowNull: false,
    },

});

UserGame.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    }
});

User.hasMany(UserGame, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    },
    onDelete: 'cascade'
});

export default UserGame;