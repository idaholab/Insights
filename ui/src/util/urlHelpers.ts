// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export function toUrlFriendly(title: string): string {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}
  