// src/components/HistorySkeletonItem.jsx

import React from 'react';

/**
 * A skeleton placeholder component that mimics the layout of a history list item.
 */
const HistorySkeletonItem = () => {
  return (
    <li className="skeleton-item">
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-text skeleton-date"></div>
    </li>
  );
};

export default HistorySkeletonItem;