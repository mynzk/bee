import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom';
import usePortal from './usePortal';

const defaultStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)"
    },
    content: {
        position: "absolute",
        top: "40px",
        left: "40px",
        right: "40px",
        bottom: "40px",
        border: "1px solid #ccc",
        background: "#fff",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: "4px",
        outline: "none",
        padding: "20px"
    }
};


function Modal({ visible, children, requestClose, style, className }) {
    const target = usePortal('root');
    const [ isOpen, setOpen ] = useState(visible);

    useEffect(() => {
        setOpen(visible)
    }, [visible]);

    const getOverlayStyle = {...defaultStyles.overlay, ...style.overlay};
    const getContentStyle = className ? {...style.content} : {...defaultStyles.content, ...style.content};
    const getContentCls = className || '';

    function renderPortal(visible) {
        if (!visible) return null;
        return (
            <div
                style={getOverlayStyle}
                onClick={() => requestClose()}
            >
                <div
                    className={getContentCls}
                    style={getContentStyle}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        )
    }

    return ReactDOM.createPortal(
        renderPortal(isOpen),
        target,
    );
}

export default Modal
