import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { insertParty, getAllParty, getOneParty, updateParty, deleteParty, } from "../services/party-services";

const getOne = async ( { params }: Request, res: Response) => {
    try {
        const { id } = params;
        const response = await getOneParty(id);
        res.send(response);
    } catch (e) {
        handleHttp(res, 'ERROR_GET_PARTY');
    }
};

const getAll = async ( _req: Request, res: Response) => {
    try {
        const response = await getAllParty();
        res.send(response);
    } catch (e) {
        handleHttp(res, 'ERROR_GET_PARTYS');
    }
};

const update = async ( { params, body }: Request, res: Response) => {
    try {
        const { id } = params;
        const response = await updateParty(id, body);
        res.send(response);
    } catch (e) {
        handleHttp(res, 'ERROR_UPDATE_PARTY');
    }
};

const post = async ( { body }: Request, res: Response) => {
    try {
        const responseParty = await insertParty(body);
        res.send(responseParty);
    } catch (e) {
        handleHttp(res, 'ERROR_POST_PARTY', e);
    }
};

const deleteOne = async ( { params }: Request, res: Response) => {
    try {
        const { id } = params;
        const response = await deleteParty(id);

        const data = response ? response : 'NOT_DATA_FOUND';
        res.send(data);
    } catch (e) {
        handleHttp(res, 'ERROR_DELETE_PARTY');
    }
};

export {
    getAll,
    getOne,
    update,
    post,
    deleteOne
};