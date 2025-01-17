export default async () => {
  const getUserList = (limit, cursor = '') =>
    fetch(
      'https://slack.com/api/users.list?token=' +
        process.env.SLACK_TOKEN +
        '&limit=' +
        limit +
        '&cursor=' +
        cursor
    )
      .then(res => res.json())
      .then(res => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        return res;
      })
      .catch(error => {
        throw new Error(error);
      });

  const flattenUser = item => {
    if (!item.is_bot) {
      return {
        id: item.id,
        screenname: item.name,
        name: item.real_name,
        email: item.profile.email
      };
    }

    return false;
  };

  const limit = 200;
  let users = [];

  const firstCall = await getUserList(limit);

  const loopCalls = async ({ response_metadata }) => {
    if (response_metadata && response_metadata.next_cursor) {
      const nextCall = await getUserList(limit, response_metadata.next_cursor);

      if (nextCall.ok) {
        users = users.concat(nextCall.members.map(flattenUser));

        await loopCalls(nextCall);
      }
    }
  };

  if (firstCall.ok) {
    users = users.concat(firstCall.members.map(flattenUser));

    await loopCalls(firstCall);
  }

  return {
    metadata: {
      count: users.length
    },
    members: users
  };
};
