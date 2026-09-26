function integer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(values) { return values?.length ? values[integer(0, values.length - 1)] : null; }
module.exports = { integer, pick };
