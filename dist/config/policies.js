'use strict';

module.exports.policies = {
  AuthController: {
    '*': ['passport']
  }
};