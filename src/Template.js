// @ts-check

/**
 * @typedef {import('./typing').ITemplate} ITemplate
 * @typedef {import('./typing').TemplateArguments} TemplateArguments
 * @typedef {import('./typing').TemplateFunction} TemplateFunction
 */

/**
 * Generates string from template.
 * @template {TemplateArguments} T
 * @implements {ITemplate}
 */
class Template {
  /**
   * Generates string.
   * @type {TemplateFunction}
   * @private
   */
  func;

  /**
   * @param {TemplateFunction} func
   */
  constructor(func) {
    this.func = func;
    this.validate();
  }

  /**
   * @param {T} args
   * @throws {TypeError} When args isn't a map object.
   */
  generate(args) {
    if (!args || typeof args !== 'object') {
      throw new TypeError('args must be a map object');
    }
    return this.func(args);
  }

  /**
   * Validates properties of a class instance.
   * @private
   * @throws {TypeError} When some properties has incorrect type.
   */
  validate() {
    if (typeof this.func !== 'function') {
      throw new TypeError('func must be a function');
    }
  }
}

module.exports = Template;
