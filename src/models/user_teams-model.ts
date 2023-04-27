import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';
import User from './users-model';
import Position from './positions-model';
import Team from './teams-model';

interface UserTeam extends Model {
    id: number;
    isCaptain: boolean;
    position_id: Position,
    user_id: User,
    team_id: Team
    associations: {
        positions: Association<Position, UserTeam>;
        users: Association<User, UserTeam>;
        teams: Association<Team, UserTeam>;
    }
}

const UserTeam = db.define<UserTeam>('UserTeam',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    isCaptain: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
});

UserTeam.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    }
});

User.hasMany(UserTeam, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    }
});

UserTeam.belongsTo(Position, {
    foreignKey: {
        name: 'position_id',
        allowNull: false,
    }
});

Position.hasMany(UserTeam, {
    foreignKey: {
        name: 'position_id',
        allowNull: false,
    }
});

UserTeam.belongsTo(Team, {
    foreignKey: {
        name: 'team_id',
        allowNull: false,
    }
});

Team.hasMany(UserTeam, {
    foreignKey: {
        name: 'team_id',
        allowNull: false,
    }
});


export default UserTeam;