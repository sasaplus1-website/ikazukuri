import dispatcher from '../dispatcher';

import { ActionTypes } from '../constants/AppConstants';

export default {

  dropFiles(files) {
    log('AppAction.dropFile', files);

    dispatcher.dispatch({
      files,
      type: ActionTypes.APP_DROP_FILES,
    });
  },

};
