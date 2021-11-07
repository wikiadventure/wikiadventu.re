package utils;

class SampleSize {
	public static function sampleSize<T>(array:Array<T>, n = 2) {
		var length = array == null ? 0 : array.length;
		if (length < 1 || n < 1) return [];
		n = n > length ? length : n;
		var i = -1;
		var li = length - 1;
		var result = array.slice(0);
		while (++i < n) {
			var r = i + Math.floor(Math.random() * (li - i + 1));
			var v = result[r];
			result[r] = result[i];
			result[i] = v;
		}
		return result.slice(0, n);
	}
}