import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  rules: [
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
    [/^my-(\d+)$/, ([, d]) => ({ margin: `${d}px 0` })],
    [/^mx-(\d+)$/, ([, d]) => ({ margin: `0 ${d}px` })],
    [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` })],
    [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` })],
    [/^p-(\d+)$/, (match) => ({ padding: `${match[1]}px` })],
    [/^px-(\d+)$/, (match) => ({ 'padding-left': `${match[1]}px`,'padding-right':`${match[1]}px` })],
    [/^py-(\d+)$/, (match) => ({ 'padding-top': `${match[1]}px`,'padding-bottom': `${match[1]}px` })],
    [/^pb-(\d+)$/, (match) => ({ 'padding-bottom': `${match[1]}px` })],
    [/^wh-(\d+)$/, ([, wh]) => ({ width: `${wh}px`, height: `${wh}px` })],
    [/^w-(\d+)$/, ([, w]) => ({ width: `${w}px` })],
    [/^h-(\d+)$/, ([, h]) => ({ height: `${h}px` })],
    [/^w-(\d+)$/, ([, w]) => ({ width: `${w}px` })],
    [/^w-(\d+)%$/, ([, w]) => ({ width: `${w}%` })],
    [/^wMin-(\d+)%$/, ([, w]) => ({ 'min-width': `${w}%` })],
    [/^wMax-(\d+)%$/, ([, w]) => ({ 'max-width': `${w}%` })],
    ['h-100%', { height: '100%' }],
    [/^fsize-(\d+)$/, ([, s]) => ({ 'font-size': `${s}px` })],
    [/^gap-(\d+)$/, ([, g]) => ({ gap: `${g}px` })],
    ['font-pingfang', { 'font-family': 'PingFang SC' }],
    ['font-source', { 'font-family': 'Source Han Sans CN' }],
    ['font-microsoft', { 'font-family': 'Microsoft YaHei' }],
    ['font-inter', { 'font-family': 'Inter' }],
    ['font-roboto', { 'font-family': 'Roboto' }],
    // ['rounded-[20px]', { 'border-radius': '20px' }],
  ]
})
