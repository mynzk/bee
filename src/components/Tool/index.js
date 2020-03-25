export const mergeSort = arr => {
	//采用自上而下的递归方法
	const len = arr.length;
	if (len < 2) {
		return arr;
	}
	// length >> 1 和 Math.floor(len / 2) 等价
	let middle = Math.floor(len / 2),
		left = arr.slice(0, middle),
		right = arr.slice(middle); // 拆分为两个子数组
	return merge(mergeSort(left), mergeSort(right));
};

const merge = (left, right) => {
	const result = [];

	while (left.length && right.length) {
		// 注意: 判断的条件是小于或等于，如果只是小于，那么排序将不稳定.
		if (left[0] <= right[0]) {
			result.push(left.shift());
		} else {
			result.push(right.shift());
		}
	}

	while (left.length) result.push(left.shift());

	while (right.length) result.push(right.shift());

	return result;
};


export const quickSort1 = arr => {
	if (arr.length <= 1) {
		return arr;
	}
	//取基准点
	const midIndex = Math.floor(arr.length / 2);
	//取基准点的值，splice(index,1) 则返回的是含有被删除的元素的数组。
	const valArr = arr.splice(midIndex, 1);
	const midIndexVal = valArr[0];
	const left = []; //存放比基准点小的数组
	const right = []; //存放比基准点大的数组
	//遍历数组，进行判断分配
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] < midIndexVal) {
			left.push(arr[i]); //比基准点小的放在左边数组
		} else {
			right.push(arr[i]); //比基准点大的放在右边数组
		}
	}
	//递归执行以上操作，对左右两个数组进行操作，直到数组长度为 <= 1
	return quickSort1(left).concat(midIndexVal, quickSort1(right));
};


// 快速排序
export const quickSort = (arr, left, right) => {
	let len = arr.length,
		partitionIndex;
	left = typeof left != 'number' ? 0 : left;
	right = typeof right != 'number' ? len - 1 : right;

	if (left < right) {
		partitionIndex = partition(arr, left, right);
		quickSort(arr, left, partitionIndex - 1);
		quickSort(arr, partitionIndex + 1, right);
	}
	return arr;
};

const partition = (arr, left, right) => {
	//分区操作
	let pivot = left, //设定基准值（pivot）
		index = pivot + 1;
	for (let i = index; i <= right; i++) {
		if (arr[i] < arr[pivot]) {
			swap(arr, i, index);
			index++;
		}
	}
	swap(arr, pivot, index - 1);
	return index - 1;
};

const swap = (arr, i, j) => {
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
};


export const shellSort = arr => {
	let len = arr.length,
		temp,
		gap = 1;
	while (gap < len / 3) {
		//动态定义间隔序列
		gap = gap * 3 + 1;
	}
	for (gap; gap > 0; gap = Math.floor(gap / 3)) {
		for (let i = gap; i < len; i++) {
			temp = arr[i];
			let j = i - gap;
			for (; j >= 0 && arr[j] > temp; j -= gap) {
				arr[j + gap] = arr[j];
			}
			arr[j + gap] = temp;
		}
	}
	return arr;
};

export const testAsync = () => {
    async function async1() {
        console.log('async1 start')
        await async2()
        console.log('async1 end')
    }

    async function async2() {
        console.log('async2')
    }

    console.log('script start')

    setTimeout(function() {
        console.log('setTimeout')
    }, 0)

    async1()

    new Promise(function(resolve) {
        console.log('promise1')
        resolve()
    }).then(function() {
        console.log('promise2')
    })

    console.log('script end')
}


const PENDING = 'pending' //初始状态，既不是成功，也不是失败状态。
const FULFILLED = 'fulfilled' //意味着操作成功完成
const REJECTED = 'rejected' //意味着操作失败。

export class MyPromise {
  constructor(executor) {
    //Promise构造函数执行时立即调用executor 函数
    //类型检测
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is  not a function`)
    }
    //初始化promosie状态
    this.initValue()

    //执行executor ,传入reject resolve 两个方法
    executor(this.resolve, this.reject)
  }

  initValue() {
    /**
     * 初始化promise状态
     */
    this.state = PENDING //promise状态 默认为pending
    this.value = null //全局管理的 resolve之间传递的值
    this.reason = null //全局管理的 reject传递的值
    //绑定 reject resolve的this
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    //提供执行队列 =>发布订阅模式
    this.onFulfilledQueue = []
    this.onRejectedQueue = []
  }
  resolve(value) {
    /**
     * 成功时执行的函数
     */
    const run = () => {
      if (this.state === PENDING) {
        //当用户调用resolve 且状态为pending时
        //我们将执行队列函数依次执行并清空
        this.state = FULFILLED
        while (this.onFulfilledQueue.length > 0) {
          this.onFulfilledQueue.shift()(this.value)
        }
      }
    }
    //注意： 这里判断value 是否是promise实例目的是解决
    // resolve(new promise(...)) 这样的递归
    // 这也是 将 value存放进 this的意义 --自行体会
    // reject 同理
    this.value = value
    if (value instanceof MyPromise) {
      value.then((value) => {
        this.value = value
      })
    }
    //将run添加进异步队列 使支持同步promise的写法
    setTimeout(() => {
      run()
    }, 0)
  }
  reject(reason) {
    /**
     * 失败时执行的函数 道理同 resolve
     */
    const run = () => {
      if (this.state === PENDING) {
        //当用户调用reject且状态为pending时
        //我们将执行队列函数依次执行并清空
        this.state = REJECTED
        while (this.onRejectedQueue.length > 0) {
          this.onRejectedQueue.shift()(this.reason)
        }
      }
    }
    this.reason = reason

    if (reason instanceof MyPromise) {
      reason.then(
        () => {},
        (reason) => {
          this.reason = reason
        }
      )
    }
    setTimeout(() => {
      run()
    }, 0)
  }

  then(fulfilledFn, rejectedFn) {
    /**
     * then方法 resolve|reject 后执行的函数
     */
    //return promise 使支持 链式调用 核心的做法之一
    return new MyPromise((resolve, reject) => {
      if (this.state === PENDING) {
        if (fulfilledFn) {
          //最核心的算法
          //为什么需要用发布订阅模式, 因为这一坨需要在 resolve执行后执行
          //这也是promise支持异步的原理,他是等resolve函数执行完再遍历队列执行then里面的函数
          this.onFulfilledQueue.push((value) => {
            let res = fulfilledFn(value)
            //这里的res 就是用户调用then 之后的返回值
            if (res instanceof MyPromise) {
              //如果res是promise实例 调用用户promise的then方法
              res.then(resolve, reject)
            } else {
              //如果不是promise 使支持then穿透 即 P.then('null').then(()=>{xxx})
              resolve()
            }
          })
        }
        //同理
        if (rejectedFn) {
          this.onRejectedQueue.push((value) => {
            let res = rejectedFn(value)
            if (res instanceof MyPromise) {
              res.then(resolve, reject)
            } else {
              resolve()
            }
          })
        }
      }
    })
  }
}




