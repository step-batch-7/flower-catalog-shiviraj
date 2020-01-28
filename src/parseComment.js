const decodeValue = function(value) {
  value = value.replace(/\+/g, ' ');
  return decodeURIComponent(value);
};

const pickupParams = function(query, keyValue) {
  const [key, value] = keyValue.split('=');
  query[key] = decodeValue(value);
  return query;
};

const parseText = function(keyValueTextPairs) {
  const keyValuePairs = keyValueTextPairs.split('&');
  return keyValuePairs.reduce(pickupParams, {});
};

module.exports = {parseText};
