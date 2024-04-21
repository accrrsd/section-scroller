import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import defaultStyle from './style.module.css'

type TTouchStartCords = { x: number; y: number }

type TFullPageScrollerProps = {
  children: React.ReactElement[]
  initialSlideIndex?: number
  slidesOffset?: number | number[]
  navigationKeys?: { increaseKeys: string | string[]; decreaseKeys: string | string[] }
  getScrollPos?: (scrollPos: number, direction: 'vertical' | 'horizontal') => void
  getActiveSlide?: (slide: HTMLDivElement, index: number) => void
  onScrollError?: (elem: HTMLDivElement) => void
  scrollErrorDelay?: number
  direction?: 'vertical' | 'horizontal'
  touchThreshold?: number
  className?: string
  tabIndex?: number
} & React.HTMLProps<HTMLDivElement>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timerId: number | null = null
  return (...args: Parameters<T>) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}

const generateUniqueId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 5)
  return `${timestamp}-${random}`
}

const SectionScroller = ({
  children,
  initialSlideIndex = 0,
  slidesOffset = 0,
  navigationKeys,
  direction = 'vertical',
  className,
  tabIndex = -1,
  touchThreshold = 50,
  getScrollPos,
  getActiveSlide,
  onScrollError,
  scrollErrorDelay = 1500,
  ...props
}: TFullPageScrollerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const slidesRef = useRef([] as HTMLDivElement[])
  const slides = slidesRef.current

  const [active, setActive] = useState<number>(initialSlideIndex)
  const [isChanging, setIsChanging] = useState<boolean>(false)

  // ref because update state will broke touchmove
  const touchStartCords = useRef<TTouchStartCords | null>(null)

  const nextActive = useCallback(() => setActive((prev: number) => (prev < slides.length - 1 ? prev + 1 : prev)), [slides, setActive])
  const prevActive = useCallback(() => setActive((prev: number) => (prev > 0 ? prev - 1 : prev)), [setActive])
  const changeActiveByDelta = useCallback((delta: number) => (delta > 0 ? nextActive() : prevActive()), [nextActive, prevActive])

  const getCurrentOffset = useCallback((elem: HTMLElement) => (direction === 'vertical' ? elem.offsetTop : elem.offsetLeft), [direction])
  const getCurrentSlidesOffset = useCallback(() => {
    if (!slidesOffset) return 0
    if (typeof slidesOffset === 'number') return slidesOffset
    return active < slidesOffset.length ? slidesOffset[active] : 0
  }, [active, slidesOffset])

  const wrapperDirectionStyle = direction === 'vertical' ? defaultStyle.wrapperVertical : defaultStyle.wrapperHorizontal

  const touchStartHandler = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      if (isChanging) return
      touchStartCords.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    },
    [isChanging]
  )

  const touchMoveHandler = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      if (!touchStartCords.current || isChanging) return
      const lastCords = touchStartCords.current
      const delta = direction === 'vertical' ? lastCords.y - e.touches[0].clientY : lastCords.x - e.touches[0].clientX
      if (Math.abs(delta) < touchThreshold) return
      changeActiveByDelta(delta)
      touchStartCords.current = null
    },
    [changeActiveByDelta, direction, isChanging, touchThreshold]
  )

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (isChanging) return e.preventDefault()
      if (!navigationKeys || document.activeElement !== wrapperRef.current) return
      const { increaseKeys: iKeys, decreaseKeys: dKeys } = navigationKeys
      if ((dKeys.constructor === Array && dKeys.includes(e.key)) || dKeys === e.key) {
        e.preventDefault()
        nextActive()
      } else if ((iKeys.constructor === Array && iKeys.includes(e.key)) || iKeys === e.key) {
        e.preventDefault()
        prevActive()
      }
    },
    [nextActive, prevActive, isChanging, navigationKeys]
  )

  const wheelHandler = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      if (isChanging) return
      changeActiveByDelta(e.deltaY)
    },
    [isChanging, changeActiveByDelta]
  )

  const smoothScroll = useCallback(
    (scrolled: HTMLElement, to: number) => {
      return new Promise((resolve, reject) => {
        if ((direction === 'vertical' && scrolled.scrollTop === to) || (direction === 'horizontal' && scrolled.scrollLeft === to))
          return resolve(null)

        const timeout = setTimeout(() => reject(new Error('Section scroll timeout')), scrollErrorDelay)
        const successHandler = () => {
          clearTimeout(timeout)
          wrapperRef.current?.removeEventListener('scroll', debouncedSuccessHandler)
          resolve(null)
        }
        const debouncedSuccessHandler = debounce(successHandler, 100)
        wrapperRef.current?.addEventListener('scroll', debouncedSuccessHandler)

        const scrollDir = direction === 'vertical' ? { top: to } : { left: to }
        scrolled.scrollTo({ ...scrollDir, behavior: 'smooth' })
      })
    },
    [direction, scrollErrorDelay]
  )

  // init
  useEffect(() => {
    if (!wrapperRef.current || !initialSlideIndex) return
    const wrapper = wrapperRef.current
    const neededOffset = slides[initialSlideIndex].offsetTop + getCurrentSlidesOffset()
    if (wrapper.offsetTop !== neededOffset) wrapper.scrollTo({ top: neededOffset })
  }, [initialSlideIndex, slides, wrapperRef, getCurrentSlidesOffset])

  // listeners
  useEffect(() => {
    if (!wrapperRef.current) return
    const wrapper = wrapperRef.current

    wrapper.addEventListener('touchstart', touchStartHandler, { passive: false })
    wrapper.addEventListener('touchmove', touchMoveHandler, { passive: false })
    wrapper.addEventListener('wheel', wheelHandler, { passive: false })
    if (navigationKeys) document.addEventListener('keydown', keyHandler, { passive: false })

    return () => {
      wrapper.removeEventListener('touchstart', touchStartHandler)
      wrapper.removeEventListener('touchmove', touchMoveHandler)
      wrapper.removeEventListener('wheel', wheelHandler)
      if (navigationKeys) document.removeEventListener('keydown', keyHandler)
    }
  }, [wrapperRef, navigationKeys, wheelHandler, keyHandler, touchStartHandler, touchMoveHandler])

  // on sides[active] change
  useEffect(() => {
    if (!wrapperRef.current || !slides[active]) return
    const wrapper = wrapperRef.current

    setIsChanging(true)
    // children 0 because we cant get dom element another way
    const currentElem = slides[active].children[0] as HTMLElement

    smoothScroll(wrapper, getCurrentOffset(currentElem) + getCurrentSlidesOffset())
      .then(() => {
        getActiveSlide?.(slides[active], active)
        getScrollPos?.(getCurrentOffset(wrapper), direction)
      })
      .catch(() => {
        onScrollError?.(wrapper)
      })
      .finally(() => {
        setIsChanging(false)
      })
  }, [active, wrapperRef, slides, direction, getCurrentOffset, getCurrentSlidesOffset, getActiveSlide, getScrollPos, onScrollError, smoothScroll])

  const memoizedChildren = useMemo(() => {
    return children?.map((child, index) => (
      <div style={{ display: 'contents' }} key={generateUniqueId()} ref={(ref) => ref && (slides[index] = ref)}>
        {child}
      </div>
    ))
  }, [children, slides])

  return (
    <div ref={wrapperRef} className={`${className || wrapperDirectionStyle}`} tabIndex={tabIndex} {...props}>
      {memoizedChildren}
    </div>
  )
}

export default SectionScroller
