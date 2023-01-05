//helper to resolve promises from the outside
function promise() { 
	var res, rej;
	var promise = new Promise((resolve, reject) => {
		res = resolve;
		rej = reject;
	});
	promise.resolve = res;
	promise.reject = rej;
	return promise;
}