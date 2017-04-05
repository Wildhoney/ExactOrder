import path    from 'object-path';
import Symbol  from 'es6-symbol';
import Bicycle from 'bi-cycle';

/**
 * @constant head
 * @type {Symbol}
 */
export const head = Symbol('set-order/head');

/**
 * @constant tail
 * @type {Symbol}
 */
export const tail = Symbol('set-order/tail');

/**
 * @method isHead
 * @param {Object} x
 * @return {Boolean}
 */
const isHead = x => x.position === head || !x.position;

/**
 * @method isTail
 * @param {Object} x
 * @return {Boolean}
 */
const isTail = x => x.position === tail;

/**
 * @method transform
 * @param {*} x
 * @return {Object}
 */
const transform = x => 'value' in Object(x) ? x : { value: x };

/**
 * @method exact
 * @param {Array} order
 * @param {Function} [sort = () => 0]
 * @return {Function}
 */
export const exact = (order, sort = () => 0) => {

    const { previous } = Bicycle({ start: -1 });
    const { next }     = Bicycle({ start: 0 });

    const heads = order.map(transform).filter(isHead).reverse().reduce((xss, x) => [...xss, { ...x, index: previous() }], []);
    const tails = order.map(transform).filter(isTail).reduce((xss, x)           => [...xss, { ...x, index: next()     }], []);
    const seq   = [...heads, ...tails];

    return (a, b) => {

        const [firstIndex, secondIndex] = [
            (seq.find(x => x.value === path.get(a, x.property)) || { index: -1 }).index,
            (seq.find(x => x.value === path.get(b, x.property)) || { index: -1 }).index,
        ];

        return firstIndex === -1 && secondIndex === -1 ? sort(a, b) : firstIndex - secondIndex;

    };

};
