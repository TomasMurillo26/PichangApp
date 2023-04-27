import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

interface FriendRequestStatus extends Model {
    id: number;
    name: string;
}

const FriendRequestStatus = db.define<FriendRequestStatus>('FriendRequestStatus',{
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
});

export default FriendRequestStatus;