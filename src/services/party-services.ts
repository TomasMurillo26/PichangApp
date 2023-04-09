import PartyModel from "../models/party-model";
import { Party } from '../interfaces/party.interface';

const insertParty = async (party: Party) => {
    const responeInsert = await PartyModel.create(party);
    return responeInsert;
};

const getAllParty = async () => {
    const responseParty = await PartyModel.find({});
    return responseParty;
};

const getOneParty = async (id: string) => {
    const responseParty = await PartyModel.findOne({ _id: id });
    return responseParty;
};

const updateParty = async (id: string, data: Party) => {
    const responseUpdate = await PartyModel.findOneAndUpdate({ _id: id }, data,{
            new: true
        });
    return responseUpdate;
};

const deleteParty = async (id: string) => {
    const responeDelete = await PartyModel.deleteOne({ _id: id });
    return responeDelete;
};

export { 
    insertParty,
    getAllParty,
    getOneParty,
    updateParty,
    deleteParty,
};