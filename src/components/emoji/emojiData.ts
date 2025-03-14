import { emojiConfig, skins, alias } from './config';

interface EmojiConfig {
  groups: {
    [key: string]: {
      name: string
      emojis: Array<{
        emoji: string
        description: string
        category: string
        aliases: string[]
        tags: string[]
        unicode_version: string
        ios_version: string
        skin_tones?: []
      }>
    }
  }
}

const processedConfig: EmojiConfig = {
  groups: Object.keys(emojiConfig).reduce((acc, key) => {
    const emojis = emojiConfig[key as keyof typeof emojiConfig] || [];
    if (emojis.length > 0) {
      (acc as Record<string, any>)[key] = {
        name: key,
        emojis: emojis.map(emoji => ({
          emoji: emoji,
          description: (alias as Record<string, string[]>)[emoji][0], // can be customized with description
          category: [],
          aliases: (alias as Record<string, string[]>)[emoji], // can be customized with aliases
          tags: [], // can be customized with tags
          unicode_version: '6.0', // default version
          ios_version: '6.0', // default version
          // Convert skins object to Record<string, boolean[]> type via unknown type casting
          skin_tones: ((skins as unknown) as Record<string, boolean[]>)[emoji]?.[3]
        }))
      };
    }
    return acc;
  }, {})
};

export default processedConfig;


