'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
	Copyright 2015 Axinom
	Copyright 2011-2013 Abdulla Abdurakhmanov
	Original sources are available at https://code.google.com/p/x2js/
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	http://www.apache.org/licenses/LICENSE-2.0
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

/*
	Supported export methods:
	* AMD
	* <script> (window.X2JS)
	* Node.js
	Limitations:
	* Attribute namespace prefixes are not parsed as such.
	* Overall the serialization/deserializaton code is "best effort" and not foolproof.
*/

// Module definition pattern used is returnExports from https://github.com/umdjs/umd
(function (root, factory) {
	"use strict";

	/* global define */

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but only CommonJS-like
		// environments that support module.exports, like Node.
		module.exports = factory(require('./../npm/xmldom/dom-parser.js').DOMParser);
	} else {
		// Browser globals (root is window)
		root.X2JS = factory();
	}
})(undefined, function (CustomDOMParser) {
	"use strict";

	// We return a constructor that can be used to make X2JS instances.

	return function X2JS(config) {
		var VERSION = "3.1.1";

		config = config || {};

		function initConfigDefaults() {
			// If set to "property" then <element>_asArray will be created
			// to allow you to access any element as an array (even if there is only one of it).
			config.arrayAccessForm = config.arrayAccessForm || "none";

			// If "text" then <empty></empty> will be transformed to "".
			// If "object" then <empty></empty> will be transformed to {}.
			config.emptyNodeForm = config.emptyNodeForm || "text";

			// Allows attribute values to be converted on the fly during parsing to objects.
			// 	"test": function(name, value) { return true; }
			//	"convert": function(name, value) { return parseFloat(value);
			// convert() will be called for every attribute where test() returns true
			// and the return value from convert() will replace the original value of the attribute.
			config.attributeConverters = config.attributeConverters || [];

			// Any elements that match the paths here will have their text parsed
			// as an XML datetime value (2011-11-12T13:00:00-07:00 style).
			// The path can be a plain string (parent.child1.child2),
			// a regex (/.*\.child2/) or function(elementPath).
			config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];

			// Any elements that match the paths listed here will be stored in JavaScript objects
			// as arrays even if there is only one of them. The path can be a plain string
			// (parent.child1.child2), a regex (/.*\.child2/) or function(elementName, elementPath).
			config.arrayAccessFormPaths = config.arrayAccessFormPaths || [];

			// If true, a toString function is generated to print nodes containing text or cdata.
			// Useful if you want to accept both plain text and CData as equivalent inputs.
			if (config.enableToStringFunc === undefined) {
				config.enableToStringFunc = true;
			}

			// If true, empty text tags are ignored for elements with child nodes.
			if (config.skipEmptyTextNodesForObj === undefined) {
				config.skipEmptyTextNodesForObj = true;
			}

			// If true, whitespace is trimmed from text nodes.
			if (config.stripWhitespaces === undefined) {
				config.stripWhitespaces = true;
			}

			// If true, double quotes are used in generated XML.
			if (config.useDoubleQuotes === undefined) {
				config.useDoubleQuotes = true;
			}

			// If true, the root element of the XML document is ignored when converting to objects.
			// The result will directly have the root element's children as its own properties.
			if (config.ignoreRoot === undefined) {
				config.ignoreRoot = false;
			}

			// Whether XML characters in text are escaped when reading/writing XML.
			if (config.escapeMode === undefined) {
				config.escapeMode = true;
			}

			// Prefix to use for properties that are created to represent XML attributes.
			if (config.attributePrefix === undefined) {
				config.attributePrefix = "_";
			}

			// If true, empty elements will created as self closing elements (<element />)
			// If false, empty elements will be created with start and end tags (<element></element>)
			if (config.selfClosingElements === undefined) {
				config.selfClosingElements = true;
			}

			// If this property defined as false and an XML element has CData node ONLY, it will be converted to text without additional property "__cdata"
			if (config.keepCData === undefined) {
				config.keepCData = false;
			}
		}

		function initRequiredPolyfills() {
			function pad(number) {
				var r = String(number);
				if (r.length === 1) {
					r = '0' + r;
				}
				return r;
			}
			// Hello IE8-
			if (typeof String.prototype.trim !== 'function') {
				String.prototype.trim = function trim() {
					return this.replace(/^\s+|^\n+|(\s|\n)+$/g, '');
				};
			}
			if (typeof Date.prototype.toISOString !== 'function') {
				// Implementation from http://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript
				Date.prototype.toISOString = function toISOString() {
					var MS_IN_S = 1000;

					return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-' + pad(this.getUTCDate()) + 'T' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds()) + '.' + String((this.getUTCMilliseconds() / MS_IN_S).toFixed(3)).slice(2, 5) + 'Z';
				};
			}
		}

		initConfigDefaults();
		initRequiredPolyfills();

		var DOMNodeTypes = {
			"ELEMENT_NODE": 1,
			"TEXT_NODE": 3,
			"CDATA_SECTION_NODE": 4,
			"COMMENT_NODE": 8,
			"DOCUMENT_NODE": 9
		};

		function getDomNodeLocalName(domNode) {
			var localName = domNode.localName;
			if (localName == null) {
				// Yeah, this is IE!!
				localName = domNode.baseName;
			}
			if (localName == null || localName === "") {
				// ==="" is IE too
				localName = domNode.nodeName;
			}
			return localName;
		}

		function getDomNodeNamespacePrefix(node) {
			return node.prefix;
		}

		function escapeXmlChars(str) {
			if (typeof str === "string") return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');else return str;
		}

		function unescapeXmlChars(str) {
			return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
		}

		function ensureProperArrayAccessForm(element, childName, elementPath) {
			switch (config.arrayAccessForm) {
				case "property":
					if (!(element[childName] instanceof Array)) element[childName + "_asArray"] = [element[childName]];else element[childName + "_asArray"] = element[childName];
					break;
			}

			if (!(element[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
				var match = false;

				for (var i = 0; i < config.arrayAccessFormPaths.length; i++) {
					var arrayPath = config.arrayAccessFormPaths[i];
					if (typeof arrayPath === "string") {
						if (arrayPath === elementPath) {
							match = true;
							break;
						}
					} else if (arrayPath instanceof RegExp) {
						if (arrayPath.test(elementPath)) {
							match = true;
							break;
						}
					} else if (typeof arrayPath === "function") {
						if (arrayPath(childName, elementPath)) {
							match = true;
							break;
						}
					}
				}

				if (match) element[childName] = [element[childName]];
			}
		}

		function xmlDateTimeToDate(prop) {
			// Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
			// Improved to support full spec and optional parts
			var MINUTES_PER_HOUR = 60;

			var bits = prop.split(/[-T:+Z]/g);

			var d = new Date(bits[0], bits[1] - 1, bits[2]);
			var secondBits = bits[5].split("\.");
			d.setHours(bits[3], bits[4], secondBits[0]);
			if (secondBits.length > 1) d.setMilliseconds(secondBits[1]);

			// Get supplied time zone offset in minutes
			if (bits[6] && bits[7]) {
				var offsetMinutes = bits[6] * MINUTES_PER_HOUR + Number(bits[7]);
				var sign = /\d\d-\d\d:\d\d$/.test(prop) ? '-' : '+';

				// Apply the sign
				offsetMinutes = 0 + (sign === '-' ? -1 * offsetMinutes : offsetMinutes);

				// Apply offset and local timezone
				d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
			} else if (prop.indexOf("Z", prop.length - 1) !== -1) {
				d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
			}

			// d is now a local time equivalent to the supplied time
			return d;
		}

		function convertToDateIfRequired(value, childName, fullPath) {
			if (config.datetimeAccessFormPaths.length > 0) {
				var pathWithoutTextNode = fullPath.split("\.#")[0];

				for (var i = 0; i < config.datetimeAccessFormPaths.length; i++) {
					var candidatePath = config.datetimeAccessFormPaths[i];
					if (typeof candidatePath === "string") {
						if (candidatePath === pathWithoutTextNode) return xmlDateTimeToDate(value);
					} else if (candidatePath instanceof RegExp) {
						if (candidatePath.test(pathWithoutTextNode)) return xmlDateTimeToDate(value);
					} else if (typeof candidatePath === "function") {
						if (candidatePath(pathWithoutTextNode)) return xmlDateTimeToDate(value);
					}
				}
			}

			return value;
		}

		function deserializeRootElementChildren(rootElement) {
			var result = {};
			var children = rootElement.childNodes;

			// Alternative for firstElementChild which is not supported in some environments
			for (var i = 0; i < children.length; i++) {
				var child = children.item(i);
				if (child.nodeType === DOMNodeTypes.ELEMENT_NODE) {
					var childName = getDomNodeLocalName(child);

					if (config.ignoreRoot) result = deserializeDomChildren(child, childName);else result[childName] = deserializeDomChildren(child, childName);
				}
			}

			return result;
		}

		function deserializeElementChildren(element, elementPath) {
			var result = {};
			result.__cnt = 0;

			var nodeChildren = element.childNodes;

			// Child nodes.
			for (var iChild = 0; iChild < nodeChildren.length; iChild++) {
				var child = nodeChildren.item(iChild);
				var childName = getDomNodeLocalName(child);

				if (child.nodeType === DOMNodeTypes.COMMENT_NODE) continue;

				result.__cnt++;

				// We deliberately do not accept everything falsey here because
				// elements that resolve to empty string should still be preserved.
				if (result[childName] == null) {
					result[childName] = deserializeDomChildren(child, elementPath + "." + childName);
					ensureProperArrayAccessForm(result, childName, elementPath + "." + childName);
				} else {
					if (!(result[childName] instanceof Array)) {
						result[childName] = [result[childName]];
						ensureProperArrayAccessForm(result, childName, elementPath + "." + childName);
					}

					result[childName][result[childName].length] = deserializeDomChildren(child, elementPath + "." + childName);
				}
			}

			// Attributes
			for (var iAttribute = 0; iAttribute < element.attributes.length; iAttribute++) {
				var attribute = element.attributes.item(iAttribute);
				result.__cnt++;

				var adjustedValue = attribute.value;
				for (var iConverter = 0; iConverter < config.attributeConverters.length; iConverter++) {
					var converter = config.attributeConverters[iConverter];
					if (converter.test.call(null, attribute.name, attribute.value)) adjustedValue = converter.convert.call(null, attribute.name, attribute.value);
				}

				result[config.attributePrefix + attribute.name] = adjustedValue;
			}

			// Node namespace prefix
			var namespacePrefix = getDomNodeNamespacePrefix(element);
			if (namespacePrefix) {
				result.__cnt++;
				result.__prefix = namespacePrefix;
			}

			if (result["#text"]) {
				result.__text = result["#text"];

				if (result.__text instanceof Array) {
					result.__text = result.__text.join("\n");
				}

				if (config.escapeMode) result.__text = unescapeXmlChars(result.__text);

				if (config.stripWhitespaces) result.__text = result.__text.trim();

				delete result["#text"];

				if (config.arrayAccessForm === "property") delete result["#text_asArray"];

				result.__text = convertToDateIfRequired(result.__text, "#text", elementPath + ".#text");
			}

			if (result.hasOwnProperty('#cdata-section')) {
				result.__cdata = result["#cdata-section"];
				delete result["#cdata-section"];

				if (config.arrayAccessForm === "property") delete result["#cdata-section_asArray"];
			}

			if (result.__cnt === 1 && result.__text) {
				result = result.__text;
			} else if (result.__cnt === 0 && config.emptyNodeForm === "text") {
				result = '';
			} else if (result.__cnt > 1 && result.__text !== undefined && config.skipEmptyTextNodesForObj) {
				if (config.stripWhitespaces && result.__text === "" || result.__text.trim() === "") {
					delete result.__text;
				}
			}
			delete result.__cnt;

			if (!config.keepCData && !result.hasOwnProperty('__text') && result.hasOwnProperty('__cdata')) {
				return result.__cdata ? result.__cdata : '';
			}

			if (config.enableToStringFunc && (result.__text || result.__cdata)) {
				result.toString = function toString() {
					return (this.__text ? this.__text : '') + (this.__cdata ? this.__cdata : '');
				};
			}

			return result;
		}

		function deserializeDomChildren(node, parentPath) {
			if (node.nodeType === DOMNodeTypes.DOCUMENT_NODE) {
				return deserializeRootElementChildren(node);
			} else if (node.nodeType === DOMNodeTypes.ELEMENT_NODE) {
				return deserializeElementChildren(node, parentPath);
			} else if (node.nodeType === DOMNodeTypes.TEXT_NODE || node.nodeType === DOMNodeTypes.CDATA_SECTION_NODE) {
				return node.nodeValue;
			} else {
				return null;
			}
		}

		function serializeStartTag(jsObject, elementName, attributeNames, selfClosing) {
			var resultStr = "<" + (jsObject && jsObject.__prefix ? jsObject.__prefix + ":" : "") + elementName;

			if (attributeNames) {
				for (var i = 0; i < attributeNames.length; i++) {
					var attributeName = attributeNames[i];
					var attributeValue = jsObject[attributeName];

					if (config.escapeMode) attributeValue = escapeXmlChars(attributeValue);

					resultStr += " " + attributeName.substr(config.attributePrefix.length) + "=";

					if (config.useDoubleQuotes) resultStr += '"' + attributeValue + '"';else resultStr += "'" + attributeValue + "'";
				}
			}

			if (!selfClosing) resultStr += ">";else resultStr += " />";

			return resultStr;
		}

		function serializeEndTag(jsObject, elementName) {
			return "</" + (jsObject && jsObject.__prefix ? jsObject.__prefix + ":" : "") + elementName + ">";
		}

		function endsWith(str, suffix) {
			return str.indexOf(suffix, str.length - suffix.length) !== -1;
		}

		function isSpecialProperty(jsonObj, propertyName) {
			if (config.arrayAccessForm === "property" && endsWith(propertyName.toString(), "_asArray") || propertyName.toString().indexOf(config.attributePrefix) === 0 || propertyName.toString().indexOf("__") === 0 || jsonObj[propertyName] instanceof Function) return true;else return false;
		}

		function getDataElementCount(jsObject) {
			var count = 0;

			if (jsObject instanceof Object) {
				for (var propertyName in jsObject) {
					if (isSpecialProperty(jsObject, propertyName)) continue;

					count++;
				}
			}

			return count;
		}

		function getDataAttributeNames(jsObject) {
			var names = [];

			if (jsObject instanceof Object) {
				for (var attributeName in jsObject) {
					if (attributeName.toString().indexOf("__") === -1 && attributeName.toString().indexOf(config.attributePrefix) === 0) {
						names.push(attributeName);
					}
				}
			}

			return names;
		}

		function serializeComplexTextNodeContents(textNode) {
			var result = "";

			if (textNode.__cdata) {
				result += "<![CDATA[" + textNode.__cdata + "]]>";
			}

			if (textNode.__text) {
				if (config.escapeMode) result += escapeXmlChars(textNode.__text);else result += textNode.__text;
			}

			return result;
		}

		function serializeTextNodeContents(textNode) {
			var result = "";

			if (textNode instanceof Object) {
				result += serializeComplexTextNodeContents(textNode);
			} else if (textNode !== null) {
				if (config.escapeMode) result += escapeXmlChars(textNode);else result += textNode;
			}

			return result;
		}

		function serializeArray(elementArray, elementName, attributes) {
			var result = "";

			if (elementArray.length === 0) {
				result += serializeStartTag(elementArray, elementName, attributes, true);
			} else {
				for (var i = 0; i < elementArray.length; i++) {
					result += serializeJavaScriptObject(elementArray[i], elementName, getDataAttributeNames(elementArray[i]));
				}
			}

			return result;
		}

		function serializeJavaScriptObject(element, elementName, attributes) {
			var result = "";

			if ((element === undefined || element === null || element === '') && config.selfClosingElements) {
				result += serializeStartTag(element, elementName, attributes, true);
			} else if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object') {
				if (Object.prototype.toString.call(element) === '[object Array]') {
					result += serializeArray(element, elementName, attributes);
				} else if (element instanceof Date) {
					result += serializeStartTag(element, elementName, attributes, false);
					result += element.toISOString();
					result += serializeEndTag(element, elementName);
				} else {
					var childElementCount = getDataElementCount(element);
					if (childElementCount > 0 || element.__text || element.__cdata) {
						result += serializeStartTag(element, elementName, attributes, false);
						result += serializeJavaScriptObjectChildren(element);
						result += serializeEndTag(element, elementName);
					} else if (config.selfClosingElements) {
						result += serializeStartTag(element, elementName, attributes, true);
					} else {
						result += serializeStartTag(element, elementName, attributes, false);
						result += serializeEndTag(element, elementName);
					}
				}
			} else {
				result += serializeStartTag(element, elementName, attributes, false);
				result += serializeTextNodeContents(element);
				result += serializeEndTag(element, elementName);
			}

			return result;
		}

		function serializeJavaScriptObjectChildren(jsObject) {
			var result = "";

			var elementCount = getDataElementCount(jsObject);

			if (elementCount > 0) {
				for (var elementName in jsObject) {
					if (isSpecialProperty(jsObject, elementName)) continue;

					var element = jsObject[elementName];
					var attributes = getDataAttributeNames(element);

					result += serializeJavaScriptObject(element, elementName, attributes);
				}
			}

			result += serializeTextNodeContents(jsObject);

			return result;
		}

		function parseXml(xml) {
			if (xml === undefined) {
				return null;
			}

			if (typeof xml !== "string") {
				return null;
			}

			var parser = null;
			var domNode = null;

			if (CustomDOMParser) {
				// This branch is used for node.js, with the xmldom parser.
				parser = new CustomDOMParser();

				domNode = parser.parseFromString(xml, "text/xml");
			} else if (window && window.DOMParser) {
				parser = new window.DOMParser();
				var parsererrorNS = null;

				var isIEParser = window.ActiveXObject || "ActiveXObject" in window;

				// IE9+ now is here
				if (!isIEParser) {
					try {
						parsererrorNS = parser.parseFromString("INVALID", "text/xml").childNodes[0].namespaceURI;
					} catch (err) {
						parsererrorNS = null;
					}
				}

				try {
					domNode = parser.parseFromString(xml, "text/xml");
					if (parsererrorNS !== null && domNode.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
						domNode = null;
					}
				} catch (err) {
					domNode = null;
				}
			} else {
				// IE :(
				if (xml.indexOf("<?") === 0) {
					xml = xml.substr(xml.indexOf("?>") + 2);
				}

				/* global ActiveXObject */
				domNode = new ActiveXObject("Microsoft.XMLDOM");
				domNode.async = "false";
				domNode.loadXML(xml);
			}

			return domNode;
		}

		this.asArray = function asArray(prop) {
			if (prop === undefined || prop === null) {
				return [];
			} else if (prop instanceof Array) {
				return prop;
			} else {
				return [prop];
			}
		};

		this.toXmlDateTime = function toXmlDateTime(dt) {
			if (dt instanceof Date) {
				return dt.toISOString();
			} else if (typeof dt === 'number') {
				return new Date(dt).toISOString();
			} else {
				return null;
			}
		};

		this.asDateTime = function asDateTime(prop) {
			if (typeof prop === "string") {
				return xmlDateTimeToDate(prop);
			} else {
				return prop;
			}
		};

		/*
  	Internally the logic works in a cycle:
  	DOM->JS - implemented by custom logic (deserialization).
  	JS->XML - implemented by custom logic (serialization).
  	XML->DOM - implemented by browser.
  */

		// Transformns an XML string into DOM-tree
		this.xml2dom = function xml2dom(xml) {
			return parseXml(xml);
		};

		// Transforms a DOM tree to JavaScript objects.
		this.dom2js = function dom2js(domNode) {
			return deserializeDomChildren(domNode, null);
		};

		// Transforms JavaScript objects to a DOM tree.
		this.js2dom = function js2dom(jsObject) {
			var xml = this.js2xml(jsObject);
			return parseXml(xml);
		};

		// Transformns an XML string into JavaScript objects.
		this.xml2js = function xml2js(xml) {
			var domNode = parseXml(xml);
			if (domNode != null) return this.dom2js(domNode);else return null;
		};

		// Transforms JavaScript objects into an XML string.
		this.js2xml = function js2xml(jsObject) {
			return serializeJavaScriptObjectChildren(jsObject);
		};

		this.getVersion = function getVersion() {
			return VERSION;
		};
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIngyanMuanMiXSwibmFtZXMiOlsicm9vdCIsImZhY3RvcnkiLCJkZWZpbmUiLCJhbWQiLCJtb2R1bGUiLCJleHBvcnRzIiwicmVxdWlyZSIsIkRPTVBhcnNlciIsIlgySlMiLCJDdXN0b21ET01QYXJzZXIiLCJjb25maWciLCJWRVJTSU9OIiwiaW5pdENvbmZpZ0RlZmF1bHRzIiwiYXJyYXlBY2Nlc3NGb3JtIiwiZW1wdHlOb2RlRm9ybSIsImF0dHJpYnV0ZUNvbnZlcnRlcnMiLCJkYXRldGltZUFjY2Vzc0Zvcm1QYXRocyIsImFycmF5QWNjZXNzRm9ybVBhdGhzIiwiZW5hYmxlVG9TdHJpbmdGdW5jIiwidW5kZWZpbmVkIiwic2tpcEVtcHR5VGV4dE5vZGVzRm9yT2JqIiwic3RyaXBXaGl0ZXNwYWNlcyIsInVzZURvdWJsZVF1b3RlcyIsImlnbm9yZVJvb3QiLCJlc2NhcGVNb2RlIiwiYXR0cmlidXRlUHJlZml4Iiwic2VsZkNsb3NpbmdFbGVtZW50cyIsImtlZXBDRGF0YSIsImluaXRSZXF1aXJlZFBvbHlmaWxscyIsInBhZCIsIm51bWJlciIsInIiLCJTdHJpbmciLCJsZW5ndGgiLCJwcm90b3R5cGUiLCJ0cmltIiwicmVwbGFjZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsIk1TX0lOX1MiLCJnZXRVVENGdWxsWWVhciIsImdldFVUQ01vbnRoIiwiZ2V0VVRDRGF0ZSIsImdldFVUQ0hvdXJzIiwiZ2V0VVRDTWludXRlcyIsImdldFVUQ1NlY29uZHMiLCJnZXRVVENNaWxsaXNlY29uZHMiLCJ0b0ZpeGVkIiwic2xpY2UiLCJET01Ob2RlVHlwZXMiLCJnZXREb21Ob2RlTG9jYWxOYW1lIiwiZG9tTm9kZSIsImxvY2FsTmFtZSIsImJhc2VOYW1lIiwibm9kZU5hbWUiLCJnZXREb21Ob2RlTmFtZXNwYWNlUHJlZml4Iiwibm9kZSIsInByZWZpeCIsImVzY2FwZVhtbENoYXJzIiwic3RyIiwidW5lc2NhcGVYbWxDaGFycyIsImVuc3VyZVByb3BlckFycmF5QWNjZXNzRm9ybSIsImVsZW1lbnQiLCJjaGlsZE5hbWUiLCJlbGVtZW50UGF0aCIsIkFycmF5IiwibWF0Y2giLCJpIiwiYXJyYXlQYXRoIiwiUmVnRXhwIiwidGVzdCIsInhtbERhdGVUaW1lVG9EYXRlIiwicHJvcCIsIk1JTlVURVNfUEVSX0hPVVIiLCJiaXRzIiwic3BsaXQiLCJkIiwic2Vjb25kQml0cyIsInNldEhvdXJzIiwic2V0TWlsbGlzZWNvbmRzIiwib2Zmc2V0TWludXRlcyIsIk51bWJlciIsInNpZ24iLCJzZXRNaW51dGVzIiwiZ2V0TWludXRlcyIsImdldFRpbWV6b25lT2Zmc2V0IiwiaW5kZXhPZiIsIlVUQyIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRTZWNvbmRzIiwiZ2V0TWlsbGlzZWNvbmRzIiwiY29udmVydFRvRGF0ZUlmUmVxdWlyZWQiLCJ2YWx1ZSIsImZ1bGxQYXRoIiwicGF0aFdpdGhvdXRUZXh0Tm9kZSIsImNhbmRpZGF0ZVBhdGgiLCJkZXNlcmlhbGl6ZVJvb3RFbGVtZW50Q2hpbGRyZW4iLCJyb290RWxlbWVudCIsInJlc3VsdCIsImNoaWxkcmVuIiwiY2hpbGROb2RlcyIsImNoaWxkIiwiaXRlbSIsIm5vZGVUeXBlIiwiRUxFTUVOVF9OT0RFIiwiZGVzZXJpYWxpemVEb21DaGlsZHJlbiIsImRlc2VyaWFsaXplRWxlbWVudENoaWxkcmVuIiwiX19jbnQiLCJub2RlQ2hpbGRyZW4iLCJpQ2hpbGQiLCJDT01NRU5UX05PREUiLCJpQXR0cmlidXRlIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZSIsImFkanVzdGVkVmFsdWUiLCJpQ29udmVydGVyIiwiY29udmVydGVyIiwiY2FsbCIsIm5hbWUiLCJjb252ZXJ0IiwibmFtZXNwYWNlUHJlZml4IiwiX19wcmVmaXgiLCJfX3RleHQiLCJqb2luIiwiaGFzT3duUHJvcGVydHkiLCJfX2NkYXRhIiwidG9TdHJpbmciLCJwYXJlbnRQYXRoIiwiRE9DVU1FTlRfTk9ERSIsIlRFWFRfTk9ERSIsIkNEQVRBX1NFQ1RJT05fTk9ERSIsIm5vZGVWYWx1ZSIsInNlcmlhbGl6ZVN0YXJ0VGFnIiwianNPYmplY3QiLCJlbGVtZW50TmFtZSIsImF0dHJpYnV0ZU5hbWVzIiwic2VsZkNsb3NpbmciLCJyZXN1bHRTdHIiLCJhdHRyaWJ1dGVOYW1lIiwiYXR0cmlidXRlVmFsdWUiLCJzdWJzdHIiLCJzZXJpYWxpemVFbmRUYWciLCJlbmRzV2l0aCIsInN1ZmZpeCIsImlzU3BlY2lhbFByb3BlcnR5IiwianNvbk9iaiIsInByb3BlcnR5TmFtZSIsIkZ1bmN0aW9uIiwiZ2V0RGF0YUVsZW1lbnRDb3VudCIsImNvdW50IiwiT2JqZWN0IiwiZ2V0RGF0YUF0dHJpYnV0ZU5hbWVzIiwibmFtZXMiLCJwdXNoIiwic2VyaWFsaXplQ29tcGxleFRleHROb2RlQ29udGVudHMiLCJ0ZXh0Tm9kZSIsInNlcmlhbGl6ZVRleHROb2RlQ29udGVudHMiLCJzZXJpYWxpemVBcnJheSIsImVsZW1lbnRBcnJheSIsInNlcmlhbGl6ZUphdmFTY3JpcHRPYmplY3QiLCJjaGlsZEVsZW1lbnRDb3VudCIsInNlcmlhbGl6ZUphdmFTY3JpcHRPYmplY3RDaGlsZHJlbiIsImVsZW1lbnRDb3VudCIsInBhcnNlWG1sIiwieG1sIiwicGFyc2VyIiwicGFyc2VGcm9tU3RyaW5nIiwid2luZG93IiwicGFyc2VyZXJyb3JOUyIsImlzSUVQYXJzZXIiLCJBY3RpdmVYT2JqZWN0IiwibmFtZXNwYWNlVVJJIiwiZXJyIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWVOUyIsImFzeW5jIiwibG9hZFhNTCIsImFzQXJyYXkiLCJ0b1htbERhdGVUaW1lIiwiZHQiLCJhc0RhdGVUaW1lIiwieG1sMmRvbSIsImRvbTJqcyIsImpzMmRvbSIsImpzMnhtbCIsInhtbDJqcyIsImdldFZlcnNpb24iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7Ozs7Ozs7Ozs7QUFVQTtBQUNBLENBQUMsVUFBVUEsSUFBVixFQUFnQkMsT0FBaEIsRUFB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QUtzSSxNQUFMLEdBQWMsU0FBU0EsTUFBVCxDQUFnQmpELFFBQWhCLEVBQTBCO0FBQ3ZDLE9BQUkrQixNQUFNLEtBQUttQixNQUFMLENBQVlsRCxRQUFaLENBQVY7QUFDQSxVQUFPOEIsU0FBU0MsR0FBVCxDQUFQO0FBQ0EsR0FIRDs7QUFLQTtBQUNBLE9BQUtvQixNQUFMLEdBQWMsU0FBU0EsTUFBVCxDQUFnQnBCLEdBQWhCLEVBQXFCO0FBQ2xDLE9BQUlwSCxVQUFVbUgsU0FBU0MsR0FBVCxDQUFkO0FBQ0EsT0FBSXBILFdBQVcsSUFBZixFQUNDLE9BQU8sS0FBS3FJLE1BQUwsQ0FBWXJJLE9BQVosQ0FBUCxDQURELEtBR0MsT0FBTyxJQUFQO0FBQ0QsR0FORDs7QUFRQTtBQUNBLE9BQUt1SSxNQUFMLEdBQWMsU0FBU0EsTUFBVCxDQUFnQmxELFFBQWhCLEVBQTBCO0FBQ3ZDLFVBQU80QixrQ0FBa0M1QixRQUFsQyxDQUFQO0FBQ0EsR0FGRDs7QUFJQSxPQUFLb0QsVUFBTCxHQUFrQixTQUFTQSxVQUFULEdBQXNCO0FBQ3ZDLFVBQU9qTCxPQUFQO0FBQ0EsR0FGRDtBQUdBLEVBenFCRTtBQTBxQkgsQ0E3ckJEIiwiZmlsZSI6IngyanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXHRDb3B5cmlnaHQgMjAxNSBBeGlub21cblx0Q29weXJpZ2h0IDIwMTEtMjAxMyBBYmR1bGxhIEFiZHVyYWtobWFub3Zcblx0T3JpZ2luYWwgc291cmNlcyBhcmUgYXZhaWxhYmxlIGF0IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AveDJqcy9cblx0TGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcblx0eW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuXHRZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblx0aHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcblx0ZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuXHRXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblx0U2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuXHRsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbi8qXG5cdFN1cHBvcnRlZCBleHBvcnQgbWV0aG9kczpcblx0KiBBTURcblx0KiA8c2NyaXB0PiAod2luZG93LlgySlMpXG5cdCogTm9kZS5qc1xuXHRMaW1pdGF0aW9uczpcblx0KiBBdHRyaWJ1dGUgbmFtZXNwYWNlIHByZWZpeGVzIGFyZSBub3QgcGFyc2VkIGFzIHN1Y2guXG5cdCogT3ZlcmFsbCB0aGUgc2VyaWFsaXphdGlvbi9kZXNlcmlhbGl6YXRvbiBjb2RlIGlzIFwiYmVzdCBlZmZvcnRcIiBhbmQgbm90IGZvb2xwcm9vZi5cbiovXG5cbi8vIE1vZHVsZSBkZWZpbml0aW9uIHBhdHRlcm4gdXNlZCBpcyByZXR1cm5FeHBvcnRzIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZFxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8qIGdsb2JhbCBkZWZpbmUgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dCBvbmx5IENvbW1vbkpTLWxpa2Vcblx0XHQvLyBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLCBsaWtlIE5vZGUuXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwieG1sZG9tXCIpLkRPTVBhcnNlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdC5YMkpTID0gZmFjdG9yeSgpO1xuXHR9XG59KSh0aGlzLCBmdW5jdGlvbiAoQ3VzdG9tRE9NUGFyc2VyKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gV2UgcmV0dXJuIGEgY29uc3RydWN0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byBtYWtlIFgySlMgaW5zdGFuY2VzLlxuICAgIHJldHVybiBmdW5jdGlvbiBYMkpTKGNvbmZpZykge1xuXHRcdHZhciBWRVJTSU9OID0gXCIzLjEuMVwiO1xuXG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdFx0ZnVuY3Rpb24gaW5pdENvbmZpZ0RlZmF1bHRzKCkge1xuXHRcdFx0Ly8gSWYgc2V0IHRvIFwicHJvcGVydHlcIiB0aGVuIDxlbGVtZW50Pl9hc0FycmF5IHdpbGwgYmUgY3JlYXRlZFxuXHRcdFx0Ly8gdG8gYWxsb3cgeW91IHRvIGFjY2VzcyBhbnkgZWxlbWVudCBhcyBhbiBhcnJheSAoZXZlbiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBvZiBpdCkuXG5cdFx0XHRjb25maWcuYXJyYXlBY2Nlc3NGb3JtID0gY29uZmlnLmFycmF5QWNjZXNzRm9ybSB8fCBcIm5vbmVcIjtcblxuXHRcdFx0Ly8gSWYgXCJ0ZXh0XCIgdGhlbiA8ZW1wdHk+PC9lbXB0eT4gd2lsbCBiZSB0cmFuc2Zvcm1lZCB0byBcIlwiLlxuXHRcdFx0Ly8gSWYgXCJvYmplY3RcIiB0aGVuIDxlbXB0eT48L2VtcHR5PiB3aWxsIGJlIHRyYW5zZm9ybWVkIHRvIHt9LlxuXHRcdFx0Y29uZmlnLmVtcHR5Tm9kZUZvcm0gPSBjb25maWcuZW1wdHlOb2RlRm9ybSB8fCBcInRleHRcIjtcblxuXHRcdFx0Ly8gQWxsb3dzIGF0dHJpYnV0ZSB2YWx1ZXMgdG8gYmUgY29udmVydGVkIG9uIHRoZSBmbHkgZHVyaW5nIHBhcnNpbmcgdG8gb2JqZWN0cy5cblx0XHRcdC8vIFx0XCJ0ZXN0XCI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7IHJldHVybiB0cnVlOyB9XG5cdFx0XHQvL1x0XCJjb252ZXJ0XCI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7IHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKTtcblx0XHRcdC8vIGNvbnZlcnQoKSB3aWxsIGJlIGNhbGxlZCBmb3IgZXZlcnkgYXR0cmlidXRlIHdoZXJlIHRlc3QoKSByZXR1cm5zIHRydWVcblx0XHRcdC8vIGFuZCB0aGUgcmV0dXJuIHZhbHVlIGZyb20gY29udmVydCgpIHdpbGwgcmVwbGFjZSB0aGUgb3JpZ2luYWwgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZS5cblx0XHRcdGNvbmZpZy5hdHRyaWJ1dGVDb252ZXJ0ZXJzID0gY29uZmlnLmF0dHJpYnV0ZUNvbnZlcnRlcnMgfHwgW107XG5cblx0XHRcdC8vIEFueSBlbGVtZW50cyB0aGF0IG1hdGNoIHRoZSBwYXRocyBoZXJlIHdpbGwgaGF2ZSB0aGVpciB0ZXh0IHBhcnNlZFxuXHRcdFx0Ly8gYXMgYW4gWE1MIGRhdGV0aW1lIHZhbHVlICgyMDExLTExLTEyVDEzOjAwOjAwLTA3OjAwIHN0eWxlKS5cblx0XHRcdC8vIFRoZSBwYXRoIGNhbiBiZSBhIHBsYWluIHN0cmluZyAocGFyZW50LmNoaWxkMS5jaGlsZDIpLFxuXHRcdFx0Ly8gYSByZWdleCAoLy4qXFwuY2hpbGQyLykgb3IgZnVuY3Rpb24oZWxlbWVudFBhdGgpLlxuXHRcdFx0Y29uZmlnLmRhdGV0aW1lQWNjZXNzRm9ybVBhdGhzID0gY29uZmlnLmRhdGV0aW1lQWNjZXNzRm9ybVBhdGhzIHx8IFtdO1xuXG5cdFx0XHQvLyBBbnkgZWxlbWVudHMgdGhhdCBtYXRjaCB0aGUgcGF0aHMgbGlzdGVkIGhlcmUgd2lsbCBiZSBzdG9yZWQgaW4gSmF2YVNjcmlwdCBvYmplY3RzXG5cdFx0XHQvLyBhcyBhcnJheXMgZXZlbiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBvZiB0aGVtLiBUaGUgcGF0aCBjYW4gYmUgYSBwbGFpbiBzdHJpbmdcblx0XHRcdC8vIChwYXJlbnQuY2hpbGQxLmNoaWxkMiksIGEgcmVnZXggKC8uKlxcLmNoaWxkMi8pIG9yIGZ1bmN0aW9uKGVsZW1lbnROYW1lLCBlbGVtZW50UGF0aCkuXG5cdFx0XHRjb25maWcuYXJyYXlBY2Nlc3NGb3JtUGF0aHMgPSBjb25maWcuYXJyYXlBY2Nlc3NGb3JtUGF0aHMgfHwgW107XG5cblx0XHRcdC8vIElmIHRydWUsIGEgdG9TdHJpbmcgZnVuY3Rpb24gaXMgZ2VuZXJhdGVkIHRvIHByaW50IG5vZGVzIGNvbnRhaW5pbmcgdGV4dCBvciBjZGF0YS5cblx0XHRcdC8vIFVzZWZ1bCBpZiB5b3Ugd2FudCB0byBhY2NlcHQgYm90aCBwbGFpbiB0ZXh0IGFuZCBDRGF0YSBhcyBlcXVpdmFsZW50IGlucHV0cy5cblx0XHRcdGlmIChjb25maWcuZW5hYmxlVG9TdHJpbmdGdW5jID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29uZmlnLmVuYWJsZVRvU3RyaW5nRnVuYyA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRydWUsIGVtcHR5IHRleHQgdGFncyBhcmUgaWdub3JlZCBmb3IgZWxlbWVudHMgd2l0aCBjaGlsZCBub2Rlcy5cblx0XHRcdGlmIChjb25maWcuc2tpcEVtcHR5VGV4dE5vZGVzRm9yT2JqID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29uZmlnLnNraXBFbXB0eVRleHROb2Rlc0Zvck9iaiA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRydWUsIHdoaXRlc3BhY2UgaXMgdHJpbW1lZCBmcm9tIHRleHQgbm9kZXMuXG5cdFx0XHRpZiAoY29uZmlnLnN0cmlwV2hpdGVzcGFjZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb25maWcuc3RyaXBXaGl0ZXNwYWNlcyA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRydWUsIGRvdWJsZSBxdW90ZXMgYXJlIHVzZWQgaW4gZ2VuZXJhdGVkIFhNTC5cblx0XHRcdGlmIChjb25maWcudXNlRG91YmxlUXVvdGVzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29uZmlnLnVzZURvdWJsZVF1b3RlcyA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRydWUsIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIFhNTCBkb2N1bWVudCBpcyBpZ25vcmVkIHdoZW4gY29udmVydGluZyB0byBvYmplY3RzLlxuXHRcdFx0Ly8gVGhlIHJlc3VsdCB3aWxsIGRpcmVjdGx5IGhhdmUgdGhlIHJvb3QgZWxlbWVudCdzIGNoaWxkcmVuIGFzIGl0cyBvd24gcHJvcGVydGllcy5cblx0XHRcdGlmIChjb25maWcuaWdub3JlUm9vdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbmZpZy5pZ25vcmVSb290ID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdoZXRoZXIgWE1MIGNoYXJhY3RlcnMgaW4gdGV4dCBhcmUgZXNjYXBlZCB3aGVuIHJlYWRpbmcvd3JpdGluZyBYTUwuXG5cdFx0XHRpZiAoY29uZmlnLmVzY2FwZU1vZGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb25maWcuZXNjYXBlTW9kZSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFByZWZpeCB0byB1c2UgZm9yIHByb3BlcnRpZXMgdGhhdCBhcmUgY3JlYXRlZCB0byByZXByZXNlbnQgWE1MIGF0dHJpYnV0ZXMuXG5cdFx0XHRpZiAoY29uZmlnLmF0dHJpYnV0ZVByZWZpeCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbmZpZy5hdHRyaWJ1dGVQcmVmaXggPSBcIl9cIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdHJ1ZSwgZW1wdHkgZWxlbWVudHMgd2lsbCBjcmVhdGVkIGFzIHNlbGYgY2xvc2luZyBlbGVtZW50cyAoPGVsZW1lbnQgLz4pXG5cdFx0XHQvLyBJZiBmYWxzZSwgZW1wdHkgZWxlbWVudHMgd2lsbCBiZSBjcmVhdGVkIHdpdGggc3RhcnQgYW5kIGVuZCB0YWdzICg8ZWxlbWVudD48L2VsZW1lbnQ+KVxuXHRcdFx0aWYgKGNvbmZpZy5zZWxmQ2xvc2luZ0VsZW1lbnRzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29uZmlnLnNlbGZDbG9zaW5nRWxlbWVudHMgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGlzIHByb3BlcnR5IGRlZmluZWQgYXMgZmFsc2UgYW5kIGFuIFhNTCBlbGVtZW50IGhhcyBDRGF0YSBub2RlIE9OTFksIGl0IHdpbGwgYmUgY29udmVydGVkIHRvIHRleHQgd2l0aG91dCBhZGRpdGlvbmFsIHByb3BlcnR5IFwiX19jZGF0YVwiXG5cdFx0XHRpZiAoY29uZmlnLmtlZXBDRGF0YSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbmZpZy5rZWVwQ0RhdGEgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpbml0UmVxdWlyZWRQb2x5ZmlsbHMoKSB7XG5cdFx0XHRmdW5jdGlvbiBwYWQobnVtYmVyKSB7XG5cdFx0XHRcdHZhciByID0gU3RyaW5nKG51bWJlcik7XG5cdFx0XHRcdGlmIChyLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdHIgPSAnMCcgKyByO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByO1xuXHRcdFx0fVxuXHRcdFx0Ly8gSGVsbG8gSUU4LVxuXHRcdFx0aWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnRyaW0gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0U3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24gdHJpbSgpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xeXFxuK3woXFxzfFxcbikrJC9nLCAnJyk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdC8vIEltcGxlbWVudGF0aW9uIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNTczNTIxL2hvdy1kby1pLW91dHB1dC1hbi1pc28tODYwMS1mb3JtYXR0ZWQtc3RyaW5nLWluLWphdmFzY3JpcHRcblx0XHRcdFx0RGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgPSBmdW5jdGlvbiB0b0lTT1N0cmluZygpIHtcblx0XHRcdFx0XHR2YXIgTVNfSU5fUyA9IDEwMDA7XG5cblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRVVENGdWxsWWVhcigpXG5cdFx0XHRcdFx0XHQrICctJyArIHBhZCh0aGlzLmdldFVUQ01vbnRoKCkgKyAxKVxuXHRcdFx0XHRcdFx0KyAnLScgKyBwYWQodGhpcy5nZXRVVENEYXRlKCkpXG5cdFx0XHRcdFx0XHQrICdUJyArIHBhZCh0aGlzLmdldFVUQ0hvdXJzKCkpXG5cdFx0XHRcdFx0XHQrICc6JyArIHBhZCh0aGlzLmdldFVUQ01pbnV0ZXMoKSlcblx0XHRcdFx0XHRcdCsgJzonICsgcGFkKHRoaXMuZ2V0VVRDU2Vjb25kcygpKVxuXHRcdFx0XHRcdFx0KyAnLicgKyBTdHJpbmcoKHRoaXMuZ2V0VVRDTWlsbGlzZWNvbmRzKCkgLyBNU19JTl9TKS50b0ZpeGVkKDMpKS5zbGljZSgyLCA1KVxuXHRcdFx0XHRcdFx0KyAnWic7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aW5pdENvbmZpZ0RlZmF1bHRzKCk7XG5cdFx0aW5pdFJlcXVpcmVkUG9seWZpbGxzKCk7XG5cblx0XHR2YXIgRE9NTm9kZVR5cGVzID0ge1xuXHRcdFx0XCJFTEVNRU5UX05PREVcIjogMSxcblx0XHRcdFwiVEVYVF9OT0RFXCI6IDMsXG5cdFx0XHRcIkNEQVRBX1NFQ1RJT05fTk9ERVwiOiA0LFxuXHRcdFx0XCJDT01NRU5UX05PREVcIjogOCxcblx0XHRcdFwiRE9DVU1FTlRfTk9ERVwiOiA5XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldERvbU5vZGVMb2NhbE5hbWUoZG9tTm9kZSkge1xuXHRcdFx0dmFyIGxvY2FsTmFtZSA9IGRvbU5vZGUubG9jYWxOYW1lO1xuXHRcdFx0aWYgKGxvY2FsTmFtZSA9PSBudWxsKSB7XG5cdFx0XHRcdC8vIFllYWgsIHRoaXMgaXMgSUUhIVxuXHRcdFx0XHRsb2NhbE5hbWUgPSBkb21Ob2RlLmJhc2VOYW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxvY2FsTmFtZSA9PSBudWxsIHx8IGxvY2FsTmFtZSA9PT0gXCJcIikge1xuXHRcdFx0XHQvLyA9PT1cIlwiIGlzIElFIHRvb1xuXHRcdFx0XHRsb2NhbE5hbWUgPSBkb21Ob2RlLm5vZGVOYW1lO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGxvY2FsTmFtZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXREb21Ob2RlTmFtZXNwYWNlUHJlZml4KG5vZGUpIHtcblx0XHRcdHJldHVybiBub2RlLnByZWZpeDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBlc2NhcGVYbWxDaGFycyhzdHIpIHtcblx0XHRcdGlmICh0eXBlb2Ygc3RyID09PSBcInN0cmluZ1wiKVxuXHRcdFx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykucmVwbGFjZSgvJy9nLCAnJiN4Mjc7Jyk7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBzdHI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdW5lc2NhcGVYbWxDaGFycyhzdHIpIHtcblx0XHRcdHJldHVybiBzdHIucmVwbGFjZSgvJmx0Oy9nLCAnPCcpLnJlcGxhY2UoLyZndDsvZywgJz4nKS5yZXBsYWNlKC8mcXVvdDsvZywgJ1wiJykucmVwbGFjZSgvJiN4Mjc7L2csIFwiJ1wiKS5yZXBsYWNlKC8mYW1wOy9nLCAnJicpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGVuc3VyZVByb3BlckFycmF5QWNjZXNzRm9ybShlbGVtZW50LCBjaGlsZE5hbWUsIGVsZW1lbnRQYXRoKSB7XG5cdFx0XHRzd2l0Y2ggKGNvbmZpZy5hcnJheUFjY2Vzc0Zvcm0pIHtcblx0XHRcdFx0Y2FzZSBcInByb3BlcnR5XCI6XG5cdFx0XHRcdFx0aWYgKCEoZWxlbWVudFtjaGlsZE5hbWVdIGluc3RhbmNlb2YgQXJyYXkpKVxuXHRcdFx0XHRcdFx0ZWxlbWVudFtjaGlsZE5hbWUgKyBcIl9hc0FycmF5XCJdID0gW2VsZW1lbnRbY2hpbGROYW1lXV07XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0ZWxlbWVudFtjaGlsZE5hbWUgKyBcIl9hc0FycmF5XCJdID0gZWxlbWVudFtjaGlsZE5hbWVdO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIShlbGVtZW50W2NoaWxkTmFtZV0gaW5zdGFuY2VvZiBBcnJheSkgJiYgY29uZmlnLmFycmF5QWNjZXNzRm9ybVBhdGhzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dmFyIG1hdGNoID0gZmFsc2U7XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcuYXJyYXlBY2Nlc3NGb3JtUGF0aHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgYXJyYXlQYXRoID0gY29uZmlnLmFycmF5QWNjZXNzRm9ybVBhdGhzW2ldO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgYXJyYXlQYXRoID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0XHRpZiAoYXJyYXlQYXRoID09PSBlbGVtZW50UGF0aCkge1xuXHRcdFx0XHRcdFx0XHRtYXRjaCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJyYXlQYXRoIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdFx0XHRcdFx0XHRpZiAoYXJyYXlQYXRoLnRlc3QoZWxlbWVudFBhdGgpKSB7XG5cdFx0XHRcdFx0XHRcdG1hdGNoID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgYXJyYXlQYXRoID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdGlmIChhcnJheVBhdGgoY2hpbGROYW1lLCBlbGVtZW50UGF0aCkpIHtcblx0XHRcdFx0XHRcdFx0bWF0Y2ggPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAobWF0Y2gpXG5cdFx0XHRcdFx0ZWxlbWVudFtjaGlsZE5hbWVdID0gW2VsZW1lbnRbY2hpbGROYW1lXV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24geG1sRGF0ZVRpbWVUb0RhdGUocHJvcCkge1xuXHRcdFx0Ly8gSW1wbGVtZW50YXRpb24gYmFzZWQgdXAgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy84MTc4NTk4L3htbC1kYXRldGltZS10by1qYXZhc2NyaXB0LWRhdGUtb2JqZWN0XG5cdFx0XHQvLyBJbXByb3ZlZCB0byBzdXBwb3J0IGZ1bGwgc3BlYyBhbmQgb3B0aW9uYWwgcGFydHNcblx0XHRcdHZhciBNSU5VVEVTX1BFUl9IT1VSID0gNjA7XG5cblx0XHRcdHZhciBiaXRzID0gcHJvcC5zcGxpdCgvWy1UOitaXS9nKTtcblxuXHRcdFx0dmFyIGQgPSBuZXcgRGF0ZShiaXRzWzBdLCBiaXRzWzFdIC0gMSwgYml0c1syXSk7XG5cdFx0XHR2YXIgc2Vjb25kQml0cyA9IGJpdHNbNV0uc3BsaXQoXCJcXC5cIik7XG5cdFx0XHRkLnNldEhvdXJzKGJpdHNbM10sIGJpdHNbNF0sIHNlY29uZEJpdHNbMF0pO1xuXHRcdFx0aWYgKHNlY29uZEJpdHMubGVuZ3RoID4gMSlcblx0XHRcdFx0ZC5zZXRNaWxsaXNlY29uZHMoc2Vjb25kQml0c1sxXSk7XG5cblx0XHRcdC8vIEdldCBzdXBwbGllZCB0aW1lIHpvbmUgb2Zmc2V0IGluIG1pbnV0ZXNcblx0XHRcdGlmIChiaXRzWzZdICYmIGJpdHNbN10pIHtcblx0XHRcdFx0dmFyIG9mZnNldE1pbnV0ZXMgPSBiaXRzWzZdICogTUlOVVRFU19QRVJfSE9VUiArIE51bWJlcihiaXRzWzddKTtcblx0XHRcdFx0dmFyIHNpZ24gPSAvXFxkXFxkLVxcZFxcZDpcXGRcXGQkLy50ZXN0KHByb3ApID8gJy0nIDogJysnO1xuXG5cdFx0XHRcdC8vIEFwcGx5IHRoZSBzaWduXG5cdFx0XHRcdG9mZnNldE1pbnV0ZXMgPSAwICsgKHNpZ24gPT09ICctJyA/IC0xICogb2Zmc2V0TWludXRlcyA6IG9mZnNldE1pbnV0ZXMpO1xuXG5cdFx0XHRcdC8vIEFwcGx5IG9mZnNldCBhbmQgbG9jYWwgdGltZXpvbmVcblx0XHRcdFx0ZC5zZXRNaW51dGVzKGQuZ2V0TWludXRlcygpIC0gb2Zmc2V0TWludXRlcyAtIGQuZ2V0VGltZXpvbmVPZmZzZXQoKSk7XG5cdFx0XHR9IGVsc2UgaWYgKHByb3AuaW5kZXhPZihcIlpcIiwgcHJvcC5sZW5ndGggLSAxKSAhPT0gLTEpIHtcblx0XHRcdFx0ZCA9IG5ldyBEYXRlKERhdGUuVVRDKGQuZ2V0RnVsbFllYXIoKSwgZC5nZXRNb250aCgpLCBkLmdldERhdGUoKSwgZC5nZXRIb3VycygpLCBkLmdldE1pbnV0ZXMoKSwgZC5nZXRTZWNvbmRzKCksIGQuZ2V0TWlsbGlzZWNvbmRzKCkpKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZCBpcyBub3cgYSBsb2NhbCB0aW1lIGVxdWl2YWxlbnQgdG8gdGhlIHN1cHBsaWVkIHRpbWVcblx0XHRcdHJldHVybiBkO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvbnZlcnRUb0RhdGVJZlJlcXVpcmVkKHZhbHVlLCBjaGlsZE5hbWUsIGZ1bGxQYXRoKSB7XG5cdFx0XHRpZiAoY29uZmlnLmRhdGV0aW1lQWNjZXNzRm9ybVBhdGhzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dmFyIHBhdGhXaXRob3V0VGV4dE5vZGUgPSBmdWxsUGF0aC5zcGxpdChcIlxcLiNcIilbMF07XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcuZGF0ZXRpbWVBY2Nlc3NGb3JtUGF0aHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgY2FuZGlkYXRlUGF0aCA9IGNvbmZpZy5kYXRldGltZUFjY2Vzc0Zvcm1QYXRoc1tpXTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGNhbmRpZGF0ZVBhdGggPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdGlmIChjYW5kaWRhdGVQYXRoID09PSBwYXRoV2l0aG91dFRleHROb2RlKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4geG1sRGF0ZVRpbWVUb0RhdGUodmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY2FuZGlkYXRlUGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuXHRcdFx0XHRcdFx0aWYgKGNhbmRpZGF0ZVBhdGgudGVzdChwYXRoV2l0aG91dFRleHROb2RlKSlcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHhtbERhdGVUaW1lVG9EYXRlKHZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjYW5kaWRhdGVQYXRoID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdGlmIChjYW5kaWRhdGVQYXRoKHBhdGhXaXRob3V0VGV4dE5vZGUpKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4geG1sRGF0ZVRpbWVUb0RhdGUodmFsdWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVzZXJpYWxpemVSb290RWxlbWVudENoaWxkcmVuKHJvb3RFbGVtZW50KSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSByb290RWxlbWVudC5jaGlsZE5vZGVzO1xuXG5cdFx0XHQvLyBBbHRlcm5hdGl2ZSBmb3IgZmlyc3RFbGVtZW50Q2hpbGQgd2hpY2ggaXMgbm90IHN1cHBvcnRlZCBpbiBzb21lIGVudmlyb25tZW50c1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgY2hpbGQgPSBjaGlsZHJlbi5pdGVtKGkpO1xuXHRcdFx0XHRpZiAoY2hpbGQubm9kZVR5cGUgPT09IERPTU5vZGVUeXBlcy5FTEVNRU5UX05PREUpIHtcblx0XHRcdFx0XHR2YXIgY2hpbGROYW1lID0gZ2V0RG9tTm9kZUxvY2FsTmFtZShjaGlsZCk7XG5cblx0XHRcdFx0XHRpZiAoY29uZmlnLmlnbm9yZVJvb3QpXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBkZXNlcmlhbGl6ZURvbUNoaWxkcmVuKGNoaWxkLCBjaGlsZE5hbWUpO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJlc3VsdFtjaGlsZE5hbWVdID0gZGVzZXJpYWxpemVEb21DaGlsZHJlbihjaGlsZCwgY2hpbGROYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRlc2VyaWFsaXplRWxlbWVudENoaWxkcmVuKGVsZW1lbnQsIGVsZW1lbnRQYXRoKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0XHRyZXN1bHQuX19jbnQgPSAwO1xuXG5cdFx0XHR2YXIgbm9kZUNoaWxkcmVuID0gZWxlbWVudC5jaGlsZE5vZGVzO1xuXG5cdFx0XHQvLyBDaGlsZCBub2Rlcy5cblx0XHRcdGZvciAodmFyIGlDaGlsZCA9IDA7IGlDaGlsZCA8IG5vZGVDaGlsZHJlbi5sZW5ndGg7IGlDaGlsZCsrKSB7XG5cdFx0XHRcdHZhciBjaGlsZCA9IG5vZGVDaGlsZHJlbi5pdGVtKGlDaGlsZCk7XG5cdFx0XHRcdHZhciBjaGlsZE5hbWUgPSBnZXREb21Ob2RlTG9jYWxOYW1lKGNoaWxkKTtcblxuXHRcdFx0XHRpZiAoY2hpbGQubm9kZVR5cGUgPT09IERPTU5vZGVUeXBlcy5DT01NRU5UX05PREUpXG5cdFx0XHRcdFx0Y29udGludWU7XG5cblx0XHRcdFx0cmVzdWx0Ll9fY250Kys7XG5cblx0XHRcdFx0Ly8gV2UgZGVsaWJlcmF0ZWx5IGRvIG5vdCBhY2NlcHQgZXZlcnl0aGluZyBmYWxzZXkgaGVyZSBiZWNhdXNlXG5cdFx0XHRcdC8vIGVsZW1lbnRzIHRoYXQgcmVzb2x2ZSB0byBlbXB0eSBzdHJpbmcgc2hvdWxkIHN0aWxsIGJlIHByZXNlcnZlZC5cblx0XHRcdFx0aWYgKHJlc3VsdFtjaGlsZE5hbWVdID09IG51bGwpIHtcblx0XHRcdFx0XHRyZXN1bHRbY2hpbGROYW1lXSA9IGRlc2VyaWFsaXplRG9tQ2hpbGRyZW4oY2hpbGQsIGVsZW1lbnRQYXRoICsgXCIuXCIgKyBjaGlsZE5hbWUpO1xuXHRcdFx0XHRcdGVuc3VyZVByb3BlckFycmF5QWNjZXNzRm9ybShyZXN1bHQsIGNoaWxkTmFtZSwgZWxlbWVudFBhdGggKyBcIi5cIiArIGNoaWxkTmFtZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCEocmVzdWx0W2NoaWxkTmFtZV0gaW5zdGFuY2VvZiBBcnJheSkpIHtcblx0XHRcdFx0XHRcdHJlc3VsdFtjaGlsZE5hbWVdID0gW3Jlc3VsdFtjaGlsZE5hbWVdXTtcblx0XHRcdFx0XHRcdGVuc3VyZVByb3BlckFycmF5QWNjZXNzRm9ybShyZXN1bHQsIGNoaWxkTmFtZSwgZWxlbWVudFBhdGggKyBcIi5cIiArIGNoaWxkTmFtZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVzdWx0W2NoaWxkTmFtZV1bcmVzdWx0W2NoaWxkTmFtZV0ubGVuZ3RoXSA9IGRlc2VyaWFsaXplRG9tQ2hpbGRyZW4oY2hpbGQsIGVsZW1lbnRQYXRoICsgXCIuXCIgKyBjaGlsZE5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEF0dHJpYnV0ZXNcblx0XHRcdGZvciAodmFyIGlBdHRyaWJ1dGUgPSAwOyBpQXR0cmlidXRlIDwgZWxlbWVudC5hdHRyaWJ1dGVzLmxlbmd0aDsgaUF0dHJpYnV0ZSsrKSB7XG5cdFx0XHRcdHZhciBhdHRyaWJ1dGUgPSBlbGVtZW50LmF0dHJpYnV0ZXMuaXRlbShpQXR0cmlidXRlKTtcblx0XHRcdFx0cmVzdWx0Ll9fY250Kys7XG5cblx0XHRcdFx0dmFyIGFkanVzdGVkVmFsdWUgPSBhdHRyaWJ1dGUudmFsdWU7XG5cdFx0XHRcdGZvciAodmFyIGlDb252ZXJ0ZXIgPSAwOyBpQ29udmVydGVyIDwgY29uZmlnLmF0dHJpYnV0ZUNvbnZlcnRlcnMubGVuZ3RoOyBpQ29udmVydGVyKyspIHtcblx0XHRcdFx0XHR2YXIgY29udmVydGVyID0gY29uZmlnLmF0dHJpYnV0ZUNvbnZlcnRlcnNbaUNvbnZlcnRlcl07XG5cdFx0XHRcdFx0aWYgKGNvbnZlcnRlci50ZXN0LmNhbGwobnVsbCwgYXR0cmlidXRlLm5hbWUsIGF0dHJpYnV0ZS52YWx1ZSkpXG5cdFx0XHRcdFx0XHRhZGp1c3RlZFZhbHVlID0gY29udmVydGVyLmNvbnZlcnQuY2FsbChudWxsLCBhdHRyaWJ1dGUubmFtZSwgYXR0cmlidXRlLnZhbHVlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3VsdFtjb25maWcuYXR0cmlidXRlUHJlZml4ICsgYXR0cmlidXRlLm5hbWVdID0gYWRqdXN0ZWRWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTm9kZSBuYW1lc3BhY2UgcHJlZml4XG5cdFx0XHR2YXIgbmFtZXNwYWNlUHJlZml4ID0gZ2V0RG9tTm9kZU5hbWVzcGFjZVByZWZpeChlbGVtZW50KTtcblx0XHRcdGlmIChuYW1lc3BhY2VQcmVmaXgpIHtcblx0XHRcdFx0cmVzdWx0Ll9fY250Kys7XG5cdFx0XHRcdHJlc3VsdC5fX3ByZWZpeCA9IG5hbWVzcGFjZVByZWZpeDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJlc3VsdFtcIiN0ZXh0XCJdKSB7XG5cdFx0XHRcdHJlc3VsdC5fX3RleHQgPSByZXN1bHRbXCIjdGV4dFwiXTtcblxuXHRcdFx0XHRpZiAocmVzdWx0Ll9fdGV4dCBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRcdFx0cmVzdWx0Ll9fdGV4dCA9IHJlc3VsdC5fX3RleHQuam9pbihcIlxcblwiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb25maWcuZXNjYXBlTW9kZSlcblx0XHRcdFx0XHRyZXN1bHQuX190ZXh0ID0gdW5lc2NhcGVYbWxDaGFycyhyZXN1bHQuX190ZXh0KTtcblxuXHRcdFx0XHRpZiAoY29uZmlnLnN0cmlwV2hpdGVzcGFjZXMpXG5cdFx0XHRcdFx0cmVzdWx0Ll9fdGV4dCA9IHJlc3VsdC5fX3RleHQudHJpbSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSByZXN1bHRbXCIjdGV4dFwiXTtcblxuXHRcdFx0XHRpZiAoY29uZmlnLmFycmF5QWNjZXNzRm9ybSA9PT0gXCJwcm9wZXJ0eVwiKVxuXHRcdFx0XHRcdGRlbGV0ZSByZXN1bHRbXCIjdGV4dF9hc0FycmF5XCJdO1xuXG5cdFx0XHRcdHJlc3VsdC5fX3RleHQgPSBjb252ZXJ0VG9EYXRlSWZSZXF1aXJlZChyZXN1bHQuX190ZXh0LCBcIiN0ZXh0XCIsIGVsZW1lbnRQYXRoICsgXCIuI3RleHRcIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJyNjZGF0YS1zZWN0aW9uJykpIHtcblx0XHRcdFx0cmVzdWx0Ll9fY2RhdGEgPSByZXN1bHRbXCIjY2RhdGEtc2VjdGlvblwiXTtcblx0XHRcdFx0ZGVsZXRlIHJlc3VsdFtcIiNjZGF0YS1zZWN0aW9uXCJdO1xuXG5cdFx0XHRcdGlmIChjb25maWcuYXJyYXlBY2Nlc3NGb3JtID09PSBcInByb3BlcnR5XCIpXG5cdFx0XHRcdFx0ZGVsZXRlIHJlc3VsdFtcIiNjZGF0YS1zZWN0aW9uX2FzQXJyYXlcIl07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChyZXN1bHQuX19jbnQgPT09IDEgJiYgcmVzdWx0Ll9fdGV4dCkge1xuXHRcdFx0XHRyZXN1bHQgPSByZXN1bHQuX190ZXh0O1xuXHRcdFx0fSBlbHNlIGlmIChyZXN1bHQuX19jbnQgPT09IDAgJiYgY29uZmlnLmVtcHR5Tm9kZUZvcm0gPT09IFwidGV4dFwiKSB7XG5cdFx0XHRcdHJlc3VsdCA9ICcnO1xuXHRcdFx0fSBlbHNlIGlmIChyZXN1bHQuX19jbnQgPiAxICYmIHJlc3VsdC5fX3RleHQgIT09IHVuZGVmaW5lZCAmJiBjb25maWcuc2tpcEVtcHR5VGV4dE5vZGVzRm9yT2JqKSB7XG5cdFx0XHRcdGlmIChjb25maWcuc3RyaXBXaGl0ZXNwYWNlcyAmJiByZXN1bHQuX190ZXh0ID09PSBcIlwiIHx8IHJlc3VsdC5fX3RleHQudHJpbSgpID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHJlc3VsdC5fX3RleHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGRlbGV0ZSByZXN1bHQuX19jbnQ7XG5cblx0XHRcdGlmICghY29uZmlnLmtlZXBDRGF0YSAmJiAoIXJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnX190ZXh0JykgJiYgcmVzdWx0Lmhhc093blByb3BlcnR5KCdfX2NkYXRhJykpKSB7XG5cdFx0XHRcdHJldHVybiAocmVzdWx0Ll9fY2RhdGEgPyByZXN1bHQuX19jZGF0YSA6ICcnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbmZpZy5lbmFibGVUb1N0cmluZ0Z1bmMgJiYgKHJlc3VsdC5fX3RleHQgfHwgcmVzdWx0Ll9fY2RhdGEpKSB7XG5cdFx0XHRcdHJlc3VsdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdFx0XHRcdHJldHVybiAodGhpcy5fX3RleHQgPyB0aGlzLl9fdGV4dCA6ICcnKSArICh0aGlzLl9fY2RhdGEgPyB0aGlzLl9fY2RhdGEgOiAnJyk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVzZXJpYWxpemVEb21DaGlsZHJlbihub2RlLCBwYXJlbnRQYXRoKSB7XG5cdFx0XHRpZiAobm9kZS5ub2RlVHlwZSA9PT0gRE9NTm9kZVR5cGVzLkRPQ1VNRU5UX05PREUpIHtcblx0XHRcdFx0cmV0dXJuIGRlc2VyaWFsaXplUm9vdEVsZW1lbnRDaGlsZHJlbihub2RlKTtcblx0XHRcdH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gRE9NTm9kZVR5cGVzLkVMRU1FTlRfTk9ERSkge1xuXHRcdFx0XHRyZXR1cm4gZGVzZXJpYWxpemVFbGVtZW50Q2hpbGRyZW4obm9kZSwgcGFyZW50UGF0aCk7XG5cdFx0XHR9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IERPTU5vZGVUeXBlcy5URVhUX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRE9NTm9kZVR5cGVzLkNEQVRBX1NFQ1RJT05fTk9ERSkge1xuXHRcdFx0XHRyZXR1cm4gbm9kZS5ub2RlVmFsdWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXJpYWxpemVTdGFydFRhZyhqc09iamVjdCwgZWxlbWVudE5hbWUsIGF0dHJpYnV0ZU5hbWVzLCBzZWxmQ2xvc2luZykge1xuXHRcdFx0dmFyIHJlc3VsdFN0ciA9IFwiPFwiICsgKChqc09iamVjdCAmJiBqc09iamVjdC5fX3ByZWZpeCkgPyAoanNPYmplY3QuX19wcmVmaXggKyBcIjpcIikgOiBcIlwiKSArIGVsZW1lbnROYW1lO1xuXG5cdFx0XHRpZiAoYXR0cmlidXRlTmFtZXMpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlTmFtZXNbaV07XG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0ganNPYmplY3RbYXR0cmlidXRlTmFtZV07XG5cblx0XHRcdFx0XHRpZiAoY29uZmlnLmVzY2FwZU1vZGUpXG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVWYWx1ZSA9IGVzY2FwZVhtbENoYXJzKGF0dHJpYnV0ZVZhbHVlKTtcblxuXHRcdFx0XHRcdHJlc3VsdFN0ciArPSBcIiBcIiArIGF0dHJpYnV0ZU5hbWUuc3Vic3RyKGNvbmZpZy5hdHRyaWJ1dGVQcmVmaXgubGVuZ3RoKSArIFwiPVwiO1xuXG5cdFx0XHRcdFx0aWYgKGNvbmZpZy51c2VEb3VibGVRdW90ZXMpXG5cdFx0XHRcdFx0XHRyZXN1bHRTdHIgKz0gJ1wiJyArIGF0dHJpYnV0ZVZhbHVlICsgJ1wiJztcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXN1bHRTdHIgKz0gXCInXCIgKyBhdHRyaWJ1dGVWYWx1ZSArIFwiJ1wiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICghc2VsZkNsb3NpbmcpXG5cdFx0XHRcdHJlc3VsdFN0ciArPSBcIj5cIjtcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVzdWx0U3RyICs9IFwiIC8+XCI7XG5cblx0XHRcdHJldHVybiByZXN1bHRTdHI7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VyaWFsaXplRW5kVGFnKGpzT2JqZWN0LCBlbGVtZW50TmFtZSkge1xuXHRcdFx0cmV0dXJuIFwiPC9cIiArICgoanNPYmplY3QgJiYganNPYmplY3QuX19wcmVmaXgpID8gKGpzT2JqZWN0Ll9fcHJlZml4ICsgXCI6XCIpIDogXCJcIikgKyBlbGVtZW50TmFtZSArIFwiPlwiO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGVuZHNXaXRoKHN0ciwgc3VmZml4KSB7XG5cdFx0XHRyZXR1cm4gc3RyLmluZGV4T2Yoc3VmZml4LCBzdHIubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCkgIT09IC0xO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGlzU3BlY2lhbFByb3BlcnR5KGpzb25PYmosIHByb3BlcnR5TmFtZSkge1xuXHRcdFx0aWYgKChjb25maWcuYXJyYXlBY2Nlc3NGb3JtID09PSBcInByb3BlcnR5XCIgJiYgZW5kc1dpdGgocHJvcGVydHlOYW1lLnRvU3RyaW5nKCksIChcIl9hc0FycmF5XCIpKSlcblx0XHRcdFx0fHwgcHJvcGVydHlOYW1lLnRvU3RyaW5nKCkuaW5kZXhPZihjb25maWcuYXR0cmlidXRlUHJlZml4KSA9PT0gMFxuXHRcdFx0XHR8fCBwcm9wZXJ0eU5hbWUudG9TdHJpbmcoKS5pbmRleE9mKFwiX19cIikgPT09IDBcblx0XHRcdFx0fHwgKGpzb25PYmpbcHJvcGVydHlOYW1lXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSlcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXREYXRhRWxlbWVudENvdW50KGpzT2JqZWN0KSB7XG5cdFx0XHR2YXIgY291bnQgPSAwO1xuXG5cdFx0XHRpZiAoanNPYmplY3QgaW5zdGFuY2VvZiBPYmplY3QpIHtcblx0XHRcdFx0Zm9yICh2YXIgcHJvcGVydHlOYW1lIGluIGpzT2JqZWN0KSB7XG5cdFx0XHRcdFx0aWYgKGlzU3BlY2lhbFByb3BlcnR5KGpzT2JqZWN0LCBwcm9wZXJ0eU5hbWUpKVxuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cblx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjb3VudDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXREYXRhQXR0cmlidXRlTmFtZXMoanNPYmplY3QpIHtcblx0XHRcdHZhciBuYW1lcyA9IFtdO1xuXG5cdFx0XHRpZiAoanNPYmplY3QgaW5zdGFuY2VvZiBPYmplY3QpIHtcblx0XHRcdFx0Zm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBqc09iamVjdCkge1xuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVOYW1lLnRvU3RyaW5nKCkuaW5kZXhPZihcIl9fXCIpID09PSAtMVxuXHRcdFx0XHRcdFx0JiYgYXR0cmlidXRlTmFtZS50b1N0cmluZygpLmluZGV4T2YoY29uZmlnLmF0dHJpYnV0ZVByZWZpeCkgPT09IDApIHtcblx0XHRcdFx0XHRcdG5hbWVzLnB1c2goYXR0cmlidXRlTmFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuYW1lcztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXJpYWxpemVDb21wbGV4VGV4dE5vZGVDb250ZW50cyh0ZXh0Tm9kZSkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IFwiXCI7XG5cblx0XHRcdGlmICh0ZXh0Tm9kZS5fX2NkYXRhKSB7XG5cdFx0XHRcdHJlc3VsdCArPSBcIjwhW0NEQVRBW1wiICsgdGV4dE5vZGUuX19jZGF0YSArIFwiXV0+XCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0ZXh0Tm9kZS5fX3RleHQpIHtcblx0XHRcdFx0aWYgKGNvbmZpZy5lc2NhcGVNb2RlKVxuXHRcdFx0XHRcdHJlc3VsdCArPSBlc2NhcGVYbWxDaGFycyh0ZXh0Tm9kZS5fX3RleHQpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0ICs9IHRleHROb2RlLl9fdGV4dDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXJpYWxpemVUZXh0Tm9kZUNvbnRlbnRzKHRleHROb2RlKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gXCJcIjtcblxuXHRcdFx0aWYgKHRleHROb2RlIGluc3RhbmNlb2YgT2JqZWN0KSB7XG5cdFx0XHRcdHJlc3VsdCArPSBzZXJpYWxpemVDb21wbGV4VGV4dE5vZGVDb250ZW50cyh0ZXh0Tm9kZSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRleHROb2RlICE9PSBudWxsKSB7XG5cdFx0XHRcdGlmIChjb25maWcuZXNjYXBlTW9kZSlcblx0XHRcdFx0XHRyZXN1bHQgKz0gZXNjYXBlWG1sQ2hhcnModGV4dE5vZGUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0ICs9IHRleHROb2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlcmlhbGl6ZUFycmF5KGVsZW1lbnRBcnJheSwgZWxlbWVudE5hbWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdHZhciByZXN1bHQgPSBcIlwiO1xuXG5cdFx0XHRpZiAoZWxlbWVudEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXN1bHQgKz0gc2VyaWFsaXplU3RhcnRUYWcoZWxlbWVudEFycmF5LCBlbGVtZW50TmFtZSwgYXR0cmlidXRlcywgdHJ1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRBcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHJlc3VsdCArPSBzZXJpYWxpemVKYXZhU2NyaXB0T2JqZWN0KGVsZW1lbnRBcnJheVtpXSwgZWxlbWVudE5hbWUsIGdldERhdGFBdHRyaWJ1dGVOYW1lcyhlbGVtZW50QXJyYXlbaV0pKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlcmlhbGl6ZUphdmFTY3JpcHRPYmplY3QoZWxlbWVudCwgZWxlbWVudE5hbWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdHZhciByZXN1bHQgPSBcIlwiO1xuXG5cdFx0XHRpZiAoKGVsZW1lbnQgPT09IHVuZGVmaW5lZCB8fCBlbGVtZW50ID09PSBudWxsIHx8IGVsZW1lbnQgPT09ICcnKSAmJiBjb25maWcuc2VsZkNsb3NpbmdFbGVtZW50cykge1xuXHRcdFx0XHRyZXN1bHQgKz0gc2VyaWFsaXplU3RhcnRUYWcoZWxlbWVudCwgZWxlbWVudE5hbWUsIGF0dHJpYnV0ZXMsIHRydWUpO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlbGVtZW50KSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuXHRcdFx0XHRcdHJlc3VsdCArPSBzZXJpYWxpemVBcnJheShlbGVtZW50LCBlbGVtZW50TmFtZSwgYXR0cmlidXRlcyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIERhdGUpIHtcblx0XHRcdFx0XHRyZXN1bHQgKz0gc2VyaWFsaXplU3RhcnRUYWcoZWxlbWVudCwgZWxlbWVudE5hbWUsIGF0dHJpYnV0ZXMsIGZhbHNlKTtcblx0XHRcdFx0XHRyZXN1bHQgKz0gZWxlbWVudC50b0lTT1N0cmluZygpO1xuXHRcdFx0XHRcdHJlc3VsdCArPSBzZXJpYWxpemVFbmRUYWcoZWxlbWVudCwgZWxlbWVudE5hbWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBjaGlsZEVsZW1lbnRDb3VudCA9IGdldERhdGFFbGVtZW50Q291bnQoZWxlbWVudCk7XG5cdFx0XHRcdFx0aWYgKGNoaWxkRWxlbWVudENvdW50ID4gMCB8fCBlbGVtZW50Ll9fdGV4dCB8fCBlbGVtZW50Ll9fY2RhdGEpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCArPSBzZXJpYWxpemVTdGFydFRhZyhlbGVtZW50LCBlbGVtZW50TmFtZSwgYXR0cmlidXRlcywgZmFsc2UpO1xuXHRcdFx0XHRcdFx0cmVzdWx0ICs9IHNlcmlhbGl6ZUphdmFTY3JpcHRPYmplY3RDaGlsZHJlbihlbGVtZW50KTtcblx0XHRcdFx0XHRcdHJlc3VsdCArPSBzZXJpYWxpemVFbmRUYWcoZWxlbWVudCwgZWxlbWVudE5hbWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY29uZmlnLnNlbGZDbG9zaW5nRWxlbWVudHMpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCArPSBzZXJpYWxpemVTdGFydFRhZyhlbGVtZW50LCBlbGVtZW50TmFtZSwgYXR0cmlidXRlcywgdHJ1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJlc3VsdCArPSBzZXJpYWxpemVTdGFydFRhZyhlbGVtZW50LCBlbGVtZW50TmFtZSwgYXR0cmlidXRlcywgZmFsc2UpO1xuXHRcdFx0XHRcdFx0cmVzdWx0ICs9IHNlcmlhbGl6ZUVuZFRhZyhlbGVtZW50LCBlbGVtZW50TmFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgKz0gc2VyaWFsaXplU3RhcnRUYWcoZWxlbWVudCwgZWxlbWVudE5hbWUsIGF0dHJpYnV0ZXMsIGZhbHNlKTtcblx0XHRcdFx0cmVzdWx0ICs9IHNlcmlhbGl6ZVRleHROb2RlQ29udGVudHMoZWxlbWVudCk7XG5cdFx0XHRcdHJlc3VsdCArPSBzZXJpYWxpemVFbmRUYWcoZWxlbWVudCwgZWxlbWVudE5hbWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlcmlhbGl6ZUphdmFTY3JpcHRPYmplY3RDaGlsZHJlbihqc09iamVjdCkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IFwiXCI7XG5cblx0XHRcdHZhciBlbGVtZW50Q291bnQgPSBnZXREYXRhRWxlbWVudENvdW50KGpzT2JqZWN0KTtcblxuXHRcdFx0aWYgKGVsZW1lbnRDb3VudCA+IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgZWxlbWVudE5hbWUgaW4ganNPYmplY3QpIHtcblx0XHRcdFx0XHRpZiAoaXNTcGVjaWFsUHJvcGVydHkoanNPYmplY3QsIGVsZW1lbnROYW1lKSlcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXG5cdFx0XHRcdFx0dmFyIGVsZW1lbnQgPSBqc09iamVjdFtlbGVtZW50TmFtZV07XG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBnZXREYXRhQXR0cmlidXRlTmFtZXMoZWxlbWVudCk7XG5cblx0XHRcdFx0XHRyZXN1bHQgKz0gc2VyaWFsaXplSmF2YVNjcmlwdE9iamVjdChlbGVtZW50LCBlbGVtZW50TmFtZSwgYXR0cmlidXRlcyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmVzdWx0ICs9IHNlcmlhbGl6ZVRleHROb2RlQ29udGVudHMoanNPYmplY3QpO1xuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHBhcnNlWG1sKHhtbCkge1xuXHRcdFx0aWYgKHhtbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIHhtbCAhPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHBhcnNlciA9IG51bGw7XG5cdFx0XHR2YXIgZG9tTm9kZSA9IG51bGw7XG5cblx0XHRcdGlmIChDdXN0b21ET01QYXJzZXIpIHtcblx0XHRcdFx0Ly8gVGhpcyBicmFuY2ggaXMgdXNlZCBmb3Igbm9kZS5qcywgd2l0aCB0aGUgeG1sZG9tIHBhcnNlci5cblx0XHRcdFx0cGFyc2VyID0gbmV3IEN1c3RvbURPTVBhcnNlcigpO1xuXG5cdFx0XHRcdGRvbU5vZGUgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHhtbCwgXCJ0ZXh0L3htbFwiKTtcblx0XHRcdH0gZWxzZSBpZiAod2luZG93ICYmIHdpbmRvdy5ET01QYXJzZXIpIHtcblx0XHRcdFx0cGFyc2VyID0gbmV3IHdpbmRvdy5ET01QYXJzZXIoKTtcblx0XHRcdFx0dmFyIHBhcnNlcmVycm9yTlMgPSBudWxsO1xuXG5cdFx0XHRcdHZhciBpc0lFUGFyc2VyID0gd2luZG93LkFjdGl2ZVhPYmplY3QgfHwgXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93O1xuXG5cdFx0XHRcdC8vIElFOSsgbm93IGlzIGhlcmVcblx0XHRcdFx0aWYgKCFpc0lFUGFyc2VyKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHBhcnNlcmVycm9yTlMgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKFwiSU5WQUxJRFwiLCBcInRleHQveG1sXCIpLmNoaWxkTm9kZXNbMF0ubmFtZXNwYWNlVVJJO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdFx0cGFyc2VyZXJyb3JOUyA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRkb21Ob2RlID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh4bWwsIFwidGV4dC94bWxcIik7XG5cdFx0XHRcdFx0aWYgKHBhcnNlcmVycm9yTlMgIT09IG51bGwgJiYgZG9tTm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZU5TKHBhcnNlcmVycm9yTlMsIFwicGFyc2VyZXJyb3JcIikubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0ZG9tTm9kZSA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRkb21Ob2RlID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSUUgOihcblx0XHRcdFx0aWYgKHhtbC5pbmRleE9mKFwiPD9cIikgPT09IDApIHtcblx0XHRcdFx0XHR4bWwgPSB4bWwuc3Vic3RyKHhtbC5pbmRleE9mKFwiPz5cIikgKyAyKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qIGdsb2JhbCBBY3RpdmVYT2JqZWN0ICovXG5cdFx0XHRcdGRvbU5vZGUgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxET01cIik7XG5cdFx0XHRcdGRvbU5vZGUuYXN5bmMgPSBcImZhbHNlXCI7XG5cdFx0XHRcdGRvbU5vZGUubG9hZFhNTCh4bWwpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZG9tTm9kZTtcblx0XHR9XG5cblx0XHR0aGlzLmFzQXJyYXkgPSBmdW5jdGlvbiBhc0FycmF5KHByb3ApIHtcblx0XHRcdGlmIChwcm9wID09PSB1bmRlZmluZWQgfHwgcHJvcCA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9IGVsc2UgaWYgKHByb3AgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0XHRyZXR1cm4gcHJvcDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBbcHJvcF07XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHRoaXMudG9YbWxEYXRlVGltZSA9IGZ1bmN0aW9uIHRvWG1sRGF0ZVRpbWUoZHQpIHtcblx0XHRcdGlmIChkdCBpbnN0YW5jZW9mIERhdGUpIHtcblx0XHRcdFx0cmV0dXJuIGR0LnRvSVNPU3RyaW5nKCk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiAoZHQpID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRyZXR1cm4gbmV3IERhdGUoZHQpLnRvSVNPU3RyaW5nKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhpcy5hc0RhdGVUaW1lID0gZnVuY3Rpb24gYXNEYXRlVGltZShwcm9wKSB7XG5cdFx0XHRpZiAodHlwZW9mIChwcm9wKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRyZXR1cm4geG1sRGF0ZVRpbWVUb0RhdGUocHJvcCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gcHJvcDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Lypcblx0XHRcdEludGVybmFsbHkgdGhlIGxvZ2ljIHdvcmtzIGluIGEgY3ljbGU6XG5cdFx0XHRET00tPkpTIC0gaW1wbGVtZW50ZWQgYnkgY3VzdG9tIGxvZ2ljIChkZXNlcmlhbGl6YXRpb24pLlxuXHRcdFx0SlMtPlhNTCAtIGltcGxlbWVudGVkIGJ5IGN1c3RvbSBsb2dpYyAoc2VyaWFsaXphdGlvbikuXG5cdFx0XHRYTUwtPkRPTSAtIGltcGxlbWVudGVkIGJ5IGJyb3dzZXIuXG5cdFx0Ki9cblxuXHRcdC8vIFRyYW5zZm9ybW5zIGFuIFhNTCBzdHJpbmcgaW50byBET00tdHJlZVxuXHRcdHRoaXMueG1sMmRvbSA9IGZ1bmN0aW9uIHhtbDJkb20oeG1sKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VYbWwoeG1sKTtcblx0XHR9O1xuXG5cdFx0Ly8gVHJhbnNmb3JtcyBhIERPTSB0cmVlIHRvIEphdmFTY3JpcHQgb2JqZWN0cy5cblx0XHR0aGlzLmRvbTJqcyA9IGZ1bmN0aW9uIGRvbTJqcyhkb21Ob2RlKSB7XG5cdFx0XHRyZXR1cm4gZGVzZXJpYWxpemVEb21DaGlsZHJlbihkb21Ob2RlLCBudWxsKTtcblx0XHR9O1xuXG5cdFx0Ly8gVHJhbnNmb3JtcyBKYXZhU2NyaXB0IG9iamVjdHMgdG8gYSBET00gdHJlZS5cblx0XHR0aGlzLmpzMmRvbSA9IGZ1bmN0aW9uIGpzMmRvbShqc09iamVjdCkge1xuXHRcdFx0dmFyIHhtbCA9IHRoaXMuanMyeG1sKGpzT2JqZWN0KTtcblx0XHRcdHJldHVybiBwYXJzZVhtbCh4bWwpO1xuXHRcdH07XG5cblx0XHQvLyBUcmFuc2Zvcm1ucyBhbiBYTUwgc3RyaW5nIGludG8gSmF2YVNjcmlwdCBvYmplY3RzLlxuXHRcdHRoaXMueG1sMmpzID0gZnVuY3Rpb24geG1sMmpzKHhtbCkge1xuXHRcdFx0dmFyIGRvbU5vZGUgPSBwYXJzZVhtbCh4bWwpO1xuXHRcdFx0aWYgKGRvbU5vZGUgIT0gbnVsbClcblx0XHRcdFx0cmV0dXJuIHRoaXMuZG9tMmpzKGRvbU5vZGUpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9O1xuXG5cdFx0Ly8gVHJhbnNmb3JtcyBKYXZhU2NyaXB0IG9iamVjdHMgaW50byBhbiBYTUwgc3RyaW5nLlxuXHRcdHRoaXMuanMyeG1sID0gZnVuY3Rpb24ganMyeG1sKGpzT2JqZWN0KSB7XG5cdFx0XHRyZXR1cm4gc2VyaWFsaXplSmF2YVNjcmlwdE9iamVjdENoaWxkcmVuKGpzT2JqZWN0KTtcblx0XHR9O1xuXG5cdFx0dGhpcy5nZXRWZXJzaW9uID0gZnVuY3Rpb24gZ2V0VmVyc2lvbigpIHtcblx0XHRcdHJldHVybiBWRVJTSU9OO1xuXHRcdH07XG5cdH07XG59KTtcbiJdfQ==