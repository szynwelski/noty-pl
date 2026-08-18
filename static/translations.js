const COUNTRIES = {
  'Afghanistan': 'Afganistan', 'Albania': 'Albania', 'Algeria': 'Algieria',
  'Argentina': 'Argentyna', 'Armenia': 'Armenia', 'Australia': 'Australia',
  'Austria': 'Austria', 'Bahamas': 'Bahamy', 'Bangladesh': 'Bangladesz',
  'Belarus': 'Białoruś', 'Belgium': 'Belgia', 'Belize': 'Belize',
  'Bhutan': 'Bhutan', 'Bosnia and Herzegovina': 'Bośnia i Hercegowina',
  'Botswana': 'Botswana', 'Brazil': 'Brazylia', 'Bulgaria': 'Bułgaria',
  'Cambodia': 'Kambodża', 'Canada': 'Kanada', 'Cayman Islands': 'Kajmany',
  'Chile': 'Chile', 'China': 'Chiny', 'Colombia': 'Kolumbia',
  'Congo': 'Kongo', 'Croatia': 'Chorwacja', 'Cuba': 'Kuba',
  'Cyprus': 'Cypr', 'Czech Republic': 'Czechy', 'Czechoslovakia': 'Czechosłowacja',
  'Denmark': 'Dania', 'Dominican Republic': 'Dominikana', 'Ecuador': 'Ekwador',
  'Egypt': 'Egipt', 'Estonia': 'Estonia',
  'Federal Republic of Yugoslavia': 'Federalna Rep. Jugosławii',
  'Finland': 'Finlandia', 'France': 'Francja', 'Georgia': 'Gruzja',
  'Germany': 'Niemcy', 'West Germany': 'Niemcy Zach.',
  'Ghana': 'Ghana', 'Greece': 'Grecja', 'Guatemala': 'Gwatemala',
  'Hong Kong': 'Hongkong', 'Hungary': 'Węgry', 'Iceland': 'Islandia',
  'India': 'Indie', 'Indonesia': 'Indonezja', 'Iran': 'Iran', 'Iraq': 'Irak',
  'Ireland': 'Irlandia', 'Isle of Man': 'Wyspa Man', 'Israel': 'Izrael',
  'Italy': 'Włochy', 'Japan': 'Japonia', 'Jordan': 'Jordania',
  'Kazakhstan': 'Kazachstan', 'Kenya': 'Kenia', 'Kosovo': 'Kosowo',
  'Latvia': 'Łotwa', 'Lebanon': 'Liban', 'Liechtenstein': 'Liechtenstein',
  'Lithuania': 'Litwa', 'Luxembourg': 'Luksemburg', 'Malawi': 'Malawi',
  'Malaysia': 'Malezja', 'Mali': 'Mali', 'Malta': 'Malta',
  'Mexico': 'Meksyk', 'Moldova': 'Mołdawia', 'Monaco': 'Monako',
  'Mongolia': 'Mongolia', 'Montenegro': 'Czarnogóra', 'Morocco': 'Maroko',
  'Nepal': 'Nepal', 'Netherlands': 'Holandia', 'New Zealand': 'Nowa Zelandia',
  'North Macedonia': 'Macedonia Płn.', 'Norway': 'Norwegia',
  'Occupied Palestinian Territory': 'Palestyna', 'Pakistan': 'Pakistan',
  'Paraguay': 'Paragwaj', 'Peru': 'Peru', 'Philippines': 'Filipiny',
  'Poland': 'Polska', 'Portugal': 'Portugalia', 'Puerto Rico': 'Portoryko',
  'Qatar': 'Katar', 'Romania': 'Rumunia', 'Russia': 'Rosja', 'Rwanda': 'Rwanda',
  'Serbia': 'Serbia', 'Serbia and Montenegro': 'Serbia i Czarnogóra',
  'Singapore': 'Singapur', 'Slovakia': 'Słowacja', 'Slovenia': 'Słowenia',
  'Somalia': 'Somalia', 'South Africa': 'RPA', 'South Korea': 'Korea Płd.',
  'Soviet Union': 'ZSRR', 'USSR': 'ZSRR', 'RSFSR': 'RFSRR',
  'Austria-Hungary': 'Austro-Węgry',
  'Russian Empire': 'Imperium Rosyjskie',
  'Galicia': 'Galicja', 'Bohemia': 'Czechy', 'Prussia': 'Prusy',
  'East Prussia': 'Prusy Wschodnie', 'West Prussia': 'Prusy Zachodnie',
  'Republic of Georgia': 'Gruzja',
  'Northern Ireland': 'Irlandia Płn.', 'Republic of Ireland': 'Irlandia',
  'Spain': 'Hiszpania', 'Sri Lanka': 'Sri Lanka',
  'Sweden': 'Szwecja', 'Switzerland': 'Szwajcaria', 'Syria': 'Syria',
  'Taiwan': 'Tajwan', 'Thailand': 'Tajlandia', 'Tunisia': 'Tunezja',
  'Turkey': 'Turcja', 'Ukraine': 'Ukraina',
  'United Arab Emirates': 'ZEA', 'United Kingdom': 'Wielka Brytania', 'UK': 'Wielka Brytania',
  'United States': 'USA', 'Uruguay': 'Urugwaj', 'Venezuela': 'Wenezuela',
  'Vietnam': 'Wietnam', 'Yemen': 'Jemen', 'Yugoslavia': 'Jugosławia',
  'Zimbabwe': 'Zimbabwe',
};

const LANGUAGES = {
  'Aboriginal': 'aborygeński', 'Afrikaans': 'afrikaans', 'Akan': 'akan',
  'Albanian': 'albański', 'Algonquin': 'algonkin',
  'American Sign Language': 'ASL', 'Amharic': 'amharski', 'Arabic': 'arabski',
  'Aramaic': 'aramejski', 'Armenian': 'ormiański',
  'Assyrian Neo-Aramaic': 'asyryjski', 'Bambara': 'bambara',
  'Basque': 'baskijski', 'Belarusian': 'białoruski', 'Bengali': 'bengalski',
  'Berber languages': 'berberyjski', 'Bosnian': 'bośniacki',
  'Brazilian Sign Language': 'brazylijski j. migowy',
  'British Sign Language': 'BSL', 'Bulgarian': 'bułgarski',
  'Burmese': 'birmański', 'Cantonese': 'kantoński', 'Catalan': 'kataloński',
  'Central Khmer': 'khmerski', 'Chechen': 'czeczeński', 'Chinese': 'chiński',
  'Cornish': 'kornijski', 'Corsican': 'korsykański', 'Cree': 'kri',
  'Croatian': 'chorwacki', 'Czech': 'czeski', 'Danish': 'duński',
  'Dari': 'dari', 'Dutch': 'niderlandzki',
  'Egyptian (Ancient)': 'egipski (starożytny)', 'English': 'angielski',
  'Esperanto': 'esperanto', 'Estonian': 'estoński', 'Ewe': 'ewe',
  'Filipino': 'filipiński', 'Finnish': 'fiński', 'Flemish': 'flamandzki',
  'French': 'francuski', 'Gaelic': 'gaelicki', 'Galician': 'galicyjski',
  'Georgian': 'gruziński', 'German': 'niemiecki', 'Greek': 'grecki',
  'Greek, Ancient (to 1453)': 'grecki (starożytny)', 'Greenlandic': 'grenlandzki',
  'Guarani': 'guaraní', 'Hausa': 'hausa', 'Hawaiian': 'hawajski',
  'Hebrew': 'hebrajski', 'Hindi': 'hindi', 'Hmong': 'hmong',
  'Hokkien': 'hokkien', 'Hungarian': 'węgierski', 'Icelandic': 'islandzki',
  'Indonesian': 'indonezyjski', 'Inuktitut': 'inuktitut',
  'Irish Gaelic': 'irlandzki', 'Italian': 'włoski', 'Japanese': 'japoński',
  'Japanese Sign Language': 'japoński j. migowy', 'Kalmyk-Oirat': 'kałmucki',
  'Kazakh': 'kazachski', 'Kikuyu': 'kikuju', 'Kinyarwanda': 'kinyarwanda',
  'Klingon': 'klingoński', 'Korean': 'koreański', 'Kurdish': 'kurdyjski',
  'Lao': 'laotański', 'Latin': 'łacina', 'Latvian': 'łotewski',
  'Lithuanian': 'litewski', 'Macedonian': 'macedoński', 'Malay': 'malajski',
  'Mandarin': 'mandaryński', 'Maori': 'maoryski', 'Mapudungun': 'mapudungun',
  'Maya': 'maja', 'Mende': 'mende', 'Min Nan': 'min nan', 'Mixtec': 'mixtec',
  'Mohawk': 'mohawk', 'Mongolian': 'mongolski', 'Nahuatl': 'nahuatl',
  'Navajo': 'nawaho', 'Neapolitan': 'neapolitański', 'Nepali': 'nepalski',
  'None': 'brak dialogów', 'Norse, Old': 'staronordyjski',
  'North American Indian': 'języki indiańskie', 'Norwegian': 'norweski',
  'Nyanja': 'nyanja', 'Old English': 'staroangielski', 'Osage': 'osage',
  'Papiamento': 'papiamento', 'Pashtu': 'paszto', 'Pawnee': 'paunee',
  'Persian': 'perski', 'Polish': 'polski', 'Polynesian': 'polinezyjski',
  'Portuguese': 'portugalski', 'Punjabi': 'pendżabski', 'Quechua': 'keczua',
  'Quenya': 'quenya', 'Romanian': 'rumuński', 'Romany': 'romani',
  'Russian': 'rosyjski', 'Saami': 'saami', 'Sanskrit': 'sanskryt',
  'Serbian': 'serbski', 'Serbo-Croatian': 'serbsko-chorwacki',
  'Shanghainese': 'szanghajski', 'Shuar': 'shuar', 'Sicilian': 'sycylijski',
  'Sign Languages': 'język migowy', 'Sindarin': 'sindarin',
  'Sinhala': 'syngaleski', 'Sioux': 'lakota', 'Slovak': 'słowacki',
  'Slovenian': 'słoweński', 'Somali': 'somalijski', 'Sotho': 'sotho',
  'Spanish': 'hiszpański', 'Spanish Sign Language': 'hiszpański j. migowy',
  'Swahili': 'suahili', 'Swedish': 'szwedzki', 'Swiss German': 'szwajcarski niemiecki',
  'Syriac': 'syryjski', 'Tagalog': 'tagalog', 'Tamashek': 'tamaszek',
  'Tamil': 'tamilski', 'Tatar': 'tatarski', 'Thai': 'tajski',
  'Tibetan': 'tybetański', 'Tigrigna': 'tigrinia', 'Tok Pisin': 'tok pisin',
  'Turkish': 'turecki', 'Turkmen': 'turkmeński', 'Tzotzil': 'tzotzil',
  'Ukrainian': 'ukraiński', 'Ukrainian Sign Language': 'ukraiński j. migowy',
  'Ungwatsi': 'ungwatsi', 'Urdu': 'urdu', 'Vietnamese': 'wietnamski',
  'Welsh': 'walijski', 'Xhosa': 'xhosa', 'Yiddish': 'jidysz',
  'Yoruba': 'joruba', 'Zulu': 'zulu',
};

const GENRES = {
  Action: 'Akcja', Adventure: 'Przygodowy', Animation: 'Animacja',
  Biography: 'Biograficzny', Comedy: 'Komedia', Crime: 'Kryminał',
  Documentary: 'Dokumentalny', Drama: 'Dramat', Family: 'Familijny',
  Fantasy: 'Fantasy', 'Film-Noir': 'Film noir', History: 'Historyczny',
  Horror: 'Horror', Music: 'Muzyczny', Musical: 'Musical',
  Mystery: 'Tajemnica', News: 'News', Romance: 'Romans',
  'Sci-Fi': 'Sci-Fi', Short: 'Krótkometrażowy', Sport: 'Sportowy',
  Thriller: 'Thriller', War: 'Wojenny', Western: 'Western',
};

const CHARACTER_TRANSLATIONS = {
  'Self':              'siebie',
  'Themselves':        'siebie',
  'Narrator':          'narrator',
  'The Narrator':      'narrator',
  'Voice':             'głos',
  'Additional Voices': 'głosy dodatkowe',
  'Additional Voice':  'głos dodatkowy',
  'Additional Kids Voices': 'głosy dzieci',
  'Minor Role':        'rola epizodyczna',
  'Extra':             'statysta',
};

function translateCharacter(c) {
  if (!c) return c;
  if (CHARACTER_TRANSLATIONS[c]) return CHARACTER_TRANSLATIONS[c];
  // "Self - some description" → "siebie — opis"
  if (/^Self\s*[-–(]/i.test(c)) {
    const rest = c.replace(/^Self\s*[-–(]\s*/i, '').replace(/\)$/, '').trim();
    return rest ? `siebie (${rest})` : 'siebie';
  }
  return c;
}

// Maps redundant historical country → modern equivalent that must also be present.
// A historical entry is hidden only when its modern counterpart is also in the list.
const REDUNDANT_IF_PRESENT = {
  'Polska Rzeczpospolita Ludowa':                                          'Polska',
  'Unia Indyjska':                                                         'Indie',
  'Indie Brytyjskie':                                                      'Indie',
  'Cesarstwo Wielkiej Japonii':                                            'Japonia',
  'Zjednoczone Królestwo Włoch':                                           'Włochy',
  'Republika Federalna Niemiec (1949–1990)':                               'Niemcy',
  'Rosyjska Federacyjna Socjalistyczna Republika Radziecka (1918–1922)':   'Związek Socjalistycznych Republik Radzieckich',
  'Rosyjska Federacyjna Socjalistyczna Republika Radziecka':               'Związek Socjalistycznych Republik Radzieckich',
  'Przedlitawia':                                                          'Austria',
  'Serbia i Czarnogóra':                                                   'Serbia',
  'Królestwo Jugosławii':                                                  'Socjalistyczna Federacyjna Republika Jugosławii',
};

const REDUNDANT_COUNTRIES = new Set(Object.keys(REDUNDANT_IF_PRESENT));

function filterNationality(nats) {
  const set = new Set(nats);
  return nats.filter(n => {
    const modern = REDUNDANT_IF_PRESENT[n];
    return !modern || !set.has(modern);
  });
}
