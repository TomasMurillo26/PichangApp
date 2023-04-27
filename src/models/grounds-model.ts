import { DataTypes, Model, Association } from 'sequelize';
import db from '../config/database';
import GroundType from './groundtypes-model';
import Commune from './communes-model';

interface Ground extends Model {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    tariff: number;
    groundtype_id: GroundType,
    commune_id: Commune,
    associations: {
        groundtypes: Association<GroundType, Ground>;
        communes: Association<Commune, Ground>;
    }
}

const Ground = db.define<Ground>('Ground',{
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
    address: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    tariff: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

Ground.belongsTo(Commune, {
    foreignKey: {
        name: 'commune_id',
        allowNull: false,
    }
});

Commune.hasMany(Ground, {
    foreignKey: {
        name: 'commune_id',
        allowNull: false,
    }
});

Ground.belongsTo(GroundType, {
    foreignKey: {
        name: 'groundtype_id',
        allowNull: false,
    }
});

GroundType.hasMany(Ground, {
    foreignKey: {
        name: 'groundtype_id',
        allowNull: false,
    }
});



export default Ground;