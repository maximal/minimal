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
	 * @param {String} eventName Название события (click, keypress и т. п.)
	 * @param {EventListener|Function} callback Выполняемая функция
	 *
	 * @since 2016-10-24
	 * @author MaximAL
	 */
	function on(elements, eventName, callback) {
		if (elements instanceof NodeList) {
			for (var i in elements) {
				if (!elements.hasOwnProperty(i)) {
					continue;
				}
				elements[i].addEventListener(eventName, callback);
			}
		} else {
			elements.addEventListener(eventName, callback);
		}
	}


	/**
	 * Сделать Аякс
	 *
	 * @param {String} url
	 * @param {Object|Function} params
	 * @param {Function} callback
	 * @author MaximAL
	 * @author McTep
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
						data = type.match(/^application\/json/i) ? JSON.parse(request.response) : request.response;
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

		request.send(params.data ? params.data : null);
	}
})();
