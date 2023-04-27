import Validations from "./base-validations";

import UserGame from "../../models/user_games-model";

const usergameExist = Validations.existInDB(UserGame);

export { usergameExist }


