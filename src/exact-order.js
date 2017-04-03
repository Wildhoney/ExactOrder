import path from 'object-path';

/**
 * @method byPrimitive
 * @param {Array} order
 * @return {Function}
 */
const byPrimitive = order => (a, b) => {
    const [firstIndex, secondIndex] = [order.indexOf(a), order.indexOf(b)];
    return firstIndex > secondIndex;
};

/**
 * @method byNested
 * @param {Object} order
 * @return {Function}
 */
const byNested = order => {

    const keys = Object.keys(order);

    return function sort(a, b, index = 0) {

        const key = keys[index];

        const [firstIndex, secondIndex] = [
            order[key].findIndex(x => x === path.get(a, key)),
            order[key].findIndex(x => x === path.get(b, key))
        ];

        return firstIndex === secondIndex && keys[index + 1] ? sort(a, b, index + 1) : firstIndex > secondIndex;

    };

};

/**
 * @param {Array|Object} order
 * @return {Function}
 */
export default order => Array.isArray(order) ? byPrimitive(order) : byNested(order);
