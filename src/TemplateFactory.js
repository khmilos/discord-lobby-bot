// @ts-check

/**
 * @typedef {import('./typing').ITemplateFactory} ITemplateFactory
 */

const Template = require('./Template');

/**
 * Creates Template instance from template string.
 * @implements {ITemplateFactory}
 */
class TemplateFactory {
  /**
   * Regular expression for search arguments inside template string.
   * @type {RegExp}
   * @private
   */
  reg;

  /**
   * Arguments of function.
   * @type {string}
   * @private
   */
  args;

  constructor() {
    this.reg = /{index}|{limit}|{current}|{left}|{tag}|{link}/g;
    this.args = '{ index, limit, current, left, tag, link }';
  }

  /**
   * @param {string} template Template string.
   * @example
   * template = 'Lobby #{index} {current}/{limit}. Needed {left}'
   */
  create(template) {
    if (typeof template !== 'string') {
      throw new TypeError('template must be a string');
    }

    const templateJS = template.replace(this.reg, (substr) => `$${substr}`);
    const body = `return \`${templateJS}\``;
    const func = new Function(this.args, body);
    // @ts-ignore
    return new Template(func);
  }
}

module.exports = TemplateFactory;
