import React from 'react';
import _styles from '@styles/main.scss'

const MySvg = (
    <svg className={_styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className={_styles['checkmark_circle']} cx="26" cy="26" r="25" fill="none"/>
        <path className={_styles['checkmark_check']} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
);

export default MySvg;

