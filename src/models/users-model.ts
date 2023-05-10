import { DataTypes, Model, Association, BelongsToManySetAssociationsMixin } from 'sequelize';
import db from '../config/database';
import Role from './roles-model';

interface User extends Model {
    id: number,
    name: string,
    nickname: string,
    profile_image: string,
    birthday: Date,
    activated: boolean,
    email: string,
    password: string,
    role_id: number,
    associations: {
        roles: Association<Role, User>;
    }
    setRoles: BelongsToManySetAssociationsMixin<Role, number>;
}

const User = db.define<User>('User',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: 'nickname'
    },
    profile_image: {
        type: DataTypes.STRING(2048),
        allowNull: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(155),
        allowNull: false,
        unique: 'email'
    },
    activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
},
{
    defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    },
    scopes: {
        withPassword: {
            attributes: {include: ['password']},
        }
    }
});

Role.belongsToMany(User, {
    through: 'user_role',
    foreignKey: { name: 'role_id', allowNull: true },
    as: 'users',
});

User.belongsToMany(Role, {
    through: 'user_role',
    foreignKey: { name: 'user_id', allowNull: true },
    as: 'roles',
    onDelete: 'cascade'
});

export default User;