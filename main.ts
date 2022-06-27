import { Args, parse } from 'https://deno.land/std@0.145.0/flags/mod.ts';

const options = {
  format: 'long',
  type: 'site',
};

interface Statistics {
  adjustedBy: number;
  energy: number;
  co2: {
    grid: {
      grams: number;
      litres: number;
    };
    renewable: {
      grams: number;
      litres: number;
    };
  };
}

interface SiteResponse {
  url: string;
  green: boolean | 'unknown';
  bytes: number;
  cleanerThan: number;
  statistics: Statistics;
}

interface DataResponse {
  cleanerThan: number;
  statistics: Statistics;
}

const REQUEST_URL = 'https://api.websitecarbon.com';

const flags = parse(Deno.args, {
  boolean: ['help', 'short', 'long', 'green'],
  string: ['url', 'bytes'],
  alias: {
    'url': ['u'],
    'bytes': ['b'],
    'green': ['g'],
    'short': ['s'],
    'long': ['l'],
    'help': ['h'],
  },
});

async function _fetch(url: URL) {
  return await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
}

async function querySite(url: string, format: string) {
  const requestUrl = new URL(`${REQUEST_URL}/site`);
  requestUrl.searchParams.set('url', url);

  const result = await _fetch(requestUrl) as SiteResponse;

  if (format == 'long') {
    return result;
  }

  return {
    green: result.green,
    size: `${(result.bytes / 1024).toFixed(1)} kB`,
    cleanerThan: `${result.cleanerThan * 100}%`,
    energy_pr_load: `${result.statistics.energy} kW_g`,
    co2: {
      grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
  };
}

async function queryData(bytes: string, green: number, format: string) {
  const requestUrl = new URL(`${REQUEST_URL}/data`);
  requestUrl.searchParams.set('bytes', `${bytes}`);
  requestUrl.searchParams.set('green', `${green}`);

  const result = await _fetch(requestUrl) as DataResponse;

  if (format == 'long') {
    return result;
  }

  return {
    cleanerThan: `${result.cleanerThan * 100}%`,
    energy_pr_load: `${result.statistics.energy} kW_g`,
    co2: {
      grid: `${result.statistics.co2.grid.grams.toFixed(4)} g`,
      renewable: `${result.statistics.co2.renewable.grams.toFixed(4)} g`,
    },
  };
}

function noArgs(flags: Args) {
  return Object.values(flags).every((flag) =>
    flag === false || flag === undefined || flag.length === 0
  );
}

if (noArgs(flags) || flags.help) {
  console.log('wcarbon 1.0.1');
  console.log('Query webpages (URLs) via Website Carbons API.');
  console.log();
  console.log(
    '%cAUTHOR',
    'font-weight: bold',
    'Tim Hårek Andreassen <tim@harek.no>',
  );
  console.log(
    '%cSOURCE',
    'font-weight: bold',
    'https://github.com/timharek/wcarbon',
  );
  console.log();
  console.log('%cUSAGE', 'font-weight: bold', '\n\twcarbon [OPTIONS]');
  console.log();
  console.log('%cOPTIONS', 'font-weight: bold');
  console.log('\t-h, --help     Prints this help message');
  console.log('\t-s, --short    Give the output in the short-format.');
  console.log('\t-l, --long     Give the output in the long-format (default).');
  console.log(
    '\t-u, --url      Calculate the carbon emissions generated by the provided <url>.',
  );
  console.log(
    '\t-b, --bytes    Calculate the emissions of a page by manually passing the bytes and whether or not it is powered by green hosting.',
  );
  console.log(
    '\t-g, --green    If a page is green or not (boolean), works only in conjunction with --bytes.',
  );
  console.log();
  console.log('%cEXAMPLES', 'font-weight: bold');
  console.log('\t$ wcarbon -u https://timharek.no');
  console.log('\t$ wcarbon -su https://timharek.no');
  console.log('\t$ wcarbon -b 1195673');
  console.log('\t$ wcarbon -sgb 1195673');
  Deno.exit(1);
}

if (flags.short) {
  options.format = 'short';
}

if (flags.url) {
  console.log(await querySite(flags.url, options.format));
}

if (flags.bytes) {
  console.log(
    await queryData(flags.bytes, flags.green ? 1 : 0, options.format),
  );
}
