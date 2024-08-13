

import { CardCategoryType } from '../types';

const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

const settings = {};

const CATEGOTY_MAP: Record<CardCategoryType, string> = {
	'софт-скил': 'soft',
    'кнопка': 'button',
	'другое': 'other',
	'хард-скил': 'hard',
    'дополнительное': 'additional'
};

export { API_URL, CDN_URL, CATEGOTY_MAP, settings };