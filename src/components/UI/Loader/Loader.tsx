import style from './Loader.module.scss'

interface Props {
    size: number,
    borderSize: number
}

export default function Loader({ size, borderSize }: Props) {
    return (
        <div className={style.loader_wrapper}>
            <div style={{ width: size + 'px', borderWidth: borderSize + 'px' }} className={style.loader}></div>
        </div>
    )
}
