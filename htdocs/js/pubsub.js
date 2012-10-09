/**
 * @author  Valeriy Vasin (invis89@gmail.com)
 *
 * @description Simple observer based on jQuery callbacks
 *              Add publish/subscribe/unsubscribe methods for App object
 */
;(function ($, global) {
  'use strict';

  var PubSub = {},
      App = global.App || {};

  /**
   * Subscription
   * @param  {String}   type Type
   * @param  {Function} fn   Function to subscribe
   */
  App.subscribe = function (type, fn) {
    PubSub[type] = PubSub[type] || $.Callbacks();
    PubSub[type].add(fn);
  };

  /**
   * Publish
   * @param  {String} type Event type
   * @param  {*} data      Event data to publish
   */
  App.publish = function (type, data) {
    if (arguments.length > 2) {
      throw new Error("Arguments amount should be less or equal than 2");
    }
    if (PubSub[type]) {
      PubSub[type].fire(data);
    }
  };

  /**
   * Unsubscribe function from event
   * @param  {String}   type Event type
   * @param  {Function} fn   Function to be unsubscribed
   */
  App.unsubscribe = function (type, fn) {
    if (PubSub[type]) {
      PubSub[type].remove(fn);
    }
  };
}(jQuery, this));
