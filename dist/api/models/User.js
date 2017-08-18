'use strict';

var _ = require('lodash');
var crypto = require('crypto');

/** @module User */

var User = {
  attributes: {
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    email: {
      type: 'string',
      isEmail: true,
      unique: true,
      required: true
    },
    passports: {
      collection: 'Passport',
      via: 'user'
    }
  },

  beforeCreate: function beforeCreate(user, next) {
    if (_.isEmpty(user.username)) {
      user.username = user.email;
    }
    next();
  },

  /**
   * Register a new User with a passport
   */
  register: function register(user) {
    return new Promise(function (resolve, reject) {
      sails.services.passport.protocols.local.createUser(user, function (error, created) {
        if (error) return reject(error);

        resolve(created);
      });
    });
  },

  getGravatarUrl: function getGravatarUrl(user) {
    var md5 = crypto.createHash('md5');
    md5.update(user.email || '');
    return 'https://gravatar.com/avatar/' + md5.digest('hex');
  },

  customToJSON: function customToJSON() {
    var user = _.omit(this, ['password']);
    user.gravatarUrl = User.getGravatarUrl(user);
    return user;
  }
};

module.exports = User;