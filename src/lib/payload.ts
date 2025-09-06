interface Props {
  endpoint: string;
  global: boolean
  wrappedByKey?: string;
  lang?: string;
  menu?: boolean;
  guideline?: string;
  principle?: string;
  sort?: string;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param wrappedByKey - The key to unwrap the response from
 * @param lang - What languages to fetch
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  global,
  wrappedByKey,
  lang,
  menu,
  sort
}: Props): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  if (lang) {
    if ( lang == 'en') {
      lang = 'locale=en';
    } else {
      lang = 'locale=fi';
    }
  } else {
    lang = 'locale=*';
  }

  let sortValue = '';
  if (sort) {
    sortValue = '&sort' + sort;
  }

  let url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/${endpoint}?${lang}${sortValue}&limit="2000`);

  if (global) {
    url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/globals/${endpoint}?${lang}`);
  }

  if (endpoint == 'criteria') {
    url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/${endpoint}?${lang}&sort=criterionSort&limit=200`);
  }

  if (endpoint == 'guidelines') {
    url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/${endpoint}?${lang}&sort=guidelineNumber&limit=200`);
  }

    if (endpoint == 'principles') {
    url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/${endpoint}?${lang}&sort=principleNumber&limit=200`);
  }

  if (menu) {
    url = new URL(`${import.meta.env.PUBLIC_PAYLOAD_URL}/api/globals/${endpoint}?${lang}&depth=2&draft=false&locale=en&trash=false`);
  }

  const res = await fetch(url.toString());
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  return data as T;
}