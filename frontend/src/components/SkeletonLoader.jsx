import React from 'react'
import { Skeleton } from './Loading'
import './SkeletonLoader.css'
import './Loading.css'

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`skeleton-card ${className}`}>
            <Skeleton width="100%" height="200px" className="skeleton-card__image" />
            <div className="skeleton-card__content">
              <Skeleton width="80%" height="24px" className="skeleton-card__title" />
              <Skeleton width="100%" height="16px" className="skeleton-card__text" />
              <Skeleton width="60%" height="16px" className="skeleton-card__text" />
            </div>
          </div>
        )

      case 'list':
        return (
          <div className={`skeleton-list ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton-list__item">
                <Skeleton width="40px" height="40px" variant="circle" className="skeleton-list__avatar" />
                <div className="skeleton-list__content">
                  <Skeleton width="70%" height="20px" className="skeleton-list__title" />
                  <Skeleton width="50%" height="16px" className="skeleton-list__subtitle" />
                </div>
              </div>
            ))}
          </div>
        )

      case 'table':
        return (
          <div className={`skeleton-table ${className}`}>
            <div className="skeleton-table__header">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} width="100%" height="32px" />
              ))}
            </div>
            {Array.from({ length: count }).map((_, rowIndex) => (
              <div key={rowIndex} className="skeleton-table__row">
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} width="100%" height="40px" />
                ))}
              </div>
            ))}
          </div>
        )

      case 'hero':
        return (
          <div className={`skeleton-hero ${className}`}>
            <Skeleton width="60%" height="48px" className="skeleton-hero__title" />
            <Skeleton width="80%" height="24px" className="skeleton-hero__subtitle" />
            <Skeleton width="40%" height="40px" className="skeleton-hero__button" />
          </div>
        )

      default:
        return <Skeleton width="100%" height="100px" className={className} />
    }
  }

  return (
    <div className="skeleton-loader" role="status" aria-live="polite" aria-busy="true">
      <span className="loading-sr-only">Loading content...</span>
      {renderSkeleton()}
    </div>
  )
}

export default SkeletonLoader
