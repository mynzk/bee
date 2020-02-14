export const mySort = (arr) => {
    if (arr.length < 2) {
        return arr;
    }
    const midIndex = Math.floor(arr.length / 2);
    return merge(mySort(arr.slice(0, midIndex)), mySort(arr.slice(midIndex)))
}

const merge = (left, right) => {
    const result = [];
    while(left.length && right.length) {
        if (left[0] < right[0]) {
            result.push(left.shift())
        } else {
            result.push(right.shift())
        }
    }
    while(left.length) {
        result.push(left.shift())
    }
    while(right.length) {
        result.push(right.shift())
    }
    return result;
}

export const mySort1 = (arr) => {
    if (arr.length < 2) {
        return arr;
    }
    const midIndex = Math.floor(arr.length/2);
    const mid = arr.splice(midIndex, 1)
    const left = [];
    const right = [];
    for(let i = 0; i < arr.length; i++) {
        if (arr[i] < mid[0]) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    return mySort1(left).concat(mid, mySort1(right))
}

export const mySort2 = (arr, left, right) => {
    let len = arr.length,
    getPosition;
	left = typeof left != 'number' ? 0 : left;
	right = typeof right != 'number' ? len - 1 : right;
    if (left < right) {
        getPosition = position(arr, left, right);
        mySort2(arr, left, getPosition - 1);
        mySort2(arr, getPosition + 1, right);
    }
    return arr;
}

const position = (arr, left, right) => {
    const poivt = left;
    let index = poivt + 1;
    for (let i = index; i <= right; i++) {
        if (arr[i] < arr[poivt]) {
            swap(arr, i, index);
            index++;
        }
    }
    swap(arr, poivt, index - 1);
    return index - 1;
}

const swap = (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
