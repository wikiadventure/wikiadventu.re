package utils;

class ReverseArrayIterator<T> {
    final arr:Array<T>;
    var i:Int;

    public inline function new(arr:Array<T>) {
        this.arr = arr;
        this.i = this.arr.length - 1; 
    }

    public inline function hasNext() return i > -1;
    public inline function next() {
        return arr[i--];
    }

    public static inline function reversedIterator<T>(arr:Array<T>):Iterator<T> {
        return new ReverseArrayIterator<T>(arr);
    }
    public static inline function reversedIterable<T>(arr:Array<T>):Iterable<T> {
        return {
            iterator: () -> reversedIterator(arr)
        };
    }
}