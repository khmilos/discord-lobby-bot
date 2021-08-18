Entities:

1. Message
2. MessageEmbed
  1. Title - template
  2. Image - on/off
  3. Member - template
  4. Join - template
3. VoiceChannel
  1. Title

Functions:

1. On joining specified channel - create voice channel and send message with embed inside.
2. On joining that voice channel - change message embed decription.
3. On leaving that voice channel - change message embed description.
4. When last user leaves that voice channel - delete message.

Settings:

```json
{
  "category": "CATEGORY_CHANNEL_ID", // Where create voice channels
  "text": "TEXT_CHANNEL_ID", // Where send messages
  "lobbies": [
    {
      "join": "VOICE_CHANNEL_ID", // Voice channel to join for creating specified in lobby voice channel.
      "category": "CATEGORY_CHANNEL_ID", // (Optional)
      "text": "TEXT_CHANNEL_ID", // (Optional)
      "channel": {
        "title": "TEMPLATE",
        "titleFull": "TEMPLATE" // (Optional)
      },
      "message": {
        "title": "TEMPLATE",
        "titleFull": "TEMPLATE" // (Optional)
      }
    }
  ]
}
```
