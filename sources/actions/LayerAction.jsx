import dispatcher from '../dispatcher';

import { ActionTypes } from '../constants/LayerConstants';

export default {

  add() {
    log('LayerAction.add');

    dispatcher.dispatch({
      type: ActionTypes.LAYER_ADD,
    });
  },

  remove(layer) {
    log('LayerAction.remove', layer);

    dispatcher.dispatch({
      layer,
      type: ActionTypes.LAYER_REMOVE,
    });
  },

  update(layer) {
    log('LayerAction.update', layer);

    dispatcher.dispatch({
      layer,
      type: ActionTypes.LAYER_UPDATE,
    });
  },

};
