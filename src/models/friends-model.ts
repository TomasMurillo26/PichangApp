import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';

import User from './users-model';
import FriendRequestStatus from './friendrequeststatus-model';

interface Friend extends Model {
    id: number,
    friend_id: number,
    user_id: number,
    activated: boolean,
    friendrequest_id: number,
    associations: {
        friends: Association<User, Friend>;
        users: Association<User, Friend>;
        requeststatuses: Association<FriendRequestStatus, Friend>;
    }
}

const Friend = db.define<Friend>('Friend',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
});

Friend.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    },
    as: 'users',
});

User.hasMany(Friend, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    },
});

Friend.belongsTo(User, {
    foreignKey: {
        name: 'friend_id',
        allowNull: false,
    },
    as: 'friends'
});

User.hasMany(Friend, {
    foreignKey: {
        name: 'friend_id',
        allowNull: false,
    },
    onDelete: 'cascade'
});

Friend.belongsTo(FriendRequestStatus, {
    foreignKey: {
        name: 'friendrequest_id',
        allowNull: false,
    }
});

FriendRequestStatus.hasMany(Friend, {
    foreignKey: {
        name: 'friendrequest_id',
        allowNull: false,
    }
});

export default Friend;