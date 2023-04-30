import Validations from "./base-validations";

import UserGame from "../../models/user_games-model";
import Game from "../../models/games-model";

const usergameExist = Validations.existInDB(UserGame);

const game_id = Validations.relationExist(
    'game_id',
    'Es requerido un juego',
    true,
    Game
)

export { usergameExist, game_id }


