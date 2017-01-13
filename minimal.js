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
		if (elements instanceof NodeList) {
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
		} else {
			for (var e in eventName) {
				if (!eventName.hasOwnProperty(e)) {
					continue;
				}
				elements.addEventListener(eventName[e], callback);
			}
		}
		// TODO: Может, сделать возможность передавать строку и сразу искать элементы?
		// Кешировать селекторы, чи ну его?
	}


	/**
	 * Сделать Аякс
	 *
	 * @param {String} url
	 * @param {Object|Function} params
	 * @param {Function} [callback]
	 * @author MaximAL
	 * @author McTep
	 */
	function ajax(url, _params, _callback) {
		if (!url) {
			throw new Error('Error: `url` parameter is required!');
		}

		var params = _params instanceof Object ? _params : {};
		var callback = _params instanceof Function ? _params : (_callback || function() {});

		var request = new XMLHttpRequest();

		var method = params.method || 'GET';
		if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method) === -1) {
			throw new Error('Invalid request method (' + method + ')');
		}
		
		request.open(method || 'GET', url);
		request.onerror = handleError;
		request.onreadystatechange = handleReadyStateChange;

		function handleError(error) {
			callback(error);
		}
		
		function handleReadyStateChange() {
			if (request.readyState !== 4) { return; }
			
			const headers = {};
			
			request.getAllResponseHeaders().split('/n').forEach(function(value) {
				var parts = value.split(':', 2);
				headers[parts[0]] = parts[1];
			});
			
			var status = request.status;
			
			const response = {
				ok: status >= 200 && status < 300,
				status: request.status,
				body: request.response,
				headers: headers
			};
			
			callback(null, response);
		}

		request.send(params.body);
	}
})();
