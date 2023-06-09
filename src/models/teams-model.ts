import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';
import Sport from './sports-model';
import User from './users-model';

interface Team extends Model {
    id: number,
    name: string,
    activated: boolean,
    sport_id: number,
    captain_id: number,
    full: boolean,
    associations: {
        sports: Association<Sport, Team>;
        users: Association<User, Team>;
    }
}

const Team = db.define<Team>('Team',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
});

Team.belongsTo(User, {
    foreignKey: {
        name: 'captain_id',
        allowNull: false,
    }
});

User.hasMany(Team, {
    foreignKey: {
        name: 'captain_id',
        allowNull: false,
    }
});

Team.belongsTo(Sport, {
    foreignKey: {
        name: 'sport_id',
        allowNull: false,
    }
});

Sport.hasMany(Team, {
    foreignKey: {
        name: 'sport_id',
        allowNull: false,
    },
    onDelete: 'cascade'

});


export default Team;