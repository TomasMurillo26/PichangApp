import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';
import User from './users-model';
import Game from './games-model';
import Team from './teams-model';

interface UserGame extends Model {
    id: number;
    isVictory: boolean;
    position_id: Game,
    user_id: User,
    team_id: Team,
    game_id: Game,
    associations: {
        games: Association<Game, UserGame>;
        users: Association<User, UserGame>;
        teams: Association<Team, UserGame>;
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

UserGame.belongsTo(Team, {
    foreignKey: {
        name: 'team_id',
        allowNull: true,
    }
});

Team.hasMany(UserGame, {
    foreignKey: {
        name: 'team_id',
        allowNull: true,
    }
});

UserGame.belongsTo(Game, {
    foreignKey: {
        name: 'game_id',
        allowNull: false,
    }
});

Game.hasMany(UserGame, {
    foreignKey: {
        name: 'game_id',
        allowNull: false,
    }
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
    }
});

export default UserGame;