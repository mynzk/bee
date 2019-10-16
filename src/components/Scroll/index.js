import React, { PureComponent } from 'react';
import './style.scss';

const userAgent = navigator.userAgent;
const isNotChrome = userAgent.indexOf("Chrome") < 1;

function move(box, value) {
    box.style.transform = `translateY(${value}px)`;
}

const bindMouseWheel = (container, element, height) => {
    const page = {
        isScrolling: false,
        next: function(cbk) {
            if(!page.isScrolling) {
                cbk()
                page.move(0, height)
            }
        },
        pre: function(cbk) {
            if (!page.isScrolling) {
                cbk()
                page.move(height, 0)
            }
        },
        move: function(start, end) {

            function Animate(start, end, time, callback, timing = (t) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t) {
                page.isScrolling = true;
                container.scrollTop = height;
                container.style.overflow = 'hidden';
                let startTime = performance.now(); // 设置开始的时间戳
                let differ = end - start; // 拿到数值差值
                // 创建每帧之前要执行的函数
                function loop() {
                    raf = requestAnimationFrame(loop); // 下一阵调用每帧之前要执行的函数
                    const passTime = performance.now() - startTime; // 获取当前时间和开始时间差
                    let per = passTime / time; // 计算当前已过百分比
                    if (per >= 1) { // 判读如果已经执行
                        per = 1; // 设置为最后的状态
                        container.scrollTop = height;
                        page.isScrolling = false;
                        if (isNotChrome) {
                            setTimeout(() => {
                                container.style.overflow = 'auto';
                            }, 850);
                        } else {
                            container.style.overflow = 'auto';
                        }
                        cancelAnimationFrame(raf) // 停掉动画
                    }
                    const pass = differ * timing(1-per); // 通过已过时间百分比*开始结束数值差得出当前的数值
                    callback(pass)
                }
                let raf = requestAnimationFrame(loop) // 下一阵调用每帧之前要执行的函数
            }

            Animate(start, end, 500, move.bind(null, element))
        }
    };
    return page
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
                className="container"
                ref={this.handleSetContainer}
                onScroll={this.handleScroll}
                style={this.props.hasSetStyle}
            >
                <div
                    className="wrap"
                    ref={this.handleSetWrap}
                >
                    <div
                        className="inner"
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
