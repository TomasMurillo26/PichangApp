import { Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { RequestExt } from "../interfaces/requestExt-interface";

const getAll = ( req: RequestExt, res: Response) => {
    try {
        res.send({
            data: 'LO VEN QUIENES TIENEN JWT',
            user: req.user,
        })
    } catch (e) {
        handleHttp(res, 'ERROR_GET_PARTYS');
    }
};

export { getAll };