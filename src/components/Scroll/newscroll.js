import React, { PureComponent } from 'react';
import _styles from './style.scss';

const userAgent = navigator.userAgent;
const isNotChrome = userAgent.indexOf("Chrome") < 1;

function easeOut (x) {
    return 1 - (1 - x) * (1 - x);
}

function createAnimation ({ duration = 300, update }) {
    let start =  0;
    let elapsed = 0;
    let progress = 0;
    let animationFrameId = 0;
  
    update = (typeof update === 'function') ? update : function () {};

    return new Promise((resolve, reject) => {
        // Start a new animation by requesting for an animation frame
        animationFrameId = requestAnimationFrame(
            function _animation (timestamp) {
                animationFrameId = requestAnimationFrame(_animation);
                // Set the animation start timestamp if not set
                if (!start) start = timestamp;
            
                // Compute the time elapsed and the progress (0 - 1)
                elapsed = timestamp - start;
                progress = Math.min(elapsed / duration, 1);
            
                // Call the `update()` callback with the current progress
                update(easeOut(progress));
                // Request another animation frame until duration elapses
                if (timestamp >= start + duration) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = 0;
                    resolve();
                }
            }
        );
    })
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
        this.container.addEventListener('scroll', () => { console.log('hello=========scroll')})
        this.container.addEventListener('touchmove', () => { console.log('hello=========touch')})
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
        console.log(this.initTop, scrollTop, 'page.isScrolling---1')
        if (scrollTop === 0 || this.initTop === scrollTop) return
        console.log(this.initTop, scrollTop, 'page.isScrolling---3')
        
        const delta = scrollTop > this.initTop ? 7 : -7
        let height = this.initTop;
        if (delta > 0) {
            this.handleNext();
        } else {
            this.handlePre();
            height = -height;
        }

        this.container.style.overflow = 'hidden';

        createAnimation({ update: (process) => {
            this.scroll.style.transform = `translateY(${height*(1 - process)}px)`;
        }}).then(() => {
            this.container.scrollTop = height < 0 ? -height : height;
            this.container.style.overflow = 'auto';
        })
        
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

Scroll.defaultProps = {
    hasSetStyle: {},
}

export default Scroll