/**
 * Яваскрипт-фреймворк «Минимал»
 * 
 * @author MaximAL
 * @author McTep
 *
 * @since 2016-11-23
 * @date 2016-11-23
 * @time 14:54
 */
(function () {
	/**
	 * Навесить событие на элементы ДОМа.
	 *
	 * @example
	 * // Один элемент
	 * var button = document.body.querySelector('#one-button');
	 * on(button, 'click', listener);
	 *
	 * // Много элементов
	 * var buttons = document.body.querySelectorAll('.j-button');
	 * on(buttons, 'click', listener);
	 *
	 *
	 * @param {Document|Element|NodeList} elements Элементы ДОМа
	 * @param {String|String[]} eventName Название события (click, keypress и т. п.)
	 * @param {EventListener|Function} callback Выполняемая функция
	 *
	 * @since 2016-10-24
	 * @author MaximAL
	 */
	function on(elements, eventName, callback) {
		if (eventName instanceof String || typeof eventName === 'string') {
			eventName = [eventName];
		}
		if (elements instanceof NodeList || elements instanceof Array) {
			for (var i in elements) {
				if (!elements.hasOwnProperty(i)) {
					continue;
				}
				for (var j in eventName) {
					if (!eventName.hasOwnProperty(j)) {
						continue;
					}
					elements[i].addEventListener(eventName[j], callback);
				}
			}
		} else if (elements instanceof Node) {
			for (var e in eventName) {
				if (!eventName.hasOwnProperty(e)) {
					continue;
				}
				elements.addEventListener(eventName[e], callback);
			}
		} else {
			//console.info('Info: no element for `' + eventName + '`event.');
		}
	}

	/**
	 * Сделать Аякс
	 *
	 * @example
	 * // GET
	 * ajax('/api', function (response) {
	 *     var data = response.data;
	 *     // ...
	 * }
	 *
	 * // PUT
	 * ajax('/api', {method: 'PUT', data: {key: value}, function (response) {
	 *     var data = response.data;
	 *     // ...
	 * }
	 *
	 * @param {String} url Урл
	 * @param {Object|Function} params Объект вида `{method: method, async: true, data: data}`
	 * @param {String} params.method HTTP-метод
	 * @param {String|Object} params.data Данные для передачи
	 * @param {Boolean} [params.async] Асинхронный вызов?
	 * @param {Function} [params.onLoad] Что вызвать при загрузке
	 * @param {Function} [params.onProgress] Что вызвать при изменении прогресса
	 * @param {Function} [params.onError] Что вызвать при ошибке
	 * @param {Function} [callback] Выполнить по завершению аякс-вызова
	 *
	 * @since 2016-10-24
	 * @author MaximAL
	 */
	function ajax(url, params, callback) {
		if (!url) {
			throw new Error('Error: `url` parameter is required!');
		}

		params = params || {};

		if (params instanceof Function) {
			callback = params;
		}

		var request = new XMLHttpRequest();

		if (params.onProgress) {
			request.onprogress = params.onProgress;
		}

		request.open(params.method ? params.method : 'GET', url, params.async ? params.async : true);

		if (params.onLoad) {
			request.onload = params.onLoad;
		}

		if (params.onError) {
			request.onerror = params.onError;
		}

		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (callback) {
					var data;
					try {
						var type = request.getResponseHeader('Content-Type');
						data = type.match(/^application\/json/i) ?
							JSON.parse(request.response.toString()) :
							request.response;
					} catch (err) {
						data = null;
					}
					callback({
						ok: request.status >= 200 && request.status <= 299,
						status: request.status,
						statusText: request.statusText,
						body: request.response,
						data: data
					});
				}
			}
		};

		//request.setRequestHeader('Content-Type', 'multipart/form-data');
		request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		if (params.data) {
			// String or JSON payload
			//console.log(params.data instanceof String);
			if (params.data instanceof String || params.data instanceof FormData) {
				request.send(params.data);
			} else {
				request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
				request.send(JSON.stringify(params.data));
			}
		} else {
			request.send(null);
		}
	}

	/**
	 * Безопасный forEach
	 * @since 2018-05-07
	 * @author MaximAL
	 */
	function forEach(list, callback) {
		for (var i in list) {
			if (!list.hasOwnProperty(i)) {
				continue;
			}
			callback(list[i], i);
		}
	}

	/**
	 * Затормозить выполнение функции `callback`, чтобы она выполнялась не чаще раза в `limit` миллисекунд.
	 *
	 * @example
	 * // При вводе адреса получать координаты от геокодера и ставить метку на карте
	 * // Но не обращаться к геокодеру слишком часто (максимум, один запрос в секунду)
	 * on(inpAddress, 'input', throttle(1000, geocodeAndSetMapMarker));
	 *
	 * @param {Number} limit Ограничение частоты выполнения функции в миллисекундах
	 * @param {Function} callback Функция
	 * @returns {Function} Возвращает функцию, выполняемую не чаще раза в `limit` миллисекунд.
	 *
	 * @since 2018-10-11
	 * @author MaximAL
	 */
	function throttle(limit, callback) {
		let lastFunc;
		let lastRan;
		return function() {
			const context = this;
			const args = arguments;
			if (!lastRan) {
				callback.apply(context, args);
				lastRan = Date.now();
			} else {
				clearTimeout(lastFunc);
				lastFunc = setTimeout(function() {
					if ((Date.now() - lastRan) >= limit) {
						callback.apply(context, args);
						lastRan = Date.now()
					}
				}, limit - (Date.now() - lastRan))
			}
		}
	}
})();
