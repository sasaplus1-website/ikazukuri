import { EventEmitter } from 'events';

import React from 'react';
import keymirror from 'keymirror';

import exif from 'exif-js';

import dispatcher from '../../dispatcher';

import { ActionTypes as AppActionTypes } from '../../constants/AppConstants';
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
      case AppActionTypes.APP_DROP_FILES:
        log(AppActionTypes.APP_DROP_FILES);
        this.updateBackground(action.files[0])
          .then(
            () => this.emitUpdateBackground()
          )
          .catch(
            (err) => log(err)
          );
        break;

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
        this.updateBackground(action.file)
          .then(
            () => this.emitUpdateBackground()
          )
          .catch(
            (err) => log(err)
          );
        break;
    }
  }

  //----------------------------------------------------------------------------

  updateBackground(file) {
    return Promise
      .all([
        this.loadImage(file),
        this.getExifTag(file),
      ])
      .then(
        (results) => {
          let [image, exif] = results;

          this.background = this.fixImageOrientation(image, exif.Orientation);
        }
      );
  }

  loadImage(file) {
    log('CanvasStore#loadImage', file);

    return new Promise(function(resolve, reject) {
      let url = URL.createObjectURL(file),
          image = new Image();

      if (!/^image\//.test(file.type)) {
        URL.revokeObjectURL(url);
        image = null;

        reject(new TypeError('file type is must be an image.'));

        return;
      }

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

  getExifTag(image) {
    log('CanvasStore#getExifTag', image);

    return new Promise(function(resolve, reject) {
      exif.getData(image, function() {
        log('CanvasStore#getExifTag', image.exifdata);

        resolve(image.exifdata);
      });
    });
  }

  fixImageOrientation(image, orientation) {
    log('CanvasStore#fixImageOrientation', image, orientation);

    let canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    orientation || (orientation = 1);

    if (orientation >= 5 && orientation <= 8) {
      canvas.width = image.height;
      canvas.height = image.width;
    } else {
      canvas.width = image.width;
      canvas.height = image.height;
    }

    log('CanvasStore#fixImageOrientation', image.width, image.height);

    context.save();

    // exif orientation:
    //   http://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/
    //
    // useful for test:
    //   https://github.com/recurser/exif-orientation-examples
    //
    // the following code is based by load-image:
    //   https://github.com/blueimp/JavaScript-Load-Image/blob/1.14.0/js/load-image-orientation.js#L52-L89
    switch (orientation) {
      case 2:
        context.translate(image.width, 0);
        context.scale(-1, 1);
        break;
      case 3:
        context.translate(image.width, image.height);
        context.rotate(180 * Math.PI / 180);
        break;
      case 4:
        context.translate(0, image.height);
        context.scale(1, -1);
        break;
      case 5:
        context.rotate(90 * Math.PI / 180);
        context.scale(1, -1);
        break;
      case 6:
        context.rotate(90 * Math.PI / 180);
        context.translate(0, -image.height);
        break;
      case 7:
        context.rotate(90 * Math.PI / 180);
        context.translate(image.width, -image.height);
        context.scale(-1, 1);
        break;
      case 8:
        context.rotate(-90 * Math.PI / 180);
        context.translate(-image.width, 0);
        break;
    }

    context.drawImage(image, 0, 0);
    context.restore();
    context = null;

    return canvas;
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
