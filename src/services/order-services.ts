import PartyModel from "../models/party-model";

const getOrders = async () => {
    const responseParty = await PartyModel.find({});
    return responseParty;
};

export { getOrders };