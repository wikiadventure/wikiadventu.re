package utils;

class Random {
	
	/**
	 * Generate a random int between
	 * @param from a number
	 * @param to another
	 * @return a random Int
	 */
	public static inline function int(from:Int, to:Int):Int {
		return from + Math.floor(((to - from + 1) * Math.random()));
	}

	/**
	 * Pick random element from an array
	 * @param arr the array
	 * @return random element if array is not null or empty
	 */
	public static inline function fromArray<T>(arr:Array<T>):Null<T> {
		return (arr != null && arr.length > 0) ? arr[int(0, arr.length - 1)] : null;
	}
}
