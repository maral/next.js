import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../dev-overlay/utils/cx'

type TooltipDirection = 'top' | 'bottom' | 'left' | 'right'

export function Tooltip({
  children,
  title,
  direction = 'top',
}: {
  children: React.ReactNode
  title: string
  direction: TooltipDirection
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const isVertical = direction === 'top' || direction === 'bottom'

  useEffect(() => {
    if (isVisible && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()

      setPosition({
        top:
          rect.top -
          (!isVertical ? rect.height / 2 : 0) * (direction === 'top' ? -1 : 1),
        left:
          rect.left -
          (isVertical ? rect.width / 2 : 0) * (direction === 'left' ? 1 : -1),
      })
    }
  }, [isVisible, direction, isVertical])

  const handleMouseEnter = () => {
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  const tooltip = isVisible ? (
    <div
      className="tooltip-portal"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: wrapperRef.current?.offsetWidth || 0,
        height: wrapperRef.current?.offsetHeight || 0,
        pointerEvents: 'none',
        zIndex: 4,
      }}
    >
      <div className={cx('tooltip', `tooltip--${direction}`)}>
        {title}
        <div className={cx('tooltip-arrow', `tooltip-arrow--${direction}`)} />
      </div>
    </div>
  ) : null

  const [shadowRootRef] = useState<ShadowRoot | null>(() => {
    const portal = document.querySelector('nextjs-portal')
    if (!portal) return null
    return portal.shadowRoot as ShadowRoot
  })

  if (!shadowRootRef) return null

  return (
    <>
      <span
        ref={wrapperRef}
        className="tooltip-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {typeof document !== 'undefined' &&
        tooltip &&
        createPortal(tooltip, shadowRootRef)}
    </>
  )
}

export const styles = `
  .tooltip-wrapper {
    position: relative;
    display: inline-block;
    line-height: 1;
  }

  .tooltip {
    position: absolute;
    background: var(--color-gray-1000);
    color: var(--color-gray-100);
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.4;
    white-space: nowrap;
    min-width: 200px;
    white-space: normal;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }

  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
  }

  .tooltip--top {
    top: -8px;
    left: 0;
    transform: translate(-50%, -100%);
  }

  .tooltip-arrow--top {
    top: 100%;
    left: 50%;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid var(--color-gray-1000);
    transform: translateX(-50%);
  }

  .tooltip--bottom {
    bottom: -8px;
    left: 0;
    transform: translate(-50%, 100%);
  }

  .tooltip-arrow--bottom {
    bottom: 100%;
    left: 50%;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--color-gray-1000);
    transform: translateX(-50%);
  }

  .tooltip--left {
    left: -8px;
    top: 50%;
    transform: translate(-100%, 0%);
  }

  .tooltip-arrow--left {
    left: 100%;
    top: 50%;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid var(--color-gray-1000);
    transform: translateY(-50%);
  }

  .tooltip--right {
    right: -8px;
    top: 50%;
    transform: translate(100%, 0%);
  }

  .tooltip-arrow--right {
    right: 100%;
    top: 50%;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid var(--color-gray-1000);
    transform: translateY(-50%);
  }
`
