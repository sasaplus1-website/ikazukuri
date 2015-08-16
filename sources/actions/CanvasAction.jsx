import dispatcher from '../dispatcher';

import { ActionTypes } from '../constants/CanvasConstants';

export default {

  saveHalfSize(canvasElement, width, height) {
    log('CanvasAction.saveHalfSize', canvasElement, width, height);

    dispatcher.dispatch({
      canvasElement,
      height,
      type: ActionTypes.CANVAS_SAVE_HALF_SIZE,
      width,
    });
  },

  saveFullSize(canvasElement, width, height) {
    log('CanvasAction.saveFullSize', canvasElement, width, height);

    dispatcher.dispatch({
      canvasElement,
      height,
      type: ActionTypes.CANVAS_SAVE_FULL_SIZE,
      width,
    });
  },

  uploadFile(file) {
    log('CanvasAction.uploadFile', file);

    dispatcher.dispatch({
      file,
      type: ActionTypes.CANVAS_UPLOAD_FILE,
    });
  },

};
