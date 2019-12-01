import React, { PureComponent } from 'react';
import '@styles/reset.scss'
import Modal from '@components/Modal'
import Counter from '@components/Counter'
import Scroll from '@components/Scroll/scroll'
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
        }
        this.handleOpenModal = this.handleOpenModal.bind(this)
        this.handleCloseModal = this.handleCloseModal.bind(this)
    }

    componentDidMount() {
        this.setState({ val: this.state.val + 1 })
        console.log(this.state.val)

        this.setState({ val: this.state.val + 1 })
        console.log(this.state.val)

        setTimeout(_ => {
            console.log(this.state.val,'1');
            this.setState({ val: this.state.val + 1 })
            console.log(this.state.val);
        }, 0)
        setTimeout(_ => {
            console.log(this.state.val,'2');
            this.setState({ val: this.state.val + 1 })
            console.log(this.state.val);
        }, 0)
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
                        onSetPre={() => { console.log('onSetPre')}}
                        onSetNext={() => { console.log('onSetNext')}}
                    >
                        <div className={_styles.wrapper}>

                        </div>
                    </Scroll>
                </div>
            </React.Fragment>
        )
    }
}

export default App
