import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';

import User from './users-model';
import Game from './games-model';

interface QualificationGame extends Model {
    id: number;
    value: number;
    game_id: Game;
    user_id: User;
    associations: {
        games: Association<Game, QualificationGame>;
        users: Association<User, QualificationGame>;
    }
}

const QualificationGame = db.define<QualificationGame>(
    'QualificationGame',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

QualificationGame.belongsTo(Game, {
    foreignKey: {
        name: 'game_id',
        allowNull: false,
    }
});

Game.hasMany(QualificationGame, {
    foreignKey: {
        name: 'game_id',
        allowNull: false,
    }
});

QualificationGame.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    }
});

User.hasMany(QualificationGame, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    }
});


export default QualificationGame;