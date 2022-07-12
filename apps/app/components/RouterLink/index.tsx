import React from 'react'
import { LinkProps, useLinkClickHandler } from 'react-router-dom'

interface RouterLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: LinkProps['to']
  passHref?: boolean
  state?: any
}

export const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ href, state, children, ...rest }, ref) => {
    const child: any = React.Children.only(children)
    const internalOnClick = useLinkClickHandler(href, { state })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onClick, passHref: _, ...othersProps } = rest
    function handleClick(
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) {
      if (onClick) onClick(event)
      if (child && child.props && typeof child.props.onClick === 'function') {
        child.props.onClick(event)
      }
      if (!event.defaultPrevented) {
        internalOnClick(event)
      }
    }

    const childProps = {
      ...othersProps,
      onClick: handleClick,
      href,
      ref,
    }
    return React.cloneElement(child, childProps)
  }
)
