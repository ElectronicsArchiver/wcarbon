import { Options, parse } from './deps.ts';

export const CONFIG: Options = {
  name: 'wcarbon',
  version: '1.0.2',
  description: 'Query webpages (URLs) via Website Carbons API.',
  author: [{ name: 'Tim Hårek Andreassen', email: 'tim@harek.no' }],
  source: 'https://github.com/timharek/wcarbon',
  flags: [
    {
      name: 'version',
      aliases: ['V'],
      description: 'Prints version.',
    },
    {
      name: 'help',
      aliases: ['h'],
      description: 'Prints this help message.',
    },
    {
      name: 'short',
      aliases: ['s'],
      description: 'Give the output in the short-format.',
    },
    {
      name: 'long',
      aliases: ['l'],
      description: 'Give the output in the long-format.',
    },
    {
      name: 'green',
      aliases: ['g'],
      description:
        'If a page is green or not (boolean), works only in conjunction with --bytes.',
    },
    {
      name: 'url',
      aliases: ['h'],
      description:
        'Calculate the carbon emissions generated by the provided <url>.',
    },
    {
      name: 'bytes',
      aliases: ['b'],
      description:
        'Calculate the emissions of a page by manually passing the bytes and whether or not it is powered by green hosting.',
    },
  ],
};

export const FLAGS = parse(Deno.args, {
  boolean: ['help', 'short', 'long', 'green', 'version'],
  string: ['url', 'bytes'],
  alias: {
    url: ['u'],
    bytes: ['b'],
    green: ['g'],
    short: ['s'],
    long: ['l'],
    help: ['h'],
    version: ['V'],
  },
});