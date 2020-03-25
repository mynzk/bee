import React, { PureComponent } from 'react';
import '@styles/reset.scss'
import Modal from '@components/Modal'
import Counter from '@components/Counter'
import { connect } from 'react-redux'
import Scroll from '@components/Scroll/newscroll'
import MySvg from '@components/Svg'
import { mergeSort, quickSort1, quickSort, shellSort, MyPromise } from '@components/Tool'
import { mySort, mySort1, mySort2 } from '@components/Tool/test'
import _styles from '@styles/main.scss'

const customStyles = {
    overlay: {
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 100000,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    content: {
        padding: 0,
        width: '520px',
        height: '400px',
        position: 'absolute',
        border: 'none',
        overflow: 'hidden',
        //top: '0',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, 0)',
        borderRadius: '5px',
        boxShadow: '0 0 15px rgba(0,0,0,0.4)',
    },
};

class App extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            val: 0,
            list: [{id: 1, name: '1word'},{id: 2, name: '2word'},{id: 3, name: '3word'},{id: 4, name: '4word'}],
        }
        this.handleOpenModal = this.handleOpenModal.bind(this)
        this.handleCloseModal = this.handleCloseModal.bind(this)
        this.test = this.test.bind(this);
        this.setList = this.setList.bind(this);
    }

    componentDidMount() {
        const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
        console.time('归并排序耗时');
        console.log('arr :', arr, mySort2(arr));
        console.timeEnd('归并排序耗时');
        var path = document.querySelector('path');
        var length = path.getTotalLength();
        console.log(length, 'getTotalLength')
        this.setState({ visible: true })
    }

    

    handleCloseModal() {
        this.setState({
            visible: false,
        })
    }

    handleOpenModal() {
        this.setState({
            visible: true,
        })
    }

    setList(){
        this.setState({
            list: [{id: 1, name: '3word'},{id: 2, name: '4word'},{id: 3, name: '5word'},{id: 4, name: '6word'}],
        })
    }

    test() {
        const arr1 = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
        const arr2 = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
        const arr3 = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
        const arr4 = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
        console.time('归并排序耗时');
        console.log('arr :', arr1, mergeSort(arr1));
        console.timeEnd('归并排序耗时');
        console.time('快速排序耗时231');
        console.log('arr :', arr2, quickSort1(arr2));
        console.timeEnd('快速排序耗时231');
        console.time('快速排序耗时');
        console.log('arr :', arr3, quickSort(arr3));
        console.timeEnd('快速排序耗时');
        console.time('希尔排序耗时');
        console.log('arr :', arr4, shellSort(arr4));
        console.timeEnd('希尔排序耗时');
    }


    render() {
        return (
            <React.Fragment>
                {/*
                <div className={_styles.container}>
                    <div className={_styles.header}></div>
                    <div className={_styles.content}>
                        <aside>
                            <button onClick={this.handleOpenModal}>click</button>
                        </aside>
                        <section>
                            <Modal
                                visible={this.state.visible}
                                requestClose={this.handleCloseModal}
                                style={customStyles}
                                className={_styles['add-fade']}
                            >
                                <button onClick={this.handleCloseModal}>close</button>
                                <Counter />
                            </Modal>
                        </section>
                    </div>
                    <div className={_styles.footer}>
                        <div className={_styles.left}></div>
                        <div className={_styles.center}></div>
                        <div className={_styles.right}></div>
                    </div>
                </div>
                */}
                <div className={_styles.container}>
                    <Scroll
                        onSetPre={this.test}
                        onSetNext={() => { console.log('onSetNext')}}
                    >
                        <div className={_styles.wrapper}>
                          <div onClick={this.setList}>{MySvg}</div>
                          {this.state.list.map((item) => (
                              <div key={item.id}>{item.name}</div>
                          ))}
                        </div>
                    </Scroll>
                </div>
            </React.Fragment>
        )
    }
}

const mapState = (state) => {
    return state
}

export default connect(mapState)(App)
