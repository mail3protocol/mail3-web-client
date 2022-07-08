import React from 'react'
import { LinkProps, useLinkClickHandler } from 'react-router-dom'

interface RouterLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: LinkProps['to']
  passHref?: boolean
}

export const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ href, children, ...rest }, ref) => {
    const child: any = React.Children.only(children)
    const internalOnClick = useLinkClickHandler(href)
    const { onClick, ...othersProps } = rest
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
      ref,
    }
    return React.cloneElement(child, childProps)
  }
)
