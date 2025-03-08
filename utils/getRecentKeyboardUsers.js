const recentKeyboardUsers = (enabledKeysWithUserDetails) => [
  ...new Map(
    enabledKeysWithUserDetails
      .filter((item) => item.is_pressed === 1 && item.user.color)
      .map((item) => [
        item.user.id,
        { name: item.user.name, color: item.user.color },
      ])
  ).values(),
];

export default recentKeyboardUsers