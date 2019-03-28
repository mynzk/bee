import React, { PureComponent } from 'react';
import '@styles/reset.scss'
import Modal from '@components/Modal'
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
        }
        this.handleOpenModal = this.handleOpenModal.bind(this)
        this.handleCloseModal = this.handleCloseModal.bind(this)
    }

    componentDidMount() {

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
                <button onClick={this.handleOpenModal}>click</button>
                <Modal
                    visible={this.state.visible}
                    requestClose={this.handleCloseModal}
                    style={customStyles}
                    className={_styles['add-fade']}
                >
                    <button onClick={this.handleCloseModal}>close</button>
                </Modal>
            </React.Fragment>
        )
    }
}

export default App
