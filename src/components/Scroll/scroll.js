import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _styles from './style.scss';

const bindMouseWheel = (container, element, height) => {
    const page = {
        isScrolling: false,
        next: function(cbk) {
            if(!page.isScrolling) {
                cbk()
                page.move(_styles['fade-next'])
            }
        },
        pre: function(cbk) {
            if (!page.isScrolling) {
                cbk()
                page.move(_styles['fade-pre'])
            }
        },
        move: function(cls) {
            page.isScrolling = true
            container.style.overflow = 'hidden'
            container.scrollTop = height
            element.classList.add(cls)
            setTimeout(() => {
                container.style.overflow = 'auto'
                container.scrollTop = height
            }, 820)
            setTimeout(() => {
                page.isScrolling = false;
                element.classList.remove(cls)
                container.scrollTop = height
            }, 1300)
        }
    };
    return page
}

function deepClone(obj) {
    if (obj === null) return null
    let result = Array.isArray(obj)? [] : {};
    for(let key in obj) {
        if (typeof obj[key] === 'object') {
            result[key] = deepClone(obj[key])
        } else {
            result[key] = obj[key]
        }
    }
    return result;

}


class Scroll extends PureComponent {
    constructor(props) {
        super(props);
        this.handleSetContainer = this.handleSetContainer.bind(this)
        this.handleSetWrap = this.handleSetWrap.bind(this)
        this.handleSetInner = this.handleSetInner.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.handlePre = this.handlePre.bind(this)
        this.handleNext = this.handleNext.bind(this)
    }

    componentDidMount() {
        const height = Math.round(this.container.getBoundingClientRect().height)
        this.inner.style.height = `${height}px`
        this.scroll.style.height = `${height * 3}px`
        this.inner.style.marginTop = `${height}px`
        this.initTop = height
        this.container.scrollTop = height
        this.page = bindMouseWheel(this.container, this.scroll, this.initTop)


    }

    handleSetContainer(el) {
        this.container = el
    }

    handleSetWrap(el) {
        this.scroll = el
    }

    handleSetInner(el) {
        this.inner = el
    }

    handleScroll(event) {
        const e = event.originalEvent || event;
        const role = e.target.getAttribute('data-role')
        if (role !== 'view') return
        const scrollTop = Math.round(e.target.scrollTop)
        console.log(this.page.isScrolling,'page.isScrolling')
        if (this.page.isScrolling) return

        if (scrollTop === 0 || this.initTop === scrollTop) return

        const delta = scrollTop > this.initTop ? 7 : -7
        if (delta > 0) {
            this.page.next(() => this.handleNext())
        } else {
            this.page.pre(() => this.handlePre())
        }
    }

    handlePre() {
        this.props.onSetPre()
    }

    handleNext() {
        this.props.onSetNext()
    }

    render() {
        return (
            <div
                data-role="view"
                className={_styles.container}
                ref={this.handleSetContainer}
                onScroll={this.handleScroll}
                style={this.props.hasSetStyle}
            >
                <div
                    className={_styles.wrap}
                    ref={this.handleSetWrap}
                >
                    <div
                        className={_styles.inner}
                        ref={this.handleSetInner}
                        onScroll={e => e.stopPropagation()}
                    >
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

Scroll.propTypes = {
    hasSetStyle: PropTypes.object,
    onSetPre: PropTypes.func.isRequired,
    onSetNext: PropTypes.func.isRequired,
}

Scroll.defaultProps = {
    hasSetStyle: {},
}

export default Scroll

