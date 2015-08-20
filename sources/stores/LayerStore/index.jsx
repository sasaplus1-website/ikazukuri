import { EventEmitter } from 'events';

import React from 'react';
import keymirror from 'keymirror';

import assign from 'lodash.assign';
import uniqueId from 'lodash.uniqueid';

import dispatcher from '../../dispatcher';

import { ActionTypes as LayerActionTypes } from '../../constants/LayerConstants';

let events = keymirror({
  update: null,
});

class LayerStore extends EventEmitter {

  presets = require('./layer.yml');

  layers = [];

  dispatchToken = dispatcher.register(this.handleDispatch.bind(this));

  handleDispatch(action) {
    log('LayerStore#handleDispatch', action);

    switch (action.type) {
      case LayerActionTypes.LAYER_ADD:
        log(LayerActionTypes.LAYER_ADD);
        this.addLayer();
        this.emitUpdateLayer();
        break;
      case LayerActionTypes.LAYER_REMOVE:
        log(LayerActionTypes.LAYER_UPDATE);
        this.removeLayer(action.layer);
        this.emitUpdateLayer();
        break;
      case LayerActionTypes.LAYER_UPDATE:
        log(LayerActionTypes.LAYER_UPDATE);
        this.updateLayer(action.layer);
        this.emitUpdateLayer();
        break;
    }
  }

  //----------------------------------------------------------------------------

  addLayer() {
    log('LayerStore#addLayer');

    let id = parseInt(uniqueId(), 10),
        index = Math.floor(Math.random() * this.presets.length),
        preset = this.presets[index];

    this.layers.push(assign({
      id,
      order: id,
      size: Math.floor(Math.random() * 80) + 20,
      x: Math.floor(Math.random() * 800) + 40,
      y: Math.floor(Math.random() * 850) + 20,
      style: 'fill',
    }, preset));
  }

  removeLayer(layer) {
    log('LayerStore#removeLayer', layer);

    for (let i = 0, len = this.layers.length; i < len; ++i) {
      if (this.layers[i].id === layer.id) {
        this.layers[i] = null;
        this.layers.splice(i, 1);
        break;
      }
    }
  }

  updateLayer(layer) {
    log('LayerStore#updateLayer', layer);

    for (let i = 0, len = this.layers.length; i < len; ++i) {
      if (this.layers[i].id === layer.id) {
        this.layers[i] = null;
        this.layers[i] = layer;
        break;
      }
    }
  }

  //----------------------------------------------------------------------------

  getLayers() {
    log('LayerStore#getLayers');

    return this.layers;
  }

  //----------------------------------------------------------------------------

  emitUpdateLayer() {
    this.emit(events.update);
  }

  addUpdateLayerListener(callback) {
    this.on(events.update, callback);
  }

  removeUpdateLayerListener(callback) {
    this.removeListener(events.update, callback);
  }

}

export default new LayerStore();
