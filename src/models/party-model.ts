import { 
    Schema, 
    // Types, 
    model, 
    // Model 
} from "mongoose";
import { Party } from "../interfaces/party.interface";

const PartySchema = new Schema<Party>(
    {
        num_players: {
            type: Number,
            required: true,
        },
        start_hour: {
            type: String,
            required: true,
        },
        end_hour: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const PartyModel = model('partys', PartySchema);
export default PartyModel;