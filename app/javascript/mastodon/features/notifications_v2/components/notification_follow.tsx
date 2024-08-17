import { useMemo } from 'react';

import { FormattedMessage } from 'react-intl';

import PersonAddIcon from '@/material-icons/400-24px/person_add-fill.svg?react';
import { FollowersCounter } from 'mastodon/components/counters';
import { FollowButton } from 'mastodon/components/follow_button';
import { ShortNumber } from 'mastodon/components/short_number';
import type { NotificationGroupFollow } from 'mastodon/models/notification_group';
import { useAppSelector } from 'mastodon/store';

import { NotificationGroupWithStatus } from './notification_group_with_status';
import { DisplayedName } from './displayed_name';

const FollowerCount: React.FC<{ accountId: string }> = ({ accountId }) => {
  const account = useAppSelector((s) => s.accounts.get(accountId));

  if (!account) return null;

  return (
    <ShortNumber value={account.followers_count} renderer={FollowersCounter} />
  );
};

export const NotificationFollow: React.FC<{
  notification: NotificationGroupFollow;
  unread: boolean;
}> = ({ notification, unread }) => {
  let actions: JSX.Element | undefined;
  let additionalContent: JSX.Element | undefined;

  if (notification.sampleAccountIds.length === 1) {
    // only display those if the group contains 1 account, otherwise it does not makes sense
    const account = notification.sampleAccountIds[0];

    if (account) {
      actions = <FollowButton accountId={notification.sampleAccountIds[0]} />;
      additionalContent = <FollowerCount accountId={account} />;
    }
  }

  const displayedName = (
    <DisplayedName
      accountIds={notification.sampleAccountIds}
    />
  );

  const count = notification.notifications_count;

  const label = useMemo(
    () => {
      if (count === 1)
      return (
        <FormattedMessage
          id='notification.follow'
          defaultMessage='{name} followed you'
          values={{ name: displayedName }}
        />
      );

      return (
        <FormattedMessage
          id='notification.follow.name_and_others'
          defaultMessage='{name} and {count, plural, one {# other} other {# others}} followed you'
          values={{
            name: displayedName,
            count: count - 1,
          }}
        />
      );
    },
    [displayedName, count],
  );

  return (
    <NotificationGroupWithStatus
      type='follow'
      icon={PersonAddIcon}
      iconId='person-add'
      accountIds={notification.sampleAccountIds}
      timestamp={notification.latest_page_notification_at}
      label={label}
      unread={unread}
      actions={actions}
      additionalContent={additionalContent}
    />
  );
};
