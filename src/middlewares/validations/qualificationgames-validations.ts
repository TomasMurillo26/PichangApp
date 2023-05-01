import Validations from './base-validations';

import QualificationGame from '../../models/qualificationgames-model';
import Game from '../../models/games-model';

const game_id = Validations.relationExist(
    'game_id',
    'Es requerido un partido',
    true,
    Game
);

const value = Validations.isPositiveNumeric(
    'value',
    'Es necesaria una calificación',
    true
);

const qualificationgameExist = Validations.existInDB(QualificationGame);

export { qualificationgameExist, game_id, value }


