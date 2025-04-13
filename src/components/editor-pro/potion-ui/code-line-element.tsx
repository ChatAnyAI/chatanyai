'use client';

import React from 'react';

import { PlateElement } from '@udecode/plate/react';

export function CodeLineElement(
  props: React.ComponentProps<typeof PlateElement>
) {
  return <PlateElement {...props} />;
}
