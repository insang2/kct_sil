import { BASICS_A } from './basics-a'
import { BASICS_B } from './basics-b'
import type { IPage } from '@/lib/industrial/pages'

export const BASICS: IPage[] = [...BASICS_A, ...BASICS_B]
export const getBasics = (slug: string) => BASICS.find((x) => x.slug === slug)
export const BASICS_PDF = '/docs/silicone-basics-training-ko.pdf'
