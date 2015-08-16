import { EventEmitter } from 'events';

import React from 'react';
import keymirror from 'keymirror';

import dispatcher from '../../dispatcher';

import { ActionTypes as CanvasActionTypes } from '../../constants/CanvasConstants';

let events = keymirror({
  save: null,
});

class CanvasStore extends EventEmitter {

  background = null;

  dispatchToken = dispatcher.register(this.handleDispatch.bind(this));

  handleDispatch(action) {
    log('CanvasStore#handleDispatch', action);

    let dataUrl;

    switch (action.type) {
      case CanvasActionTypes.CANVAS_SAVE_HALF_SIZE:
        log(CanvasActionTypes.CANVAS_SAVE_HALF_SIZE);
        dataUrl = this.saveHalfSize(
          action.canvasElement, action.width, action.height
        );
        this.emitSaveCanvas(dataUrl);
        break;
      case CanvasActionTypes.CANVAS_SAVE_FULL_SIZE:
        log(CanvasActionTypes.CANVAS_SAVE_FULL_SIZE);
        dataUrl = this.saveFullSize(
          action.canvasElement, action.width, action.height
        );
        this.emitSaveCanvas(dataUrl);
        break;
      case CanvasActionTypes.CANVAS_UPLOAD_FILE:
        log(CanvasActionTypes.CANVAS_UPLOAD_FILE);
        this.loadImage(action.file)
          .then(
            (image) => {
              this.background = image;
              this.emitUpdateBackground();
            }
          )
          .catch(
            (err) => log(err)
          );
        break;
    }
  }

  //----------------------------------------------------------------------------

  loadImage(file) {
    log('CanvasStore#loadImage', file);

    return new Promise(function(resolve, reject) {
      let url = URL.createObjectURL(file),
          image = new Image();

      image.onerror = function(err) {
        URL.revokeObjectURL(url);
        reject(err);
      };
      image.onload = function() {
        URL.revokeObjectURL(url);
        resolve(image);
      };

      image.src = url;
    });
  }

  saveHalfSize(canvasElement, width, height) {
    log('CanvasStore#saveHalfSize', canvasElement, width, height);

    let canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        dataUrl;

    canvas.width = width / 2;
    canvas.height = height / 2;
    context.drawImage(canvasElement, 0, 0, width / 2, height / 2);

    dataUrl = canvas.toDataURL('image/png');
    context = null;
    canvas = null;

    return dataUrl;
  }

  saveFullSize(canvasElement, width, height) {
    log('CanvasStore#saveFullSize', canvasElement, width, height);

    let canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        dataUrl;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(canvasElement, 0, 0);

    dataUrl = canvas.toDataURL('image/png');
    context = null;
    canvas = null;

    return dataUrl;
  }

  //----------------------------------------------------------------------------

  toBlob(dataUrl) {
    log('CanvasStore#toBlob', dataUrl);

    let binary = atob(dataUrl.replace(/^[^,]*,/, '')),
        buffer = new Uint8Array(binary.length);

    for (let i = 0, len = binary.length; i < len; ++i) {
      buffer[i] = binary.charCodeAt(i);
    }

    return new Blob([buffer.buffer], { type: 'image/png' });
  }

  //----------------------------------------------------------------------------

  getBackground() {
    log('CanvasStore#getBackground');

    return this.background;
  }

  //----------------------------------------------------------------------------

  emitUpdateBackground() {
    this.emit(events.updateBackground, this.background);
  }

  addUpdateBackgroundListener(callback) {
    this.addListener(events.updateBackground, callback);
  }

  removeUpdateBackgroundListener(callback) {
    this.removeListener(events.updateBackground, callback);
  }

  //----------------------------------------------------------------------------

  emitSaveCanvas(dataUrl) {
    this.emit(events.save, dataUrl);
  }

  addSaveCanvasListener(callback) {
    this.addListener(events.save, callback);
  }

  removeSaveCanvasListener(callback) {
    this.removeListener(events.save, callback);
  }

}

export default new CanvasStore();
